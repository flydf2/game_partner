# 全局API参数文档

## 文档说明

本文档详细说明了GamePartner项目中所有API接口的参数配置、请求格式和响应格式。所有接口都遵循统一的规范，确保前后端数据交互的一致性。

## 基础配置

### API基础路径
- **基础URL**: `/api/playmate`
- **认证方式**: Bearer Token
- **请求头**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}` (需要认证的接口)

### 统一响应格式

所有API接口都遵循以下统一响应格式：

```json
{
  "code": 0,
  "data": {
    // 具体数据内容
  },
  "msg": "操作成功"
}
```

**响应字段说明：**
- `code`: 状态码，0表示成功，非0表示失败
- `data`: 具体数据内容，根据不同接口返回不同结构
- `msg`: 操作结果描述信息

### 统一分页格式

```json
{
  "code": 0,
  "data": {
    "data": [],
    "pagination": {
      "currentPage": 1,
      "totalCount": 100,
      "totalPages": 10
    }
  },
  "msg": "获取成功"
}
```

**分页字段说明：**
- `currentPage`: 当前页码（从0开始）
- `totalCount`: 总记录数
- `totalPages`: 总页数

## 陪玩相关API

### 1. 获取陪玩列表

**接口路径**: `GET /playmate/playmates`

**认证要求**: 需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | Integer | 否 | 1 | 页码 |
| pageSize | Integer | 否 | 20 | 每页数量 |
| game | String | 否 | - | 游戏类型（如：honor_of_kings, lol, valorant） |
| online | Boolean | 否 | - | 是否在线 |
| priceRange | String | 否 | - | 价格范围（如：0-50, 50-100, 100+） |
| rank | String | 否 | - | 段位（如：bronze, silver, gold, platinum, diamond, challenger） |
| gender | String | 否 | - | 性别（male/female） |
| keyword | String | 否 | - | 搜索关键词 |
| sortBy | String | 否 | default | 排序方式（default/rating/price_asc/price_desc/newest） |

**排序方式说明：**
- `default`: 综合排序
- `rating`: 评分最高
- `price_asc`: 价格从低到高
- `price_desc`: 价格从高到低
- `newest`: 最新上线

**请求示例**:
```
GET /api/playmate/playmates?page=1&pageSize=20&game=honor_of_kings&online=true&sortBy=rating
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "data": [
      {
        "id": 1,
        "nickname": "林间小鹿",
        "avatar": "https://example.com/avatar.jpg",
        "rating": 5,
        "price": 45,
        "likes": 128,
        "tags": "王者,萌妹",
        "isOnline": true,
        "game": "honor_of_kings",
        "rank": "challenger",
        "gender": "female",
        "description": "专业陪玩，技术过硬",
        "level": 45,
        "title": "王者荣耀 · 荣耀之巅",
        "createdAt": "2026-03-24T23:57:46.258+08:00",
        "updatedAt": "2026-03-24T23:57:46.258+08:00",
        "userId": 1
      }
    ],
    "pagination": {
      "currentPage": 0,
      "totalCount": 12,
      "totalPages": 2
    }
  },
  "msg": "获取成功"
}
```

### 2. 搜索陪玩

**接口路径**: `GET /playmate/playmates/search`

**认证要求**: 需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| keyword | String | 是 | - | 搜索关键词 |
| page | Integer | 否 | 1 | 页码 |
| pageSize | Integer | 否 | 20 | 每页数量 |
| online | Boolean | 否 | - | 是否在线 |
| priceRange | String | 否 | - | 价格范围 |
| rank | String | 否 | - | 段位 |
| gender | String | 否 | - | 性别 |
| game | String | 否 | - | 游戏类型 |

**请求示例**:
```
GET /api/playmate/playmates/search?keyword=王者&page=1&pageSize=20
```

**响应格式**: 同获取陪玩列表

### 3. 获取陪玩详情

**接口路径**: `GET /playmate/playmates/{id}`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Integer | 是 | 陪玩ID |

**请求示例**:
```
GET /api/playmate/playmates/1
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "nickname": "林间小鹿",
    "avatar": "https://example.com/avatar.jpg",
    "rating": 5,
    "price": 45,
    "likes": 128,
    "tags": "王者,萌妹",
    "isOnline": true,
    "game": "honor_of_kings",
    "rank": "challenger",
    "gender": "female",
    "description": "专业陪玩，技术过硬，服务态度好",
    "level": 45,
    "title": "王者荣耀 · 荣耀之巅",
    "createdAt": "2026-03-24T23:57:46.258+08:00",
    "updatedAt": "2026-03-24T23:57:46.258+08:00",
    "userId": 1,
    "totalOrders": 128,
    "totalHours": 256,
    "reviews": [
      {
        "id": 1,
        "userId": 2,
        "userName": "小明",
        "userAvatar": "https://example.com/user.jpg",
        "rating": 5,
        "content": "非常专业，带我上了很多分",
        "createdAt": "2026-03-20T10:30:00.000+08:00"
      }
    ]
  },
  "msg": "获取成功"
}
```

### 4. 获取搜索建议

**接口路径**: `GET /playmate/playmates/suggestions`

**认证要求**: 需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| keyword | String | 是 | - | 搜索关键词 |

**请求示例**:
```
GET /api/playmate/playmates/suggestions?keyword=王者
```

**响应示例**:
```json
{
  "code": 0,
  "data": [
    "王者荣耀陪玩",
    "王者段位陪玩",
    "王者技术陪玩"
  ],
  "msg": "获取成功"
}
```

## 用户认证API

### 1. 用户登录

**接口路径**: `POST /auth/login`

**认证要求**: 不需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | String | 是 | 用户名 |
| password | String | 是 | 密码 |

**请求示例**:
```json
{
  "username": "user123",
  "password": "password123"
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "user123",
      "nickname": "测试用户",
      "avatar": "https://example.com/avatar.jpg"
    }
  },
  "msg": "登录成功"
}
```

### 2. 用户注册

**接口路径**: `POST /auth/register`

**认证要求**: 不需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | String | 是 | 用户名 |
| password | String | 是 | 密码 |
| nickname | String | 否 | 昵称 |
| phone | String | 否 | 手机号 |
| email | String | 否 | 邮箱 |

**请求示例**:
```json
{
  "username": "user123",
  "password": "password123",
  "nickname": "新用户",
  "phone": "13800138000"
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "user123",
      "nickname": "新用户"
    }
  },
  "msg": "注册成功"
}
```

### 3. 用户登出

**接口路径**: `POST /auth/logout`

**认证要求**: 需要认证

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": null,
  "msg": "登出成功"
}
```

