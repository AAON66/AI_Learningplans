from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DashboardStats(BaseModel):
    users: dict
    plans: dict
    cards: dict
    difficulty: dict

class UserListItem(BaseModel):
    id: int
    email: str
    is_vip: bool
    vip_expire: Optional[datetime]
    plan_count: int
    created_at: datetime

    class Config:
        from_attributes = True
