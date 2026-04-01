# Home.vue 悬赏订单数据处理优化

## 修改时间
2026-04-01

## 问题描述
API 返回的悬赏订单数据格式与页面期望的格式不一致，导致数据渲染异常。

## 原始 API 返回格式
```json
{
  "code": 0,
  "data": {
    "data": [...],
    "pagination": {...}
  },
  "msg": "获取成功"
}
```

## 数据问题
1. **嵌套结构**: 数据在 `data.data` 中，而非直接 `data`
2. **tags 格式不一致**: 有些是 JSON 字符串数组 `["娱乐","代打"]`，有些是逗号分隔字符串 `"钻石,排位,上分"`
3. **avatar 格式问题**: 包含多余空格和反引号 `` `https://...` ``
4. **user 对象字段**: 需要从 `user.avatar`, `user.name`, `user.nickname`, `user.level` 提取

## 解决方案

### 1. 新增 parseTags 函数
```javascript
const parseTags = (tags) => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') {
    // 尝试解析 JSON 数组字符串
    try {
      const parsed = JSON.parse(tags)
      if (Array.isArray(parsed)) return parsed
    } catch (e) {
      // 不是 JSON，按逗号分隔处理
    }
    // 按逗号分隔
    return tags.split(',').map(tag => tag.trim()).filter(Boolean)
  }
  return []
}
```

### 2. 新增 cleanAvatarUrl 函数
```javascript
const cleanAvatarUrl = (avatar) => {
  if (!avatar) return ''
  return avatar.replace(/[`\s]/g, '').trim()
}
```

### 3. 优化 loadRewardOrders 函数
- 正确处理嵌套的 `data.data` 结构
- 统一字段映射和格式化
- 使用工具函数处理 tags 和 avatar

## 字段映射关系

| API 字段 | 页面字段 | 处理方式 |
|---------|---------|---------|
| `user.avatar` | `userAvatar` | cleanAvatarUrl 处理 |
| `user.name` / `user.nickname` | `userName` | 优先使用 nickname |
| `user.level` | `userLevel` | 默认为 0 |
| `user.id` / `userId` | `userId` | 合并处理 |
| `game` | `game` | 默认为 "未知游戏" |
| `content` | `content` | 默认为空字符串 |
| `reward` | `reward` | 默认为 0 |
| `paymentMethod` | `paymentMethod` | 默认为 "prepay" |
| `status` | `status` | 默认为 "available" |
| `tags` | `tags` | parseTags 处理 |
| `requirements` | `requirements` | parseTags 处理 |
| `createdAt` | `createdAt` | formatTime 格式化 |

## 测试验证
- [x] 正确处理嵌套数据结构
- [x] 兼容 JSON 字符串数组和逗号分隔字符串格式的 tags
- [x] 清理 avatar URL 中的多余字符
- [x] 正确映射 user 对象字段
- [x] 时间格式化显示正常