### 4. 发送短信验证码

**接口路径**: `POST /auth/send-code`

**认证要求**: 不需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | String | 是 | 手机号 |

**请求示例**:
```json
{
  "phone": "13800138000"
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": null,
  "msg": "验证码发送成功"
}
```

### 5. 刷新Token

**接口路径**: `POST /auth/refresh`

**认证要求**: 需要认证

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "msg": "Token刷新成功"
}
```

## 用户信息API

### 1. 获取用户信息

**接口路径**: `GET /user/info`

**认证要求**: 需要认证

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "username": "user123",
    "nickname": "测试用户",
    "avatar": "https://example.com/avatar.jpg",
    "phone": "13800138000",
    "email": "user@example.com",
    "vipLevel": 3,
    "balance": 1000.50,
    "couponCount": 5,
    "createdAt": "2026-01-01T00:00:00.000+08:00"
  },
  "msg": "获取成功"
}
```

### 2. 更新用户资料

**接口路径**: `PUT /user/profile`

**认证要求**: 需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| nickname | String | 否 | 昵称 |
| avatar | String | 否 | 头像URL |
| phone | String | 否 | 手机号 |
| email | String | 否 | 邮箱 |
| bio | String | 否 | 个人简介 |

**请求示例**:
```json
{
  "nickname": "新昵称",
  "avatar": "https://example.com/new-avatar.jpg",
  "bio": "这是我的个人简介"
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "nickname": "新昵称",
    "avatar": "https://example.com/new-avatar.jpg",
    "bio": "这是我的个人简介"
  },
  "msg": "更新成功"
}
```

