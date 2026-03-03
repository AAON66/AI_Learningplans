from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from ..core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    security_question = Column(String, nullable=True)
    security_answer = Column(String, nullable=True)
    is_admin = Column(Integer, default=0)  # 0=普通用户, 1=管理员
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # VIP关系
    vip_membership = relationship("VIPMembership", back_populates="user", uselist=False)
    used_cards = relationship("VIPCard", back_populates="user")
