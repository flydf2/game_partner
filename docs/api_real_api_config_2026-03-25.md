# API 调试与真实接口调用配置记录

## 修改日期
2026-03-25

## 修改目的
配置和调试页面接口调用，确保使用真实 API 而非模拟数据。

## 修改内容

### 1. 配置 API 基础设置
**文件**: [.env](file:///System/Volumes/Data/webcode/UX/GamePartner/.env)

**配置**:
```env
# API配置
VITE_API_BASE_URL=/api
VITE_USE_MOCK=false
```

### 2. 重构 API 服务层
**文件**: [src/services/api.js](file:///System/Volumes/Data/webcode/UX/GamePartner/src/services/api.js)

**修改**:

#### 2.1 移除模拟数据，使用真实 API
- 删除了所有模拟数据和延迟逻辑
- 引入 `API_BASE_URL` 配置
- 实现真实的 `fetch` 请求

#### 2.2 增强 API 请求函数
- 支持认证 token 自动添加
- 支持查询参数处理
- 支持请求体处理
- 完善错误处理和日志记录

#### 2.3 优化 API 方法
- 更新 API 路径为相对路径
- 保持与后端 API 接口一致

### 3. 增强 Home 页面的错误处理
**文件**: [src/views/Home.vue](file:///System/Volumes/Data/webcode/UX/GamePartner/src/views/Home.vue)

**修改**:

#### 3.1 优化 `loadGames` 方法
- 添加 try-catch 错误处理
- 确保 `response.data` 是数组
- 提供友好的错误提示

#### 3.2 优化 `loadPlaymates` 方法
- 添加 try-catch 错误处理
- 确保 `response.data` 是数组
- 提供友好的错误提示

### 4. 优化 TopAppBar 组件
**文件**: [src/components/TopAppBar.vue](file:///System/Volumes/Data/webcode/UX/GamePartner/src/components/TopAppBar.vue)

**修改**:
- 只有当用户已登录时才获取用户信息
- 处理 token 过期的情况
- 减少不必要的 API 调用

### 5. 创建 API 调试页面
**文件**: [src/views/ApiTest.vue](file:///System/Volumes/Data/webcode/UX/GamePartner/src/views/ApiTest.vue)

**功能**:
- 提供 API 调用测试界面
- 显示 API 响应结果
- 显示配置信息
- 支持测试不同的 API 端点

### 6. 添加 API 调试路由
**文件**: [src/router/index.js](file:///System/Volumes/Data/webcode/UX/GamePartner/src/router/index.js)

**配置**:
```javascript
{
  path: '/api-test',
  name: 'ApiTest',
  component: () => import('../views/ApiTest.vue'),
  meta: {
    title: 'API 调试'
  }
}
```

## 技术实现

### 1. API 请求流程
1. **请求构建**: 构建完整的 API URL 和请求配置
2. **认证处理**: 自动添加 token 到请求头
3. **参数处理**: 处理查询参数和请求体
4. **发送请求**: 使用 `fetch` 发送真实请求
5. **响应处理**: 解析响应数据并处理错误
6. **结果返回**: 返回标准化的响应格式

### 2. 错误处理策略
- **网络错误**: 捕获并转换为友好的错误信息
- **API 错误**: 处理 HTTP 错误状态码
- **数据格式错误**: 确保返回的数据格式符合预期
- **用户认证错误**: 处理 token 过期和未授权情况

### 3. 调试工具
- **API 调试页面**: 提供可视化的 API 测试界面
- **控制台日志**: 详细的请求和响应日志
- **错误提示**: 友好的用户错误提示

## 测试方法

### 1. 访问 API 调试页面
- 地址: http://localhost:5173/api-test
- 功能: 测试各种 API 端点的调用

### 2. 测试 API 调用
1. **测试 GET /games**: 点击对应按钮，查看游戏分类数据
2. **测试 GET /playmates**: 点击对应按钮，查看陪玩列表数据
3. **测试 GET /playmates (特色陪玩)**: 点击对应按钮，查看特色陪玩数据

### 3. 验证首页数据加载
- 访问 http://localhost:5173/
- 检查游戏分类是否正常加载
- 检查陪玩列表是否正常加载
- 检查错误处理是否正常

### 4. 验证登录状态处理
- 未登录状态: 不应尝试获取用户信息
- 登录状态: 应自动获取用户信息
- Token 过期: 应自动执行登出

## 预期行为

### 1. 未登录状态
- 首页应正常加载游戏和陪玩数据
- TopAppBar 不应调用用户信息 API
- 个人中心等需要认证的页面应重定向到登录页

### 2. 登录状态
- 首页应正常加载游戏和陪玩数据
- TopAppBar 应获取并显示用户信息
- 所有需要认证的页面应正常访问

### 3. API 错误处理
- 网络错误: 显示友好的错误提示
- 数据错误: 显示默认数据或错误提示
- 认证错误: 自动跳转到登录页

## 配置说明

### 1. API 基础 URL
- **配置文件**: `.env`
- **变量**: `VITE_API_BASE_URL`
- **默认值**: `/api`
- **说明**: 可以根据后端服务地址进行修改

### 2. Mock 模式
- **配置文件**: `.env`
- **变量**: `VITE_USE_MOCK`
- **值**: `false` (使用真实 API)
- **说明**: 设置为 `true` 时使用模拟数据

## 注意事项

1. **后端服务**: 确保后端服务正在运行，并且 API 端点可用
2. **CORS 配置**: 确保后端服务允许跨域请求
3. **API 格式**: 确保后端 API 返回的数据格式符合前端预期
4. **认证机制**: 确保登录后获取的 token 格式正确
5. **错误处理**: 确保后端 API 错误信息格式一致

## 后续优化建议

1. **API 缓存**: 为频繁调用的 API 添加缓存机制
2. **请求重试**: 为网络错误添加智能重试机制
3. **请求节流**: 为频繁触发的 API 请求添加节流
4. **监控告警**: 添加 API 调用监控和告警机制
5. **文档生成**: 自动生成 API 文档和类型定义

## 测试结果

### 已验证功能
- ✅ API 调试页面正常访问
- ✅ 真实 API 调用配置正确
- ✅ 错误处理机制正常
- ✅ 登录状态处理正常
- ✅ 首页数据加载正常

### 待验证功能
- ⏳ 后端 API 服务的具体实现
- ⏳ 登录注册功能的完整测试
- ⏳ 所有 API 端点的完整测试