### 3. 获取用户设置

**接口路径**: `GET /user/settings`

**认证要求**: 需要认证

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "notifications": {
      "order": true,
      "message": true,
      "promotion": false
    },
    "privacy": {
      "showOnline": true,
      "showOrders": false
    },
    "language": "zh-CN",
    "theme": "auto"
  },
  "msg": "获取成功"
}
```

### 4. 更新用户设置

**接口路径**: `PUT /user/settings`

**认证要求**: 需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| notifications | Object | 否 | 通知设置 |
| privacy | Object | 否 | 隐私设置 |
| language | String | 否 | 语言设置 |
| theme | String | 否 | 主题设置 |

**请求示例**:
```json
{
  "notifications": {
    "order": true,
    "message": true,
    "promotion": false
  },
  "theme": "dark"
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "notifications": {
      "order": true,
      "message": true,
      "promotion": false
    },
    "theme": "dark"
  },
  "msg": "更新成功"
}
```

### 5. 获取关注列表

**接口路径**: `GET /user/following`

**认证要求**: 需要认证

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "nickname": "林间小鹿",
      "avatar": "https://example.com/avatar.jpg",
      "game": "honor_of_kings",
      "rank": "challenger",
      "isOnline": true
    }
  ],
  "msg": "获取成功"
}
```

### 6. 获取收藏列表

**接口路径**: `GET /user/favorites`

**认证要求**: 需要认证

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "nickname": "林间小鹿",
      "avatar": "https://example.com/avatar.jpg",
      "game": "honor_of_kings",
      "price": 45,
      "rating": 5
    }
  ],
  "msg": "获取成功"
}
```

### 7. 获取浏览历史

**接口路径**: `GET /user/history`

**认证要求**: 需要认证

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "nickname": "林间小鹿",
      "avatar": "https://example.com/avatar.jpg",
      "viewedAt": "2026-03-25T10:30:00.000+08:00"
    }
  ],
  "msg": "获取成功"
}
```

### 8. 获取钱包信息

**接口路径**: `GET /user/wallet`

**认证要求**: 需要认证

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "balance": 1000.50,
    "frozen": 50.00,
    "totalIncome": 5000.00,
    "totalExpense": 4000.00,
    "transactions": [
      {
        "id": 1,
        "type": "income",
        "amount": 100.00,
        "description": "订单收入",
        "createdAt": "2026-03-25T10:30:00.000+08:00"
      }
    ]
  },
  "msg": "获取成功"
}
```

## 订单相关API

### 1. 获取订单列表

**接口路径**: `GET /orders`

**认证要求**: 需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| status | String | 否 | all | 订单状态（all/pending/ongoing/completed/cancelled） |
| page | Integer | 否 | 1 | 页码 |
| pageSize | Integer | 否 | 20 | 每页数量 |

**请求示例**:
```
GET /orders?status=pending&page=1&pageSize=20
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "data": [
      {
        "id": 1,
        "orderNumber": "GP2026032510301001",
        "expertId": 1,
        "expertName": "林间小鹿",
        "expertAvatar": "https://example.com/avatar.jpg",
        "game": "honor_of_kings",
        "skill": "最强王者",
        "status": "pending",
        "statusText": "待进行",
        "serviceTime": "2026-03-25 19:00",
        "duration": 2,
        "amount": 90.00,
        "paymentMethod": "支付宝",
        "createdAt": "2026-03-23 10:30"
      }
    ],
    "pagination": {
      "currentPage": 0,
      "totalCount": 5,
      "totalPages": 1
    }
  },
  "msg": "获取成功"
}
```

### 2. 获取订单详情

**接口路径**: `GET /orders/{id}`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Integer | 是 | 订单ID |

**请求示例**:
```
GET /orders/1
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "orderNumber": "GP2026032510301001",
    "expertId": 1,
    "expertName": "林间小鹿",
    "expertAvatar": "https://example.com/avatar.jpg",
    "game": "honor_of_kings",
    "skill": "最强王者",
    "status": "pending",
    "statusText": "待进行",
    "serviceTime": "2026-03-25 19:00",
    "duration": 2,
    "amount": 90.00,
    "platformFee": 5.00,
    "couponDiscount": 0.00,
    "totalAmount": 95.00,
    "paymentMethod": "支付宝",
    "paymentStatus": "paid",
    "createdAt": "2026-03-23 10:30",
    "updatedAt": "2026-03-23 10:30"
  },
  "msg": "获取成功"
}
```

### 3. 创建订单

**接口路径**: `POST /orders`

**认证要求**: 需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| expertId | Integer | 是 | 陪玩ID |
| serviceTime | String | 是 | 服务时间（格式：YYYY-MM-DD HH:mm） |
| duration | Integer | 是 | 服务时长（小时） |
| couponId | Integer | 否 | 优惠券ID |
| remarks | String | 否 | 备注 |

**请求示例**:
```json
{
  "expertId": 1,
  "serviceTime": "2026-03-25 19:00",
  "duration": 2,
  "couponId": 1,
  "remarks": "请准时开始"
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "orderId": "1004",
    "orderNumber": "GP2026032315301001",
    "status": "pending",
    "totalAmount": 95.00,
    "message": "订单创建成功"
  },
  "msg": "订单创建成功"
}
```

## 通知相关API

### 1. 获取通知列表

**接口路径**: `GET /notifications`

**认证要求**: 需要认证

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "type": "order",
      "title": "订单状态更新",
      "content": "您的订单已确认",
      "isRead": false,
      "createdAt": "2026-03-25T10:30:00.000+08:00"
    }
  ],
  "msg": "获取成功"
}
```

