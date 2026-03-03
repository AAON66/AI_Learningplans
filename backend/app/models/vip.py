from sqlalchemy import Column, Integer, String, DateTime, Boolean, func, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base

class VIPCard(Base):
    """VIP卡密表"""
    __tablename__ = "vip_cards"

    id = Column(Integer, primary_key=True, index=True)
    card_code = Column(String, unique=True, index=True, nullable=False)  # 卡密
    duration_days = Column(Integer, nullable=False)  # 有效天数
    is_used = Column(Boolean, default=False)  # 是否已使用
    used_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # 使用者
    used_at = Column(DateTime(timezone=True), nullable=True)  # 使用时间
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="used_cards")

class VIPMembership(Base):
    """VIP会员记录表"""
    __tablename__ = "vip_memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    expire_at = Column(DateTime(timezone=True), nullable=False)  # 过期时间
    is_active = Column(Boolean, default=True)  # 是否激活
    activated_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="vip_membership")
