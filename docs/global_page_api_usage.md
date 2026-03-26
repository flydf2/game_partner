# 页面API参数使用文档

## 文档说明

本文档详细说明了GamePartner项目中各个页面使用的API接口、参数配置和调用方式。每个页面都列出了所使用的API接口、请求参数、响应数据处理方式。

## 首页 (Home.vue)

### 页面功能
- 展示游戏分类
- 展示优秀陪玩列表
- 展示特色陪玩卡片

### 使用的API接口

#### 1. 获取游戏列表
**接口**: `GET /games`
**认证要求**: 不需要认证
**调用位置**: `loadGames()` 函数

**请求参数**: 无

**响应数据处理**:
```javascript
games.value = Array.isArray(response.data?.data) ? response.data.data : []
```

**错误处理**:
```javascript
error.value.games = response.msg || '加载游戏数据失败'
```

#### 2. 获取陪玩列表
**接口**: `GET /playmates`
**认证要求**: 需要认证
**调用位置**: `loadPlaymates()` 函数

**请求参数**: 无

**响应数据处理**:
```javascript
playmates.value = Array.isArray(playmatesResponse.data?.data) 
  ? playmatesResponse.data.data.slice(0, 2).map(playmate => ({
      ...playmate,
      avatar: playmate.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'
    }))
  : []
```

**错误处理**:
```javascript
error.value.playmates = playmatesResponse.msg || '加载陪玩数据失败'
```

#### 3. 获取特色陪玩
**接口**: `GET /featured-playmate`
**认证要求**: 需要认证
**调用位置**: `loadPlaymates()` 函数

**请求参数**: 无

**响应数据处理**:
```javascript
featuredPlaymate.value = {
  ...featuredResponse.data,
  avatar: featuredResponse.data?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'
}
```

### 页面导航
- 点击游戏分类 → 跳转到 `/game-categories`
- 点击游戏 → 跳转到 `/discover?gameId={gameId}`
- 点击陪玩卡片 → 跳转到 `/expert/{id}`

## 发现页 (Discover.vue)

### 页面功能
- 搜索陪玩
- 筛选陪玩（游戏、在线、价格、段位、性别）
- 排序陪玩（综合、评分、价格、最新）
- 下拉刷新
- 无限滚动加载

### 使用的API接口

#### 1. 获取陪玩列表
**接口**: `GET /playmates`
**认证要求**: 需要认证
**调用位置**: `loadData()` 函数

**请求参数**:
```javascript
const params = {
  page: 1,
  pageSize: 20,
  sortBy: sortBy.value  // default/rating/price_asc/price_desc/newest
}

if (selectedGame.value) {
  params.game = selectedGame.value  // honor_of_kings/lol/valorant/genshin/pubg
}

const filterQuery = filterStore.getFilterQuery()
Object.assign(params, filterQuery)
```

**筛选参数**:
- `online`: 是否在线
- `priceRange`: 价格范围
- `rank`: 段位
- `gender`: 性别
- `keyword`: 关键词

**响应数据处理**: 通过 `playmateStore` 自动处理

**错误处理**:
```javascript
showError('加载数据失败，请稍后重试')
```

#### 2. 搜索陪玩
**接口**: `GET /playmates/search`
**认证要求**: 需要认证
**调用位置**: 通过路由跳转到 `/search` 页面

**请求参数**:
```javascript
router.push({ path: '/search', query: { keyword } })
```

### 页面交互
- 搜索框输入 → 跳转到搜索结果页
- 游戏筛选 → 重新加载列表
- 排序选择 → 重新加载列表
- 筛选按钮 → 跳转到筛选页 `/filter`
- 下拉刷新 → 重新加载列表
- 滚动到底部 → 加载下一页

## 个人资料页 (Profile.vue)

### 页面功能
- 显示用户信息
- 显示账户余额和优惠券
- 显示订单列表（按状态筛选）
- 显示设置菜单
- 退出登录

### 使用的API接口

#### 1. 获取用户信息
**接口**: `GET /user/info`
**认证要求**: 需要认证
**调用位置**: `loadData()` 函数

**请求参数**: 无

**响应数据处理**:
```javascript
userInfo.value = {
  avatar: response.data.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
  nickname: response.data.nickname || response.data.username || '用户',
  vipLevel: response.data.vipLevel || 0,
  id: response.data.id || '',
  balance: response.data.balance || 0,
  couponCount: response.data.couponCount || 0
}
```

**错误处理**:
```javascript
const result = handleApiError(err)
error.value = result.error
```

#### 2. 获取订单列表
**接口**: `GET /orders`
**认证要求**: 需要认证
**调用位置**: `loadOrders()` 函数

