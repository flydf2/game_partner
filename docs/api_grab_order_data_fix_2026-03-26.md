# 抢单确认页面数据绑定修复记录

## 更新日期
2026-03-26

## 问题描述

**错误信息**: `Uncaught (in promise) TypeError: $setup.order.publisher is undefined`

**错误位置**: `GrabOrder.vue:96`

**问题原因**: 模板中使用了 `order.publisher.name` 和 `order.publisher.avatar`，但 Mock 数据和真实 API 返回的数据结构中使用的是 `order.userName` 和 `order.userAvatar`。

## 修复内容

### 1. 修改的文件
- `src/views/GrabOrder.vue`

### 2. 数据结构对比

#### Mock 数据结构 (src/api/mock.js)
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
  tags: ['钻石', '排位', '上分']
}
```

#### 修复前的模板代码
```vue
<div class="flex items-center gap-3">
  <div class="w-10 h-10 rounded-full overflow-hidden">
    <img :alt="order.publisher.name" class="w-full h-full object-cover" :src="order.publisher.avatar" />
  </div>
  <div>
    <h3 class="font-bold text-on-surface">{{ order.publisher.name }}</h3>
    <p class="text-xs text-on-surface-variant">等级 {{ order.publisher.level }} · {{ order.publisher.gameLevel }}</p>
  </div>
</div>
```

#### 修复后的模板代码
```vue
<div class="flex items-center gap-3">
  <div class="w-10 h-10 rounded-full overflow-hidden">
    <img :alt="order.userName" class="w-full h-full object-cover" :src="order.userAvatar" />
  </div>
  <div>
    <h3 class="font-bold text-on-surface">{{ order.userName }}</h3>
    <p class="text-xs text-on-surface-variant">等级 1 · {{ order.game }}</p>
  </div>
</div>
```

### 3. 修复详情

**修改位置**: `GrabOrder.vue:96-100`

**修改内容**:
- `order.publisher.name` → `order.userName`
- `order.publisher.avatar` → `order.userAvatar`
- `order.publisher.level` → `1` (硬编码默认值)
- `order.publisher.gameLevel` → `order.game`

## API接口说明

### 获取悬赏订单详情

**接口路径**: `GET /reward-orders/:id`

**认证要求**: 需要认证

**响应数据结构**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
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
    "requirements": ["钻石以上段位", "有稳定网络"]
  },
  "msg": "获取成功"
}
```

## 测试建议

1. **功能测试**
   - 测试订单详情加载
   - 测试发布者信息显示
   - 测试抢单功能
   - 测试取消功能

2. **数据绑定测试**
   - 测试订单标题显示
   - 测试发布者头像显示
   - 测试发布者名称显示
   - 测试游戏类型显示
   - 测试悬赏金额显示

3. **异常测试**
   - 测试订单不存在情况
   - 测试网络错误处理
   - 测试权限错误处理

## 相关文件

- `src/views/GrabOrder.vue` - 抢单确认页面
- `src/api/mock.js` - Mock 数据定义
- `src/api/index.js` - API 接口定义

## 变更记录

- 2026-03-26: 初始版本，修复数据绑定错误
