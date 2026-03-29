# 账号安全页面真实 API 接入记录

## 修改日期
2026-03-28

## 修改内容

### 1. API 层新增安全相关接口

**文件**: `src/api/index.js`

新增 `securityApi` 对象，包含以下方法：

| 方法名 | 功能 | 真实 API 端点 | Mock 模式 |
|--------|------|--------------|-----------|
| `changePassword(data)` | 修改密码 | `POST /user/change-password` | 支持 |
| `sendPhoneCode(phone)` | 发送手机验证码 | `POST /auth/send-phone-code` | 支持 |
| `bindPhone(data)` | 绑定手机 | `POST /user/bind-phone` | 支持 |
| `sendEmailCode(email)` | 发送邮箱验证码 | `POST /auth/send-email-code` | 支持 |
| `bindEmail(data)` | 绑定邮箱 | `POST /user/bind-email` | 支持 |
| `getSecurityInfo()` | 获取安全信息 | `GET /user/security-info` | 支持 |

### 2. 修改密码页面接入真实 API

**文件**: `src/views/PasswordChange.vue`

**变更内容**:
- 导入 `securityApi` 和 `handleApiError`
- 导入 `useToast` 用于显示操作提示
- `handleSubmit` 方法改为异步调用 `securityApi.changePassword()`
- 添加错误处理和 Toast 提示

**API 请求格式**:
```javascript
{
  currentPassword: string,  // 当前密码
  newPassword: string       // 新密码
}
```

### 3. 手机绑定页面接入真实 API

**文件**: `src/views/PhoneBind.vue`

**变更内容**:
- 导入 `securityApi` 和 `handleApiError`
- 导入 `useToast` 用于显示操作提示
- `sendVerificationCode` 方法改为异步调用 `securityApi.sendPhoneCode()`
- `handleSubmit` 方法改为异步调用 `securityApi.bindPhone()`
- 添加错误处理和 Toast 提示

**API 请求格式**:
```javascript
// 发送验证码
POST /auth/send-phone-code
{ phone: string }

// 绑定手机
POST /user/bind-phone
{
  phone: string,  // 手机号
  code: string    // 验证码
}
```

### 4. 邮箱绑定页面接入真实 API

**文件**: `src/views/EmailBind.vue`

**变更内容**:
- 导入 `securityApi` 和 `handleApiError`
- 导入 `useToast` 用于显示操作提示
- `sendVerificationCode` 方法改为异步调用 `securityApi.sendEmailCode()`
- `handleSubmit` 方法改为异步调用 `securityApi.bindEmail()`
- 添加错误处理和 Toast 提示

**API 请求格式**:
```javascript
// 发送验证码
POST /auth/send-email-code
{ email: string }

// 绑定邮箱
POST /user/bind-email
{
  email: string,  // 邮箱地址
  code: string    // 验证码
}
```

## API 端点汇总

### 真实 API 端点（非 Mock 模式）

| 功能 | 方法 | 端点 | 请求体 |
|------|------|------|--------|
| 修改密码 | POST | `/user/change-password` | `{ currentPassword, newPassword }` |
| 发送手机验证码 | POST | `/auth/send-phone-code` | `{ phone }` |
| 绑定手机 | POST | `/user/bind-phone` | `{ phone, code }` |
| 发送邮箱验证码 | POST | `/auth/send-email-code` | `{ email }` |
| 绑定邮箱 | POST | `/user/bind-email` | `{ email, code }` |
| 获取安全信息 | GET | `/user/security-info` | - |

## 环境配置

通过 `.env` 文件控制是否使用 Mock 数据：

```bash
# 使用 Mock 数据
VITE_USE_MOCK=true

# 使用真实 API
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://your-api-server/api/playmate
```

## 错误处理

所有 API 调用均使用 `handleApiError` 统一处理错误，包括：
- 网络连接失败
- 请求超时
- 服务器错误（500+）
- 客户端错误（400-499）
- 业务错误

## 测试建议

1. **Mock 模式测试**: 设置 `VITE_USE_MOCK=true`，验证页面交互逻辑
2. **真实 API 测试**: 设置 `VITE_USE_MOCK=false`，验证与后端接口的连通性
3. **错误场景测试**: 
   - 网络断开时的错误提示
   - 验证码错误时的处理
   - 密码不符合规则时的校验

## 相关文件

- `src/api/index.js` - API 接口定义
- `src/views/Security.vue` - 账号安全主页面
- `src/views/PasswordChange.vue` - 修改密码页面
- `src/views/PhoneBind.vue` - 手机绑定页面
- `src/views/EmailBind.vue` - 邮箱绑定页面
- `src/composables/useToast.js` - Toast 提示组件
