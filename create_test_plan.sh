#!/bin/bash

BASE_URL="http://localhost:8001"

# 登录
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"viptest@example.com","password":"123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "创建测试计划..."
PLAN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/plans" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Web开发学习",
    "goal": "学习Python Flask框架开发Web应用",
    "user_background": "有Python基础",
    "difficulty_level": "intermediate",
    "total_duration_days": 60
  }')

echo "$PLAN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PLAN_RESPONSE"

PLAN_ID=$(echo $PLAN_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -n "$PLAN_ID" ]; then
  echo ""
  echo "✅ 计划创建成功，ID: $PLAN_ID"
  
  # 生成分析
  echo ""
  echo "生成学习分析..."
  curl -s -X POST "$BASE_URL/api/v1/plans/$PLAN_ID/analysis" \
    -H "Authorization: Bearer $TOKEN" > /dev/null
  
  sleep 2
  
  # 生成阶段
  echo "生成学习阶段..."
  curl -s -X POST "$BASE_URL/api/v1/plans/$PLAN_ID/stages" \
    -H "Authorization: Bearer $TOKEN" > /dev/null
  
  sleep 2
  
  # 获取阶段列表
  STAGES=$(curl -s -X GET "$BASE_URL/api/v1/plans/$PLAN_ID/stages" \
    -H "Authorization: Bearer $TOKEN")
  
  STAGE_ID=$(echo $STAGES | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
  
  if [ -n "$STAGE_ID" ]; then
    echo "生成资源推荐..."
    curl -s -X POST "$BASE_URL/api/v1/stages/$STAGE_ID/resources" \
      -H "Authorization: Bearer $TOKEN" > /dev/null
    
    sleep 2
  fi
  
  # 生成学习方法
  echo "生成学习方法..."
  curl -s -X POST "$BASE_URL/api/v1/plans/$PLAN_ID/methods" \
    -H "Authorization: Bearer $TOKEN" > /dev/null
  
  echo ""
  echo "========================================="
  echo "✅ 测试数据创建完成！"
  echo "========================================="
  echo ""
  echo "请访问: http://localhost:5177/plans/$PLAN_ID"
  echo ""
  echo "打开浏览器控制台查看日志输出："
  echo "- [PlanDetail] VIP status from API"
  echo "- [ResourceCard] isVipProp"
  echo "- [MethodCard] isVipProp"
  echo ""
fi
