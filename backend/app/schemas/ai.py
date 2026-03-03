from pydantic import BaseModel
from typing import Optional, List

class AIRequest(BaseModel):
    prompt: str
    context: Optional[str] = None

class AIResponse(BaseModel):
    content: str
    usage: Optional[dict] = None