**请求参数**:
```javascript
orderApi.getOrders(activeOrderStatus.value === 'all' ? 'all' : activeOrderStatus.value)
```

**订单状态**:
- `all`: 全部订单
- `pending`: 待进行
- `ongoing`: 进行中
- `completed`: 已完成
- `cancelled`: 已取消

**响应数据处理**:
```javascript
orders.value = (response.data?.data || response.data || []).map(order => ({
  id: order.id,
  expertAvatar: order.expertAvatar || order.playmate?.avatar || 'https://via.placeholder.com/150',
  expertName: order.expertName || order.playmate?.name || '未知',
  game: order.game || order.playmate?.game || '未知',
  skill: order.skill || order.playmate?.service || '未知服务',
  status: order.status,
  statusText: getStatusText(order.status),
  serviceTime: formatServiceTime(order.serviceTime || order.createdAt),
  amount: order.amount || order.price || 0
}))
```

**错误处理**:
```javascript
const result = handleApiError(err)
orderError.value = result.error
```

#### 3. 退出登录
**接口**: `POST /auth/logout`
**认证要求**: 需要认证
**调用位置**: `handleLogout()` 函数

**请求参数**: 无

**响应处理**:
```javascript
await userStore.logout()
showToast('退出登录成功', 'success')
router.push('/login')
```

### 页面导航
- 点击订单 → 跳转到 `/order/{orderId}`
- 点击编辑资料 → 跳转到 `/profile/edit`
- 点击我的钱包 → 跳转到 `/wallet`
- 点击我的收藏 → 跳转到 `/favorites`
- 点击关注列表 → 跳转到 `/following`
- 点击浏览历史 → 跳转到 `/browse-history`
- 点击我的技能 → 跳转到 `/skills`
- 点击账号安全 → 跳转到 `/security`
- 点击隐私设置 → 跳转到 `/privacy`
- 点击大神认证 → 跳转到 `/expert-certification`
- 点击收益提现 → 跳转到 `/withdrawal`
- 点击申诉记录 → 跳转到 `/appeals`
- 点击用户协议 → 跳转到 `/user-agreement`
- 点击帮助与客服 → 跳转到 `/help`
- 点击通用设置 → 跳转到 `/settings`

## 专家详情页 (ExpertDetail.vue)

### 页面功能
- 显示专家详细信息
- 显示统计数据
- 显示技能列表
- 显示评价列表
- 关注/取消关注专家

### 使用的API接口

#### 1. 获取专家详情
**接口**: `GET /experts/{expertId}`
**认证要求**: 需要认证
**调用位置**: `loadExpertData()` 函数

**路径参数**:
```javascript
const expertId = route.params.id
```

**请求参数**: 无

**响应数据处理**:
```javascript
expertData.value = response.data
```

**错误处理**:
```javascript
error.value = '加载专家详情失败'
```

#### 2. 关注专家
**接口**: `POST /experts/{expertId}/follow`
**认证要求**: 需要认证
**调用位置**: `handleFollow()` 函数

**路径参数**:
```javascript
const expertId = route.params.id
```

**请求参数**: 无

**响应处理**:
```javascript
showToast('关注成功', 'success')
expertData.value.isFollowed = true
```

#### 3. 取消关注专家
**接口**: `DELETE /experts/{expertId}/follow`
**认证要求**: 需要认证
**调用位置**: `handleUnfollow()` 函数

**路径参数**:
```javascript
const expertId = route.params.id
```

**请求参数**: 无

**响应处理**:
```javascript
showToast('取消关注成功', 'success')
expertData.value.isFollowed = false
```

#### 4. 获取专家评价
**接口**: `GET /experts/{expertId}/reviews`
**认证要求**: 需要认证
**调用位置**: `loadReviews()` 函数

**路径参数**:
```javascript
const expertId = route.params.id
```

**请求参数**:
```javascript
{
  page: 1,
  pageSize: 10
}
```

**响应数据处理**:
```javascript
reviews.value = response.data.reviews || []
pagination.value = response.data.pagination || {}
```

#### 5. 获取专家语音
**接口**: `GET /experts/{expertId}/voice`
**认证要求**: 需要认证
**调用位置**: `loadVoice()` 函数

**路径参数**:
```javascript
const expertId = route.params.id
```

**请求参数**: 无

**响应数据处理**:
```javascript
voiceData.value = response.data
```

### 页面交互
- 点击关注按钮 → 调用关注API
- 点击取消关注按钮 → 调用取消关注API
- 点击评价 → 显示评价详情
- 点击语音 → 播放语音
- 点击立即下单 → 跳转到 `/confirm-order?expertId={expertId}`

