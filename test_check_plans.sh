#!/bin/bash

BASE_URL="http://localhost:8001"

# 登录
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"viptest@example.com","password":"123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
echo ""

# 获取计划列表
echo "获取计划列表..."
PLANS=$(curl -s -X GET "$BASE_URL/api/v1/plans" \
  -H "Authorization: Bearer $TOKEN")

echo "$PLANS" | python3 -m json.tool 2>/dev/null || echo "$PLANS"
echo ""

# 提取第一个计划ID
PLAN_ID=$(echo $PLANS | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -n "$PLAN_ID" ]; then
  echo "找到计划 ID: $PLAN_ID"
  echo ""
  echo "获取计划详情..."
  PLAN_DETAIL=$(curl -s -X GET "$BASE_URL/api/v1/plans/$PLAN_ID" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "$PLAN_DETAIL" | python3 -m json.tool 2>/dev/null || echo "$PLAN_DETAIL"
  echo ""
  
  echo "获取学习阶段..."
  STAGES=$(curl -s -X GET "$BASE_URL/api/v1/plans/$PLAN_ID/stages" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "$STAGES" | python3 -m json.tool 2>/dev/null || echo "$STAGES"
  echo ""
  
  # 获取第一个阶段的资源
  STAGE_ID=$(echo $STAGES | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
  
  if [ -n "$STAGE_ID" ]; then
    echo "获取阶段 $STAGE_ID 的资源..."
    RESOURCES=$(curl -s -X GET "$BASE_URL/api/v1/stages/$STAGE_ID/resources" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "$RESOURCES" | python3 -m json.tool 2>/dev/null || echo "$RESOURCES"
    echo ""
    
    RESOURCE_COUNT=$(echo $RESOURCES | grep -o '"id":[0-9]*' | wc -l)
    echo "资源数量: $RESOURCE_COUNT"
  fi
  
  echo ""
  echo "========================================="
  echo "请访问: http://localhost:5177/plans/$PLAN_ID"
  echo "========================================="
fi
