from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from ..core.database import Base

class CheckIn(Base):
    __tablename__ = "check_ins"
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("learning_plans.id"), nullable=False, index=True)
    check_in_date = Column(Date, nullable=False)
    completed = Column(Boolean, default=True)
    study_minutes = Column(Integer, default=0)
    reflection = Column(String)
    mood_score = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    plan = relationship("LearningPlan", back_populates="check_ins")
