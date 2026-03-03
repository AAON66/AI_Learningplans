from sqlalchemy.orm import Session
from ..models.user import User
from ..models.vip import VIPMembership
from ..models.plan import LearningPlan
from datetime import datetime, date
from fastapi import HTTPException

def check_vip_permission(db: Session, user_id: int) -> bool:
    """检查用户是否有VIP权限"""
    membership = db.query(VIPMembership).filter(
        VIPMembership.user_id == user_id,
        VIPMembership.is_active == True,
        VIPMembership.expire_at > datetime.now()
    ).first()
    return bool(membership)

def check_plan_limit(db: Session, user_id: int) -> bool:
    """检查用户是否可以创建新计划
    免费用户: 最多3个计划
    VIP用户: 无限制
    """
    is_vip = check_vip_permission(db, user_id)
    if is_vip:
        return True

    plan_count = db.query(LearningPlan).filter(
        LearningPlan.user_id == user_id
    ).count()

    if plan_count >= 3:
        raise HTTPException(
            403,
            "免费用户最多创建3个学习计划，升级VIP解锁无限制"
        )
    return True

def check_ai_usage_limit(db: Session, user_id: int) -> bool:
    """检查AI使用次数限制
    免费用户: 每天3次
    VIP用户: 无限制
    """
    is_vip = check_vip_permission(db, user_id)
    if is_vip:
        return True

    # 检查今天的AI使用次数
    from ..models.analysis import NeedAnalysis
    today = date.today()

    usage_count = db.query(NeedAnalysis).join(
        LearningPlan, NeedAnalysis.plan_id == LearningPlan.id
    ).filter(
        LearningPlan.user_id == user_id,
        NeedAnalysis.created_at >= datetime.combine(today, datetime.min.time())
    ).count()

    if usage_count >= 3:
        raise HTTPException(
            403,
            "免费用户每天最多使用3次AI分析，升级VIP解锁无限制"
        )
    return True

def get_user_limits(db: Session, user_id: int) -> dict:
    """获取用户的各项限制信息"""
    is_vip = check_vip_permission(db, user_id)

    # 计划数量
    plan_count = db.query(LearningPlan).filter(
        LearningPlan.user_id == user_id
    ).count()

    # 今日AI使用次数
    from ..models.analysis import NeedAnalysis
    today = date.today()
    ai_usage_today = db.query(NeedAnalysis).join(
        LearningPlan, NeedAnalysis.plan_id == LearningPlan.id
    ).filter(
        LearningPlan.user_id == user_id,
        NeedAnalysis.created_at >= datetime.combine(today, datetime.min.time())
    ).count()

    return {
        "is_vip": is_vip,
        "plan_limit": {
            "current": plan_count,
            "max": None if is_vip else 3,
            "unlimited": is_vip
        },
        "ai_usage": {
            "today": ai_usage_today,
            "daily_limit": None if is_vip else 3,
            "unlimited": is_vip
        },
        "features": {
            "export_data": is_vip,
            "advanced_stats": is_vip,
            "priority_support": is_vip,
            "learning_reminders": is_vip,
            "custom_themes": is_vip,
            "vip_badges": is_vip
        }
    }