## 订单页 (Orders.vue)

### 页面功能
- 显示订单列表
- 按状态筛选订单
- 查看订单详情

### 使用的API接口

#### 1. 获取订单列表
**接口**: `GET /orders`
**认证要求**: 需要认证
**调用位置**: `loadOrders()` 函数

**请求参数**:
```javascript
orderApi.getOrders(activeTab.value === 'all' ? 'all' : activeTab.value)
```

**订单状态**:
- `all`: 全部订单
- `pending`: 待确认
- `ongoing`: 进行中
- `completed`: 已完成
- `cancelled`: 已取消

**响应数据处理**:
```javascript
orders.value = (response.data?.data || response.data || []).map(order => ({
  id: order.id,
  status: order.status,
  statusText: getStatusText(order.status),
  statusClass: getStatusClass(order.status),
  playmate: {
    name: order.expertName || order.playmate?.name || '未知',
    game: order.game || order.playmate?.game || '未知',
    service: order.skill || order.playmate?.service || '未知服务',
    avatar: order.expertAvatar || order.playmate?.avatar || 'https://via.placeholder.com/150'
  },
  time: formatTime(order.serviceTime || order.createdAt),
  duration: getDurationText(order.status),
  price: order.amount || order.price || 0
}))
```

**错误处理**:
```javascript
const result = handleApiError(err)
error.value = result.error
```

### 页面交互
- 点击订单 → 跳转到 `/order/{orderId}`
- 切换标签页 → 重新加载对应状态的订单

## 确认订单页 (ConfirmOrder.vue)

### 页面功能
- 显示订单详情
- 选择服务时长
- 选择服务时间
- 选择优惠券
- 计算订单金额
- 提交订单

### 使用的API接口

#### 1. 获取专家详情
**接口**: `GET /experts/{expertId}`
**认证要求**: 需要认证
**调用位置**: `loadExpertDetail()` 函数

**路径参数**:
```javascript
const expertId = route.query.expertId || '1'
```

**请求参数**: 无

**响应数据处理**:
```javascript
expert.value = response.data
```

**错误处理**:
```javascript
console.error('加载大神详情失败:', error)
```

#### 2. 创建订单
**接口**: `POST /orders`
**认证要求**: 需要认证
**调用位置**: `handlePay()` 函数

**请求参数**:
```javascript
{
  expertId: expertId.value,
  serviceTime: `${serviceDate.value} ${serviceTime.value}`,
  duration: serviceDuration.value,
  couponId: selectedCoupon.value?.id,
  remarks: remarks.value
}
```

**响应处理**:
```javascript
router.push({
  path: '/payment-success',
  query: {
    expertId: expertId.value,
    amount: totalAmount.value
  }
})
```

### 页面计算
- 服务费用: `expert.price * serviceDuration`
- 平台费用: 固定 5 元
- 优惠券折扣: 根据选择的优惠券计算
- 总金额: `服务费用 + 平台费用 - 优惠券折扣`

### 页面交互
- 选择服务时长 → 重新计算金额
- 选择服务时间 → 更新服务时间
- 选择优惠券 → 重新计算金额
- 点击支付 → 提交订单并跳转到支付成功页

## 搜索结果页 (SearchResults.vue)

### 页面功能
- 显示搜索结果
- 筛选搜索结果
- 排序搜索结果
- 显示搜索建议

### 使用的API接口

#### 1. 搜索陪玩
**接口**: `GET /playmates/search`
**认证要求**: 需要认证
**调用位置**: `handleSearch()` 函数

**请求参数**:
```javascript
const params = {
  keyword: searchKeyword.value,
  online: selectedFilter.value === 'online' ? true : undefined,
  sortBy: sortBy.value
}
```

**筛选选项**:
- `all`: 全部
- `online`: 在线
- `price`: 价格
- `rank`: 段位
- `gender`: 性别

**排序选项**:
- `recommend`: 综合推荐
- `price_asc`: 价格从低到高
- `price_desc`: 价格从高到低
- `rating`: 评分最高
- `orders`: 接单最多

**响应数据处理**: 通过 `playmateStore` 自动处理

#### 2. 获取搜索建议
**接口**: `GET /playmates/suggestions`
**认证要求**: 需要认证
**调用位置**: `handleInput()` 函数

**请求参数**:
```javascript
{
  keyword: value
}
```

**响应数据处理**:
```javascript
suggestions.value = await getSearchSuggestions(value)
showSuggestions.value = suggestions.value.length > 0
```

