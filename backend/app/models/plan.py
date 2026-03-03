from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, func
from sqlalchemy.orm import relationship
from ..core.database import Base

class LearningPlan(Base):
    __tablename__ = "learning_plans"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    goal = Column(String, nullable=False)
    user_background = Column(String)
    total_duration_days = Column(Integer)
    difficulty_level = Column(String, default="beginner")
    status = Column(String, default="draft")
    start_date = Column(Date)
    target_end_date = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    stages = relationship("PlanStage", back_populates="plan", cascade="all, delete-orphan")
    analysis = relationship("NeedAnalysis", back_populates="plan", uselist=False, cascade="all, delete-orphan")
    progress_records = relationship("ProgressRecord", back_populates="plan", cascade="all, delete-orphan")
    check_ins = relationship("CheckIn", back_populates="plan", cascade="all, delete-orphan")
