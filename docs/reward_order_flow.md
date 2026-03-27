# 悬赏订单交互流程文档

## 概述
本文档整理了悬赏订单系统的完整交互流程，分为**发布者**和**抢单者**两个角色的业务流程。

---

## 角色定义

### 发布者（雇主）
- 发布悬赏任务
- 选择抢单者
- 支付托管金
- 确认服务完成
- 评价结算

### 抢单者（大神/陪玩师）
- 浏览悬赏广场
- 抢单确认
- 完成服务
- 查看抢单状态

---

## 完整业务流程

### 发布者流程

```
1. 发布悬赏 → 2. 订单列表 → 3. 悬赏详情 → 4. 选择抢单者 → 5. 支付托管金 → 6. 确认服务 → 7. 评价结算
```

#### 1. 发布悬赏
- **页面**: `/reward/publish` - RewardOrderPublish.vue
- **功能**: 发布新的悬赏任务
- **操作**:
  - 选择游戏类型
  - 设置赏金金额
  - 设置服务时长
  - 设置开始时间
  - 填写任务要求

#### 2. 订单列表
- **页面**: `/reward` - RewardSquare.vue (悬赏广场)
- **功能**: 浏览所有可抢单的悬赏任务
- **操作**:
  - 按分类筛选
  - 点击任务查看详情
  - 点击"立即接单"进入抢单流程

#### 3. 悬赏详情
- **页面**: `/reward/:id` - RewardOrderDetail.vue
- **功能**: 查看悬赏任务详细信息
- **状态流转**:
  - **可抢单**: 显示"立即抢单"按钮 + 抢单列表
  - **进行中**: 显示抢单列表（带已选中标记）
  - **已完成**: 显示抢单列表（带已选中标记）
  - **草稿/已取消/已过期**: 显示对应状态

#### 4. 选择抢单者
- **页面**: `/grab-order/:id` - GrabOrder.vue
- **功能**: 抢单者提交抢单申请
- **操作**:
  - 查看任务简述
  - 填写自我推荐
  - 选择语音试听/上传战绩
  - 选择预计出发时间
  - 提交抢单申请

#### 5. 支付托管金
- **页面**: `/reward/:id/payment` - RewardOrderPayment.vue
- **功能**: 发布者支付托管金
- **操作**:
  - 确认服务时长
  - 选择支付方式（支付宝/微信）
  - 确认支付金额
  - 完成支付

#### 6. 确认服务
- **页面**: `/reward/:id/confirm` - RewardOrderConfirm.vue
- **功能**: 确认服务开始
- **操作**:
  - 查看陪玩师信息
  - 确认服务内容
  - 点击"确认开始"

#### 7. 评价结算
- **页面**: `/reward/:id/review` - RewardOrderReview.vue
- **功能**: 评价服务并结算
- **操作**:
  - 评分（1-5星）
  - 选择评价标签
  - 填写评价内容
  - 提交评价

---

### 抢单者流程

```
1. 悬赏广场 → 2. 悬赏详情 → 3. 抢单确认 → 4. 抢单成功 → 5. 抢单状态
```

#### 1. 悬赏广场
- **页面**: `/reward` - RewardSquare.vue
- **功能**: 浏览所有悬赏任务
- **操作**:
  - 浏览悬赏列表
  - 点击任务查看详情
  - 点击"立即接单"

#### 2. 悬赏详情
- **页面**: `/reward/:id` - RewardOrderDetail.vue
- **功能**: 查看悬赏任务详细信息
- **状态**:
  - **可抢单**: 显示"立即抢单"按钮（在抢单列表上方）
  - **进行中/已完成**: 显示抢单列表（带已选中标记）

#### 3. 抢单确认
- **页面**: `/grab-order/:id` - GrabOrder.vue
- **功能**: 提交抢单申请
- **操作**:
  - 查看任务简述
  - 填写自我推荐（可快速填充模板）
  - 选择语音试听/上传战绩
  - 选择预计出发时间
  - 提交抢单申请

#### 4. 抢单成功
- **页面**: `/grab-order/:id/success` - GrabOrderSuccess.vue
- **功能**: 抢单成功确认
- **操作**:
  - 查看抢单成功信息
  - 点击"立即沟通"进入聊天
  - 点击"查看任务详情"

#### 5. 抢单状态
- **页面**: `/reward/:id/status` - RewardOrderStatus.vue
- **功能**: 查看抢单状态
- **标签页**:
  - **等待选择**: 抢单已提交，等待雇主选择
  - **已入选**: 被雇主选中，点击"确认完成并结算"跳转到 `/reward/:id/confirm`
  - **已完成**: 服务已完成，查看订单详情

---

## 抢单状态页面链接地址

### 待选择状态（pending）
- **页面**: `/reward/:id/status` - RewardOrderStatus.vue
- **说明**: 抢单已提交，等待雇主选择
- **操作**: 无跳转链接，仅显示状态

