# 后端API文档更新记录

## 更新内容

### 1. API路径前缀变更
- 所有API路径现在都需要添加 `/playmate` 前缀
- 例如：`/playmates` 变为 `/playmate/playmates`

### 2. API认证要求
- 后端API文档显示所有陪玩相关接口都需要认证（ApiKeyAuth）
- 需要在请求头中添加 `Authorization: Bearer {token}`

### 3. 陪玩API接口

#### 获取陪玩列表
- **接口路径**: `GET /playmate/playmates`
- **认证要求**: 需要认证
- **查询参数**:
  - `game`: 游戏（字符串）
  - `online`: 是否在线（布尔值）
  - `priceRange`: 价格范围（字符串）
  - `rank`: 段位（字符串）
  - `gender`: 性别（字符串）
  - `keyword`: 关键词（字符串）
  - `sortBy`: 排序方式（字符串）
  - `page`: 页码（整数）
  - `pageSize`: 每页数量（整数）

#### 搜索陪玩
- **接口路径**: `GET /playmate/playmates/search`
- **认证要求**: 需要认证
- **查询参数**:
  - `keyword`: 搜索关键词（必需，字符串）
  - `page`: 页码（整数）
  - `pageSize`: 每页数量（整数）

#### 获取陪玩详情
- **接口路径**: `GET /playmate/playmates/{id}`
- **认证要求**: 需要认证
- **路径参数**:
  - `id`: 陪玩ID（必需，整数）

### 4. 数据模型

#### Playmate模型
```json
{
  "id": 1,
  "nickname": "林间小鹿",
  "avatar": "...",
  "rating": 5,
  "price": 45,
  "likes": 128,
  "tags": "王者,萌妹",
  "isOnline": true,
  "game": "honor_of_kings",
  "rank": "challenger",
  "gender": "female",
  "description": "",
  "level": 45,
  "title": "王者荣耀 · 荣耀之巅",
  "createdAt": "2026-03-24T23:57:46.258+08:00",
  "updatedAt": "2026-03-24T23:57:46.258+08:00",
  "userId": 1
}
```

## 前端修改

### 1. 更新API配置
- 修改文件：`src/api/config.js`
- 更新 `API_BASE_URL` 为 `/api/playmate`
- 添加了认证支持，从localStorage获取token并添加到请求头

### 2. 认证实现
```javascript
const token = localStorage.getItem('token')
if (token) {
  config.headers.Authorization = `Bearer ${token}`
}
```

## 技术细节

### API响应格式
```json
{
  "code": 0,
  "data": {
    "data": [...],
    "pagination": {
      "currentPage": 0,
      "totalCount": 12,
      "totalPages": 2
    }
  },
  "msg": "获取成功"
}
```

### 数据转换
- `tags` 字段在后端是用逗号分隔的字符串
- 前端在store中将其转换为数组格式，便于组件使用

## 影响范围

- `playmate` store：已经适配真实API响应格式
- `PlaymateList` 组件：使用真实API数据
- `PlaymateCard` 组件：通过数据转换适配新格式
- API配置：支持认证和新的路径前缀

## 测试建议

1. 验证未登录状态下的API调用（应该返回401错误）
2. 验证登录后的API调用（应该正常返回数据）
3. 验证认证token过期时的处理
4. 验证所有陪玩相关接口的认证要求
5. 验证API路径前缀是否正确

## 注意事项

1. 所有陪玩相关接口都需要认证
2. Token应该存储在localStorage中
3. Token格式为 `Bearer {token}`
4. 需要处理认证失败的情况（401错误）
5. 可能需要实现token刷新机制
6. 所有API路径都需要添加 `/playmate` 前缀