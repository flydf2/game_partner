# 大神排行榜页面开发文档

## 开发概述

**路由**: `/leaderboard`
**路由名称**: `Leaderboard`
**开发日期**: 2026-03-31

## 功能实现

### 1. 类型切换 (Tab Switcher)
- **周榜 (weekly)**: 默认选中，显示本周排行数据
- **月榜 (monthly)**: 显示本月排行数据

切换 tab 时会重置列表并重新加载数据。

### 2. 游戏类型筛选 (Game Type Filter)
支持的游戏类型：
- `all` - 全部
- `honor_of_kings` - 王者荣耀
- `lol` - 英雄联盟
- `pubg` - 绝地求生
- `genshin` - 原神
- `valorant` - 无畏契约
- `csgo` - CS:GO

筛选器支持水平滚动，采用横向滚动设计。

### 3. 分页加载更多 (Pagination / Load More)
- **初始加载**: 每页 20 条数据
- **滚动加载**: 当滚动到距离底部 200px 时自动加载更多
- **手动加载**: 提供"加载更多"按钮供用户手动触发
- **状态显示**:
  - 加载中显示旋转动画
  - 数据加载完成后显示"没有更多了"提示

### 4. Top 3 展示区 (Podium Area)
排行榜前三名以特殊样式展示：
- 第 1 名: 置于中央且向上偏移，添加金色皇冠图标
- 第 2 名: 左侧展示，银色边框
- 第 3 名: 右侧展示，铜色边框

### 5. 排行列表 (Rankings List)
从第 4 名开始显示，包含以下信息：
- 排名数字
- 用户头像
- 昵称
- 游戏类型标签
- 热度分数 (火力值)
- "查看战绩"按钮

## API 调用

### API 方法
```javascript
api.fetchLeaderboard(params)
```

### 请求参数
```javascript
{
  period: 'weekly' | 'monthly',  // 排行周期
  page: Number,                   // 页码，从 1 开始
  pageSize: Number,                // 每页条数，默认 20
  game?: String                    // 游戏类型筛选（可选）
}
```

### Mock 数据支持
Mock API (`mockGetLeaderboard`) 已更新支持：
- 按游戏类型筛选
- 根据周期（周/月）生成不同的分数（月榜分数约为周榜的 4 倍）
- 分页处理

## 文件修改

### 修改的文件
1. `src/views/Leaderboard.vue` - 排行榜页面主组件
   - 添加游戏类型筛选器 UI
   - 实现分页加载逻辑
   - 修复 tab 切换数据重载问题
   - 优化列表项 key 以支持分页

2. `src/api/mock-playmates.js` - Mock 数据
   - `mockGetLeaderboard` 函数增加 `game` 和 `period` 参数支持
   - 根据 period 计算不同分数（月榜 × 4）
   - 根据 game 参数过滤数据

## 状态管理

### 组件内状态
```javascript
const tab = ref('weekly')              // 当前 tab (weekly/monthly)
const selectedGame = ref('all')       // 选中的游戏类型
const leaderboard = ref([])            // 排行数据列表
const loading = ref(false)             // 初始加载状态
const loadingMore = ref(false)          // 加载更多状态
const page = ref(1)                     // 当前页码
const pageSize = ref(20)               // 每页条数
const hasMore = ref(true)              // 是否有更多数据
const totalPages = ref(1)              // 总页数
```

### 核心函数
- `handleTabChange(newTab)` - 处理 tab 切换
- `handleGameChange(gameId)` - 处理游戏类型切换
- `loadLeaderboard(append)` - 加载排行榜数据
- `loadMore()` - 加载更多数据
- `handleScroll()` - 滚动监听触发加载

## 注意事项

1. **嵌套查询禁止**: 本次开发未使用嵌套查询
2. **文档保存**: 本文档保存在 `docs/global_leaderboard_page.md`
3. **Key 优化**: 列表项使用 `${player.id}-${page}` 作为 key，支持分页后数据正确渲染
