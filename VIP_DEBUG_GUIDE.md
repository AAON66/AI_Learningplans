# VIP 显示功能调试指南

## 当前状态
已添加详细的调试日志，帮助诊断 VIP 状态传递问题。

## 测试步骤

### 1. 刷新前端页面
由于前端代码已重新构建，请刷新浏览器页面（Ctrl+F5 强制刷新）。

### 2. 打开浏览器开发者工具
- Chrome/Edge: 按 F12
- 查看 Console 标签页

### 3. 访问学习任务详情页
访问您已创建的学习任务详情页面。

### 4. 查看控制台日志

您应该看到以下日志输出：

```
[PlanDetail] VIP Status Response: {is_vip: true, expire_at: "...", days_remaining: ...}
[PlanDetail] is_vip value: true
[PlanDetail] is_vip type: boolean

[ResourceCard] Render - isVipProp: true isVipState: false final isVip: true
[ResourceCard] Using isVip from props: true

[ResourceCard] Stage X: {isVip: true, totalResources: 5, displayResources: 5, hiddenCount: 0}
```

### 5. 关键检查点

#### ✅ 正常情况（VIP 用户）
- `[PlanDetail] is_vip value: true`
- `[ResourceCard] isVipProp: true`
- `[ResourceCard] final isVip: true`
- `hiddenCount: 0`
- **不应该显示**"还有 X 个资源，升级VIP查看"

#### ❌ 异常情况
如果看到：
- `[ResourceCard] isVipProp: false` - 说明父组件传递的值是 false
- `[ResourceCard] final isVip: false` - 说明最终使用的值是 false
- `hiddenCount: 3` - 说明计算出了隐藏数量

### 6. 可能的问题

#### 问题 1: isVipProp 是 false
**原因**: PlanDetail 页面的 `isVip` 状态是 false
**解决**: 检查 VIP 状态 API 返回值

#### 问题 2: isVipProp 是 undefined
**原因**: 父组件没有传递 isVip prop
**解决**: 检查 PlanDetail.tsx 是否正确传递了 isVip

#### 问题 3: hiddenCount 计算错误
**原因**: 逻辑判断有误
**当前逻辑**: `const hiddenCount = !isVip && stageResources.length > 2 ? stageResources.length - 2 : 0`

## 请提供以下信息

请将浏览器控制台的日志截图或复制粘贴发送给我，包括：

1. 所有 `[PlanDetail]` 开头的日志
2. 所有 `[ResourceCard]` 开头的日志
3. 页面上是否仍然显示"还有 X 个资源，升级VIP查看"

这样我可以准确定位问题所在。

## 快速测试命令

如果您想通过 API 直接测试 VIP 状态：

```bash
# 获取 token（替换为您的邮箱和密码）
TOKEN=$(curl -s -X POST "http://localhost:8001/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# 检查 VIP 状态
curl -s -X GET "http://localhost:8001/api/v1/vip/status" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

预期输出（VIP 用户）：
```json
{
  "is_vip": true,
  "expire_at": "2026-04-02T12:49:31.084250",
  "days_remaining": 29
}
```
