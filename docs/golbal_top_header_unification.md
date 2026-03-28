# 顶部菜单统一方案

## 实施日期
2026-03-28

## 概述
统一所有页面的顶部导航菜单，分为两种风格以适配不同页面类型的需求。

## 实现方案

### 1. 组件架构

#### ListPageHeader.vue
**位置**: `src/components/ListPageHeader.vue`

**使用场景**: 列表/频道页面
- 首页
- 发现页
- 悬赏广场
- 社区首页
- 排行榜
- 我的抢单
- 订单列表

**功能特性**:
- 菜单按钮（可选）
- 标题（黄色主题色）
- 通知按钮（带未读数徽章）
- 搜索按钮
- 用户头像
- 底部分割线

**Props**:
```typescript
{
  title: String,        // 标题文字
  showMenu: Boolean,    // 是否显示菜单按钮
  showNotifications: Boolean,  // 是否显示通知按钮
  showSearch: Boolean,  // 是否显示搜索按钮
  showAvatar: Boolean,  // 是否显示用户头像
  unreadCount: Number,  // 未读通知数量
  avatarUrl: String     // 用户头像URL
}
```

**Emits**:
- `menu`: 点击菜单按钮
- `notifications`: 点击通知按钮
- `search`: 点击搜索按钮
- `profile`: 点击用户头像

---

#### DetailPageHeader.vue
**位置**: `src/components/DetailPageHeader.vue`

**使用场景**: 详情/子页面
- 订单详情
- 帖子详情
- 大神主页
- 抢单页面
- 个人中心
- 所有二级页面

**功能特性**:
- 返回按钮（可选）
- 标题（主题色）
- 分享按钮（可选）
- 更多菜单（可选）
- 帮助按钮（可选）
- 底部分割线

**Props**:
```typescript
{
  title: String,        // 标题文字（必填）
  showBack: Boolean,    // 是否显示返回按钮
  showShare: Boolean,   // 是否显示分享按钮
  showMore: Boolean,    // 是否显示更多按钮
  showHelp: Boolean     // 是否显示帮助按钮
}
```

**Emits**:
- `back`: 点击返回按钮
- `share`: 点击分享按钮
- `more`: 点击更多按钮
- `help`: 点击帮助按钮

---

### 2. 路由配置

**文件**: `src/router/index.js`

**新增元信息**: `headerType`

**配置规则**:
```javascript
{
  path: '/example',
  name: 'Example',
  component: () => import('../views/Example.vue'),
  meta: {
    title: '示例页面',
    headerType: 'list'  // 'list' 或 'detail'
  }
}
```

**列表页 (headerType: 'list')**:
- `/` - 首页（底部导航）
- `/discover` - 发现（底部导航）
- `/messages` - 消息（底部导航）
- `/community` - 社区（底部导航）
- `/orders` - 订单（底部导航）
- `/profile` - 我的（底部导航）
- `/search` - 搜索
- `/leaderboard` - 排行榜
- `/filter` - 筛选
- `/game-categories` - 游戏分类
- `/community-feed` - 社区动态
- `/notifications` - 通知
- `/reward` - 悬赏广场
- `/my-grab-orders` - 我的抢单

**详情页 (headerType: 'detail')**:
- `/reward/:id` - 悬赏详情
- `/reward/:id/confirm` - 确认订单
- `/reward/:id/payment` - 支付托管金
- `/reward/:id/review` - 评价服务
- `/reward/:id/status` - 抢单状态
- `/reward/publish` - 发布悬赏
- `/grab-order/:id` - 抢单确认
- `/grab-order/:id/success` - 抢单成功
- `/grab-order/:id/detail` - 抢单详情
- `/order/:id` - 订单详情
- `/confirm-order` - 确认订单
- `/payment-success` - 支付成功
- `/review-service/:orderId` - 评价服务
- `/expert/:id` - 大神详情
- `/expert-certification` - 大神认证
- `/expert-certification/upload` - 上传截图
- `/expert-certification/voice` - 录制语音
- `/expert-verification` - 大神认证
- `/profile` - 个人中心
- `/profile/edit` - 编辑资料
- `/profile/level` - 我的段位
- `/profile/skills` - 我的技能
- `/profile/wallet` - 我的钱包
- `/profile/recharge` - 立即充值
- `/withdrawal` - 收益提现
- `/profile/favorites` - 我的收藏
- `/profile/following` - 我的关注
- `/profile/history` - 浏览历史
- `/profile/security` - 账号安全
- `/profile/security/password` - 修改密码
- `/profile/security/phone` - 手机绑定
- `/profile/security/email` - 邮箱绑定
- `/profile/privacy` - 隐私设置
- `/profile/settings` - 设置
- `/profile/help` - 帮助与客服
- `/appeals` - 我的申诉
- `/order-settings` - 接单设置中心
- `/user-agreement` - 用户服务协议
- `/about-us` - 关于我们
- `/feedback` - 意见反馈
- `/login` - 登录
- `/register` - 注册
- `/forgot-password` - 忘记密码
- `/post/:id` - 帖子详情
- `/topic/:id` - 话题详情
- `/leaderboard/:id` - 排行详情
- `/match-history` - 历史战绩

