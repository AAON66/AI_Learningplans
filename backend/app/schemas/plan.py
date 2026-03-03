from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List

class PlanCreate(BaseModel):
    title: str
    goal: str
    user_background: Optional[str] = None
    total_duration_days: Optional[int] = None
    difficulty_level: str = "beginner"

class PlanUpdate(BaseModel):
    title: Optional[str] = None
    goal: Optional[str] = None
    user_background: Optional[str] = None

class PlanOut(BaseModel):
    id: int
    user_id: int
    title: str
    goal: str
    user_background: Optional[str] = None
    total_duration_days: Optional[int] = None
    difficulty_level: str
    status: str
    start_date: Optional[date] = None
    target_end_date: Optional[date] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    model_config = {"from_attributes": True}
