# 真实后端接口替换记录

## 变更内容

### 1. API 基础 URL 配置
- **文件**: `src/api/config.js`
- **变更**: 将 API 基础 URL 从 `/api` 修改为 `http://localhost:3000/api`
- **说明**: 指向本地运行的后端服务

### 2. 请求模块配置
- **文件**: `src/api/request.js`
- **变更**: 将 BASE_URL 从 `https://api.example.com` 修改为 `http://localhost:3000/api`
- **说明**: 统一所有请求的基础 URL

### 3. Mock 模式关闭
- **文件**: `src/api/index.js`
- **变更**: 将 `USE_MOCK` 从 `true` 修改为 `false`
- **说明**: 禁用 Mock 数据，使用真实后端接口

## 后端接口说明

### 基础 URL
- `http://localhost:3000/api`

### 主要接口端点

#### 1. 专家相关
- `GET /playmates` - 获取陪玩列表
- `GET /playmates/:id` - 获取专家详情
- `GET /playmates/search` - 搜索专家
- `GET /playmates/suggestions` - 获取搜索建议

#### 2. 用户相关
- `POST /auth/login` - 登录
- `POST /auth/register` - 注册
- `GET /user/profile` - 获取用户信息
- `PUT /user/profile` - 更新用户信息

#### 3. 订单相关
- `GET /orders` - 获取订单列表
- `POST /orders` - 创建订单
- `GET /orders/:id` - 获取订单详情

#### 4. 其他
- `GET /games` - 获取游戏列表
- `GET /activities` - 获取活动列表
- `GET /notifications` - 获取通知列表
- `GET /messages` - 获取消息列表

## 认证方式
- 使用 JWT Token 认证
- Token 存储在 localStorage 中
- 请求头中添加 `Authorization: Bearer {token}`

## 注意事项
- 确保后端服务在 `http://localhost:3000` 正常运行
- 检查 CORS 配置，确保前端可以正常访问后端接口
- 测试所有 API 调用，确保接口响应正常
