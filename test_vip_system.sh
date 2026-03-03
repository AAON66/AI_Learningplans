#!/bin/bash
# VIP会员系统完整测试脚本

echo "========================================="
echo "VIP会员系统功能测试"
echo "========================================="
echo ""

BASE_URL="http://localhost:8001/api/v1"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试结果统计
PASS=0
FAIL=0

test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((PASS++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((FAIL++))
    fi
}

echo "=== 1. 管理员功能测试 ==="
echo ""

# 1.1 管理员登录
echo "1.1 测试管理员登录..."
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/admin/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"AAON","password":"250378"}')
ADMIN_TOKEN=$(echo $ADMIN_LOGIN | python -c "import sys, json; print(json.load(sys.stdin).get('access_token', ''))" 2>/dev/null)

if [ -n "$ADMIN_TOKEN" ]; then
    test_result 0 "管理员登录成功"
else
    test_result 1 "管理员登录失败"
    exit 1
fi

# 1.2 生成VIP卡密
echo "1.2 测试生成VIP卡密..."
CARDS=$(curl -s -X POST "$BASE_URL/vip/cards" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d '{"duration_days":7,"count":2}')
CARD_COUNT=$(echo $CARDS | python -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

if [ "$CARD_COUNT" = "2" ]; then
    test_result 0 "成功生成2张7天VIP卡密"
    CARD_CODE=$(echo $CARDS | python -c "import sys, json; print(json.load(sys.stdin)[0]['card_code'])" 2>/dev/null)
    echo "   卡密示例: $CARD_CODE"
else
    test_result 1 "生成VIP卡密失败"
fi

# 1.3 查询卡密列表
echo "1.3 测试查询卡密列表..."
CARDS_LIST=$(curl -s "$BASE_URL/vip/cards" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
TOTAL_CARDS=$(echo $CARDS_LIST | python -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

if [ -n "$TOTAL_CARDS" ] && [ "$TOTAL_CARDS" -gt 0 ]; then
    test_result 0 "查询卡密列表成功 (共 $TOTAL_CARDS 张)"
else
    test_result 1 "查询卡密列表失败"
fi

echo ""
echo "=== 2. 用户注册与登录测试 ==="
echo ""

# 2.1 用户注册
echo "2.1 测试用户注册..."
TIMESTAMP=$(date +%s)
TEST_EMAIL="viptest${TIMESTAMP}@example.com"
REGISTER=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"test123\"}")
USER_ID=$(echo $REGISTER | python -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null)

if [ -n "$USER_ID" ]; then
    test_result 0 "用户注册成功 (ID: $USER_ID)"
else
    test_result 1 "用户注册失败"
    exit 1
fi

# 2.2 用户登录
echo "2.2 测试用户登录..."
LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"test123\"}")
USER_TOKEN=$(echo $LOGIN | python -c "import sys, json; print(json.load(sys.stdin).get('access_token', ''))" 2>/dev/null)

if [ -n "$USER_TOKEN" ]; then
    test_result 0 "用户登录成功"
else
    test_result 1 "用户登录失败"
    exit 1
fi

echo ""
echo "=== 3. VIP状态与激活测试 ==="
echo ""

# 3.1 查看VIP状态(激活前)
echo "3.1 测试查看VIP状态(激活前)..."
VIP_STATUS_BEFORE=$(curl -s "$BASE_URL/vip/status" \
    -H "Authorization: Bearer $USER_TOKEN")
IS_VIP_BEFORE=$(echo $VIP_STATUS_BEFORE | python -c "import sys, json; print(json.load(sys.stdin).get('is_vip', ''))" 2>/dev/null)

if [ "$IS_VIP_BEFORE" = "False" ]; then
    test_result 0 "确认用户非VIP状态"
else
    test_result 1 "VIP状态查询异常"
fi

# 3.2 激活VIP
echo "3.2 测试VIP激活..."
ACTIVATE=$(curl -s -X POST "$BASE_URL/vip/activate" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -d "{\"card_code\":\"$CARD_CODE\"}")
IS_VIP_AFTER=$(echo $ACTIVATE | python -c "import sys, json; print(json.load(sys.stdin).get('is_vip', ''))" 2>/dev/null)
DAYS_REMAINING=$(echo $ACTIVATE | python -c "import sys, json; print(json.load(sys.stdin).get('days_remaining', ''))" 2>/dev/null)

if [ "$IS_VIP_AFTER" = "True" ]; then
    test_result 0 "VIP激活成功 (剩余 $DAYS_REMAINING 天)"
else
    test_result 1 "VIP激活失败"
fi

echo ""
echo "=== 4. VIP权限功能测试 ==="
echo ""

# 4.1 创建学习计划
echo "4.1 测试创建学习计划..."
PLAN=$(curl -s -X POST "$BASE_URL/plans" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -d '{"title":"测试计划","goal":"测试VIP功能","difficulty_level":"beginner"}')
PLAN_ID=$(echo $PLAN | python -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null)

if [ -n "$PLAN_ID" ]; then
    test_result 0 "创建学习计划成功 (ID: $PLAN_ID)"
else
    test_result 1 "创建学习计划失败"
fi

# 4.2 测试AI分析(VIP专属功能)
echo "4.2 测试AI分析功能(VIP专属)..."
ANALYSIS=$(curl -s -X POST "$BASE_URL/analysis/generate" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -d "{\"plan_id\":$PLAN_ID}")
ANALYSIS_ID=$(echo $ANALYSIS | python -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null)

if [ -n "$ANALYSIS_ID" ]; then
    test_result 0 "AI分析生成成功 (VIP功能正常)"
else
    test_result 1 "AI分析生成失败"
fi

echo ""
echo "=== 5. 非VIP用户权限测试 ==="
echo ""

# 5.1 注册非VIP用户
echo "5.1 注册非VIP测试用户..."
NOVIP_EMAIL="novip${TIMESTAMP}@example.com"
curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$NOVIP_EMAIL\",\"password\":\"test123\"}" > /dev/null

NOVIP_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$NOVIP_EMAIL\",\"password\":\"test123\"}")
NOVIP_TOKEN=$(echo $NOVIP_LOGIN | python -c "import sys, json; print(json.load(sys.stdin).get('access_token', ''))" 2>/dev/null)