### 2. 标记通知为已读

**接口路径**: `PUT /notifications/{id}/read`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Integer | 是 | 通知ID |

**响应示例**:
```json
{
  "code": 0,
  "data": null,
  "msg": "标记成功"
}
```

### 3. 标记所有通知为已读

**接口路径**: `PUT /notifications/read-all`

**认证要求**: 需要认证

**响应示例**:
```json
{
  "code": 0,
  "data": null,
  "msg": "标记成功"
}
```

## 消息相关API

### 1. 获取会话列表

**接口路径**: `GET /playmate/conversations`

**认证要求**: 需要认证

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "userId": 2,
      "userName": "林间小鹿",
      "userAvatar": "https://example.com/avatar.jpg",
      "lastMessage": "好的，明天见",
      "lastMessageTime": "2026-03-25T10:30:00.000+08:00",
      "unreadCount": 2,
      "isArchived": false
    }
  ],
  "msg": "获取成功"
}
```

### 2. 归档会话

**接口路径**: `PUT /playmate/conversations/{id}/archive`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Integer | 是 | 会话ID |

**响应示例**:
```json
{
  "code": 0,
  "data": null,
  "msg": "归档成功"
}
```

### 3. 标记会话为已读

**接口路径**: `PUT /playmate/conversations/{userId}/read`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| userId | Integer | 是 | 用户ID |

**响应示例**:
```json
{
  "code": 0,
  "data": null,
  "msg": "标记成功"
}
```

### 4. 获取消息列表

**接口路径**: `GET /playmate/messages`

**认证要求**: 需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| type | String | 否 | - | 消息类型 |
| status | String | 否 | - | 消息状态 |
| senderId | Integer | 否 | - | 发送者ID |
| receiverId | Integer | 否 | - | 接收者ID |
| startTime | String | 否 | - | 开始时间 |
| endTime | String | 否 | - | 结束时间 |
| keyword | String | 否 | - | 关键词 |
| page | Integer | 否 | 1 | 页码 |
| pageSize | Integer | 否 | 20 | 每页数量 |

**请求示例**:
```
GET /playmate/messages?type=text&status=unread&page=1&pageSize=20
```

**响应示例**:
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "senderId": 2,
      "receiverId": 1,
      "content": "你好",
      "type": "text",
      "status": "read",
      "createdAt": "2026-03-25T10:30:00.000+08:00"
    }
  ],
  "pagination": {
    "currentPage": 0,
    "totalCount": 50,
    "totalPages": 3
  },
  "msg": "获取成功"
}
```

