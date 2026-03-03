#!/bin/bash

# VIP 显示功能测试脚本

echo "========================================="
echo "VIP 显示功能测试"
echo "========================================="
echo ""

BASE_URL="http://localhost:8001"

# 1. 创建测试用户（如果不存在）
echo "1. 创建/登录测试用户..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"viptest@example.com","password":"123456","username":"VIP测试用户"}' 2>&1)

# 登录
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"viptest@example.com","password":"123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ 登录失败"
  exit 1
fi

echo "✅ 登录成功"
echo ""

# 2. 检查 VIP 状态
echo "2. 检查 VIP 状态..."
VIP_STATUS=$(curl -s -X GET "$BASE_URL/api/v1/vip/status" \
  -H "Authorization: Bearer $TOKEN")

echo "VIP 状态响应: $VIP_STATUS"
IS_VIP=$(echo $VIP_STATUS | grep -o '"is_vip":[^,}]*' | cut -d':' -f2 | tr -d ' ')

echo "IS_VIP 值: [$IS_VIP]"

if [ "$IS_VIP" = "true" ]; then
  echo "✅ 当前用户是 VIP"
else
  echo "⚠️  当前用户不是 VIP，需要激活 VIP"

  # 3. 生成并激活 VIP 卡密
  echo ""
  echo "3. 生成 VIP 卡密（需要管理员权限）..."

  # 先登录管理员
  ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"admin123"}')

  ADMIN_TOKEN=$(echo $ADMIN_LOGIN | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

  if [ -z "$ADMIN_TOKEN" ]; then
    echo "❌ 管理员登录失败，请先创建管理员账户"
    echo "   可以手动在数据库中设置用户为管理员"
    exit 1
  fi

  # 生成卡密
  CARD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/vip/cards" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"duration_days":365,"count":1}')

  CARD_CODE=$(echo $CARD_RESPONSE | grep -o '"card_code":"[^"]*' | head -1 | cut -d'"' -f4)

  if [ -z "$CARD_CODE" ]; then
    echo "❌ 生成卡密失败"
    echo "响应: $CARD_RESPONSE"
    exit 1
  fi

  echo "✅ 生成卡密成功: $CARD_CODE"

  # 4. 激活 VIP
  echo ""
  echo "4. 激活 VIP..."
  ACTIVATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/vip/activate" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"card_code\":\"$CARD_CODE\"}")

  echo "激活响应: $ACTIVATE_RESPONSE"

  # 再次检查 VIP 状态
  VIP_STATUS=$(curl -s -X GET "$BASE_URL/api/v1/vip/status" \
    -H "Authorization: Bearer $TOKEN")

  IS_VIP=$(echo $VIP_STATUS | grep -o '"is_vip":[^,}]*' | cut -d':' -f2 | tr -d ' ')

  if [ "$IS_VIP" = "true" ]; then
    echo "✅ VIP 激活成功"
  else
    echo "❌ VIP 激活失败"
    exit 1
  fi
fi

echo ""
echo "5. 创建测试计划..."
PLAN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/plans" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"VIP功能测试计划","goal":"测试VIP用户是否能看到完整资源","user_background":"测试用户","difficulty_level":"beginner","total_duration_days":30}')

PLAN_ID=$(echo $PLAN_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$PLAN_ID" ]; then
  echo "❌ 创建计划失败"
  echo "响应: $PLAN_RESPONSE"
  exit 1
fi

echo "✅ 创建计划成功，ID: $PLAN_ID"

echo ""
echo "========================================="
echo "测试完成！"
echo "========================================="
echo ""
echo "请在浏览器中访问以下地址进行手动测试："
echo "http://localhost:5177/plans/$PLAN_ID"
echo ""
echo "测试要点："
echo "1. 检查浏览器控制台的日志输出"
echo "2. 确认 VIP 状态是否正确传递"
echo "3. 确认资源和方法是否完整显示"
echo ""
