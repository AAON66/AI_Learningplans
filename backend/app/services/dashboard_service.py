from sqlalchemy.orm import Session
from sqlalchemy import func, case
from ..models.user import User
from ..models.plan import LearningPlan
from ..models.vip import VIPMembership, VIPCard
from datetime import datetime

def get_dashboard_stats(db: Session) -> dict:
    """获取管理后台看板数据"""

    # 1. 用户统计
    total_users = db.query(User).count()

    # VIP会员统计
    active_vip_count = db.query(VIPMembership).filter(
        VIPMembership.is_active == True,
        VIPMembership.expire_at > datetime.now()
    ).count()

    vip_ratio = (active_vip_count / total_users * 100) if total_users > 0 else 0

    # 2. 学习计划统计
    total_plans = db.query(LearningPlan).count()

    # 按状态统计
    plan_stats = db.query(
        LearningPlan.status,
        func.count(LearningPlan.id)
    ).group_by(LearningPlan.status).all()

    status_counts = {status: count for status, count in plan_stats}

    completed_plans = status_counts.get('completed', 0)
    active_plans = status_counts.get('active', 0)
    paused_plans = status_counts.get('paused', 0)
    draft_plans = status_counts.get('draft', 0)

    completion_rate = (completed_plans / total_plans * 100) if total_plans > 0 else 0

    # 3. VIP卡密统计
    total_cards = db.query(VIPCard).count()
    used_cards = db.query(VIPCard).filter(VIPCard.is_used == True).count()
    unused_cards = total_cards - used_cards
    card_usage_rate = (used_cards / total_cards * 100) if total_cards > 0 else 0

    # 4. 按难度统计学习计划
    difficulty_stats = db.query(
        LearningPlan.difficulty_level,
        func.count(LearningPlan.id)
    ).group_by(LearningPlan.difficulty_level).all()

    difficulty_counts = {level: count for level, count in difficulty_stats}

    # 5. 最近7天新增用户
    from datetime import timedelta
    seven_days_ago = datetime.now() - timedelta(days=7)
    recent_users = db.query(User).filter(
        User.created_at >= seven_days_ago
    ).count()

    # 6. 最近7天新增计划
    recent_plans = db.query(LearningPlan).filter(
        LearningPlan.created_at >= seven_days_ago
    ).count()

    # 7. 活跃用户统计(最近30天有活动的用户)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    active_users = db.query(func.count(func.distinct(LearningPlan.user_id))).filter(
        LearningPlan.updated_at >= thirty_days_ago
    ).scalar()

    return {
        "users": {
            "total": total_users,
            "vip_count": active_vip_count,
            "vip_ratio": round(vip_ratio, 2),
            "recent_7days": recent_users,
            "active_30days": active_users
        },
        "plans": {
            "total": total_plans,
            "completed": completed_plans,
            "active": active_plans,
            "paused": paused_plans,
            "draft": draft_plans,
            "completion_rate": round(completion_rate, 2),
            "recent_7days": recent_plans
        },
        "cards": {
            "total": total_cards,
            "used": used_cards,
            "unused": unused_cards,
            "usage_rate": round(card_usage_rate, 2)
        },
        "difficulty": difficulty_counts
    }

def get_user_list(db: Session, skip: int = 0, limit: int = 50):
    """获取用户列表(带VIP状态)"""
    users = db.query(User).order_by(User.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for user in users:
        vip = db.query(VIPMembership).filter(
            VIPMembership.user_id == user.id,
            VIPMembership.is_active == True,
            VIPMembership.expire_at > datetime.now()
        ).first()

        plan_count = db.query(LearningPlan).filter(
            LearningPlan.user_id == user.id
        ).count()

        result.append({
            "id": user.id,
            "email": user.email,
            "is_vip": bool(vip),
            "vip_expire": vip.expire_at if vip else None,
            "plan_count": plan_count,
            "created_at": user.created_at
        })

    return result
