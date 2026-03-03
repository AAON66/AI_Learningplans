from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MethodOut(BaseModel):
    id: int
    stage_id: int
    method_type: Optional[str] = None
    title: str
    content: Optional[str] = None
    schedule: Optional[str] = None
    order_index: int = 0
    confirmed: bool = False
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

class MethodUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    schedule: Optional[str] = None

class MethodGenerate(BaseModel):
    plan_id: int
