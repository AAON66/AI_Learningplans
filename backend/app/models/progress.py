from sqlalchemy import Column, Integer, String, Text, Float, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from ..core.database import Base

class ProgressRecord(Base):
    __tablename__ = "progress_records"
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("learning_plans.id"), nullable=False, index=True)
    stage_id = Column(Integer, ForeignKey("plan_stages.id"))
    record_date = Column(Date, nullable=False)
    study_minutes = Column(Integer, default=0)
    content_studied = Column(Text)
    completion_percentage = Column(Float, default=0)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    plan = relationship("LearningPlan", back_populates="progress_records")
