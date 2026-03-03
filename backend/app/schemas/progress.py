from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class ProgressCreate(BaseModel):
    plan_id: int
    stage_id: Optional[int] = None
    record_date: date
    study_minutes: int = 0
    content_studied: Optional[str] = None
    completion_percentage: float = 0
    notes: Optional[str] = None

class ProgressOut(BaseModel):
    id: int
    plan_id: int
    stage_id: Optional[int] = None
    record_date: date
    study_minutes: int
    content_studied: Optional[str] = None
    completion_percentage: float
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

class CheckInCreate(BaseModel):
    plan_id: int
    check_in_date: date
    study_minutes: int = 0
    reflection: Optional[str] = None
    mood_score: Optional[int] = None

class CheckInOut(BaseModel):
    id: int
    plan_id: int
    check_in_date: date
    completed: bool
    study_minutes: int
    reflection: Optional[str] = None
    mood_score: Optional[int] = None
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

class StatsOut(BaseModel):
    total_study_minutes: int = 0
    total_check_ins: int = 0
    consecutive_days: int = 0
    completion_percentage: float = 0
