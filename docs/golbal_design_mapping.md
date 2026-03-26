# 设计稿与 Vue 页面映射表

| 序号 | 设计稿文件 | 页面名称 | 对应 Vue 页面 | 说明 |
|------|-----------|---------|--------------|------|
| 1 | _1/code.html | 首页 | src/views/Home.vue | 包含热门游戏、陪玩师推荐、搜索功能 |
| 2 | _2/code.html | 大神主页 | src/views/Profile.vue | 陪玩师个人主页，包含技能、评价、状态等 |
| 3 | _3/code.html | 发现/陪玩列表 | src/views/Discover.vue | 游戏陪玩师列表，支持筛选和搜索 |
| 4 | _4/code.html | 我的 | src/views/Profile.vue | 用户个人中心，包含订单、钱包等入口 |
| 5 | _5/code.html | 消息列表 | src/views/Messages.vue | 聊天消息列表，显示未读数量 |
| 6 | _6/code.html | 聊天界面 | src/views/Chat.vue | 一对一聊天界面，支持订单卡片 |
| 7 | _7/code.html | 确认订单 | src/views/ConfirmOrder.vue | 订单确认页面，显示服务详情和价格 |
| 8 | _8/code.html | 支付成功 | src/views/PaymentSuccess.vue | 支付成功后的反馈页面 |
| 9 | _9/code.html | 评价服务 | src/views/Review.vue | 服务评价页面，包含评分和标签 |
| 10 | _10/code.html | 社区动态 | src/views/Community.vue | 用户发布动态、浏览社区内容 |
| 11 | _11/code.html | 发现页筛选 | src/views/Filter.vue | 陪玩师筛选功能，支持多条件筛选 |
| 12 | _12/code.html | 订单列表 | src/views/Orders.vue | 用户订单列表，显示订单状态 |
| 13 | _13/code.html | 提现 | src/views/Withdrawal.vue | 提现申请页面 |
| 14 | _14/code.html | 帮助中心 | src/views/Help.vue | 帮助与客服页面 |
| 15 | _15/code.html | 游戏分类 | src/views/GameCategories.vue | 游戏分类列表 |
| 16 | _16/code.html | 专家认证 | src/views/ExpertVerification.vue | 陪玩师认证页面 |
| 17 | _17/code.html | 订单详情 | src/views/OrderDetail.vue | 订单详情页面 |
| 18 | _18/code.html | 创建订单 | src/views/GrabOrder.vue | 抢单页面 |
| 19 | _19/code.html | 浏览历史 | src/views/BrowseHistory.vue | 浏览记录页面 |
| 20 | _20/code.html | 专家详情 | src/views/ExpertDetail.vue | 专家/大神详情页 |
| 21 | _21/code.html | 登录 | src/views/Login.vue | 用户登录页面 |
| 22 | _22/code.html | 关注列表 | src/views/Following.vue | 关注的陪玩师列表 |
| 23 | _23/code.html | 绑定手机号 | src/views/PhoneBind.vue | 手机号绑定页面 |
| 24 | _24/code.html | 语音设置 | src/views/Settings.vue | 语音相关设置 |
| 25 | _25/code.html | 举报/投诉 | src/views/CreateAppeal.vue | 举报和投诉功能 |
| 26 | _26/code.html | 我的申诉 | src/views/Appeals.vue | 用户申诉列表 |
| 27 | _27/code.html | 申诉详情 | src/views/CreateAppeal.vue | 申诉详情和处理结果 |
| 28 | _28/code.html | 用户协议 | src/views/UserAgreement.vue | 用户协议页面 |
| 29 | _29/code.html | 隐私政策 | src/views/Privacy.vue | 隐私政策页面 |
| 30 | _30/code.html | 安全中心 | src/views/Security.vue | 账号安全设置 |
| 31 | _31/code.html | 搜索结果 | src/views/SearchResults.vue | 搜索结果页面 |
| 32 | _32/code.html | 注册 | src/views/Register.vue | 用户注册页面 |
| 33 | _33/code.html | 忘记密码 | src/views/ForgotPassword.vue | 忘记密码找回页面 |
| 34 | _34/code.html | 密码修改 | src/views/PasswordChange.vue | 密码修改页面 |
| 35 | _35/code.html | 邮箱绑定 | src/views/EmailBind.vue | 邮箱绑定页面 |
| 36 | _36/code.html | 个人资料编辑 | src/views/ProfileEdit.vue | 个人资料编辑页面 |
| 37 | _37/code.html | 我的钱包 | src/views/Wallet.vue | 钱包余额和交易记录 |
| 38 | _38/code.html | 交易明细 | src/views/Orders.vue | 交易明细列表 |
| 39 | _39/code.html | 历史战绩 | src/views/Orders.vue | 历史订单和战绩记录 |

## 设计系统规范

详细的设计系统规范请参考：`sunnyplay_gaming/DESIGN.md`

### 核心设计原则

1. **色彩系统**
   - Primary (活力黄): `#6c5a00` / `#FFD700`
   - Secondary (暖阳橙): `#8c4a00`
   - Tertiary (阳光橙): `#805100` / `#feb246`

2. **字体系统**
   - 标题: Plus Jakarta Sans
   - 正文: Be Vietnam Pro

3. **无边框原则**
   - 禁止使用 1px 实心边框
   - 通过背景色层级区分模块

4. **圆角规范**
   - 默认: 0.25rem
   - 卡片: 1.5rem - 2rem
   - 按钮: full (胶囊型)

## 组件映射说明

### 公共组件
- TopAppBar: src/components/TopAppBar.vue
- BottomNavBar: src/components/BottomNavBar.vue
- PrimaryButton: src/components/PrimaryButton.vue
- SecondaryButton: src/components/SecondaryButton.vue

### 发现页组件
- PlaymateCard: src/components/discover/PlaymateCard.vue
- PlaymateList: src/components/discover/PlaymateList.vue
- FilterPanel: src/components/discover/FilterPanel.vue
- FilterChip: src/components/discover/FilterChip.vue

### 通用组件
- Card: src/components/Card.vue
- Tag: src/components/Tag.vue
- StatusChip: src/components/StatusChip.vue
- SearchInput: src/components/SearchInput.vue

## 开发注意事项

1. 所有页面需遵循设计系统规范中的色彩、字体、圆角等要求
2. 使用 Tailwind CSS 进行样式开发
3. 保持与设计稿一致的交互反馈（active:scale-95 等）
4. 注意深色模式适配
5. 确保响应式布局在不同屏幕尺寸下的显示效果
