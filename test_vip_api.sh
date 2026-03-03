#!/bin/bash

echo "========================================="
echo "VIP 状态 API 测试"
echo "========================================="
echo ""

BASE_URL="http://localhost:8001"

# 检查用户是否登录
echo "1. 检查 localStorage 中的 token..."
echo "   请在浏览器控制台运行："
echo "   localStorage.getItem('access_token')"
echo ""

# 测试 VIP 状态端点
echo "2. 测试 VIP 状态端点（需要 token）..."
echo ""
echo "如果您有 token，请运行："
echo "TOKEN='your_token_here'"
echo "curl -H \"Authorization: Bearer \$TOKEN\" http://localhost:8001/api/v1/vip/status"
echo ""

# 检查后端日志
echo "3. 检查后端日志..."
echo "   查看是否有 404 或认证错误"
echo ""

echo "========================================="
echo "可能的问题："
echo "========================================="
echo ""
echo "1. 用户未登录"
echo "   - 检查 localStorage 中是否有 access_token"
echo "   - 尝试重新登录"
echo ""
echo "2. Token 过期"
echo "   - 刷新页面触发 token 刷新"
echo "   - 或重新登录"
echo ""
echo "3. API 路径错误"
echo "   - 检查后端路由配置"
echo "   - 确认 /api/v1/vip/status 端点存在"
echo ""
echo "4. CORS 问题"
echo "   - 检查浏览器控制台是否有 CORS 错误"
echo ""

echo "========================================="
echo "解决方案："
echo "========================================="
echo ""
echo "请在浏览器控制台运行以下命令检查登录状态："
echo ""
echo "console.log('Token:', localStorage.getItem('access_token'))"
echo "console.log('User:', localStorage.getItem('user'))"
echo ""
echo "如果没有 token，请重新登录。"
echo ""
