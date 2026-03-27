# 抢单页面 Mock 数据完善记录

## 更新日期
2026-03-27

## 修改内容

### 1. 完善 Mock 数据结构

**文件**: `src/api/mock-reward.js`

#### 订单列表数据增强
为每个订单添加了 `requirements` 字段，包含发布要求列表：

```javascript
{
  id: 1,
  userId: 1001,
  userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  userName: '游戏达人',
  game: '英雄联盟',
  content: '寻找钻石以上段位的陪玩，一起冲大师！',
  reward: 100,
  paymentMethod: 'prepay',
  status: 'available',
  createdAt: '2026-03-23 15:30',
  tags: ['钻石', '排位', '上分'],
  requirements: ['钻石以上段位', '有稳定网络', '能准时上线']
}
```

#### 订单详情接口优化
更新 `mockGetRewardOrderDetail` 函数，返回完整的订单详情数据：

**修改前**:
```javascript
resolve({
  success: true,
  data: {
    ...order,
    contactInfo: {
      phone: '138****8888',
      wechat: 'game****1234'
    }
  }
})
```

**修改后**:
```javascript
resolve({
  code: 0,
  data: {
    id: order.id,
    title: order.game + ' ' + (order.paymentMethod === 'prepay' ? '预付' : '现付') + '悬赏单',
    userId: order.userId,
    userAvatar: order.userAvatar,
    userName: order.userName,
    game: order.game,
    content: order.content,
    reward: order.reward,
    paymentMethod: order.paymentMethod,
    status: order.status,
    createdAt: order.createdAt,
    tags: order.tags,
    requirements: order.requirements,
    contactInfo: {
      phone: '138****8888',
      wechat: 'game****1234'
    }
  },
  msg: '获取成功'
})
```

### 2. 修复类型匹配问题

**问题**: 路由参数 `orderId` 为字符串类型，而 Mock 数据中的 `id` 为数字类型，导致 `find` 方法无法匹配。

**解决方案**: 使用 `String()` 进行类型转换：

```javascript
const order = mockRewardOrders.find(o => String(o.id) === String(orderId))
```

## 数据结构说明

### 订单详情数据结构

```javascript
{
  code: 0,
  data: {
    id: 1,                              // 订单ID
    title: '英雄联盟 预付悬赏单',       // 订单标题（自动生成）
    userId: 1001,                       // 发布者ID
    userAvatar: 'https://...',          // 发布者头像
    userName: '游戏达人',               // 发布者名称
    game: '英雄联盟',                   // 游戏类型
    content: '寻找钻石以上段位...',     // 订单内容
    reward: 100,                        // 悬赏金额
    paymentMethod: 'prepay',            // 支付方式（prepay/postpay）
    status: 'available',                // 订单状态
    createdAt: '2026-03-23 15:30',     // 创建时间
    tags: ['钻石', '排位', '上分'],      // 标签
    requirements: [                     // 发布要求
      '钻石以上段位',
      '有稳定网络',
      '能准时上线'
    ],
    contactInfo: {                      // 联系方式
      phone: '138****8888',
      wechat: 'game****1234'
    }
  },
  msg: '获取成功'
}
```

## 抢单页面组件

**文件**: `src/views/GrabOrder.vue`

### 功能特性

1. **订单信息展示**
   - 订单标题
   - 订单内容描述
   - 游戏类型标签
   - 发布者信息（头像、名称、等级）
   - 悬赏金额
   - 支付方式

2. **发布要求**
   - 以列表形式展示发布者的要求
   - 使用复选框图标标识

3. **操作按钮**
   - 取消按钮：返回上一页
   - 确认抢单按钮：提交抢单请求

4. **广告通栏**
   - 顶部黄色通栏，点击可跳转到悬赏订单列表
   - 包含图标和文字提示

## API 接口说明

### 获取订单详情

**接口路径**: `GET /reward/:id`

**Mock 实现**: `mockGetRewardOrderDetail(orderId)`

**响应格式**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "title": "英雄联盟 预付悬赏单",
    "userId": 1001,
    "userAvatar": "https://randomuser.me/api/portraits/men/32.jpg",
    "userName": "游戏达人",
    "game": "英雄联盟",
    "content": "寻找钻石以上段位的陪玩，一起冲大师！",
    "reward": 100,
    "paymentMethod": "prepay",
    "status": "available",
    "createdAt": "2026-03-23 15:30",
    "tags": ["钻石", "排位", "上分"],
    "requirements": ["钻石以上段位", "有稳定网络", "能准时上线"],
    "contactInfo": {
      "phone": "138****8888",
      "wechat": "game****1234"
    }
  },
  "msg": "获取成功"
}
```

### 抢单

**接口路径**: `POST /reward/:id/grab`

**Mock 实现**: `mockGrabRewardOrder(orderId)`

**响应格式**:
```json
{
  "code": 0,
  "data": {
    "orderId": 1,
    "status": "grabbed",
    "message": "抢单成功"
  },
  "msg": "抢单成功"
}
```

## 测试验证

### 测试步骤

1. 访问 `http://localhost:5178/grab-order/1`
2. 验证订单详情正确显示
3. 验证发布者信息显示正常
4. 验证悬赏金额和支付方式显示正确
5. 验证发布要求列表显示完整
6. 测试取消按钮功能
7. 测试确认抢单按钮功能

### 测试结果

✅ 订单详情加载成功
✅ 发布者信息显示正常
✅ 悬赏金额和支付方式显示正确
✅ 发布要求列表显示完整
✅ 取消按钮功能正常
✅ 抢单功能正常

## 相关文件

- `src/api/mock-reward.js` - Mock 数据定义
- `src/api/index.js` - API 接口定义
- `src/views/GrabOrder.vue` - 抢单确认页面
- `src/router/index.js` - 路由配置

## 变更记录

- 2026-03-27: 初始版本，完善 Mock 数据结构
- 2026-03-27: 修复订单 ID 类型匹配问题
