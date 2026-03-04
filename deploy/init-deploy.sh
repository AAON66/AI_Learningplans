#!/bin/bash

# 首次部署初始化脚本
# 在腾讯云服务器上运行此脚本进行初始化

set -e

echo "=== 智能学习计划系统 - 首次部署初始化 ==="

# 配置变量
APP_DIR="/var/www/learning-plan"
REPO_URL="your-git-repo-url"  # 替换为你的 Git 仓库地址

# 1. 更新系统
echo "1. 更新系统..."
sudo apt update
sudo apt upgrade -y

# 2. 安装必要软件
echo "2. 安装必要软件..."
sudo apt install -y python3.10 python3.10-venv python3-pip nginx git curl

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. 创建应用目录
echo "3. 创建应用目录..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# 4. 克隆代码
echo "4. 克隆代码..."
cd /var/www
git clone $REPO_URL learning-plan
cd learning-plan

# 5. 设置后端
echo "5. 设置后端..."
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements_sqlite.txt

# 6. 配置环境变量
echo "6. 配置环境变量..."
cd backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "请编辑 backend/.env 文件，填入你的配置"
    echo "特别是 DEEPSEEK_API_KEY"
fi

# 7. 初始化数据库
echo "7. 初始化数据库..."
alembic upgrade head

# 8. 创建管理员账户（可选）
# python create_admin.py

# 9. 安装前端依赖并构建
echo "9. 构建前端..."
cd ../frontend
npm install
npm run build

# 10. 部署前端静态文件
echo "10. 部署前端静态文件..."
sudo mkdir -p /var/www/learning-plan/frontend
sudo cp -r dist/* /var/www/learning-plan/frontend/

# 11. 配置 Nginx
echo "11. 配置 Nginx..."
sudo cp ../deploy/nginx.conf /etc/nginx/sites-available/learning-plan
sudo ln -sf /etc/nginx/sites-available/learning-plan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 12. 配置 systemd 服务
echo "12. 配置后端服务..."
sudo cp ../deploy/learning-plan.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable learning-plan
sudo systemctl start learning-plan

# 13. 配置防火墙
echo "13. 配置防火墙..."
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw --force enable

echo "=== 初始化完成 ==="
echo ""
echo "服务状态:"
sudo systemctl status learning-plan --no-pager
echo ""
echo "Nginx 状态:"
sudo systemctl status nginx --no-pager
echo ""
echo "请访问: http://your-server-ip"
echo ""
echo "重要提醒:"
echo "1. 编辑 backend/.env 文件，配置 DEEPSEEK_API_KEY"
echo "2. 修改 deploy/nginx.conf 中的 server_name 为你的域名"
echo "3. 如需 HTTPS，请配置 SSL 证书"
