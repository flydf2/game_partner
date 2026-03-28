# 悬赏订单 API 接口文档

## 数据对象

### 订单状态 (Order Status)

| 状态值 | 中文描述 | 说明 |
|--------|---------|------|
| `available` | 可抢单 | 订单已发布，等待大神抢单 |
| `ongoing` | 进行中 | 已有大神抢单，服务进行中 |
| `completed` | 已完成 | 服务已完成，等待结算 |
| `draft` | 草稿 | 订单尚未发布 |
| `cancelled` | 已取消 | 订单已被取消 |
| `expired` | 已过期 | 订单已过期 |

### 订单类型 (Order Type)

| 类型值 | 中文描述 | 说明 |
|--------|---------|------|
| `prepay` | 预付 | 先付款后服务 |
| `postpay` | 现付 | 先服务后付款 |

### 订单对象 (Reward Order)

```javascript
{
  id: 1,
  userId: 1001,
  userAvatar: 'https://...',
  userName: '游戏达人',
  userLevel: 24,
  userSpecialty: '顶级辅助',
  game: '英雄联盟',
  content: '寻找钻石以上段位的陪玩，一起冲大师！',
  reward: 100,
  paymentMethod: 'prepay',
  status: 'available',
  timeLeft: '24:59',
  tags: ['钻石', '排位', '上分'],
  requirements: ['钻石以上段位', '有稳定网络', '能准时上线'],
  createdAt: '2026-03-28T10:00:00Z'
}
```

### 抢单者对象 (Applicant)

```javascript
{
  id: 1,
  name: '逐风猎手',
  avatar: 'https://...',
  level: 24,
  rating: 4.9,
  specialty: '擅长：玄策、韩信、李白 | 效率极高',
  orderCount: 2400,
  badges: [
    { type: 'verified', text: '实名认证' },
    { type: 'deposit', text: '保证金已缴' }
  ]
}
```

### 抢单申请对象 (Grab Application)

```javascript
{
  id: 1,
  orderId: 1,
  userId: 2001,
  userName: '大神玩家',
  userAvatar: 'https://...',
  userLevel: 32,
  recommendation: '全能选手，擅长打野和对抗路...',
  appliedAt: '2026-03-28 14:30:00',
  status: 'pending',
  voiceUrl: 'https://...',
  recordUrl: 'https://...'
}
```

### 发布订单请求对象 (Publish Request)

```javascript
{
  game: '王者荣耀',
  content: '寻找荣耀王者陪玩，教我玩貂蝉',
  reward: 80,
  paymentMethod: 'postpay',
  requirements: ['荣耀王者及以上', '擅长貂蝉', '有耐心'],
  tags: ['荣耀王者', '貂蝉', '教学']
}
```

### 支付请求对象 (Payment Request)

```javascript
{
  orderId: 1,
  amount: 100,
  paymentMethod: 'wechat',
  transactionId: 'TX123456789'
}
```

### 服务确认请求对象 (Service Confirm Request)

```javascript
{
  orderId: 1,
  rating: 5,
  review: '非常专业，带我上了很多分',
  images: ['https://...']
}
```

## API 接口列表

### 1. 获取悬赏订单列表

**接口**: `GET /api/reward`

**参数**:
```javascript
{
  page: 1,
  pageSize: 20,
  status: 'available', // 可选：过滤状态
  game: '王者荣耀'      // 可选：过滤游戏
}
```

**响应**:
```javascript
{
  code: 0,
  data: {
    data: [...],
    pagination: {
      currentPage: 1,
      totalPages: 5,
      totalCount: 100
    }
  },
  msg: '获取成功'
}
```

### 2. 获取我的悬赏订单列表

**接口**: `GET /api/my-reward`

**参数**:
```javascript
{
  page: 1,
  pageSize: 20
}
```

**响应**: 同上

### 3. 获取悬赏订单详情

**接口**: `GET /api/reward/:orderId`

**参数**: 无

**响应**:
```javascript
{
  code: 0,
  data: {
    id: 1,
    title: '王者荣耀：巅峰赛上分',
    userId: 1001,
    userAvatar: 'https://...',
    userName: '晴天小浪君',
    userLevel: 32,
    userSpecialty: '顶级辅助',
    game: '王者荣耀',
    content: '寻找钻石以上段位的陪玩，一起冲大师！',
    reward: 188,
    paymentMethod: 'prepay',
    status: 'available',
    timeLeft: '24:59',
    tags: ['钻石', '排位', '上分'],
    requirements: ['钻石以上段位', '有稳定网络', '能准时上线'],
    contactInfo: {
      phone: '138****8888',
      wechat: 'game****1234'
    }
  },
  msg: '获取成功'
}
```

### 4. 获取抢单者列表

**接口**: `GET /api/reward/:orderId/applicants`

**参数**: 无

**响应**:
```javascript
{
  code: 0,
  data: [
    {
      id: 1,
      name: '逐风猎手',
      avatar: 'https://...',
      level: 24,
      rating: 4.9,
      specialty: '擅长：玄策、韩信、李白 | 效率极高',
      orderCount: 2400,
      badges: [
        { type: 'verified', text: '实名认证' },
        { type: 'deposit', text: '保证金已缴' }
      ]
    }
  ],
  msg: '获取成功'
}
```

