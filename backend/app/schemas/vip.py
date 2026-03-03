from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# VIP卡密相关
class VIPCardCreate(BaseModel):
    duration_days: int = Field(..., gt=0, description="有效天数")
    count: int = Field(1, gt=0, le=100, description="生成数量")

class VIPCardOut(BaseModel):
    id: int
    card_code: str
    duration_days: int
    is_used: bool
    used_by: Optional[int]
    used_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

class VIPCardActivate(BaseModel):
    card_code: str = Field(..., min_length=16, max_length=32)

# VIP会员相关
class VIPMembershipOut(BaseModel):
    id: int
    user_id: int
    expire_at: datetime
    is_active: bool
    activated_at: datetime

    class Config:
        from_attributes = True

class VIPStatusOut(BaseModel):
    is_vip: bool
    expire_at: Optional[datetime]
    days_remaining: Optional[int]
