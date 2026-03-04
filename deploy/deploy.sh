#!/bin/bash

# 腾讯云部署脚本
# 使用方法: bash deploy.sh

set -e

echo "=== 开始部署智能学习计划系统 ==="

# 配置变量
APP_DIR="/var/www/learning-plan"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
VENV_DIR="$APP_DIR/venv"

# 1. 更新代码
echo "1. 更新代码..."
cd $APP_DIR
git pull origin master

# 2. 部署后端
echo "2. 部署后端..."
cd $BACKEND_DIR

# 激活虚拟环境
source $VENV_DIR/bin/activate

# 安装依赖
pip install -r ../requirements_sqlite.txt

# 运行数据库迁移
alembic upgrade head

# 重启后端服务
echo "3. 重启后端服务..."
sudo systemctl restart learning-plan

# 4. 构建前端
echo "4. 构建前端..."
cd $APP_DIR/frontend
npm install
npm run build

# 5. 部署前端静态文件
echo "5. 部署前端..."
sudo rm -rf /var/www/learning-plan/frontend/*
sudo cp -r dist/* /var/www/learning-plan/frontend/

# 6. 重启 Nginx
echo "6. 重启 Nginx..."
sudo systemctl restart nginx

echo "=== 部署完成 ==="
echo "后端服务状态:"
sudo systemctl status learning-plan --no-pager

echo ""
echo "Nginx 状态:"
sudo systemctl status nginx --no-pager
