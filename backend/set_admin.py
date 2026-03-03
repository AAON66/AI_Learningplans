"""
设置用户为管理员的脚本
"""
from app.core.database import SessionLocal
from app.models.user import User

def set_admin(email: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.is_admin = 1
            db.commit()
            print(f"✅ 用户 {email} 已设置为管理员")
        else:
            print(f"❌ 未找到用户 {email}")
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("用法: python set_admin.py <email>")
        print("示例: python set_admin.py admin@example.com")
    else:
        set_admin(sys.argv[1])
