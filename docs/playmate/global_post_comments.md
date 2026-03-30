# 评论列表功能开发记录

## 更新时间
2026-03-30

## 功能描述
在帖子详情页 `/post/:id` 显示评论列表

## 修改内容

### 1. API层 (`src/api/index.js`)
- 在 `communityApi` 中添加了 `getComments(postId, page, pageSize)` 方法
- 支持 Mock 和真实 API 两种模式
- Mock 模式返回模拟评论数据
- 真实 API 调用 `/community/posts/${postId}/comments` 接口

### 2. 视图层 (`src/views/PostDetail.vue`)
- 添加 `loadComments()` 函数独立加载评论列表
- 修改 `loadPostDetail()` 函数，只在 `commentsList` 存在时才处理内置评论
- 在 `onMounted` 钩子中调用 `loadComments()`

## 当前状态
✅ 代码已完成

## 待后端配合
⚠️ 后端需要实现评论列表接口 `/community/posts/{postId}/comments`

当前真实 API 模式下，评论接口调用会失败，因为后端尚未实现该接口。

### 预期后端响应格式
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "user": {
          "id": 101,
          "name": "评论用户名",
          "avatar": "头像URL"
        },
        "content": "评论内容",
        "time": "1小时前",
        "likes": 23,
        "createdAt": "2026-03-30T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalCount": 4
    }
  }
}
```

## 测试
- Mock 模式：评论列表功能正常
- 真实 API 模式：等待后端实现接口