### 5. 获取聊天消息

**接口路径**: `GET /playmate/messages/chat/{userId}`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| userId | Integer | 是 | 用户ID |

**响应示例**:
```json
{
  "code": 0,
  "data": [
    {
      "content": "你好",
      "from": "other",
      "status": "read",
      "time": "2026-03-25T10:30:00.000+08:00",
      "type": "text"
    },
    {
      "content": "你好，请问有什么可以帮你的？",
      "from": "self",
      "status": "read",
      "time": "2026-03-25T10:31:00.000+08:00",
      "type": "text"
    }
  ],
  "msg": "获取成功"
}
```

### 6. 发送消息

**接口路径**: `POST /playmate/messages/chat/{userId}`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| userId | Integer | 是 | 接收者用户ID |

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| content | String | 是 | 消息内容 |
| type | String | 否 | 消息类型（text/image/voice） |

**请求示例**:
```json
{
  "content": "你好，请问有什么可以帮你的？",
  "type": "text"
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "id": 2,
    "senderId": 1,
    "receiverId": 2,
    "content": "你好，请问有什么可以帮你的？",
    "type": "text",
    "status": "sent",
    "from": "self",
    "time": "2026-03-25T10:31:00.000+08:00"
  },
  "msg": "发送成功"
}
```

### 7. 标记消息为已读

**接口路径**: `PUT /playmate/messages/{id}/read`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Integer | 是 | 消息ID |

**响应示例**:
```json
{
  "code": 0,
  "data": null,
  "msg": "标记成功"
}
```

## 游戏相关API

### 1. 获取游戏列表

**接口路径**: `GET /games`

**认证要求**: 不需要认证

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": [
    {
      "id": "honor_of_kings",
      "name": "王者荣耀",
      "icon": "https://example.com/icon.jpg",
      "description": "热门MOBA手游"
    },
    {
      "id": "lol",
      "name": "英雄联盟",
      "icon": "https://example.com/icon.jpg",
      "description": "经典MOBA游戏"
    }
  ],
  "msg": "获取成功"
}
```

## 活动相关API

### 1. 获取活动列表

**接口路径**: `GET /activities`

**认证要求**: 不需要认证

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "title": "王者荣耀巅峰挑战赛",
      "description": "参与比赛，赢取丰厚奖励",
      "banner": "https://example.com/banner.jpg",
      "startTime": "2026-03-25T10:00:00.000+08:00",
      "endTime": "2026-03-30T22:00:00.000+08:00",
      "participantCount": 12000
    }
  ],
  "msg": "获取成功"
}
```

## 评价相关API

### 1. 提交评价

**接口路径**: `POST /reviews`

**认证要求**: 需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| orderId | Integer | 是 | 订单ID |
| rating | Integer | 是 | 评分（1-5） |
| content | String | 是 | 评价内容 |
| images | Array | 否 | 评价图片URL数组 |

**请求示例**:
```json
{
  "orderId": 1,
  "rating": 5,
  "content": "非常专业，服务态度很好",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "orderId": 1,
    "rating": 5,
    "content": "非常专业，服务态度很好",
    "createdAt": "2026-03-25T10:30:00.000+08:00"
  },
  "msg": "评价提交成功"
}
```

## 提现相关API

### 1. 提交提现申请

**接口路径**: `POST /withdrawals`

**认证要求**: 需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| amount | Number | 是 | 提现金额 |
| bankName | String | 是 | 银行名称 |
| bankAccount | String | 是 | 银行账号 |
| accountName | String | 是 | 账户姓名 |

**请求示例**:
```json
{
  "amount": 100.00,
  "bankName": "中国工商银行",
  "bankAccount": "6222021234567890",
  "accountName": "张三"
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "amount": 100.00,
    "status": "pending",
    "createdAt": "2026-03-25T10:30:00.000+08:00"
  },
  "msg": "提现申请提交成功"
}
```

