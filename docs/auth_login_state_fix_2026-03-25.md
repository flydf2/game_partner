# 登录态处理修改记录

## 修改日期
2026-03-25

## 修改目的
处理登录态，实现默认未登录状态，并完善登录注册功能。

## 修改内容

### 1. 修复路由守卫 Token Key 不一致问题
**文件**: [src/router/index.js](file:///System/Volumes/Data/webcode/UX/GamePartner/src/router/index.js)

**问题**: 
- 路由守卫检查的是 `auth_token`
- 登录时存储的是 `token`
- 导致即使登录成功，路由守卫也无法识别

**修改**:
```javascript
// 修改前
function checkAuth() {
  const token = localStorage.getItem('auth_token')
  return !!token
}

// 修改后
function checkAuth() {
  const token = localStorage.getItem('token')
  return !!token
}
```

### 2. 重构登录页面使用 Pinia Store
**文件**: [src/views/Login.vue](file:///System/Volumes/Data/webcode/UX/GamePartner/src/views/Login.vue)

**问题**:
- 登录页面直接调用 API，没有使用 Pinia store 管理状态
- 缺少统一的错误处理和用户反馈

**修改**:
- 引入 `useUserStore` 和 `useToast`
- 使用 `userStore.login()` 替代直接 API 调用
- 添加 Toast 提示反馈

### 3. 重构注册页面使用 Pinia Store
**文件**: [src/views/Register.vue](file:///System/Volumes/Data/webcode/UX/GamePartner/src/views/Register.vue)

**问题**:
- 注册页面直接调用 API，没有使用 Pinia store 管理状态
- 缺少统一的错误处理和用户反馈

**修改**:
- 引入 `useUserStore` 和 `useToast`
- 使用 `userStore.register()` 和 `userStore.sendSmsCode()` 替代直接 API 调用
- 添加 Toast 提示反馈

### 4. 完善 User Store
**文件**: [src/stores/user.js](file:///System/Volumes/Data/webcode/UX/GamePartner/src/stores/user.js)

**新增功能**:

#### 4.1 添加发送验证码方法
```javascript
async sendSmsCode(phone) {
  try {
    this.isLoading = true
    this.error = null
    await userApi.sendSmsCode(phone)
  } catch (error) {
    this.error = error.message
    throw error
  } finally {
    this.isLoading = false
  }
}
```

#### 4.2 添加持久化功能
- 使用 `localStorage` 持久化用户信息
- 新增 `loadUserFromStorage()` 和 `saveUserToStorage()` 辅助函数
- 在 state 初始化时从 localStorage 恢复用户信息
- 登录/注册成功后保存用户信息
- 退出登录后清除用户信息

#### 4.3 优化登录和注册方法
- 统一处理 API 响应格式
- 正确存储 token 和用户信息
- 添加持久化保存

#### 4.4 添加 checkAuth 方法
```javascript
checkAuth() {
  const token = localStorage.getItem('token')
  const storedUser = loadUserFromStorage()
  
  if (token && storedUser) {
    this.userInfo = storedUser
    this.isLoggedIn = true
  } else if (token && !this.isLoggedIn) {
    this.getProfile().catch(() => {
      this.isLoggedIn = false
    })
  }
  
  return !!(token && this.isLoggedIn)
}
```

### 5. 优化 App.vue
**文件**: [src/App.vue](file:///System/Volumes/Data/webcode/UX/GamePartner/src/App.vue)

**修改**:
- 引入 `useUserStore`
- 使用 `userStore.checkAuth()` 检查登录状态
- 在 401 响应时调用 `userStore.logout()` 统一处理退出逻辑

## 技术要点

### 1. 状态持久化
使用 `localStorage` 实现用户状态持久化，确保刷新页面后登录状态不丢失：
- `token`: 存储在 `localStorage.getItem('token')`
- `userInfo`: 存储在 `localStorage.getItem('gamepartner_user')`

### 2. 默认未登录状态
- 应用启动时，`userStore` 的 `isLoggedIn` 默认为 `false`
- 只有当 localStorage 中同时存在 token 和 userInfo 时，才会自动恢复登录状态
- 如果 token 存在但 userInfo 不存在，会尝试调用 API 获取用户信息

### 3. 统一错误处理
- 使用 Pinia store 统一管理错误状态
- 使用 `useToast` 提供用户友好的错误提示
- 在响应拦截器中统一处理 401 未授权错误

### 4. 路由守卫
- 需要认证的路由通过 `meta.requireAuth` 标记
- 路由守卫检查 token 是否存在
- 未登录用户访问需要认证的路由时，自动跳转到登录页并携带 redirect 参数

## 测试建议

### 1. 登录功能测试
1. 访问 http://localhost:5178/login
2. 输入测试账号密码
3. 验证登录成功后：
   - 跳转到首页或 redirect 指定的页面
   - localStorage 中存储了 token 和 userInfo
   - 刷新页面后登录状态保持

### 2. 注册功能测试
1. 访问 http://localhost:5178/register
2. 填写手机号、验证码、密码、昵称
3. 验证注册成功后：
   - 自动登录
   - localStorage 中存储了 token 和 userInfo

### 3. 退出登录测试
1. 登录后访问个人中心
2. 点击退出登录
3. 验证：
   - localStorage 中的 token 和 userInfo 被清除
   - 跳转到首页或登录页
   - 无法访问需要认证的路由

### 4. 路由守卫测试
1. 未登录状态下访问需要认证的路由（如 `/orders`）
2. 验证自动跳转到登录页，并携带 redirect 参数
3. 登录成功后自动跳转回原页面

### 5. Token 过期测试
1. 登录后手动修改 localStorage 中的 token 为无效值
2. 访问需要认证的 API
3. 验证收到 401 响应后：
   - 自动清除登录状态
   - 跳转到登录页
   - 显示"登录已过期"提示

## 注意事项

1. **API 配置**: 确保 `.env` 文件中的 `VITE_API_BASE_URL` 和 `VITE_USE_MOCK` 配置正确
2. **后端接口**: 确保后端登录注册接口返回的数据格式符合前端预期
3. **Token 有效期**: 建议后端设置合理的 token 有效期，并在快过期时提示用户
4. **安全性**: 敏感信息（如密码）不应存储在 localStorage 中

## 后续优化建议

1. **Token 刷新机制**: 实现 token 自动刷新，避免用户频繁登录
2. **多标签页同步**: 使用 `storage` 事件监听，实现多标签页登录状态同步
3. **记住登录状态**: 添加"记住我"功能，延长 token 有效期
4. **登录设备管理**: 提供查看和踢出其他登录设备的功能
