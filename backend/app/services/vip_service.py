from sqlalchemy.orm import Session
from ..models.vip import VIPCard, VIPMembership
from ..models.user import User
from datetime import datetime, timedelta
from fastapi import HTTPException
import secrets
import string

def generate_card_code() -> str:
    """生成16位卡密"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(16))

def create_vip_cards(db: Session, duration_days: int, count: int = 1) -> list[VIPCard]:
    """批量生成VIP卡密"""
    cards = []
    for _ in range(count):
        while True:
            code = generate_card_code()
            existing = db.query(VIPCard).filter(VIPCard.card_code == code).first()
            if not existing:
                break

        card = VIPCard(card_code=code, duration_days=duration_days)
        db.add(card)
        cards.append(card)

    db.commit()
    for card in cards:
        db.refresh(card)
    return cards

def get_vip_cards(db: Session, skip: int = 0, limit: int = 100, is_used: bool = None):
    """获取卡密列表"""
    query = db.query(VIPCard)
    if is_used is not None:
        query = query.filter(VIPCard.is_used == is_used)
    return query.order_by(VIPCard.created_at.desc()).offset(skip).limit(limit).all()

def delete_vip_card(db: Session, card_id: int):
    """删除卡密"""
    card = db.query(VIPCard).filter(VIPCard.id == card_id).first()
    if not card:
        raise HTTPException(404, "卡密不存在")
    if card.is_used:
        raise HTTPException(400, "已使用的卡密不能删除")
    db.delete(card)
    db.commit()

def activate_vip(db: Session, user_id: int, card_code: str) -> VIPMembership:
    """激活VIP"""
    # 查找卡密
    card = db.query(VIPCard).filter(VIPCard.card_code == card_code).first()
    if not card:
        raise HTTPException(404, "卡密不存在")
    if card.is_used:
        raise HTTPException(400, "卡密已被使用")

    # 查找或创建会员记录
    membership = db.query(VIPMembership).filter(VIPMembership.user_id == user_id).first()

    now = datetime.now()
    new_expire = now + timedelta(days=card.duration_days)

    if membership:
        # 如果已有会员，延长时间
        if membership.expire_at > now:
            # 未过期，在原基础上延长
            membership.expire_at = membership.expire_at + timedelta(days=card.duration_days)
        else:
            # 已过期，从现在开始计算
            membership.expire_at = new_expire
        membership.is_active = True
        membership.updated_at = now
    else:
        # 创建新会员
        membership = VIPMembership(
            user_id=user_id,
            expire_at=new_expire,
            is_active=True
        )
        db.add(membership)

    # 标记卡密已使用
    card.is_used = True
    card.used_by = user_id
    card.used_at = now

    db.commit()
    db.refresh(membership)
    return membership

def get_vip_status(db: Session, user_id: int) -> dict:
    """获取用户VIP状态"""
    membership = db.query(VIPMembership).filter(VIPMembership.user_id == user_id).first()

    if not membership:
        return {"is_vip": False, "expire_at": None, "days_remaining": None}

    now = datetime.now()
    is_vip = membership.is_active and membership.expire_at > now

    if is_vip:
        days_remaining = (membership.expire_at - now).days
    else:
        days_remaining = None
        # 自动更新过期状态
        if membership.is_active and membership.expire_at <= now:
            membership.is_active = False
            db.commit()

    return {
        "is_vip": is_vip,
        "expire_at": membership.expire_at if is_vip else None,
        "days_remaining": days_remaining
    }

def check_vip_permission(db: Session, user_id: int) -> bool:
    """检查用户是否有VIP权限"""
    status = get_vip_status(db, user_id)
    return status["is_vip"]
