# 页面样式对比分析报告

**日期**: 2026-03-25  
**对比页面**: 
- 设计稿: `/设计稿/_1/code.html`
- 实际页面: `http://localhost:5173/`

---

## 📊 总体评估

设计稿（code.html）的视觉效果确实更好，主要体现在以下几个方面：

### ✅ 设计稿的优势
1. **色彩层次更丰富** - 使用了多种容器颜色，视觉层次分明
2. **渐变效果更明显** - Hero Banner 有明显的渐变叠加层
3. **卡片样式更统一** - 游戏卡片使用了不同的主题色
4. **圆角更统一** - 使用了更大的圆角（2rem）
5. **字体加载明确** - 直接在 HTML 中加载 Google Fonts

---

## 🔍 详细对比

### 1. 字体加载

#### 设计稿 (code.html)
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet"/>
```

#### Vue 项目 (index.html)
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet"/>
```

**状态**: ✅ 两者都加载了相同的字体

---

### 2. Hero Banner 对比

#### 设计稿
```html
<section class="relative w-full h-48 rounded-[2rem] overflow-hidden group shadow-xl shadow-primary/10">
  <div class="absolute inset-0 bg-gradient-to-r from-primary to-tertiary-fixed opacity-90 mix-blend-multiply"></div>
  <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
  ...
</section>
```

#### Vue 项目 (Home.vue)
```html
<section class="relative w-full h-48 sm:h-64 md:h-80 rounded-[2rem] overflow-hidden group shadow-xl shadow-primary/10">
  <div class="absolute inset-0 bg-gradient-to-r from-primary to-tertiary-fixed opacity-90 mix-blend-multiply"></div>
  <LazyImage class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
  ...
</section>
```

**状态**: ✅ 两者结构相同，Vue 项目增加了响应式高度

---

### 3. 游戏卡片对比

#### 设计稿
```html
<!-- LOL Card -->
<div class="flex-shrink-0 w-28 h-36 bg-surface-container-lowest rounded-3xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
  <div class="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center">
    <span class="material-symbols-outlined text-primary text-3xl">videogame_asset</span>
  </div>
  <span class="font-bold text-sm">LOL</span>
</div>

<!-- Valorant Card -->
<div class="flex-shrink-0 w-28 h-36 bg-surface-container-lowest rounded-3xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
  <div class="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center">
    <span class="material-symbols-outlined text-secondary text-3xl">target</span>
  </div>
  <span class="font-bold text-sm">Valorant</span>
</div>

<!-- Honor of Kings -->
<div class="flex-shrink-0 w-28 h-36 bg-surface-container-lowest rounded-3xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
  <div class="w-14 h-14 rounded-2xl bg-tertiary-container flex items-center justify-center">
    <span class="material-symbols-outlined text-on-tertiary-container text-3xl">shield</span>
  </div>
  <span class="font-bold text-sm">王者荣耀</span>
</div>
```

#### Vue 项目 (GameCategories.vue)
```html
<div 
  v-for="game in games" 
  :key="game.id" 
  class="flex-shrink-0 w-24 sm:w-28 h-32 sm:h-36 bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2 sm:gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer"
>
  <div class="w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-primary-container flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary-container/80">
    <span class="material-symbols-outlined text-primary text-2xl sm:text-3xl transition-transform duration-300 hover:scale-110">
      {{ game.icon }}
    </span>
  </div>
  <span class="font-bold text-sm transition-colors duration-300 hover:text-primary">{{ game.name }}</span>
</div>
```

**状态**: ⚠️ **主要差异**
- 设计稿: 每个游戏卡片使用不同的容器颜色（primary, secondary, tertiary）
- Vue 项目: 所有游戏卡片都使用 `bg-primary-container`
- 设计稿: 圆角统一为 `rounded-3xl` (2rem)
- Vue 项目: 使用响应式圆角 `rounded-2xl sm:rounded-3xl`

---

### 4. 陪玩卡片对比

