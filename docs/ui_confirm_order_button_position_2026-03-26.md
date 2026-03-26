# 确认订单页面"立即支付"按钮位置调整记录

## 更新日期
2026-03-26

## 修改内容

### 1. 页面信息
- **页面名称**: 确认订单页 (ConfirmOrder.vue)
- **路由路径**: `/confirm-order`
- **访问方式**: GET /confirm-order

### 2. 修改的文件
- `src/views/ConfirmOrder.vue`

### 3. 按钮位置调整

#### 3.1 修改前

**位置**: `<footer>` 标签内（页面底部固定定位）

```vue
<footer class="fixed bottom-0 left-0 w-full ...">
  <div class="flex flex-col">
    <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">待支付总额</span>
    <div class="flex items-baseline gap-1">
      <span class="text-primary font-bold text-sm">¥</span>
      <span class="text-3xl font-extrabold font-headline text-on-surface">{{ totalAmount }}</span>
    </div>
  </div>
  <button
    @click="handlePay"
    :disabled="isSubmitting"
    class="bg-primary-container text-on-primary-container font-headline font-bold px-10 py-4 rounded-full ..."
  >
    {{ isSubmitting ? '提交中...' : '立即支付' }}
  </button>
</footer>
```

**问题**: 
- 按钮使用 `fixed` 定位，脱离文档流
- 需要额外的底部留白（`pb-36`）来避免被底部导航栏遮挡
- 按钮位置固定，不随页面滚动

#### 3.2 修改后

**位置**: `<main>` 标签内（文档流中）

```vue
<div class="bg-surface-container-low rounded-xl p-5 shadow-sm">
  <div class="flex items-center justify-between mb-4">
    <div class="flex flex-col">
      <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">待支付总额</span>
      <div class="flex items-baseline gap-1">
        <span class="text-primary font-bold text-sm">¥</span>
        <span class="text-3xl font-extrabold font-headline text-on-surface">{{ totalAmount }}</span>
      </div>
    </div>
  </div>
  <button
    @click="handlePay"
    :disabled="isSubmitting"
    class="w-full py-4 rounded-full bg-primary-container text-on-primary-container font-headline font-bold shadow-lg ..."
  >
    {{ isSubmitting ? '提交中...' : '立即支付' }}
  </button>
</div>
```

**优势**:
- 按钮在文档流中，自然排列
- 无需额外的底部留白
- 按钮会随页面滚动
- 更好的响应式布局

### 4. 结构对比

#### 修改前的页面结构

```html
<div class="min-h-screen bg-surface text-on-surface pb-36">
  <nav>顶部导航栏</nav>
  <main>主内容区域</main>
  <footer>底部操作栏（固定定位）</footer>
</div>
```

#### 修改后的页面结构

```html
<div class="min-h-screen bg-surface text-on-surface">
  <nav>顶部导航栏</nav>
  <main>
    主内容区域
    <div>底部操作栏（文档流）</div>
  </main>
</div>
```

### 5. 样式变化

#### 5.1 按钮样式

| 属性 | 修改前 | 修改后 |
|-----|-------|-------|
| 宽度 | 自动 | `w-full` (100%) |
| 内边距 | `px-10 py-4` | `py-4` |
| 布局 | `flex items-center justify-between` | `w-full` 单列布局 |

#### 5.2 容器样式

| 属性 | 修改前 | 修改后 |
|-----|-------|-------|
| 定位 | `fixed bottom-0` | 文档流 |
| 底部留白 | `pb-36` | 无 |
| 背景 | `bg-white/80` | `bg-surface-container-low` |
| 圆角 | `rounded-t-[1.5rem]` | `rounded-xl` |

### 6. 用户体验改进

#### 6.1 滚动行为

**修改前**:
- 按钮固定在底部
- 滚动时按钮位置不变
- 需要额外空间避免遮挡

**修改后**:
- 按钮随页面滚动
- 自然排列在内容末尾
- 无需额外空间

#### 6.2 响应式

**修改前**:
- 需要计算底部导航栏高度
- 不同屏幕尺寸需要调整

**修改后**:
- 自动适应内容高度
- 无需额外计算

### 7. 构建结果

✅ 构建成功，没有错误
- ConfirmOrder页面: `ConfirmOrder-BigWM6l_.js` (6.57 kB)

### 8. 相关文件

- `src/views/ConfirmOrder.vue` - 确认订单页面
- `src/components/BottomNavBar.vue` - 底部导航栏组件

### 9. 变更记录

- 2026-03-26: 初始版本，将"立即支付"按钮从固定定位改为文档流布局
