# 智能学习计划系统

基于 AI 的个性化学习规划工具，使用 DeepSeek R1 模型提供智能分析和推荐。

## 技术栈

**后端：**
- FastAPI + SQLAlchemy + SQLite
- Alembic（数据库迁移）
- DeepSeek R1 API（AI 分析）
- JWT 认证
- Python 3.10+

**前端：**
- React 18 + TypeScript
- Vite
- React Router v6
- Tailwind CSS
- Axios

## 快速开始

### 1. 环境要求

- Python 3.10+
- Node.js 18+
- SQLite（已内置，无需额外安装）

### 2. 后端设置

```bash
cd backend

# 创建虚拟环境（如果还没有）
python -m venv ../.venv
source ../.venv/bin/activate  # Windows: ..\.venv\Scripts\activate

# 安装依赖（使用 SQLite 版本）
pip install -r ../requirements_sqlite.txt

# 配置环境变量（已有 .env 文件）
# 确认 .env 文件中的配置：
# - DATABASE_URL=sqlite:///./learning_plan.db
# - DEEPSEEK_API_KEY=你的API密钥

# 运行数据库迁移
alembic upgrade head

# 启动后端服务
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**注意：** 如果 8000 端口被占用，可以使用其他端口：
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

### 3. 前端设置

```bash
cd frontend

# 安装依赖（如果还没有）
npm install

# 启动开发服务器
npm run dev
```

前端会自动在可用端口启动（通常是 5173，如被占用会尝试 5174、5175 等）

**访问地址：** 启动后终端会显示实际的访问地址，例如 `http://localhost:5175`

## 功能特性

### 核心功能
1. **用户认证系统**
   - 用户注册、登录
   - JWT Token 认证（Access Token + Refresh Token）
   - 密码找回功能
   - 用户个人资料管理

2. **AI 智能分析**
   - 使用 DeepSeek R1 模型分析学习需求
   - 智能生成学习计划
   - 个性化学习建议

3. **学习计划管理**
   - 创建学习计划
   - 查看计划详情
   - 计划状态跟踪（未开始、进行中、已完成、已暂停）
   - 学习阶段管理

4. **学习资源推荐**
   - AI 推荐优质学习资源
   - 资源分类（视频、文章、书籍、课程等）
   - 资源链接管理

5. **学习方法建议**
   - 定制化学习方法推荐
   - 学习技巧指导

6. **进度跟踪**
   - 每日学习打卡
   - 学习记录管理
   - 学习笔记

7. **数据统计**
   - 学习时长统计
   - 完成率分析
   - 连续学习天数
   - 可视化数据展示

## API 文档

启动后端后访问 Swagger 文档：
- 本地：`http://localhost:8000/docs`（或你使用的端口）
- ReDoc：`http://localhost:8000/redoc`

### 主要 API 端点