#### 设计稿
```html
<div class="bg-surface-container-lowest rounded-[2rem] p-4 space-y-4 shadow-sm relative overflow-hidden flex flex-col">
  <div class="absolute top-0 right-0 p-3">
    <div class="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
      <span class="material-symbols-outlined text-primary text-[10px]" style="font-variation-settings: 'FILL' 1;">star</span>
      <span class="text-[10px] font-bold">5.0</span>
    </div>
  </div>
  <div class="w-full aspect-square rounded-2xl overflow-hidden bg-surface-container">
    <img class="w-full h-full object-cover" />
  </div>
  <div class="space-y-2">
    <div class="flex flex-wrap gap-1">
      <span class="px-2 py-0.5 bg-primary-container/30 text-on-primary-container text-[9px] font-bold rounded-lg">王者</span>
      <span class="px-2 py-0.5 bg-tertiary-container/30 text-on-tertiary-container text-[9px] font-bold rounded-lg">萌妹</span>
    </div>
    <div class="flex flex-col">
      <span class="font-bold text-sm">林间小鹿</span>
      <span class="text-primary text-xs font-black">¥45/hr</span>
    </div>
  </div>
</div>
```

#### Vue 项目 (PlaymateCard.vue)
```html
<div
  class="bg-surface-container-lowest rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 space-y-3 sm:space-y-4 shadow-sm relative overflow-hidden flex flex-col cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
>
  <div class="absolute top-0 right-0 p-3">
    <div class="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
      <span class="material-symbols-outlined text-primary text-[10px]" style="font-variation-settings: 'FILL' 1;">star</span>
      <span class="text-[10px] font-bold">{{ playmate.rating }}</span>
    </div>
  </div>

  <LazyImage class="relative" />

  <div class="space-y-2">
    <div class="flex flex-wrap gap-1">
      <span class="px-2 py-0.5 bg-primary-container/30 text-on-primary-container text-[9px] font-bold rounded-lg">
        {{ tag }}
      </span>
    </div>
    <div class="flex justify-between items-end">
      <div class="flex flex-col">
        <span class="font-bold text-sm">{{ playmate.nickname }}</span>
        <span class="text-primary text-xs font-black">¥{{ playmate.price }}/hr</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="material-symbols-outlined text-zinc-400 text-xs">favorite</span>
        <span class="text-xs text-zinc-500">{{ playmate.likes }}</span>
      </div>
    </div>
  </div>
</div>
```

**状态**: ⚠️ **差异**
- 设计稿: 圆角统一为 `rounded-[2rem]`
- Vue 项目: 使用响应式圆角 `rounded-[1.5rem] sm:rounded-[2rem]`
- Vue 项目: 增加了点赞数显示
- Vue 项目: 增加了在线状态指示器

---

### 5. 特色陪玩卡片对比

#### 设计稿
```html
<div class="col-span-2 bg-surface-container-lowest rounded-[2rem] p-5 shadow-sm flex items-center gap-5 relative overflow-hidden group">
  <div class="w-24 h-24 rounded-2xl overflow-hidden bg-surface-container flex-shrink-0">
    <img class="w-full h-full object-cover" />
  </div>
  <div class="flex-grow space-y-2">
    <div class="flex justify-between items-start">
      <div class="flex flex-col">
        <span class="font-bold text-lg">安妮喵呜</span>
        <span class="text-[10px] text-zinc-500 font-medium">累计陪玩 1,200+ 小时</span>
      </div>
      <span class="text-primary text-lg font-black">¥55/hr</span>
    </div>
    <div class="flex gap-2">
      <span class="px-3 py-1 bg-surface-container-low text-on-surface text-[10px] font-bold rounded-full">温柔语聊</span>
      <span class="px-3 py-1 bg-surface-container-low text-on-surface text-[10px] font-bold rounded-full">绝地求生</span>
    </div>
  </div>
  <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full group-hover:scale-125 transition-transform"></div>
</div>
```

#### Vue 项目 (FeaturedPlaymateCard.vue)
```html
<router-link 
  class="col-span-2 bg-surface-container-lowest rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 shadow-sm flex items-center gap-4 sm:gap-5 relative overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-95"
>
  <div class="w-24 h-24 rounded-2xl overflow-hidden bg-surface-container flex-shrink-0 group">
    <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
  </div>
  <div class="flex-grow space-y-2">
    <div class="flex justify-between items-start">
      <div class="flex flex-col">
        <span class="font-bold text-lg transition-colors hover:text-primary">{{ playmate.name }}</span>
        <span class="text-[10px] text-zinc-500 font-medium transition-colors hover:text-zinc-700">{{ playmate.description }}</span>
      </div>
      <span class="text-primary text-lg font-black transition-transform hover:scale-105 inline-block">¥{{ playmate.price }}/hr</span>
    </div>
    <div class="flex gap-2">
      <span class="px-3 py-1 bg-surface-container-low text-on-surface text-[10px] font-bold rounded-full transition-all hover:bg-primary-container hover:text-white">
        {{ tag }}
      </span>
    </div>
  </div>
  <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
</router-link>
```

