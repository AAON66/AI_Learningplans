from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, func
from ..core.database import Base

class NeedAnalysis(Base):
    __tablename__ = "need_analysis"
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("learning_plans.id"), nullable=False, index=True)
    analysis_result = Column(Text)
    key_points = Column(Text)
    recommended_path = Column(Text)
    confirmed = Column(Boolean, default=False)
    version = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    from sqlalchemy.orm import relationship
    plan = relationship("LearningPlan", back_populates="analysis")