---

### 3. 页面替换指南

#### 列表页替换示例

**原始代码** (Discover.vue):
```vue
<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-sm shadow-yellow-500/5 flex justify-between items-center px-6 py-4">
      <div class="flex items-center gap-4">
        <span class="material-symbols-outlined text-yellow-600 dark:text-yellow-400 active:scale-95 duration-200 ease-out cursor-pointer" @click="goToMenu">menu</span>
        <h1 class="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-yellow-600 dark:text-yellow-400">发现大神</h1>
      </div>
      <div class="flex items-center gap-4">
        <span class="material-symbols-outlined text-zinc-500 relative cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform" @click="goToNotifications">
          notifications
          <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-primary text-on-primary rounded-full flex items-center justify-center text-[8px] font-bold">
            {{ unreadCount }}
          </span>
        </span>
        <span class="material-symbols-outlined text-zinc-500 cursor-pointer" @click="goToSearch">search</span>
        <div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden cursor-pointer active:scale-95 transition-transform" @click="goToProfile">
          <img alt="User Avatar" class="w-full h-full object-cover" src="..." />
        </div>
      </div>
      <div class="absolute bottom-0 left-0 bg-zinc-100 dark:bg-zinc-800 h-[1px] w-full self-end opacity-20"></div>
    </header>
    ...
  </div>
</template>
```

**替换后代码**:
```vue
<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <ListPageHeader
      title="发现大神"
      :unread-count="unreadCount"
      @menu="goToMenu"
      @notifications="goToNotifications"
      @search="goToSearch"
      @profile="goToProfile"
    />
    ...
  </div>
</template>

<script setup>
import ListPageHeader from '../components/ListPageHeader.vue'
</script>
```

---

#### 底部导航共用顶部风格

底部导航的六个主要页面（首页、发现、消息、社区、订单、我的）共用首页的顶部导航风格（list 类型），确保导航体验的一致性。

**底部导航页面列表**:
1. `/` - 首页
2. `/discover` - 发现
3. `/messages` - 消息
4. `/community` - 社区
5. `/orders` - 订单
6. `/profile` - 我的

这些页面都配置了 `headerType: 'list'`，使用 ListPageHeader 组件。

---

#### 详情页替换示例

**原始代码** (RewardOrderDetail.vue):
```vue
<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16 border-b border-outline-variant/20">
      <div class="flex items-center gap-4">
        <span @click="handleCancel" class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform">
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">悬赏详情</h1>
      </div>
      <div class="w-6"></div>
    </header>
    ...
  </div>
</template>
```

**替换后代码**:
```vue
<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <DetailPageHeader
      title="悬赏详情"
      @back="handleCancel"
    />
    ...
  </div>
</template>

<script setup>
import DetailPageHeader from '../components/DetailPageHeader.vue'
</script>
```

---

### 4. 视觉规范

#### 列表页风格
- **背景**: `bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl`
- **阴影**: `shadow-sm shadow-yellow-500/5`
- **主色调**: `text-yellow-600 dark:text-yellow-400`
- **高度**: `py-4` (约 56px)
- **间距**: `px-6`

#### 详情页风格
- **背景**: `bg-surface`
- **边框**: `border-b border-outline-variant/20`
- **主色调**: `text-primary`
- **高度**: `h-16` (64px)
- **间距**: `px-5`

---

### 5. 后续工作

#### 需要手动替换的页面

**列表页 (10个)**:
1. ✅ Home.vue - 首页
2. ✅ Discover.vue - 发现
3. ✅ RewardSquare.vue - 悬赏广场
4. ✅ Community.vue - 社区
5. ✅ Leaderboard.vue - 排行榜
6. ✅ MyGrabOrders.vue - 我的抢单
7. ✅ Orders.vue - 订单列表
8. ⏳ SearchResults.vue - 搜索结果
9. ⏳ Notifications.vue - 通知
10. ⏳ Messages.vue - 消息