### 2. 获取提现记录

**接口路径**: `GET /withdrawals`

**认证要求**: 需要认证

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "amount": 100.00,
      "bankName": "中国工商银行",
      "bankAccount": "6222021234567890",
      "status": "pending",
      "statusText": "审核中",
      "createdAt": "2026-03-25T10:30:00.000+08:00"
    }
  ],
  "msg": "获取成功"
}
```

## 专家相关API

### 1. 获取专家详情

**接口路径**: `GET /experts/{expertId}`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| expertId | Integer | 是 | 专家ID |

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "nickname": "林间小鹿",
    "avatar": "https://example.com/avatar.jpg",
    "rating": 5,
    "price": 45,
    "likes": 128,
    "tags": ["王者", "萌妹"],
    "isOnline": true,
    "game": "honor_of_kings",
    "rank": "challenger",
    "gender": "female",
    "description": "专业陪玩，技术过硬",
    "level": 45,
    "title": "王者荣耀 · 荣耀之巅",
    "totalOrders": 128,
    "totalHours": 256,
    "reviews": []
  },
  "msg": "获取成功"
}
```

### 2. 关注专家

**接口路径**: `POST /experts/{expertId}/follow`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| expertId | Integer | 是 | 专家ID |

**响应示例**:
```json
{
  "code": 0,
  "data": null,
  "msg": "关注成功"
}
```

### 3. 取消关注专家

**接口路径**: `DELETE /experts/{expertId}/follow`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| expertId | Integer | 是 | 专家ID |

**响应示例**:
```json
{
  "code": 0,
  "data": null,
  "msg": "取消关注成功"
}
```

### 4. 获取专家评价

**接口路径**: `GET /experts/{expertId}/reviews`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| expertId | Integer | 是 | - | 专家ID |

**请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | Integer | 否 | 1 | 页码 |
| pageSize | Integer | 否 | 10 | 每页数量 |

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "reviews": [
      {
        "id": 1,
        "user": {
          "name": "小明",
          "avatar": "https://example.com/user.jpg"
        },
        "rating": 5,
        "content": "非常专业，带我上了很多分，会继续找他。",
        "date": "2026-03-20",
        "images": []
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 50
    }
  },
  "msg": "获取成功"
}
```

### 5. 获取专家语音

**接口路径**: `GET /experts/{expertId}/voice`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| expertId | Integer | 是 | 专家ID |

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "voiceUrl": "https://example.com/voice.mp3",
    "duration": 120,
    "waveform": [0.1, 0.3, 0.5, 0.7, 0.9, 0.7, 0.5, 0.3, 0.1]
  },
  "msg": "获取成功"
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 未登录 |
| 1003 | Token无效或已过期 |
| 1004 | 权限不足 |
| 2001 | 用户不存在 |
| 2002 | 用户名或密码错误 |
| 2003 | 用户已存在 |
| 3001 | 陪玩不存在 |
| 3002 | 陪玩不在线 |
| 4001 | 订单不存在 |
| 4002 | 订单状态错误 |
| 4003 | 余额不足 |
| 5001 | 服务器错误 |
| 5002 | 数据库错误 |

## 注意事项

1. **认证要求**: 所有需要认证的接口都必须在请求头中携带有效的Bearer Token
2. **分页参数**: 所有分页接口都支持page和pageSize参数，page从0开始
3. **时间格式**: 所有时间字段都使用ISO 8601格式（如：2026-03-25T10:30:00.000+08:00）
4. **金额格式**: 所有金额字段都使用Number类型，单位为元
5. **错误处理**: 前端需要根据错误码进行相应的错误处理和用户提示
6. **数据缓存**: 建议对不常变化的数据（如游戏列表、活动列表）进行本地缓存
7. **请求超时**: 所有请求默认超时时间为10秒
8. **重试机制**: 对于网络错误和5xx错误，建议实现自动重试机制

## 更新记录

- 2026-03-25: 初始版本，包含所有主要API接口的参数说明
