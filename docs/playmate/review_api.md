# 陪玩评价 API 文档

## 1. 提交评价

### 1.1 接口说明
- **路径**: `/playmate/reviews`
- **方法**: `POST`
- **功能**: 提交对陪玩师的评价
- **权限**: 需要认证 (ApiKeyAuth)

### 1.2 请求参数

**Request Body (`request.SubmitReviewRequest`)**

| 字段 | 类型 | 必填 | 说明 | 校验规则 |
|------|------|------|------|----------|
| playmateId | integer | 是 | 陪玩师ID | required |
| orderId | integer | 否 | 订单ID | omitempty |
| rating | integer | 是 | 评分 | required, min=1, max=5 |
| content | string | 是 | 评价内容 | required |
| images | array[string] | 否 | 图片URL列表 | - |
| tags | array[string] | 否 | 评价标签 | - |

**请求示例**
```json
{
  "playmateId": 41,
  "orderId": 123,
  "rating": 5,
  "content": "服务非常专业，沟通顺畅！",
  "images": ["https://example.com/image1.jpg"],
  "tags": ["专业", "耐心"]
}
```

### 1.3 响应结果

**成功响应 (200)**
```json
{
  "code": 200,
  "msg": "提交评价成功",
  "data": null
}
```

---

## 2. 获取评价列表

### 2.1 接口说明
- **路径**: `/playmate/reviews`
- **方法**: `GET`
- **功能**: 获取陪玩师的评价列表（支持多种筛选条件）
- **权限**: 需要认证 (ApiKeyAuth)

### 2.2 请求参数

**Query 参数**

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| playmateId | integer | 否 | 陪玩师ID | 41 |
| minRating | integer | 否 | 最低评分 | 4 |
| maxRating | integer | 否 | 最高评分 | 5 |
| game | string | 否 | 游戏名称 | "英雄联盟" |
| keyword | string | 否 | 关键词搜索 | "专业" |
| startTime | string | 否 | 开始时间 (ISO 8601) | "2024-01-01T00:00:00Z" |
| endTime | string | 否 | 结束时间 (ISO 8601) | "2024-12-31T23:59:59Z" |
| page | integer | 否 | 页码 | 1 |
| pageSize | integer | 否 | 每页数量 | 10 |

**请求示例**
```
GET /playmate/reviews?playmateId=41&page=1&pageSize=10&minRating=4
```

### 2.3 响应结果

**成功响应 (200)**
```json
{
  "code": 200,
  "msg": "获取评价列表成功",
  "data": [
    {
      "id": 1,
      "playmateId": 41,
      "orderId": 123,
      "userId": 100,
      "rating": 5,
      "content": "服务非常专业，沟通顺畅！",
      "images": "https://example.com/image1.jpg",
      "tags": "专业,耐心",
      "user": {
        "id": 100,
        "avatar": "https://example.com/avatar.jpg",
        "nickname": "玩家A"
      },
      "createdAt": "2024-03-27T10:30:00Z",
      "updatedAt": "2024-03-27T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pageSize": 10
  }
}
```

---

## 3. 获取专家评价列表

### 3.1 接口说明
- **路径**: `/playmate/experts/{id}/reviews`
- **方法**: `GET`
- **功能**: 专门获取专家（陪玩师）的评价列表
- **权限**: 需要认证 (ApiKeyAuth)

### 3.2 请求参数

**Path 参数**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 专家ID |

**Query 参数**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码 |
| pageSize | integer | 否 | 每页数量 |

**请求示例**
```
GET /playmate/experts/41/reviews?page=1&pageSize=10
```

### 3.3 响应结果

**成功响应 (200)**
```json
{
  "code": 200,
  "msg": "获取专家评价列表成功",
  "data": [...]
}
```

---

## 4. 数据模型

### 4.1 评价模型 (`model.Review`)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 评价ID |
| playmateId | integer | 陪玩师ID |
| orderId | integer | 订单ID |
| userId | integer | 用户ID |
| rating | integer | 评分 (1-5) |
| content | string | 评价内容 |
| images | string | 图片URL列表（逗号分隔） |
| tags | string | 标签列表（逗号分隔） |
| user | object | 用户信息 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

### 4.2 用户信息模型 (`model.User` - 简化)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 用户ID |
| avatar | string | 头像URL |
| nickname | string | 昵称 |
| balance | number | 余额 |

---

## 5. 注意事项

1. **评分范围**: rating 必须在 1-5 之间
2. **必填字段**: playmateId、rating、content 为必填项
3. **图片格式**: images 为图片 URL 列表
4. **标签格式**: tags 为字符串数组
5. **订单关联**: orderId 为可选，用于关联已完成的订单
6. **数据存储**: images 和 tags 在数据库中以逗号分隔的字符串形式存储
