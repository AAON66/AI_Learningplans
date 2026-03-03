"""add_username_to_users"""
from alembic import op
import sqlalchemy as sa


revision = '4184d3a6b6d4'
down_revision = '2f3706f782d1'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # 添加 username 字段，允许为空（兼容旧数据）
    op.add_column('users', sa.Column('username', sa.String(), nullable=True))

def downgrade() -> None:
    op.drop_column('users', 'username')
