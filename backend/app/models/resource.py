from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from ..core.database import Base

class LearningResource(Base):
    __tablename__ = "learning_resources"
    id = Column(Integer, primary_key=True, index=True)
    stage_id = Column(Integer, ForeignKey("plan_stages.id"), nullable=False, index=True)
    resource_type = Column(String)
    title = Column(String, nullable=False)
    description = Column(Text)
    url = Column(String)
    provider = Column(String)
    estimated_hours = Column(Float)
    difficulty = Column(String)
    is_free = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    user_selected = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    stage = relationship("PlanStage", back_populates="resources")
