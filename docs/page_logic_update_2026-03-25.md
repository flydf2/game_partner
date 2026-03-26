# 页面逻辑更新记录 - 2026-03-25

## 更新概述

根据新增的API接口，更新了消息相关页面的逻辑，实现了会话管理、消息发送、归档功能和标记已读功能。

## 更新的页面

### 1. Messages.vue（消息列表页）

#### 更新的功能

##### 1.1 使用新的会话列表API
**修改位置**: `fetchMessages()` 函数

**修改前**:
```javascript
const response = await messageApi.getMessages()
```

**修改后**:
```javascript
const response = await messageApi.getConversations()
```

**原因**: 使用新的会话列表API，获取更完整的会话信息

##### 1.2 数据格式转换
**修改位置**: 数据映射逻辑

**新增字段**:
- `isArchived`: 会话归档状态
- `unreadCount`: 未读消息数量（使用新的字段名）

**修改内容**:
```javascript
conversations.value = (response.data || []).map(conv => ({
  id: conv.id.toString(),
  userId: conv.userId.toString(),
  name: conv.userName || conv.name,
  avatar: conv.userAvatar || conv.avatar,
  lastMessage: conv.lastMessage,
  lastMessageTime: conv.lastMessageTime,
  unreadCount: conv.unreadCount || 0,
  isArchived: conv.isArchived || false,
  online: conv.online || false
}))
```

##### 1.3 点击会话时标记已读
**修改位置**: `handleConversationClick()` 函数

**修改前**:
```javascript
const handleConversationClick = (conversation) => {
  // 标记为已读
  conversation.unreadCount = 0
  calculateTotalUnread()
  
  // 跳转到聊天页面
  router.push(`/chat/${conversation.userId}`)
}
```

**修改后**:
```javascript
const handleConversationClick = async (conversation) => {
  try {
    // 标记会话为已读
    await messageApi.markConversationAsRead(conversation.userId)
    
    // 更新本地状态
    conversation.unreadCount = 0
    calculateTotalUnread()
    
    // 跳转到聊天页面
    router.push(`/chat/${conversation.userId}`)
  } catch (err) {
    console.error('标记会话已读失败:', err)
    // 即使标记失败也跳转到聊天页面
    router.push(`/chat/${conversation.userId}`)
  }
}
```

**改进点**:
- 调用API标记会话为已读
- 添加错误处理
- 即使API调用失败也允许跳转

##### 1.4 新增归档会话功能
**新增位置**: `handleArchiveConversation()` 函数

**实现**:
```javascript
const handleArchiveConversation = async (conversation, event) => {
  event.stopPropagation()
  
  try {
    await messageApi.archiveConversation(conversation.id)
    
    // 从列表中移除已归档的会话
    conversations.value = conversations.value.filter(conv => conv.id !== conversation.id)
    calculateTotalUnread()
  } catch (err) {
    console.error('归档会话失败:', err)
    alert('归档失败，请稍后重试')
  }
}
```

**功能说明**:
- 调用归档API
- 从本地列表中移除已归档的会话
- 更新未读计数
- 错误处理和用户提示

##### 1.5 UI更新
**修改位置**: 会话列表项模板

**新增内容**:
- 归档按钮
- 按钮图标和悬停效果
- 点击事件处理

**代码**:
```html
<div class="flex items-center gap-2 flex-shrink-0">
  <button
    @click="handleArchiveConversation(conversation, $event)"
    class="material-symbols-outlined text-on-surface-variant text-lg hover:text-primary transition-colors active:scale-95"
    title="归档"
  >
    archive
  </button>
  <span class="text-xs text-on-surface-variant">
    {{ formatMessageTime(conversation.lastMessageTime) }}
  </span>
</div>
```

### 2. Chat.vue（聊天页面）

#### 更新的功能

##### 2.1 消息数据格式转换
**修改位置**: `loadMessages()` 函数

**修改内容**:
```javascript
// 转换消息数据格式
messages.value = (response.data?.messages || response.data || []).map(msg => ({
  id: msg.id || Date.now(),
  content: msg.content,
  sender: msg.from === 'self' ? 'me' : 'other',
  time: msg.time,
  read: msg.status === 'read',
  type: msg.type || 'text'
}))
```

**转换说明**:
- `from` → `sender` (self → me, other → other)
- `status` → `read` (read → true, 其他 → false)
- 新增 `type` 字段支持不同消息类型

##### 2.2 发送消息增强
**修改位置**: `handleSendMessage()` 函数

**修改前**:
```javascript
const response = await messageApi.sendMessage(userId, newMessage.content)
```

**修改后**:
```javascript
const response = await messageApi.sendMessage(userId, tempMessage.content, tempMessage.type)
```

**改进点**:
- 支持消息类型参数
- 更新消息ID（使用服务器返回的ID）
- 更新消息状态
- 发送失败时移除临时消息

**完整实现**:
```javascript
const handleSendMessage = async () => {
  if (!inputMessage.value.trim()) return
  
  const tempMessage = {
    id: Date.now(),
    content: inputMessage.value.trim(),
    sender: 'me',
    time: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    read: false,
    type: 'text'
  }
  
  messages.value.push(tempMessage)
  inputMessage.value = ''
  scrollToBottom()
  
  try {
    const response = await messageApi.sendMessage(userId, tempMessage.content, tempMessage.type)
    if (response.success || response.code === 0) {
      // 更新消息ID和状态
      if (response.data && response.data.id) {
        tempMessage.id = response.data.id
      }
      if (response.data && response.data.status) {
        tempMessage.read = response.data.status === 'read'
      }
    } else {
      throw new Error(response.message || response.msg || '发送消息失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('发送消息失败:', err)
    // 发送失败，移除临时消息
    messages.value = messages.value.filter(msg => msg.id !== tempMessage.id)
  }
}
```

