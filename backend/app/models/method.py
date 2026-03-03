from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from ..core.database import Base

class LearningMethod(Base):
    __tablename__ = "learning_methods"
    id = Column(Integer, primary_key=True, index=True)
    stage_id = Column(Integer, ForeignKey("plan_stages.id"), nullable=False, index=True)
    method_type = Column(String)
    title = Column(String, nullable=False)
    content = Column(Text)
    schedule = Column(Text)
    order_index = Column(Integer, default=0)
    confirmed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    stage = relationship("PlanStage", back_populates="methods")
