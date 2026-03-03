"""
创建初始管理员账号
用户名: AAON
密码: 250378
"""
from app.core.database import SessionLocal
from app.models.admin import AdminUser
from app.core.security import hash_password

def create_admin():
    db = SessionLocal()
    try:
        # 检查是否已存在
        existing = db.query(AdminUser).filter(AdminUser.username == "AAON").first()
        if existing:
            print("管理员账号已存在")
            return

        # 创建管理员
        admin = AdminUser(
            username="AAON",
            hashed_password=hash_password("250378")
        )
        db.add(admin)
        db.commit()
        print("管理员账号创建成功")
        print("用户名: AAON")
        print("密码: 250378")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