### 5. 选择抢单者

**接口**: `POST /api/reward/:orderId/select-applicant`

**请求体**:
```javascript
{
  applicantId: 1
}
```

**响应**:
```javascript
{
  code: 0,
  data: {},
  msg: '选择成功'
}
```

### 6. 抢单

**接口**: `POST /api/reward/:orderId/grab`

**请求体**: 无

**响应**:
```javascript
{
  code: 0,
  data: {
    orderId: 1,
    status: 'grabbed',
    message: '抢单成功'
  },
  msg: '抢单成功'
}
```

### 7. 发布悬赏订单

**接口**: `POST /api/reward`

**请求体**:
```javascript
{
  game: '王者荣耀',
  content: '寻找荣耀王者陪玩，教我玩貂蝉',
  reward: 80,
  paymentMethod: 'postpay',
  requirements: ['荣耀王者及以上', '擅长貂蝉', '有耐心'],
  tags: ['荣耀王者', '貂蝉', '教学']
}
```

**响应**:
```javascript
{
  code: 0,
  data: {
    orderId: 123
  },
  msg: '发布成功'
}
```

### 8. 发布订单

**接口**: `POST /api/reward/:orderId/publish`

**请求体**: 无

**响应**:
```javascript
{
  code: 0,
  data: {},
  msg: '发布成功'
}
```

### 9. 支付订单

**接口**: `POST /api/reward/:orderId/pay`

**请求体**:
```javascript
{
  amount: 100,
  paymentMethod: 'wechat',
  transactionId: 'TX123456789'
}
```

**响应**:
```javascript
{
  code: 0,
  data: {
    transactionId: 'TX123456789'
  },
  msg: '支付成功'
}
```

### 10. 确认服务

**接口**: `POST /api/reward/:orderId/confirm`

**请求体**:
```javascript
{
  rating: 5,
  review: '非常专业，带我上了很多分',
  images: ['https://...']
}
```

**响应**:
```javascript
{
  code: 0,
  data: {
    settlementAmount: 150
  },
  msg: '服务确认成功'
}
```

## 使用的 API 模块

### api/index.js - rewardOrderApi

```javascript
export const rewardOrderApi = {
  async getRewardOrders(params = {}) { ... }
  async getMyRewardOrders(params = {}) { ... }
  async getRewardOrderDetail(orderId) { ... }
  async getApplicants(orderId) { ... }
  async selectApplicant(orderId, applicantId) { ... }
  async grabRewardOrder(orderId) { ... }
  async publishRewardOrder(orderId) { ... }
  async publishReward(publishData) { ... }
  async payRewardOrder(orderId, paymentData) { ... }
  async confirmService(orderId, reviewData) { ... }
}
```

### stores/rewardOrder.js - Pinia Store

```javascript
export const useRewardOrderStore = defineStore('rewardOrder', {
  state: () => ({
    orders: [],
    currentOrder: null,
    applicants: [],
    isLoading: false,
    error: null,
    total: 0,
    currentPage: 1,
    totalPages: 1
  }),
  
  actions: {
    async getRewardOrders(params = {}) { ... }
    async getMyRewardOrders(params = {}) { ... }
    async getRewardOrderDetail(orderId) { ... }
    async getApplicants(orderId) { ... }
    async selectApplicant(orderId, applicantId) { ... }
    async grabRewardOrder(orderId) { ... }
    async publishRewardOrder(orderId) { ... }
    async publishReward(publishData) { ... }
    async payRewardOrder(orderId, paymentData) { ... }
    async confirmService(orderId, reviewData) { ... }
  }
})
```

## 页面使用的接口

### RewardOrderList.vue (悬赏订单列表)
- `rewardOrderApi.getRewardOrders(params)`
- `rewardOrderApi.getRewardOrderDetail(orderId)`

### RewardOrderDetail.vue (悬赏详情)
- `rewardOrderApi.getRewardOrderDetail(orderId)`
- `rewardOrderApi.getApplicants(orderId)`
- `rewardOrderApi.selectApplicant(orderId, applicantId)`

### GrabOrder.vue (抢单确认)
- `rewardOrderApi.grabRewardOrder(orderId)`

### GrabOrderDetail.vue (抢单详情)
- 模拟数据 (待接入真实 API)

### MyGrabOrders.vue (我的抢单)
- 模拟数据 (待接入真实 API)

### RewardOrderPublish.vue (发布悬赏)
- `rewardOrderApi.publishReward(publishData)`

### RewardOrderPayment.vue (支付)
- `rewardOrderApi.payRewardOrder(orderId, paymentData)`

### RewardOrderConfirm.vue (确认服务)
- `rewardOrderApi.confirmService(orderId, reviewData)`

## Mock 数据文件

### api/mock-reward.js

包含完整的订单列表和详情的 mock 数据：
- `mockRewardOrders`: 30 个订单数据
- `mockGetRewardOrders()`: 获取订单列表
- `mockGetRewardOrderDetail()`: 获取订单详情
- `mockGrabRewardOrder()`: 抢单接口
