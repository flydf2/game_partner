# 确认订单页面真实API集成记录

## 更新日期
2026-03-26

## 更新内容

### 1. 页面信息
- **页面名称**: 确认订单页 (ConfirmOrder.vue)
- **路由路径**: `/confirm-order`
- **访问方式**: GET /confirm-order?expertId={expertId}

### 2. 修改的文件
- `src/views/ConfirmOrder.vue`

### 3. API集成详情

#### 3.1 导入的API模块
```javascript
import { expertApi, orderApi, handleApiError } from '../api'
```

#### 3.2 使用的API接口

##### 获取专家详情
- **接口**: `expertApi.getExpertDetail(expertId)`
- **方法**: GET
- **路径**: `/experts/{expertId}`
- **用途**: 加载专家详细信息用于订单确认
- **参数**: 
  - `expertId` (String): 专家ID，从路由查询参数获取

##### 创建订单
- **接口**: `orderApi.createOrder(orderData)`
- **方法**: POST
- **路径**: `/orders`
- **用途**: 提交订单创建请求
- **参数**:
  ```javascript
  {
    expertId: expertId.value,           // 专家ID
    serviceTime: `${serviceDate.value} ${serviceTime.value}`,  // 服务时间
    duration: serviceDuration.value,    // 服务时长（小时）
    couponId: selectedCoupon.value?.id, // 优惠券ID（可选）
    remarks: ''                         // 备注
  }
  ```

### 4. 功能变更

#### 4.1 订单创建流程变更

**修改前**:
```javascript
const handlePay = () => {
  router.push({
    path: '/payment-success',
    query: {
      expertId: expertId.value,
      amount: totalAmount.value
    }
  })
}
```

**修改后**:
```javascript
const handlePay = async () => {
  isSubmitting.value = true
  try {
    const response = await orderApi.createOrder({
      expertId: expertId.value,
      serviceTime: `${serviceDate.value} ${serviceTime.value}`,
      duration: serviceDuration.value,
      couponId: selectedCoupon.value?.id,
      remarks: ''
    })
    
    if (response.success || response.code === 0) {
      router.push({
        path: '/payment-success',
        query: {
          expertId: expertId.value,
          amount: totalAmount.value,
          orderId: response.data?.orderId
        }
      })
    } else {
      throw new Error(response.message || response.msg || '创建订单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    alert(result.error || '创建订单失败，请重试')
    console.error('创建订单失败:', err)
    isSubmitting.value = false
  }
}
```

#### 4.2 新增功能

1. **提交状态管理**
   - 新增 `isSubmitting` 状态变量
   - 在提交过程中禁用按钮
   - 显示"提交中..."提示

2. **错误处理**
   - 添加 try-catch 错误捕获
   - 使用 `handleApiError` 统一处理错误
   - 显示友好的错误提示

3. **订单ID传递**
   - 支付成功页面接收 `orderId` 参数
   - 用于后续订单查询和状态跟踪

### 5. API响应处理

#### 创建订单响应格式
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

#### 响应处理逻辑
```javascript
if (response.success || response.code === 0) {
  // 订单创建成功
  router.push({
    path: '/payment-success',
    query: {
      expertId: expertId.value,
      amount: totalAmount.value,
      orderId: response.data?.orderId
    }
  })
} else {
  // 订单创建失败
  throw new Error(response.message || response.msg || '创建订单失败')
}
```

### 6. 用户体验改进

1. **按钮状态反馈**
   - 提交时按钮显示"提交中..."
   - 提交时禁用按钮防止重复提交
   - 提交完成后恢复按钮状态

2. **错误提示**
   - 统一的错误处理机制
   - 友好的错误提示信息
   - 控制台错误日志记录

3. **数据传递**
   - 订单ID传递到支付成功页面
   - 便于后续订单状态查询

### 7. Mock数据使用

当前配置使用 Mock 数据：
- `USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'`
- Mock 实现位于 `src/api/mock.js`
- 真实 API 实现已准备就绪，可通过环境变量切换

### 8. 后端接口说明

#### 创建订单接口
- **路径**: `POST /orders`
- **认证**: 需要 JWT Token
- **请求体**:
  ```json
  {
    "expertId": 1,
    "serviceTime": "2026-03-25 19:00",
    "duration": 2,
    "couponId": 1,
    "remarks": ""
  }
  ```
- **响应格式**: 统一响应格式（code/data/msg）

### 9. 测试建议

1. **功能测试**
   - 测试订单创建流程
   - 测试错误处理机制
   - 测试按钮禁用状态

2. **集成测试**
   - 测试与支付成功页面的跳转
   - 测试订单ID传递
   - 测试优惠券使用

3. **异常测试**
   - 测试网络错误处理
   - 测试服务器错误处理
   - 测试重复提交防护

### 10. 相关文档

- [全局API参数文档](./global_api_parameters.md)
- [真实后端接口说明](./api_real_backend.md)
- [页面API使用文档](./global_page_api_usage.md)

### 11. 变更记录

- 2026-03-26: 初始版本，集成真实订单创建API
