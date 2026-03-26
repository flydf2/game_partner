# 订单页面按钮功能API集成记录

## 更新日期
2026-03-26

## 更新内容

### 1. 页面信息
- **页面名称**: 订单列表页 (Orders.vue)
- **路由路径**: `/orders`
- **访问方式**: GET /orders

### 2. 修改的文件
- `src/api/index.js` - 添加订单操作API
- `src/views/Orders.vue` - 添加按钮点击功能

### 3. API集成详情

#### 3.1 新增API接口

##### 取消订单
- **接口**: `orderApi.cancelOrder(orderId)`
- **方法**: POST
- **路径**: `/orders/:orderId/cancel`
- **用途**: 用户取消订单
- **参数**: 
  - `orderId` (string): 订单ID

##### 确认订单
- **接口**: `orderApi.confirmOrder(orderId)`
- **方法**: POST
- **路径**: `/orders/:orderId/confirm`
- **用途**: 确认订单完成
- **参数**: 
  - `orderId` (string): 订单ID

##### 接单
- **接口**: `orderApi.acceptOrder(orderId)`
- **方法**: POST
- **路径**: `/orders/:orderId/accept`
- **用途**: 陪玩师接单
- **参数**: 
  - `orderId` (string): 订单ID

##### 拒绝订单
- **接口**: `orderApi.rejectOrder(orderId)`
- **方法**: POST
- **路径**: `/orders/:orderId/reject`
- **用途**: 陪玩师拒绝订单
- **参数**: 
  - `orderId` (string): 订单ID

### 4. 功能说明

#### 4.1 取消订单功能

```javascript
const handleCancelOrder = async (orderId) => {
  try {
    const response = await orderApi.cancelOrder(orderId)
    if (response.success || response.code === 0) {
      alert('订单已取消')
      await loadOrders()
    } else {
      alert(response.message || response.msg || '取消订单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    alert(result.error || '取消订单失败，请重试')
    console.error('取消订单失败:', err)
  }
}
```

**使用场景**: 
- 待确认订单：用户可以取消订单
- 进行中订单：用户可以取消订单

#### 4.2 确认订单功能

```javascript
const handleConfirmOrder = async (orderId) => {
  try {
    const response = await orderApi.confirmOrder(orderId)
    if (response.success || response.code === 0) {
      alert('订单已确认')
      await loadOrders()
    } else {
      alert(response.message || response.msg || '确认订单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    alert(result.error || '确认订单失败，请重试')
    console.error('确认订单失败:', err)
  }
}
```

**使用场景**: 
- 进行中订单：用户确认订单完成

#### 4.3 接单功能

```javascript
const handleAcceptOrder = async (orderId) => {
  try {
    const response = await orderApi.acceptOrder(orderId)
    if (response.success || response.code === 0) {
      alert('订单已接单')
      await loadOrders()
    } else {
      alert(response.message || response.msg || '接单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    alert(result.error || '接单失败，请重试')
    console.error('接单失败:', err)
  }
}
```

**使用场景**: 
- 待确认订单：陪玩师接单

#### 4.4 拒绝订单功能

```javascript
const handleRejectOrder = async (orderId) => {
  try {
    const response = await orderApi.rejectOrder(orderId)
    if (response.success || response.code === 0) {
      alert('订单已拒绝')
      await loadOrders()
    } else {
      alert(response.message || response.msg || '拒绝订单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    alert(result.error || '拒绝订单失败，请重试')
    console.error('拒绝订单失败:', err)
  }
}
```

**使用场景**: 
- 待确认订单：陪玩师拒绝订单

### 5. API响应处理

#### 统一响应格式
```json
{
  "code": 0,
  "data": {},
  "msg": "操作成功"
}
```

#### 响应处理逻辑
```javascript
if (response.success || response.code === 0) {
  // 操作成功
  alert('操作成功')
  await loadOrders() // 重新加载订单列表
} else {
  // 操作失败
  alert(response.message || response.msg || '操作失败')
}
```

### 6. 订单状态按钮布局

#### 6.1 待确认订单 (pending)
- **按钮**: 取消订单
- **功能**: 用户取消订单
- **API**: `orderApi.cancelOrder(orderId)`

#### 6.2 进行中订单 (ongoing)
- **按钮**: 联系Ta、进入房间
- **功能**: 联系陪玩师、进入游戏房间
- **API**: 无（已实现）

#### 6.3 已完成订单 (completed)
- **按钮**: 再来一单、去评价
- **功能**: 重复下单、评价服务
- **API**: 无（已实现）

#### 6.4 已取消订单 (cancelled)
- **按钮**: 查看详情
- **功能**: 查看取消的订单详情
- **API**: 无（已实现）

### 7. Mock数据使用

当前配置使用真实后端数据：
- `VITE_USE_MOCK = false`
- 真实 API 实现位于 `src/api/index.js`
- Mock 实现位于 `src/api/mock.js`

### 8. 后端接口说明

#### 取消订单接口
- **路径**: `POST /orders/:orderId/cancel`
- **认证**: 需要 JWT Token
- **请求参数**: 
  ```json
  {
    "orderId": "123"
  }
  ```
- **响应格式**: 统一响应格式（code/data/msg）

#### 确认订单接口
- **路径**: `POST /orders/:orderId/confirm`
- **认证**: 需要 JWT Token
- **请求参数**: 
  ```json
  {
    "orderId": "123"
  }
  ```
- **响应格式**: 统一响应格式（code/data/msg）

#### 接单接口
- **路径**: `POST /orders/:orderId/accept`
- **认证**: 需要 JWT Token
- **请求参数**: 
  ```json
  {
    "orderId": "123"
  }
  ```
- **响应格式**: 统一响应格式（code/data/msg）

#### 拒绝订单接口
- **路径**: `POST /orders/:orderId/reject`
- **认证**: 需要 JWT Token
- **请求参数**: 
  ```json
  {
    "orderId": "123"
  }
  ```
- **响应格式**: 统一响应格式（code/data/msg）

### 9. API配置

#### 环境变量
```
VITE_API_BASE_URL=/api/playmate
VITE_USE_MOCK=false
```

#### API基础URL
- 来源：`src/api/config.js`
- 配置：`const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/playmate'`

### 10. 测试建议

1. **功能测试**
   - 测试取消订单功能
   - 测试确认订单功能
   - 测试接单功能
   - 测试拒绝订单功能
   - 测试订单列表刷新

2. **集成测试**
   - 测试与订单详情页面的关联
   - 测试与聊天页面的关联
   - 测试API调用链

3. **异常测试**
   - 测试网络错误处理
   - 测试服务器错误处理
   - 测试重复操作防护

### 11. 相关文档

- [全局API参数文档](./global_api_parameters.md)
- [真实后端接口说明](./api_real_backend.md)
- [页面API使用文档](./global_page_api_usage.md)

### 12. 变更记录

- 2026-03-26: 初始版本，集成订单操作API
