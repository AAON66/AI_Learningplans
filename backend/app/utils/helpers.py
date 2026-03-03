from datetime import datetime
from typing import Optional

def format_datetime(dt: Optional[datetime]) -> Optional[str]:
    return dt.isoformat() if dt else None

def paginate(query, page: int = 1, per_page: int = 20):
    return query.offset((page - 1) * per_page).limit(per_page).all()
