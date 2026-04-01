# global_post_comment_reply_2026-04-01

## 功能描述

在帖子详情页 `/post/:id` 实现评论引用（回复）功能，允许用户回复某条评论，实现嵌套评论交互。

## 使用方式

### 前端创建评论时引用

前端创建评论时，可以通过 `parentId` 参数指定要引用的评论ID：

```javascript
// 调用 communityApi.commentPost 时传入 parentId
const response = await communityApi.commentPost(postId, content, parentId)
```

### 前端获取评论列表

前端获取评论列表时，会收到包含 `parentComment` 字段的评论数据，其中包含被引用评论的详细信息和用户信息：

```javascript
const response = await communityApi.getComments(postId)

response.data.forEach(comment => {
  if (comment.parentComment) {
    console.log('被引用评论:', comment.parentComment.content)
    console.log('被引用用户:', comment.parentComment.user.name)
  }
})
```

## 修改内容

### 1. API 层 (`src/api/index.js`)

#### commentPost 方法

- 新增 `parentId` 可选参数
- Mock 模式返回包含 `parentId` 和 `parentComment` 的完整数据
- 真实 API 模式将 `parentId` 作为请求体参数发送

```javascript
async commentPost(postId, content, parentId = null) {
  // Mock 模式返回引用信息
  // 真实 API 发送 { content, parentId }
}
```

#### getComments 方法

- 增强 Mock 数据，新增两条带引用信息的评论示例
- 评论数据包含 `parentId` 和 `parentComment` 嵌套对象

```javascript
{
  id: 5,
  user: { id: 105, name: '峡谷新秀', avatar: '...' },
  content: '回复王者的：求带加我微信',
  time: '10分钟前',
  likes: 2,
  parentId: 3,
  parentComment: {
    id: 3,
    user: { id: 103, name: '王者大神', avatar: '...' },
    content: '技术不错，求带！'
  }
}
```

### 2. 视图层 (`src/views/PostDetail.vue`)

#### 新增响应式变量

```javascript
const replyingTo = ref(null)    // 当前回复目标评论
const replyInputRef = ref(null) // 输入框引用
```

#### 新增函数

- `startReply(comment)` - 开始回复指定评论，设置 replyingTo
- `cancelReply()` - 取消回复，清空 replyingTo
- 更新 `handleComment()` - 支持发送 parentId 参数

#### UI 更新

1. **评论列表** - 每条评论新增"回复"按钮
2. **被引用评论显示** - 带边框和背景色的引用块，显示被引用评论的用户名和内容
3. **回复状态栏** - 显示当前正在回复的用户信息，提供取消按钮
4. **输入框占位符** - 根据是否在回复状态动态切换提示文字

## 预期后端接口格式

### 创建评论（带引用）

**请求**

```
POST /community/posts/{postId}/comments
{
  "content": "这是回复内容",
  "parentId": 3  // 可选，指定引用的评论ID
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "user": {
      "id": 105,
      "name": "峡谷新秀",
      "avatar": "https://..."
    },
    "content": "回复王者的：求带加我微信",
    "time": "刚刚",
    "likes": 0,
    "parentId": 3,
    "parentComment": {
      "id": 3,
      "user": {
        "id": 103,
        "name": "王者大神",
        "avatar": "https://..."
      },
      "content": "技术不错，求带！"
    }
  },
  "message": "评论成功"
}
```

### 获取评论列表

**响应**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "user": { "id": 101, "name": "小玩家", "avatar": "..." },
        "content": "我也在艾欧尼亚，一起玩吧！",
        "time": "1小时前",
        "likes": 23,
        "createdAt": "2026-04-01T10:00:00Z",
        "parentId": null,
        "parentComment": null
      },
      {
        "id": 5,
        "user": { "id": 105, "name": "峡谷新秀", "avatar": "..." },
        "content": "回复王者的：求带加我微信",
        "time": "10分钟前",
        "likes": 2,
        "createdAt": "2026-04-01T11:50:00Z",
        "parentId": 3,
        "parentComment": {
          "id": 3,
          "user": { "id": 103, "name": "王者大神", "avatar": "..." },
          "content": "技术不错，求带！"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalCount": 6
    }
  }
}
```

## 实现特点

- **符合 GVA 框架的分层架构设计** - API层与视图层分离，职责清晰
- **保持了代码的一致性和可维护性** - 使用现有的社区API结构
- **支持嵌套引用** - 虽然实际使用中通常只引用一级，但系统支持多级嵌套
- **预加载关系数据** - 通过 `parentComment` 字段预加载被引用评论信息，减少前端查询
- **乐观更新** - 评论提交时即时显示，提供流畅的用户体验

## 注意事项

- `parentId` 为可选参数，不传或传 `null` 表示普通评论
- 被引用评论内容仅在创建时存储，不会随原评论更新而更新
- Mock 数据中的 `parentComment` 为模拟数据，真实场景下应从数据库获取
- 回复功能不影响原有的评论统计逻辑，评论数仍按实际评论条数计算