### 已入选状态（selected）
- **页面**: `/reward/:id/status` - RewardOrderStatus.vue
- **说明**: 被雇主选中，等待服务开始
- **跳转链接**: 
  - 点击"确认完成并结算"按钮 → `/reward/:id/confirm` (RewardOrderConfirm.vue)
  - 点击订单卡片 → `/reward/:id` (RewardOrderDetail.vue)

### 已完成状态（completed）
- **页面**: `/reward/:id/status` - RewardOrderStatus.vue
- **说明**: 服务已完成，等待结算
- **操作**: 无跳转链接，仅显示订单信息

---

## 订单状态流转

### 发布者视角
```
草稿 → 可抢单 → 已入选 → 进行中 → 已完成 → 已取消/已过期
```

### 抢单者视角
```
可抢单 → 已提交 → 等待选择 → 已入选 → 进行中 → 已完成
```

---

## 页面清单

### 发布者相关页面

| 页面 | 路由 | 组件 | 功能 |
|------|------|------|------|
| 发布悬赏 | `/reward/publish` | RewardOrderPublish.vue | 发布新的悬赏任务 |
| 悬赏广场 | `/reward` | RewardSquare.vue | 浏览悬赏列表 |
| 悬赏详情 | `/reward/:id` | RewardOrderDetail.vue | 查看任务详情 |
| 确认订单 | `/reward/:id/confirm` | RewardOrderConfirm.vue | 确认订单信息 |
| 支付托管金 | `/reward/:id/payment` | RewardOrderPayment.vue | 支付托管金 |
| 评价服务 | `/reward/:id/review` | RewardOrderReview.vue | 评价并结算 |
| 订单列表 | `/orders` | Orders.vue | 查看所有订单 |
| 订单详情 | `/order/:id` | OrderDetail.vue | 查看订单详情 |

### 抢单者相关页面

| 页面 | 路由 | 组件 | 功能 |
|------|------|------|------|
| 悬赏广场 | `/reward` | RewardSquare.vue | 浏览悬赏列表 |
| 悬赏详情 | `/reward/:id` | RewardOrderDetail.vue | 查看任务详情 |
| 抢单确认 | `/grab-order/:id` | GrabOrder.vue | 提交抢单申请 |
| 抢单成功 | `/grab-order/:id/success` | GrabOrderSuccess.vue | 抢单成功确认 |
| 抢单状态 | `/reward/:id/status` | RewardOrderStatus.vue | 查看抢单状态 |
| 我的订单 | `/orders` | Orders.vue | 查看所有订单 |

---

## API 接口清单

### 发布者接口

| 接口 | 方法 | 路径 | 功能 |
|------|------|------|------|
| 发布悬赏 | POST | `/api/reward/publish` | 发布新的悬赏任务 |
| 获取悬赏列表 | GET | `/api/reward/orders` | 获取悬赏订单列表 |
| 获取悬赏详情 | GET | `/api/reward/:id` | 获取悬赏订单详情 |
| 获取抢单列表 | GET | `/api/reward/:id/applicants` | 获取抢单者列表 |
| 选择抢单者 | POST | `/api/reward/:id/select` | 选择抢单者 |
| 支付托管金 | POST | `/api/reward/:id/payment` | 支付托管金 |
| 确认服务 | POST | `/api/reward/:id/confirm` | 确认服务开始 |
| 评价服务 | POST | `/api/reward/:id/review` | 评价服务 |

### 抢单者接口

| 接口 | 方法 | 路径 | 功能 |
|------|------|------|------|
| 浏览悬赏 | GET | `/api/reward` | 浏览悬赏列表 |
| 获取悬赏详情 | GET | `/api/reward/:id` | 获取悬赏订单详情 |
| 抢单申请 | POST | `/api/reward/:id/grab` | 提交抢单申请 |
| 获取抢单状态 | GET | `/api/reward/:id/status` | 获取抢单状态 |
| 获取我的订单 | GET | `/api/reward/my-orders` | 获取我的订单列表 |

---

## 状态说明

### 订单状态

| 状态 | 值 | 描述 |
|------|------|------|
| 草稿 | `draft` | 任务创建但未发布 |
| 可抢单 | `available` | 任务已发布，等待抢单 |
| 已入选 | `selected` | 任务已被选中，等待服务 |
| 进行中 | `ongoing` | 服务进行中 |
| 已完成 | `completed` | 服务已完成 |
| 已取消 | `cancelled` | 任务已取消 |
| 已过期 | `expired` | 任务已过期 |

### 抢单状态

| 状态 | 描述 |
|------|------|
| 待选择 | 抢单已提交，等待雇主选择 |
| 已入选 | 被雇主选中 |
| 已完成 | 服务已完成 |

---

## 注意事项

1. 所有页面都需要用户登录认证
2. 订单状态流转必须严格按照业务逻辑
3. 支付成功后才能确认服务
4. 评价结算后订单状态变为"已完成"
5. 抢单者只能在"可抢单"状态下提交抢单申请
6. 发布者只能在"已入选"状态下确认服务
