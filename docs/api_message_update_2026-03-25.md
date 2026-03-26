# API接口更新记录 - 2026-03-25

## 更新概述

本次更新基于服务器API文档（`/docs/server-api/swagger.json`）与现有文档的对比，新增了消息管理相关的接口，并更新了相应的API调用代码和文档。

## 新增接口

### 1. 会话管理接口

#### 获取会话列表
- **接口路径**: `GET /playmate/conversations`
- **认证要求**: 需要认证
- **功能**: 获取用户的所有会话列表
- **新增原因**: 之前只有消息列表，新增会话管理功能

#### 归档会话
- **接口路径**: `PUT /playmate/conversations/{id}/archive`
- **认证要求**: 需要认证
- **功能**: 归档指定的会话
- **新增原因**: 支持用户归档不需要的会话

#### 标记会话为已读
- **接口路径**: `PUT /playmate/conversations/{userId}/read`
- **认证要求**: 需要认证
- **功能**: 标记与指定用户的会话为已读
- **新增原因**: 批量标记会话中的消息为已读

### 2. 消息管理接口增强

#### 获取消息列表（增强版）
- **接口路径**: `GET /playmate/messages`
- **认证要求**: 需要认证
- **新增参数**:
  - `type`: 消息类型（text/image/voice）
  - `status`: 消息状态（sent/delivered/read）
  - `senderId`: 发送者ID
  - `receiverId`: 接收者ID
  - `startTime`: 开始时间
  - `endTime`: 结束时间
  - `keyword`: 关键词搜索
  - `page`: 页码
  - `pageSize`: 每页数量
- **新增原因**: 支持更灵活的消息查询和筛选

#### 获取聊天消息（增强版）
- **接口路径**: `GET /playmate/messages/chat/{userId}`
- **认证要求**: 需要认证
- **响应数据增强**:
  - `type`: 消息类型（text/image/voice）
  - `status`: 消息状态（sent/delivered/read）
  - `from`: 消息来源（self/other）
- **新增原因**: 支持更丰富的消息类型和状态

#### 发送消息（增强版）
- **接口路径**: `POST /playmate/messages/chat/{userId}`
- **认证要求**: 需要认证
- **新增参数**:
  - `type`: 消息类型（text/image/voice）
- **响应数据增强**:
  - `senderId`: 发送者ID
  - `receiverId`: 接收者ID
  - `type`: 消息类型
  - `status`: 消息状态
- **新增原因**: 支持发送不同类型的消息

#### 标记消息为已读
- **接口路径**: `PUT /playmate/messages/{id}/read`
- **认证要求**: 需要认证
- **功能**: 标记指定消息为已读
- **新增原因**: 支持单条消息标记已读

## 接口路径变更

### 消息相关接口路径前缀变更
所有消息相关接口路径都添加了 `/playmate` 前缀：

| 原路径 | 新路径 |
|--------|--------|
| `GET /messages` | `GET /playmate/messages` |
| `GET /messages/chat/{userId}` | `GET /playmate/messages/chat/{userId}` |
| `POST /messages/chat/{userId}` | `POST /playmate/messages/chat/{userId}` |
| `PUT /messages/{id}/read` | `PUT /playmate/messages/{id}/read` |

## 代码实现更新

### 1. API调用代码更新

#### 新增方法
```javascript
// 获取会话列表
async getConversations()

// 归档会话
async archiveConversation(conversationId)

// 标记会话为已读
async markConversationAsRead(userId)

// 获取消息列表（支持参数）
async getMessages(params = {})

// 标记消息为已读
async markMessageAsRead(messageId)
```

#### 增强方法
```javascript
// 发送消息（支持消息类型）
async sendMessage(userId, content, type = 'text')
```

### 2. 参数处理增强

#### GET请求参数处理
```javascript
// 支持查询参数
export async function get(url, options = {}) {
  let finalUrl = url
  if (options.params) {
    const queryParams = new URLSearchParams()
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value)
      }
    }
    const queryString = queryParams.toString()
    if (queryString) {
      finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
    }
  }
  return request(finalUrl, {
    method: 'GET',
    ...options
  })
}
```

