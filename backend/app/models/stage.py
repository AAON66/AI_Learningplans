from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from ..core.database import Base

class PlanStage(Base):
    __tablename__ = "plan_stages"
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("learning_plans.id"), nullable=False, index=True)
    order_index = Column(Integer, nullable=False)
    stage_name = Column(String, nullable=False)
    description = Column(Text)
    duration_days = Column(Integer)
    milestones = Column(Text)
    status = Column(String, default="pending")
    confirmed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    plan = relationship("LearningPlan", back_populates="stages")
    resources = relationship("LearningResource", back_populates="stage", cascade="all, delete-orphan")
    methods = relationship("LearningMethod", back_populates="stage", cascade="all, delete-orphan")
