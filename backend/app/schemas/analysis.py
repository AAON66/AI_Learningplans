from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AnalysisOut(BaseModel):
    id: int
    plan_id: int
    analysis_result: Optional[str] = None
    key_points: Optional[str] = None
    recommended_path: Optional[str] = None
    confirmed: bool = False
    version: int = 1
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

class AnalysisGenerate(BaseModel):
    plan_id: int
