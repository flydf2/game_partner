# Mock数据使用报告

## 报告生成时间
2026-03-23

## 项目状态
- 项目已成功启动，运行在 http://localhost:5177/
- 当前环境使用Mock数据（VITE_USE_MOCK=true）

## Mock数据来源

### 1. 主要Mock数据文件

#### `/src/api/mock.js`
这是项目中最主要的Mock数据文件，包含了所有API接口的Mock实现。

**包含的Mock数据：**
- `mockPlaymates` - 陪玩人员数据（8条记录）
- `mockSearchSuggestions` - 搜索建议数据
- `mockGetPlaymates()` - 获取陪玩列表
- `mockGetSearchSuggestions()` - 获取搜索建议
- `mockGetExpertDetail()` - 获取专家详情
- `mockGetGames()` - 获取游戏列表
- `mockGetActivities()` - 获取活动列表
- `mockGetOrders()` - 获取订单列表
- `mockGetUserInfo()` - 获取用户信息
- `mockGetFollowing()` - 获取关注列表
- `mockGetNotifications()` - 获取通知列表
- `mockGetMessages()` - 获取消息列表
- `mockGetChatMessages()` - 获取聊天记录
- `mockGetFavorites()` - 获取收藏列表
- `mockGetBrowseHistory()` - 获取浏览历史
- `mockGetWallet()` - 获取钱包信息
- `mockGetSettings()` - 获取用户设置
- `mockLogin()` - 用户登录
- `mockRegister()` - 用户注册
- `mockUpdateProfile()` - 更新用户资料
- `mockUpdateSettings()` - 更新用户设置
- `mockRefreshToken()` - 刷新Token
- `mockSubmitReview()` - 提交评价
- `mockSubmitWithdrawal()` - 提交提现
- `mockGetWithdrawalRecords()` - 获取提现记录
- `mockUploadFile()` - 上传文件
- `mockGetCategories()` - 获取分类列表
- `mockGetRecommendations()` - 获取推荐列表
- `mockGetCommunityPosts()` - 获取社区帖子
- `mockGetGamesByCategory()` - 按分类获取游戏
- `mockGetOrderConfirmation()` - 获取订单确认信息
- `mockGetRewardOrders()` - 获取奖励订单
- `mockGrabRewardOrder()` - 抢单

#### `/src/services/mock.js`
这是另一个Mock数据文件，主要用于stores中的数据管理。

**包含的Mock数据：**
- `mockPlaymates` - 陪玩人员数据（3条记录）
- `mockUser` - 用户数据
- `mockOrders` - 订单数据（3条记录）
- `mockService` - Mock服务对象
  - `getGames()` - 获取游戏
  - `getPlaymates()` - 获取陪玩列表
  - `getPlaymateDetail()` - 获取陪玩详情
  - `searchPlaymates()` - 搜索陪玩
  - `getUserInfo()` - 获取用户信息
  - `getOrders()` - 获取订单

## Mock数据使用位置

### 2. API层使用位置

#### `/src/api/index.js`
这是主要的API接口文件，通过`USE_MOCK`环境变量控制是否使用Mock数据。

**使用方式：**
```javascript
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
```

**具体使用位置：**

