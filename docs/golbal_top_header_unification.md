# 顶部导航优化记录

## 实施日期
2026-04-02

## 概述
本次优化对所有页面顶部导航进行了一致性调整，解决了之前存在的 `pt-20`、`pt-24`、`pt-16` 等不统一的 padding 值问题。

## 修改内容

### 1. AppHeader.vue 组件优化

**文件**: `src/components/AppHeader.vue`

**修改点**:
- 统一 header 高度：主页面 `h-16 sm:h-20`，详情页 `h-14 sm:h-16`
- 优化按钮点击区域：添加 `p-1` 或 `p-2` 的点击 padding
- 优化未读消息徽章：调整位置和显示（超过 9 显示 9+）
- 优化背景样式：使用 `bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl`
- 移除冗余的 `py-3 sm:py-4` 内边距，改为通过 headerClass 控制
- 移除无用的 CSS 变量 `--header-height`

### 2. 全局样式优化

**文件**: `src/style.css`

**修改点**:
- 移除 `:root` 中的 `--header-height` 和 `--header-padding-top` 变量
- 统一 `.page-content` 样式：
  - 移动端：`padding: 72px 16px 100px`
  - 桌面端：`padding: 88px 20px 120px`
- 确保所有页面使用统一的 `page-content` class

### 3. 页面 padding 修复

| 页面 | 原 padding | 新 padding |
|------|-----------|-----------|
| Home.vue | `pt-24` | `pt-20` |
| Discover.vue | `pt-20` | `pt-20` (统一 pb-24) |
| Community.vue | `pt-24` | `pt-20` |
| RewardSquare.vue | `pt-20 sm:pt-24` | `pt-20` |
| Profile.vue | 动态计算 | 使用 page-content |
| OrderDetail.vue | `pt-16` + `pt-24` | 使用 page-content |
| ExpertDetail.vue | `pt-16` | `pt-20` |
| Notifications.vue | `pt-4` | `pt-20` |

### 4. Profile.vue 简化

**移除内容**:
- 删除动态计算 padding 的 `setContentPadding` 函数
- 删除 `nextTick` 导入
- 简化 onMounted 钩子

**原因**: 使用全局统一的 `page-content` class 后，不再需要动态计算

## 技术规范

### AppHeader Props
```typescript
{
  title: String,           // 标题文字，默认 '阳光陪玩'
  showBack: Boolean,      // 是否显示返回按钮，默认 true
  showMenu: Boolean,      // 是否显示菜单按钮，默认 false
  showNotifications: Boolean, // 是否显示通知按钮，默认 true
  showSearch: Boolean,    // 是否显示搜索按钮，默认 true
  showAvatar: Boolean,     // 是否显示用户头像，默认 true
  unreadCount: Number,    // 未读通知数量，默认 0
  avatarUrl: String,      // 用户头像 URL
  isPrimaryPage: Boolean   // 是否为主页面（黄色主题），默认 false
}
```

### AppHeader Emits
- `back`: 点击返回按钮
- `menu`: 点击菜单按钮
- `notifications`: 点击通知按钮
- `search`: 点击搜索按钮
- `profile`: 点击用户头像

### 全局 page-content 样式
```css
.page-content {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding: 72px 16px 100px;  /* 移动端 */
}

@media (min-width: 640px) {
  .page-content {
    padding: 88px 20px 120px;  /* 桌面端 */
  }
}
```

## 视觉效果

### 主页面（isPrimaryPage: true）
- 背景：白色半透明 + 模糊效果
- 主题色：黄色 `#f59e0b`（黄色主题）
- 阴影：微弱黄色阴影
- 高度：64px（移动）/ 80px（桌面）

### 详情页（isPrimaryPage: false）
- 背景：surface 颜色
- 主题色：primary 颜色
- 边框：底部细线分隔
- 高度：56px（移动）/ 64px（桌面）

## 后续工作

### 已验证页面（31 个使用 AppHeader）
1. ✅ Home.vue
2. ✅ Discover.vue
3. ✅ Community.vue
4. ✅ RewardSquare.vue
5. ✅ Profile.vue
6. ✅ OrderDetail.vue
7. ✅ ExpertDetail.vue
8. ✅ Notifications.vue
9. ⏳ 其他页面...

### 需要检查的页面
- 所有详情页的 padding 是否正确
- BottomNavBar 页面是否有正确使用 page-content
- 特殊布局页面是否需要单独处理

## 版本历史
- **v1.0** (2026-04-02): 初始优化，完成 AppHeader 组件和全局样式统一