**认证相关：**
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/refresh` - 刷新 Token
- `GET /api/v1/auth/me` - 获取当前用户信息

**学习计划：**
- `POST /api/v1/plans` - 创建学习计划
- `GET /api/v1/plans` - 获取计划列表
- `GET /api/v1/plans/{id}` - 获取计划详情
- `PUT /api/v1/plans/{id}` - 更新计划
- `DELETE /api/v1/plans/{id}` - 删除计划

**AI 分析：**
- `POST /api/v1/analysis/analyze` - AI 需求分析

**学习阶段：**
- `GET /api/v1/stages` - 获取阶段列表
- `PUT /api/v1/stages/{id}` - 更新阶段

**学习资源：**
- `GET /api/v1/resources` - 获取资源列表

**学习方法：**
- `GET /api/v1/methods` - 获取学习方法

**进度跟踪：**
- `POST /api/v1/progress/checkin` - 每日打卡
- `GET /api/v1/progress/stats` - 获取统计数据

## 项目结构

```
aistudy/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/              # API v1 路由
│   │   │       ├── auth.py      # 认证相关
│   │   │       ├── plans.py     # 学习计划
│   │   │       ├── analysis.py  # AI 分析
│   │   │       ├── stages.py    # 学习阶段
│   │   │       ├── resources.py # 学习资源
│   │   │       ├── methods.py   # 学习方法
│   │   │       └── progress.py  # 进度跟踪
│   │   ├── core/                # 核心配置
│   │   │   ├── config.py        # 应用配置
│   │   │   ├── database.py      # 数据库连接
│   │   │   └── security.py      # 安全相关
│   │   ├── models/              # SQLAlchemy 模型
│   │   ├── schemas/             # Pydantic 模式
│   │   ├── services/            # 业务逻辑
│   │   ├── utils/               # 工具函数
│   │   └── main.py              # FastAPI 应用入口
│   ├── alembic/                 # 数据库迁移
│   ├── .env                     # 环境变量配置
│   ├── alembic.ini              # Alembic 配置
│   └── learning_plan.db         # SQLite 数据库文件
├── frontend/
│   ├── src/
│   │   ├── components/          # React 组件
│   │   │   ├── auth/            # 认证组件
│   │   │   ├── layout/          # 布局组件
│   │   │   ├── plan/            # 计划组件
│   │   │   ├── stage/           # 阶段组件
│   │   │   ├── resource/        # 资源组件
│   │   │   ├── method/          # 方法组件
│   │   │   └── analysis/        # 分析组件
│   │   ├── pages/               # 页面组件
│   │   │   ├── Home.tsx         # 首页
│   │   │   ├── Login.tsx        # 登录
│   │   │   ├── Register.tsx     # 注册
│   │   │   ├── Plans.tsx        # 计划列表
│   │   │   ├── CreatePlan.tsx   # 创建计划
│   │   │   ├── PlanDetail.tsx   # 计划详情
│   │   │   ├── Progress.tsx     # 进度跟踪
│   │   │   ├── Stats.tsx        # 数据统计
│   │   │   └── Profile.tsx      # 个人资料
│   │   ├── services/            # API 调用服务
│   │   ├── hooks/               # 自定义 Hooks
│   │   ├── utils/               # 工具函数
│   │   ├── App.tsx              # 应用根组件
│   │   └── main.tsx             # 应用入口
│   ├── vite.config.ts           # Vite 配置（含 API 代理）
│   ├── tailwind.config.js       # Tailwind CSS 配置
│   └── package.json
├── .venv/                       # Python 虚拟环境
├── requirements.txt             # Python 依赖（PostgreSQL 版本）
├── requirements_sqlite.txt      # Python 依赖（SQLite 版本）
└── README.md
```

## 环境变量配置

后端 `.env` 文件配置项：

```env
# 数据库配置（SQLite）
DATABASE_URL=sqlite:///./learning_plan.db

# JWT 配置
SECRET_KEY=你的密钥
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# DeepSeek API 配置
DEEPSEEK_API_KEY=你的DeepSeek API密钥
DEEPSEEK_API_URL=https://api.deepseek.com/v1

# CORS 配置
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175
```

**注意：**
- 如需使用 PostgreSQL，请修改 `DATABASE_URL` 并使用 `requirements.txt` 安装依赖
- 请妥善保管 `SECRET_KEY` 和 `DEEPSEEK_API_KEY`，不要提交到版本控制

## 开发说明

### 后端开发
- 使用 FastAPI 自动生成 API 文档
- 遵循 RESTful API 设计规范
- 使用 Alembic 管理数据库迁移
- JWT Bearer Token 认证机制
- 异步数据库操作

### 前端开发
- TypeScript 严格模式
- React Hooks 编程范式
- 组件化开发
- Tailwind CSS 样式管理
- Vite 代理配置（`/api` 代理到后端）

### 数据库迁移

创建新的迁移：
```bash
cd backend
alembic revision --autogenerate -m "描述"
```

应用迁移：
```bash
alembic upgrade head
```

回滚迁移：
```bash
alembic downgrade -1
```

## 常见问题

### 1. 端口被占用
如果默认端口被占用，可以修改启动命令：
- 后端：`uvicorn app.main:app --reload --port 8001`
- 前端：Vite 会自动尝试其他端口

### 2. 前端无法连接后端
检查 `frontend/vite.config.ts` 中的代理配置，确保指向正确的后端端口。

### 3. 数据库迁移失败
确保虚拟环境已激活，且在 `backend` 目录下执行迁移命令。

### 4. DeepSeek API 调用失败
检查 `.env` 文件中的 `DEEPSEEK_API_KEY` 是否正确配置。

## 许可证

MIT
