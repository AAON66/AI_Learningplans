from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ResourceOut(BaseModel):
    id: int
    stage_id: int
    resource_type: Optional[str] = None
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    provider: Optional[str] = None
    estimated_hours: Optional[float] = None
    difficulty: Optional[str] = None
    is_free: bool = True
    order_index: int = 0
    user_selected: bool = False
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

class ResourceRecommend(BaseModel):
    stage_id: int
