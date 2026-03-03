from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class StageOut(BaseModel):
    id: int
    plan_id: int
    order_index: int
    stage_name: str
    description: Optional[str] = None
    duration_days: Optional[int] = None
    milestones: Optional[str] = None
    status: str = "pending"
    confirmed: bool = False
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

class StageUpdate(BaseModel):
    stage_name: Optional[str] = None
    description: Optional[str] = None
    duration_days: Optional[int] = None
    milestones: Optional[str] = None

class StageGenerate(BaseModel):
    plan_id: int