### 页面交互
- 输入关键词 → 显示搜索建议
- 选择建议 → 执行搜索
- 点击筛选 → 重新搜索
- 点击排序 → 重新搜索
- 点击陪玩卡片 → 跳转到 `/expert/{id}`

## 登录页 (Login.vue)

### 页面功能
- 用户名密码登录
- 手机验证码登录
- 忘记密码
- 注册账号

### 使用的API接口

#### 1. 用户登录
**接口**: `POST /auth/login`
**认证要求**: 不需要认证
**调用位置**: `handleLogin()` 函数

**请求参数**:
```javascript
{
  username: username.value,
  password: password.value
}
```

**响应处理**:
```javascript
if (response.success && response.data.token) {
  localStorage.setItem('token', response.data.token)
  showToast('登录成功', 'success')
  router.push('/')
}
```

**错误处理**:
```javascript
showToast(response.message || '登录失败，请检查用户名和密码', 'error')
```

#### 2. 发送短信验证码
**接口**: `POST /auth/send-code`
**认证要求**: 不需要认证
**调用位置**: `handleSendCode()` 函数

**请求参数**:
```javascript
{
  phone: phone.value
}
```

**响应处理**:
```javascript
showToast('验证码发送成功', 'success')
startCountdown()
```

**错误处理**:
```javascript
showToast(response.message || '验证码发送失败', 'error')
```

### 页面导航
- 点击忘记密码 → 跳转到 `/forgot-password`
- 点击注册账号 → 跳转到 `/register`

## 注册页 (Register.vue)

### 页面功能
- 用户名注册
- 手机验证码注册
- 设置密码
- 同意用户协议

### 使用的API接口

#### 1. 用户注册
**接口**: `POST /auth/register`
**认证要求**: 不需要认证
**调用位置**: `handleRegister()` 函数

**请求参数**:
```javascript
{
  username: username.value,
  password: password.value,
  phone: phone.value,
  code: code.value,
  nickname: nickname.value
}
```

**响应处理**:
```javascript
if (response.success && response.data.token) {
  localStorage.setItem('token', response.data.token)
  showToast('注册成功', 'success')
  router.push('/')
}
```

**错误处理**:
```javascript
showToast(response.message || '注册失败，请重试', 'error')
```

#### 2. 发送短信验证码
**接口**: `POST /auth/send-code`
**认证要求**: 不需要认证
**调用位置**: `handleSendCode()` 函数

**请求参数**:
```javascript
{
  phone: phone.value
}
```

**响应处理**:
```javascript
showToast('验证码发送成功', 'success')
startCountdown()
```

**错误处理**:
```javascript
showToast(response.message || '验证码发送失败', 'error')
```

### 页面导航
- 点击登录 → 跳转到 `/login`
- 点击用户协议 → 跳转到 `/user-agreement`

## 通知页 (Notifications.vue)

### 页面功能
- 显示通知列表
- 标记通知为已读
- 标记所有通知为已读

### 使用的API接口

#### 1. 获取通知列表
**接口**: `GET /notifications`
**认证要求**: 需要认证
**调用位置**: `loadNotifications()` 函数

**请求参数**: 无

**响应数据处理**:
```javascript
notifications.value = response.data || []
```

**错误处理**:
```javascript
error.value = '加载通知失败'
```

#### 2. 标记通知为已读
**接口**: `PUT /notifications/{id}/read`
**认证要求**: 需要认证
**调用位置**: `markAsRead()` 函数

**路径参数**:
```javascript
const notificationId = notification.id
```

**请求参数**: 无

**响应处理**:
```javascript
notification.isRead = true
```

#### 3. 标记所有通知为已读
**接口**: `PUT /notifications/read-all`
**认证要求**: 需要认证
**调用位置**: `markAllAsRead()` 函数

**请求参数**: 无

**响应处理**:
```javascript
notifications.value.forEach(notification => {
  notification.isRead = true
})
showToast('已全部标记为已读', 'success')
```

## 消息页 (Messages.vue)

### 页面功能
- 显示会话列表
- 显示消息列表
- 显示聊天记录
- 发送消息
- 归档会话
- 标记消息为已读

### 使用的API接口

#### 1. 获取会话列表
**接口**: `GET /conversations`
**认证要求**: 需要认证
**调用位置**: `loadConversations()` 函数

**请求参数**: 无

**响应数据处理**:
```javascript
conversations.value = response.data || []
```

**错误处理**:
```javascript
error.value = '加载会话失败'
```

#### 2. 归档会话
**接口**: `PUT /conversations/{id}/archive`
**认证要求**: 需要认证
**调用位置**: `archiveConversation()` 函数

