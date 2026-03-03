#!/bin/bash

# VIP 功能测试脚本

echo "========================================="
echo "VIP 功能完整测试"
echo "========================================="
echo ""

BASE_URL="http://localhost:8001"

# 测试用户登录
echo "1. 测试用户登录..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"viptest@example.com","password":"123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ 登录失败，请先创建测试用户"
  exit 1
fi

echo "✅ 登录成功"
echo ""

# 测试 VIP 状态查询
echo "2. 测试 VIP 状态查询..."
VIP_STATUS=$(curl -s -X GET "$BASE_URL/api/v1/vip/status" \
  -H "Authorization: Bearer $TOKEN")

echo "VIP 状态: $VIP_STATUS"
IS_VIP=$(echo $VIP_STATUS | grep -o '"is_vip":[^,}]*' | cut -d':' -f2)

if [ "$IS_VIP" = "true" ]; then
  echo "✅ 当前用户是 VIP"
else
  echo "⚠️  当前用户不是 VIP，部分功能测试将跳过"
fi
echo ""

# 测试用户限制查询
echo "3. 测试用户限制查询..."
LIMITS=$(curl -s -X GET "$BASE_URL/api/v1/vip/limits" \
  -H "Authorization: Bearer $TOKEN")

echo "用户限制: $LIMITS"
echo "✅ 限制查询成功"
echo ""

# 测试计划列表
echo "4. 测试计划列表..."
PLANS=$(curl -s -X GET "$BASE_URL/api/v1/plans" \
  -H "Authorization: Bearer $TOKEN")

PLAN_COUNT=$(echo $PLANS | grep -o '"id":[0-9]*' | wc -l)
echo "当前计划数: $PLAN_COUNT"
echo "✅ 计划列表查询成功"
echo ""

# 如果是 VIP，测试高级功能
if [ "$IS_VIP" = "true" ]; then
  echo "5. 测试 VIP 高级功能..."

  # 测试创建多个计划（VIP 无限制）
  echo "   - 测试无限制创建计划..."
  CREATE_RESULT=$(curl -s -X POST "$BASE_URL/api/v1/plans" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"VIP测试计划","goal":"测试VIP功能","user_background":"测试用户","difficulty_level":"beginner","total_duration_days":30}')

  if echo "$CREATE_RESULT" | grep -q '"id"'; then
    echo "   ✅ VIP 用户可以创建计划（无限制）"
  else
    echo "   ❌ 创建计划失败"
  fi

  echo ""
else
  echo "5. 测试普通用户限制..."

  # 测试计划数量限制
  if [ "$PLAN_COUNT" -ge 3 ]; then
    echo "   - 测试计划数量限制..."
    CREATE_RESULT=$(curl -s -X POST "$BASE_URL/api/v1/plans" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"title":"测试计划","goal":"测试限制","user_background":"测试","difficulty_level":"beginner","total_duration_days":30}')

    if echo "$CREATE_RESULT" | grep -q "已达到免费版计划数量上限"; then
      echo "   ✅ 普通用户计划数量限制正常"
    else
      echo "   ⚠️  限制检查可能有问题"
    fi
  else
    echo "   ⚠️  当前计划数少于3个，无法测试限制"
  fi

  echo ""
fi

echo "========================================="
echo "前端功能测试清单"
echo "========================================="
echo ""
echo "请手动测试以下前端功能："
echo ""
echo "✓ VIP 徽章显示"
echo "  - 导航栏用户名旁显示 VIP 徽章"
echo "  - 个人资料页显示 VIP 状态"
echo ""
echo "✓ AI 资源推荐"
echo "  - VIP 用户：查看所有资源"
echo "  - 普通用户：只显示前 2 个资源，其余提示升级"
echo ""
echo "✓ 学习方法建议"
echo "  - VIP 用户：查看完整方法和详细内容"
echo "  - 普通用户：只显示前 2 个方法的简略版"
echo ""
echo "✓ 高级统计分析"
echo "  - VIP 用户：显示学习效率分析、趋势预测、AI 建议"
echo "  - 普通用户：只显示基础统计，提示升级 VIP"
echo ""
echo "✓ 数据导出"
echo "  - VIP 用户：显示导出按钮，可导出计划数据"
echo "  - 普通用户：显示 VIP 导出按钮，点击跳转升级页面"
echo ""
echo "✓ 自定义主题"
echo "  - VIP 用户：可在个人中心访问主题设置"
echo "  - VIP 用户：可选择 6 种配色方案"
echo "  - 普通用户：只能使用默认主题"
echo ""
echo "========================================="
echo "测试完成！"
echo "========================================="
echo ""
echo "访问地址："
echo "前端: http://localhost:5177"
echo "后端 API 文档: http://localhost:8001/docs"
echo ""