| 行号 | API函数 | Mock函数 | 说明 |
|------|---------|----------|------|
| 248 | `expertApi.getExpertDetail` | `mockGetExpertDetail` | 获取专家详情 |
| 368 | `expertApi.submitReview` | `mockSubmitReview` | 提交评价 |
| 379 | `withdrawalApi.submitWithdrawal` | `mockSubmitWithdrawal` | 提交提现 |
| 387 | `withdrawalApi.getWithdrawalRecords` | `mockGetWithdrawalRecords` | 获取提现记录 |
| 424 | `userApi.getUserInfo` | `mockGetUserInfo` | 获取用户信息 |
| 439 | `userApi.login` | `mockLogin` | 用户登录 |
| 463 | `userApi.register` | `mockRegister` | 用户注册 |
| 487 | `userApi.updateProfile` | `mockUpdateProfile` | 更新用户资料 |
| 513 | `userApi.getSettings` | `mockGetSettings` | 获取用户设置 |
| 528 | `userApi.updateSettings` | `mockUpdateSettings` | 更新用户设置 |
| 571 | `userApi.refreshToken` | `mockRefreshToken` | 刷新Token |
| 590 | `userApi.getFollowing` | `mockGetFollowing` | 获取关注列表 |
| 598 | `userApi.getFavorites` | `mockGetFavorites` | 获取收藏列表 |
| 606 | `userApi.getBrowseHistory` | `mockGetBrowseHistory` | 获取浏览历史 |
| 614 | `userApi.getWallet` | `mockGetWallet` | 获取钱包信息 |
| 625 | `notificationApi.getNotifications` | `mockGetNotifications` | 获取通知列表 |
| 633 | `notificationApi.markAsRead` | `mockMarkNotificationRead` | 标记通知已读 |
| 641 | `notificationApi.markAllAsRead` | `mockMarkAllNotificationsRead` | 标记所有通知已读 |
| 652 | `messageApi.getMessages` | `mockGetMessages` | 获取消息列表 |
| 660 | `messageApi.getChatMessages` | `mockGetChatMessages` | 获取聊天记录 |
| 691 | `orderApi.getOrders` | `mockGetOrders` | 获取订单列表 |
| 760 | `gameApi.getGames` | `mockGetGames` | 获取游戏列表 |
| 786 | `activityApi.getActivities` | `mockGetActivities` | 获取活动列表 |
| 802 | `categoryApi.getCategories` | `mockGetCategories` | 获取分类列表 |
| 813 | `recommendationApi.getRecommendations` | `mockGetRecommendations` | 获取推荐列表 |
| 834 | `communityApi.getCommunityPosts` | `mockGetCommunityPosts` | 获取社区帖子 |
| 990 | `gameApi.getGamesByCategory` | `mockGetGamesByCategory` | 按分类获取游戏 |
| 1006 | `orderApi.getOrderConfirmation` | `mockGetOrderConfirmation` | 获取订单确认信息 |
| 1017 | `rewardApi.getRewardOrders` | `mockGetRewardOrders` | 获取奖励订单 |
| 1025 | `rewardApi.grabRewardOrder` | `mockGrabRewardOrder` | 抢单 |
| 1036 | `uploadApi.uploadFile` | `mockUploadFile` | 上传文件 |
| 1124 | `fetchPlaymates` | `mockGetPlaymates` | 获取陪玩列表（带分页） |
| 1159 | `searchPlaymates` | `mockGetPlaymates` | 搜索陪玩 |
| 1184 | `getSearchSuggestions` | `mockGetSearchSuggestions` | 获取搜索建议 |

### 3. Store层使用位置

#### `/src/stores/playmate.js`
```javascript
import { mockService } from '../services/mock'

// 第32行
const response = await mockService.getPlaymates(params)

// 第48行
const response = await mockService.getPlaymateDetail(id)

// 第63行
const response = await mockService.searchPlaymates(params)
```

#### `/src/stores/order.js`
```javascript
import { mockService } from '../services/mock'

// 第40行
const response = await mockService.getOrders(params)
```

## Mock数据结构

### 4. 主要Mock数据结构

#### 陪玩人员数据 (mockPlaymates)
```javascript
{
  id: '1',
  nickname: '林间小鹿',
  avatar: 'https://...',
  rating: 5.0,
  price: 45,
  likes: 128,
  tags: ['王者', '萌妹'],
  isOnline: true,
  game: 'honor_of_kings',
  rank: 'challenger',
  gender: 'female'
}
```

#### 用户数据 (mockUser)
```javascript
{
  id: '123456789',
  name: '我的账号',
  avatar: 'https://...',
  stats: {
    following: 12,
    followers: 34,
    orders: 56,
    favorites: 78
  }
}
```

#### 订单数据 (mockOrders)
```javascript
{
  id: '1001',
  playmateName: '林间小鹿',
  playmateAvatar: 'https://...',
  service: '普通陪玩',
  price: '¥45',
  hours: 2,
  total: '¥90',
  status: '已完成',
  date: '2026-03-20'
}
```

## 切换真实后端

### 5. 切换到真实后端API

要切换到真实后端API，需要修改以下配置：

1. **修改环境变量**
   在 `.env` 文件中设置：
   ```
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=https://your-real-api.com
   ```

2. **修改API配置**
   在 `/src/api/config.js` 中配置真实API地址：
   ```javascript
   export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'
   ```

3. **移除Mock依赖**
   当 `USE_MOCK` 为 `false` 时，所有API调用将自动切换到真实后端。

## 建议

### 6. 改进建议

1. **统一Mock数据来源**
   目前有两个Mock数据文件（`/src/api/mock.js` 和 `/src/services/mock.js`），建议统一到一个文件，避免数据不一致。

2. **添加Mock数据文档**
   为每个Mock API添加详细的文档说明，包括请求参数、响应格式等。

3. **实现Mock数据开关**
   在开发环境中添加UI开关，方便开发者快速切换Mock和真实数据。

4. **Mock数据持久化**
   考虑使用localStorage或IndexedDB持久化Mock数据，模拟真实的数据持久化行为。

5. **添加Mock数据生成器**
   使用faker.js等库生成更真实的Mock数据，提高开发体验。

## 总结

本项目使用了完整的Mock数据方案，涵盖了所有主要API接口。通过环境变量`VITE_USE_MOCK`可以方便地切换Mock和真实数据。建议在开发完成后，逐步替换为真实后端API，并移除Mock数据依赖。

**统计信息：**
- Mock数据文件：2个
- Mock API函数：37个
- 使用Mock的API接口：37个
- 使用Mock的Store：2个