#### DELETE请求参数处理
```javascript
// 支持查询参数
export async function del(url, options = {}) {
  let finalUrl = url
  if (options.params) {
    const queryParams = new URLSearchParams()
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value)
      }
    }
    const queryString = queryParams.toString()
    if (queryString) {
      finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
    }
  }
  return request(finalUrl, {
    method: 'DELETE',
    ...options
  })
}
```

## 数据模型更新

### ChatMessage模型
```javascript
{
  content: String,      // 消息内容
  from: String,        // self 或 other
  status: String,      // sent, delivered, read
  time: String,        // 时间
  type: String         // text, image, voice
}
```

### Message模型
```javascript
{
  id: Integer,
  senderId: Integer,
  receiverId: Integer,
  content: String,
  type: String,        // text, image, voice
  status: String,      // sent, delivered, read
  from: String,        // self 或 other
  time: String
}
```

### Conversation模型
```javascript
{
  id: Integer,
  userId: Integer,
  userName: String,
  userAvatar: String,
  lastMessage: String,
  lastMessageTime: String,
  unreadCount: Integer,
  isArchived: Boolean
}
```

## 文档更新

### 1. 全局API参数文档更新
- **文件**: `docs/global_api_parameters.md`
- **更新内容**:
  - 新增会话管理接口（3个）
  - 增强消息管理接口（4个）
  - 更新接口路径前缀为 `/playmate`
  - 添加详细的请求参数表格
  - 更新响应示例

### 2. 页面API使用文档更新
- **文件**: `docs/global_page_api_usage.md`
- **更新内容**:
  - 新增会话管理功能说明
  - 新增归档会话接口说明
  - 新增标记已读接口说明
  - 增强消息查询参数说明
  - 更新页面交互说明

## 功能增强

### 1. 消息类型支持
- 支持文本消息（text）
- 支持图片消息（image）
- 支持语音消息（voice）

### 2. 消息状态跟踪
- 已发送（sent）
- 已送达（delivered）
- 已读（read）

### 3. 消息查询增强
- 按类型筛选
- 按状态筛选
- 按发送者筛选
- 按接收者筛选
- 按时间范围筛选
- 关键词搜索
- 分页支持

### 4. 会话管理
- 会话列表展示
- 会话归档功能
- 会话已读标记
- 未读消息计数

## 兼容性说明

### 向后兼容
- 保留了原有的消息接口功能
- 新增参数都是可选的
- 响应格式保持一致

### Mock数据兼容
- 所有新增接口都有对应的Mock实现
- Mock数据格式与真实API保持一致
- 支持通过环境变量切换Mock/真实API

## 测试建议

### 1. 功能测试
- 测试会话列表获取
- 测试会话归档功能
- 测试会话已读标记
- 测试消息列表查询（各种筛选条件）
- 测试不同类型消息发送
- 测试消息已读标记

### 2. 集成测试
- 测试与现有页面的集成
- 测试状态管理
- 测试错误处理
- 测试缓存机制

### 3. 性能测试
- 测试大量消息的加载性能
- 测试消息发送的响应时间
- 测试会话列表的渲染性能

## 注意事项

1. **路径前缀**: 所有消息相关接口都需要添加 `/playmate` 前缀
2. **参数验证**: 所有可选参数在未提供时应该有合理的默认值
3. **错误处理**: 需要处理各种网络错误和业务错误
4. **状态管理**: 需要正确管理消息和会话的状态
5. **缓存策略**: 会话列表和消息列表可以考虑本地缓存
6. **实时更新**: 考虑使用WebSocket实现消息实时推送

## 后续优化建议

1. **实时通信**: 实现WebSocket支持消息实时推送
2. **消息已读回执**: 实现消息已读回执机制
3. **消息撤回**: 支持消息撤回功能
4. **消息转发**: 支持消息转发功能
5. **富文本支持**: 支持富文本消息和表情
6. **文件传输**: 支持文件传输功能
7. **语音消息**: 支持语音录制和播放
8. **视频通话**: 支持视频通话功能

## 更新记录

- 2026-03-25: 初始版本，新增消息管理接口