**状态**: ⚠️ **差异**
- Vue 项目: 增加了更多 hover 效果和过渡动画
- Vue 项目: 圆角使用响应式值
- Vue 项目: 使用 router-link 包装

---

### 6. 底部导航栏对比

#### 设计稿
```html
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(255,215,0,0.08)] z-50 rounded-t-[24px]">
  <!-- 首页 (Active) -->
  <a class="flex flex-col items-center justify-center bg-yellow-400 dark:bg-yellow-500 text-zinc-900 rounded-2xl px-5 py-2 scale-105 transform transition-all active:scale-90 duration-300 cubic-bezier(0.34,1.56,0.64,1)" href="#">
    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">home_filled</span>
    <span class="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold tracking-wide">首页</span>
  </a>
  <!-- 其他导航项 -->
  ...
</nav>
```

#### Vue 项目 (BottomNavBar.vue)
```html
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(255,215,0,0.08)] z-50 rounded-t-[24px]">
  <router-link 
    to="/" 
    class="flex flex-col items-center justify-center px-5 py-2 transition-all active:scale-90 duration-300 cubic-bezier(0.34,1.56,0.64,1)"
    :class="{
      'bg-yellow-400 dark:bg-yellow-500 text-zinc-900 rounded-2xl scale-105': currentRoute === '/',
      'text-zinc-400 dark:text-zinc-500 hover:text-yellow-500': currentRoute !== '/'
    }"
  >
    <span class="material-symbols-outlined" :style="currentRoute === '/' ? { fontVariationSettings: 'FILL 1' } : {}">
      home_filled
    </span>
    <span class="font-headline text-[11px] font-semibold tracking-wide">首页</span>
  </router-link>
  <!-- 其他导航项 -->
</nav>
```

**状态**: ✅ 两者基本相同，Vue 项目增加了路由功能

---

## 🎯 关键差异总结

### 1. 游戏卡片颜色多样性 ⚠️
**设计稿**: 每个游戏卡片使用不同的主题色
- LOL: `bg-primary-container` + `text-primary`
- Valorant: `bg-secondary-container` + `text-secondary`
- 王者荣耀: `bg-tertiary-container` + `text-on-tertiary-container`
- 原神: `bg-surface-container-high` + `text-on-surface-variant`

**Vue 项目**: 所有游戏卡片统一使用 `bg-primary-container`

### 2. 圆角统一性 ⚠️
**设计稿**: 统一使用 `rounded-[2rem]` (2rem)

**Vue 项目**: 使用响应式圆角 `rounded-[1.5rem] sm:rounded-[2rem]`

### 3. 交互效果 ⚠️
**设计稿**: 基础的 hover 效果

**Vue 项目**: 更丰富的交互效果（hover、active、过渡动画）

---

## 💡 改进建议

### 优先级 1: 恢复游戏卡片的颜色多样性
为不同的游戏分配不同的主题色，增加视觉层次。

### 优先级 2: 统一圆角大小
将所有卡片的圆角统一为 `rounded-[2rem]`，保持设计一致性。

### 优先级 3: 检查字体加载
确保 Google Fonts 正确加载并应用到所有文本元素。

### 优先级 4: 优化渐变效果
确保 Hero Banner 的渐变叠加层正确显示。

---

## 📝 结论

设计稿（code.html）之所以看起来更好，主要是因为：

1. **游戏卡片使用了不同的主题色**，增加了视觉丰富度和层次感
2. **圆角更统一**，整体设计更协调
3. **颜色使用更准确**，完全遵循了 Material Design 3 的颜色系统

Vue 项目虽然增加了响应式设计和更多交互效果，但在视觉层次和色彩运用上还有改进空间。
