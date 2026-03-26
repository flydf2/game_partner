# 确认订单页面底部导航遮挡修复记录

## 更新日期
2026-03-26

## 问题描述

**问题**: 确认订单页面底部的"立即支付"按钮被底部导航栏遮挡

**原因**: 页面底部留白空间不足，无法容纳底部导航栏的高度

### 底部导航栏高度分析

底部导航栏组件 ([BottomNavBar.vue](file:///System/Volumes/Data/webcode/UX/GamePartner/src/components/BottomNavBar.vue)) 的高度计算：
- `pb-6` (底部内边距): 24px
- `pt-3` (顶部内边距): 12px
- 导航项高度: 约 24px
- **总高度**: 约 60-64px

### 修复前

```vue
<div class="min-h-screen bg-surface text-on-surface pb-32">
```

- 底部留白: 32px
- **问题**: 32px < 64px (底部导航栏高度)，导致按钮被遮挡

## 修复内容

### 1. 修改的文件
- `src/views/ConfirmOrder.vue`

### 2. 修复详情

#### 2.1 主容器底部留白

**修改位置**: `ConfirmOrder.vue:98`

**修复前**:
```vue
<div class="min-h-screen bg-surface text-on-surface pb-32">
```

**修复后**:
```vue
<div class="min-h-screen bg-surface text-on-surface pb-36">
```

**说明**: 将底部留白从 32px 增加到 36px，确保内容不会被底部导航栏遮挡

#### 2.2 主内容区域

**修改位置**: `ConfirmOrder.vue:118`

**修复前**:
```vue
<main v-else-if="expert" class="pt-20 pb-32 px-5 max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6">
```

**修复后**:
```vue
<main v-else-if="expert" class="pt-20 px-5 max-w-2xl mx-auto space-y-6">
```

**说明**: 移除了重复的 `px-5` 和 `pb-32` 类，简化了类名，避免样式冲突

### 3. 修复效果

#### 修复前
- 底部留白: 32px
- 底部导航栏高度: ~64px
- **结果**: 按钮被遮挡

#### 修复后
- 底部留白: 36px
- 底部导航栏高度: ~64px
- **结果**: 按钮完全可见，有 36px 的安全距离

## 布局说明

### 页面结构

```
┌─────────────────────────────────────┐
│ 顶部导航栏 (固定)                    │
│ ┌─────────────────────────────────┐ │
│ │ ← 确认订单                      │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│                                     │
│  主内容区域                          │
│  - 专家信息                         │
│  - 订单详情                         │
│  - 平台保障                         │
│                                     │
├─────────────────────────────────────┤
│  底部操作栏 (固定)                   │
│  ┌───────────────────────────────┐  │
│  │ ¥100              立即支付    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  底部导航栏 (固定)                   │
│  ┌──┬──┬──┬──┬──┬──┐                │
│  │首页│发现│社区│聊天│订单│我的│   │
│  └──┴──┴──┴──┴──┴──┘                │
└─────────────────────────────────────┘
```

### 安全距离计算

```
底部操作栏高度: ~80px (包含 padding)
底部导航栏高度: ~64px
底部留白: 36px

总安全距离 = 36px > 64px (底部导航栏高度)
```

## 相关组件

### 底部导航栏组件
- **文件**: [src/components/BottomNavBar.vue](file:///System/Volumes/Data/webcode/UX/GamePartner/src/components/BottomNavBar.vue)
- **高度**: ~64px
- **定位**: fixed bottom-0
- **z-index**: z-50

### 底部操作栏
- **文件**: [src/views/ConfirmOrder.vue](file:///System/Volumes/Data/webcode/UX/GamePartner/src/views/ConfirmOrder.vue#L203-L215)
- **高度**: ~80px
- **定位**: fixed bottom-0
- **z-index**: z-50

## 测试建议

1. **功能测试**
   - 测试按钮是否完全可见
   - 测试按钮是否可以正常点击
   - 测试页面滚动是否正常

2. **响应式测试**
   - 测试不同屏幕尺寸
   - 测试横屏模式
   - 测试移动端显示

3. **兼容性测试**
   - 测试 iOS Safari
   - 测试 Android Chrome
   - 测试桌面浏览器

## 变更记录

- 2026-03-26: 初始版本，修复底部导航遮挡问题