**详情页 (40+个)**:
1. ✅ RewardOrderDetail.vue - 悬赏详情
2. ✅ PostDetail.vue - 帖子详情
3. ✅ ExpertDetail.vue - 大神主页
4. ✅ GrabOrder.vue - 抢单页面
5. ✅ Profile.vue - 个人中心
6. ⏳ RewardOrderConfirm.vue - 确认订单
7. ⏳ RewardOrderPayment.vue - 支付托管金
8. ⏳ RewardOrderReview.vue - 评价服务
9. ⏳ RewardOrderStatus.vue - 抢单状态
10. ⏳ RewardOrderPublish.vue - 发布悬赏
11. ⏳ GrabOrderSuccess.vue - 抢单成功
12. ⏳ GrabOrderDetail.vue - 抢单详情
13. ⏳ OrderDetail.vue - 订单详情
14. ⏳ ConfirmOrder.vue - 确认订单
15. ⏳ PaymentSuccess.vue - 支付成功
16. ⏳ ReviewService.vue - 评价服务
17. ⏳ ExpertCertification.vue - 大神认证
18. ⏳ ExpertCertificationUpload.vue - 上传截图
19. ⏳ ExpertCertificationVoice.vue - 录制语音
20. ⏳ ExpertVerification.vue - 大神认证
21. ⏳ ProfileEdit.vue - 编辑资料
22. ⏳ ProfileLevel.vue - 我的段位
23. ⏳ ProfileSkills.vue - 我的技能
24. ⏳ ProfileWallet.vue - 我的钱包
25. ⏳ ProfileRecharge.vue - 立即充值
26. ⏳ Withdrawal.vue - 收益提现
27. ⏳ ProfileFavorites.vue - 我的收藏
28. ⏳ ProfileFollowing.vue - 我的关注
29. ⏳ ProfileHistory.vue - 浏览历史
30. ⏳ ProfileSecurity.vue - 账号安全
31. ⏳ PasswordChange.vue - 修改密码
32. ⏳ PhoneBind.vue - 手机绑定
33. ⏳ EmailBind.vue - 邮箱绑定
34. ⏳ ProfilePrivacy.vue - 隐私设置
35. ⏳ ProfileSettings.vue - 设置
36. ⏳ ProfileHelp.vue - 帮助与客服
37. ⏳ Appeals.vue - 我的申诉
38. ⏳ OrderSettings.vue - 接单设置中心
39. ⏳ UserAgreement.vue - 用户服务协议
40. ⏳ AboutUs.vue - 关于我们
41. ⏳ Feedback.vue - 意见反馈
42. ⏳ TopicDetail.vue - 话题详情
43. ⏳ LeaderboardDetail.vue - 排行详情
44. ⏳ MatchHistory.vue - 历史战绩
45. ⏳ Chat.vue - 聊天
46. ⏳ CreatePost.vue - 发布动态
47. ⏳ Filter.vue - 筛选
48. ⏳ GameCategories.vue - 游戏分类
49. ⏳ CommunityFeed.vue - 社区动态
50. ⏳ NotFound.vue - 404页面

---

### 6. 优势

1. **一致性**: 同类页面使用相同风格，降低用户学习成本
2. **功能性**: 列表页强调发现和导航，详情页强调操作和返回
3. **性能**: 组件复用减少代码重复，提升维护性
4. **可扩展**: 通过 props 灵活控制显示元素
5. **主题适配**: 完美支持深色模式

---

### 7. 注意事项

1. 所有页面需要在路由配置中添加 `headerType` 元信息
2. 列表页的 `title` 从路由 `meta.title` 获取
3. 详情页的 `title` 从路由 `meta.title` 获取
4. 通知按钮的未读数通过 `unreadCount` prop 传递
5. 用户头像 URL 通过 `avatarUrl` prop 传递
6. 详情页的返回、分享、更多、帮助按钮根据业务需求选择性显示

---

### 8. 测试建议

1. **视觉测试**:
   - 检查列表页黄色主题色是否统一
   - 检查详情页主题色是否统一
   - 检查底部分割线是否显示
   - 检查深色模式适配

2. **功能测试**:
   - 测试菜单按钮跳转
   - 测试通知按钮跳转
   - 测试搜索按钮跳转
   - 测试用户头像跳转
   - 测试返回按钮
   - 测试分享按钮
   - 测试更多按钮
   - 测试帮助按钮

3. **响应式测试**:
   - 检查移动端显示
   - 检查平板端显示
   - 检查横屏显示

---

### 9. 版本历史

- **v1.0** (2026-03-28): 初始版本，完成组件创建和路由配置