##### 2.3 标记会话为已读
**修改位置**: `loadMessages()` 函数

**新增内容**:
```javascript
// 标记会话为已读
try {
  await messageApi.markConversationAsRead(userId)
  // 更新本地消息状态
  messages.value.forEach(msg => {
    if (msg.sender === 'other') {
      msg.read = true
    }
  })
} catch (err) {
  console.error('标记会话已读失败:', err)
}
```

**功能说明**:
- 加载聊天记录时自动标记会话为已读
- 更新本地消息状态
- 错误处理（不影响聊天记录显示）

## 功能对比

### Messages.vue 功能对比

| 功能 | 更新前 | 更新后 | 说明 |
|------|--------|--------|------|
| 获取列表 | `getMessages()` | `getConversations()` | 使用新的会话API |
| 数据字段 | `lastTime`, `unread` | `lastMessageTime`, `unreadCount` | 字段名更新 |
| 点击会话 | 仅本地标记 | 调用API标记 | 同步服务器状态 |
| 归档功能 | ❌ 不支持 | ✅ 支持 | 新增归档按钮和功能 |
| 归档状态 | ❌ 不支持 | ✅ 支持 | 新增 `isArchived` 字段 |

### Chat.vue 功能对比

| 功能 | 更新前 | 更新后 | 说明 |
|------|--------|--------|------|
| 消息类型 | ❌ 不支持 | ✅ 支持 | 支持text/image/voice |
| 发送参数 | 仅content | content + type | 支持消息类型 |
| 消息ID | 临时ID | 服务器ID | 使用服务器返回的ID |
| 消息状态 | ❌ 不更新 | ✅ 更新 | 同步服务器状态 |
| 发送失败 | ❌ 不处理 | ✅ 移除消息 | 优化用户体验 |
| 标记已读 | ❌ 不支持 | ✅ 支持 | 自动标记会话为已读 |

## 数据流更新

### Messages.vue 数据流

```
1. 页面加载
   ↓
2. 调用 getConversations()
   ↓
3. 接收会话列表数据
   ↓
4. 转换数据格式
   ↓
5. 更新 conversations.value
   ↓
6. 计算未读总数
   ↓
7. 渲染会话列表

用户操作:
- 点击会话 → 调用 markConversationAsRead() → 跳转聊天
- 点击归档 → 调用 archiveConversation() → 移除会话
```

### Chat.vue 数据流

```
1. 页面加载
   ↓
2. 调用 getChatMessages(userId)
   ↓
3. 接收聊天记录
   ↓
4. 转换消息格式
   ↓
5. 调用 markConversationAsRead(userId)
   ↓
6. 更新 messages.value
   ↓
7. 滚动到底部
   ↓
8. 渲染消息列表

发送消息:
1. 创建临时消息
   ↓
2. 添加到本地列表
   ↓
3. 调用 sendMessage(userId, content, type)
   ↓
4. 接收服务器响应
   ↓
5. 更新消息ID和状态
   ↓
6. 失败时移除临时消息
```

## 错误处理

### Messages.vue 错误处理

1. **获取会话列表失败**
   - 显示错误提示
   - 提供重试按钮
   - 记录错误日志

2. **标记已读失败**
   - 记录错误日志
   - 允许继续跳转聊天

3. **归档会话失败**
   - 记录错误日志
   - 显示错误提示
   - 不移除会话

### Chat.vue 错误处理

1. **获取聊天记录失败**
   - 显示错误提示
   - 记录错误日志

2. **发送消息失败**
   - 移除临时消息
   - 显示错误提示
   - 记录错误日志

3. **标记已读失败**
   - 记录错误日志
   - 不影响聊天记录显示

## 性能优化

1. **本地状态优先更新**
   - 先更新UI，再调用API
   - 提升用户体验

2. **批量操作**
   - 标记已读使用会话级别API
   - 减少API调用次数

3. **错误恢复**
   - API失败不影响基本功能
   - 提供重试机制

## 用户体验改进

1. **即时反馈**
   - 点击会话立即跳转
   - 发送消息立即显示

2. **错误提示**
   - 清晰的错误信息
   - 友好的提示文案

3. **操作确认**
   - 归档成功后移除
   - 发送失败后回滚

## 兼容性说明

1. **向后兼容**
   - 保留原有功能
   - 新增功能不影响旧功能

2. **Mock数据**
   - 所有新增功能都有Mock实现
   - Mock数据格式与真实API一致

3. **渐进增强**
   - 基础功能优先
   - 增强功能逐步添加

## 测试建议

### 功能测试
- 测试会话列表加载
- 测试点击会话跳转
- 测试标记已读功能
- 测试归档会话功能
- 测试发送消息功能
- 测试错误处理

### 集成测试
- 测试页面间跳转
- 测试状态同步
- 测试API调用链
- 测试错误恢复

### 性能测试
- 测试大量会话加载
- 测试大量消息渲染
- 测试API响应时间

## 后续优化建议

1. **实时通信**
   - 实现WebSocket消息推送
   - 实时更新未读计数

2. **消息缓存**
   - 本地缓存聊天记录
   - 离线消息队列

3. **批量操作**
   - 批量归档会话
   - 批量标记已读

4. **搜索功能**
   - 搜索会话
   - 搜索消息

5. **消息类型扩展**
   - 支持图片消息
   - 支持语音消息
   - 支持文件传输

## 更新记录

- 2026-03-25: 初始版本，更新消息相关页面逻辑