# 5.2 创建计划
NOVIP_PLAN=$(curl -s -X POST "$BASE_URL/plans" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $NOVIP_TOKEN" \
    -d '{"title":"非VIP测试","goal":"测试权限","difficulty_level":"beginner"}')
NOVIP_PLAN_ID=$(echo $NOVIP_PLAN | python -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null)

# 5.3 尝试使用VIP功能
echo "5.2 测试非VIP用户访问VIP功能..."
NOVIP_ANALYSIS=$(curl -s -X POST "$BASE_URL/analysis/generate" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $NOVIP_TOKEN" \
    -d "{\"plan_id\":$NOVIP_PLAN_ID}")
ERROR_MSG=$(echo $NOVIP_ANALYSIS | python -c "import sys, json; print(json.load(sys.stdin).get('detail', ''))" 2>/dev/null)

if [[ "$ERROR_MSG" == *"VIP"* ]]; then
    test_result 0 "非VIP用户被正确拒绝访问VIP功能"
else
    test_result 1 "权限控制失败"
fi

echo ""
echo "========================================="
echo "测试完成"
echo "========================================="
echo -e "通过: ${GREEN}$PASS${NC}"
echo -e "失败: ${RED}$FAIL${NC}"
echo "总计: $((PASS + FAIL))"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}所有测试通过！VIP系统运行正常。${NC}"
    exit 0
else
    echo -e "${RED}部分测试失败，请检查系统配置。${NC}"
    exit 1
fi
