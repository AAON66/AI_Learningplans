from sqlalchemy import Column, Integer, String, DateTime, func
from ..core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    security_question = Column(String, nullable=True)
    security_answer = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