**路径参数**:
```javascript
const conversationId = conversation.id
```

**请求参数**: 无

**响应处理**:
```javascript
showToast('归档成功', 'success')
```

#### 3. 标记会话为已读
**接口**: `PUT /conversations/{userId}/read`
**认证要求**: 需要认证
**调用位置**: `markConversationAsRead()` 函数

**路径参数**:
```javascript
const userId = conversation.userId
```

**请求参数**: 无

**响应处理**:
```javascript
conversation.unreadCount = 0
```

#### 4. 获取消息列表
**接口**: `GET /messages`
**认证要求**: 需要认证
**调用位置**: `loadMessages()` 函数

**请求参数**:
```javascript
{
  type: 'text',
  status: 'unread',
  page: 1,
  pageSize: 20
}
```

**响应数据处理**:
```javascript
messages.value = response.data || []
pagination.value = response.pagination || {}
```

**错误处理**:
```javascript
error.value = '加载消息失败'
```

#### 5. 获取聊天记录
**接口**: `GET /messages/chat/{userId}`
**认证要求**: 需要认证
**调用位置**: `loadChatMessages()` 函数

**路径参数**:
```javascript
const userId = selectedChat.value.userId
```

**请求参数**: 无

**响应数据处理**:
```javascript
chatMessages.value = response.data || []
```

#### 6. 发送消息
**接口**: `POST /messages/chat/{userId}`
**认证要求**: 需要认证
**调用位置**: `sendMessage()` 函数

**路径参数**:
```javascript
const userId = selectedChat.value.userId
```

**请求参数**:
```javascript
{
  content: messageContent.value,
  type: 'text'
}
```

**响应处理**:
```javascript
chatMessages.value.push(response.data)
messageContent.value = ''
```

#### 7. 标记消息为已读
**接口**: `PUT /messages/{id}/read`
**认证要求**: 需要认证
**调用位置**: `markMessageAsRead()` 函数

**路径参数**:
```javascript
const messageId = message.id
```

**请求参数**: 无

**响应处理**:
```javascript
message.status = 'read'
```

### 页面交互
- 点击会话 → 显示聊天记录
- 发送消息 → 调用发送API并更新聊天记录
- 归档会话 → 调用归档API并移除会话
- 标记已读 → 更新消息状态

## 钱包页 (Wallet.vue)

### 页面功能
- 显示余额信息
- 显示交易记录
- 提现功能

### 使用的API接口

#### 1. 获取钱包信息
**接口**: `GET /user/wallet`
**认证要求**: 需要认证
**调用位置**: `loadWallet()` 函数

**请求参数**: 无

**响应数据处理**:
```javascript
wallet.value = response.data
```

**错误处理**:
```javascript
error.value = '加载钱包信息失败'
```

#### 2. 提交提现申请
**接口**: `POST /withdrawals`
**认证要求**: 需要认证
**调用位置**: `handleWithdrawal()` 函数

**请求参数**:
```javascript
{
  amount: amount.value,
  bankName: bankName.value,
  bankAccount: bankAccount.value,
  accountName: accountName.value
}
```

**响应处理**:
```javascript
showToast('提现申请提交成功', 'success')
loadWallet()
```

**错误处理**:
```javascript
showToast(response.message || '提现申请提交失败', 'error')
```

## 评价页 (Review.vue)

### 页面功能
- 显示评价表单
- 上传评价图片
- 提交评价

### 使用的API接口

#### 1. 提交评价
**接口**: `POST /reviews`
**认证要求**: 需要认证
**调用位置**: `handleSubmitReview()` 函数

**请求参数**:
```javascript
{
  orderId: orderId.value,
  rating: rating.value,
  content: content.value,
  images: images.value
}
```

**响应处理**:
```javascript
showToast('评价提交成功', 'success')
router.push('/orders')
```

**错误处理**:
```javascript
showToast(response.message || '评价提交失败', 'error')
```

## 通用说明

### 认证处理
所有需要认证的接口都会自动在请求头中添加 `Authorization: Bearer {token}`，token从localStorage中获取。

### 错误处理
所有API调用都包含错误处理逻辑，使用 `handleApiError` 函数统一处理错误。

### 数据缓存
部分数据使用缓存机制，如用户信息、游戏列表等，缓存时间根据数据更新频率设置。

### 加载状态
所有页面都包含加载状态显示，提升用户体验。

### 分页处理
列表类页面都支持分页加载，使用 `page` 和 `pageSize` 参数控制。

### 参数验证
所有请求参数都经过验证，确保数据格式正确。

## 更新记录

- 2026-03-25: 初始版本，包含所有主要页面的API使用说明
