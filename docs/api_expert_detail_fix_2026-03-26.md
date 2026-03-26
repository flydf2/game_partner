# 专家详情页数据结构修复记录

## 问题描述

访问 `/expert/20` 页面时，专家详情接口 `/api/playmate/experts/20` 返回的数据存在以下问题：

### 1. 评论数据结构不匹配

**后端返回格式**：
```json
{
  "reviews": [
    {
      "id": 60,
      "userId": 20,
      "playmateId": 20,
      "rating": 5,
      "content": "多游戏都很精通，技术全面，非常满意",
      "images": "url1,url2,url3",
      "tags": "全面,精通,满意",
      "createdAt": "2026-03-25T12:45:33+08:00"
    }
  ]
}
```

**前端期望格式**：
```json
{
  "reviews": [
    {
      "id": 60,
      "user": {
        "avatar": "xxx",
        "name": "xxx"
      },
      "rating": 5,
      "content": "多游戏都很精通，技术全面，非常满意",
      "images": ["url1", "url2", "url3"],
      "date": "2026-03-25"
    }
  ]
}
```

### 2. 图片字段类型不一致

- 后端：`images` 是逗号分隔的字符串
- 前端：`images` 期望是数组

### 3. 日期字段名称不一致

- 后端：`createdAt` (ISO 8601 格式)
- 前端：`date`

## 修复方案

### 修改文件

[ExpertDetail.vue](file:///System/Volumes/Data/webcode/UX/GamePartner/src/views/ExpertDetail.vue)

### 具体修改

#### 1. 数据转换逻辑

在 `loadReviews` 函数中添加数据转换逻辑，将后端返回的字符串转换为数组：

```javascript
let processedReviews = response.data.reviews
processedReviews = processedReviews.map(review => ({
  ...review,
  images: typeof review.images === 'string' 
    ? review.images.split(',').filter(img => img.trim() !== '')
    : Array.isArray(review.images) ? review.images : []
}))
```

#### 2. 评论模板优化

- 移除对 `review.user` 的引用（后端不返回用户信息）
- 使用占位符显示用户头像
- 显示 `用户{userId}` 代替用户名
- 修正日期字段为 `createdAt`
- 为图片添加懒加载和错误处理

```vue
<div class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
  <span class="material-symbols-outlined text-zinc-500" data-icon="person">person</span>
</div>
<span class="font-bold text-sm block text-zinc-900">用户{{ review.userId }}</span>
<span class="text-zinc-400 text-[10px]">{{ review.createdAt }}</span>
```

## 待解决的问题

### 1. 用户信息缺失

后端评论数据中没有嵌套用户信息（`user` 对象），只提供了 `userId`。

**解决方案**：
- 根据开发规范"代码开发不能使用嵌套查询"，后端不应在评论接口中嵌套查询用户信息
- 前端使用占位符显示，避免因用户信息缺失导致页面错误

### 2. 图片 URL 有效性

部分图片 URL 来自 Googleusercontent.com，可能存在 400 错误。

**解决方案**：
- 建议后端使用稳定的 CDN 服务
- 前端已添加 `onerror` 处理，加载失败时显示占位图

## 测试建议

1. 验证评论图片能否正常显示
2. 检查空图片数组的处理
3. 确认评论列表加载和分页功能正常
4. 验证图片加载失败时的占位符显示

## 相关文档

- [API 开发规范](../golbal_api_parameters.md)
- [专家详情页设计](../vue_expert_1.md)
- [API 响应格式规范](../api_data_format_fix_2026-03-26.md)

## 修改记录

| 日期 | 修改内容 | 文件 |
|------|---------|------|
| 2026-03-26 | 添加评论数据转换逻辑 | ExpertDetail.vue |
| 2026-03-26 | 修复评论模板中的用户信息引用 | ExpertDetail.vue |
| 2026-03-26 | 添加图片懒加载和错误处理 | ExpertDetail.vue |

