```markdown
# 视觉设计系统指南：SunnyPlay Gaming

## 1. 核心设计愿景 (Creative North Star)
**设计北极星：日光律动 (The Solar Pulse)**

本系统的核心在于将“游戏陪玩”的社交属性转化为一种极具感染力的视觉能量。我们拒绝平庸的网格堆砌，转向一种**高阶社论感 (High-End Editorial)** 的布局逻辑。通过大面积的留白、非对称的构图以及极具张力的色彩对比，创造出一个既温暖亲切又充满专业感的数字空间。我们不只是在设计一个 H5 应用，而是在构建一个充满阳光的“数字游乐场”。

---

## 2. 色彩系统 (Colors)

### 2.1 色彩逻辑
核心色调以 `primary` (#FFD700) 为灵魂，辅以温暖的橙色系 (`secondary` / `tertiary`)。这种组合旨在模拟日出的暖意，唤起用户的愉悦感与信任感。

- **Primary (活力黄):** `#6c5a00` (用于重要文字/图标)，配套容器色 `primary_container` (#FFD700) 用于大面积品牌触达。
- **Secondary (暖阳橙):** `secondary` (#8c4a00) 强化互动的温馨感。
- **Neutral (柔和灰):** 以 `surface` (#f6f6f6) 为基调，确保视觉疲劳度降至最低。

### 2.2 “无边框”原则 (The No-Line Rule)
**禁止在任何 UI 模块中使用 1px 的实心边框。**
界面的分割必须通过背景色的微妙切换来实现。例如：
- 使用 `surface_container_low` 区域嵌套在 `surface` 背景上。
- 利用 `surface_container_highest` 的浅灰度来界定导航区域，而非绘制线条。

### 2.3 叠层逻辑与环境质感
利用 `surface-container` 层级 (Lowest to Highest) 模拟物理堆叠感。
- **底层 (Base):** `surface` (#f6f6f6)
- **卡片 (Card):** `surface_container_lowest` (#ffffff)
- **悬浮组件 (Float):** 使用 `primary_container` 的半透明版本并配合 `backdrop-blur` (15px-25px)，创造出如“磨砂阳光玻璃”般的质感。

---

## 3. 字体系统 (Typography)

我们采用双字体族策略：**Plus Jakarta Sans** 处理数字与英文字符，赋予界面现代感；中文部分建议匹配等宽的高质感无衬线体（如思源黑体或屏幕定制黑体）。

| 级别 | 字体族 | 字号 | 用途 |
| :--- | :--- | :--- | :--- |
| **Display-LG** | Plus Jakarta Sans | 3.5rem | 极具冲击力的标题，如“首页 Slogan” |
| **Headline-MD** | Plus Jakarta Sans | 1.75rem | 核心板块标题，强调个性 |
| **Title-MD** | Be Vietnam Pro (中) | 1.125rem | 列表标题、卡片头部 |
| **Body-MD** | Be Vietnam Pro (中) | 0.875rem | 正文、陪玩师简介 (主要阅读层) |
| **Label-SM** | Be Vietnam Pro (中) | 0.6875rem | 辅助说明、状态标签 |

**排版设计准则：**
- **非对称缩进：** 在大标题下使用不规则的左侧留白，打破垂直对齐的僵硬感。
- **高对比：** 关键数值（如胜率、价格）统一使用 `Display` 级别字体以 `on_surface` 颜色突出显示。

---

## 4. 深度与空间 (Elevation & Depth)

### 4.1 影调层叠 (Tonal Layering)
通过颜色的深度而非阴影来定义结构。
- 将 `surface_container_lowest` (纯白) 的卡片放置在 `surface_container_low` 的灰色底色上，形成自然的视觉差。

### 4.2 环境阴影 (Ambient Shadows)
若必须使用阴影（如悬浮行动按钮），必须遵循：
- **扩散度：** Blur 必须大于 20px。
- **透明度：** Opacity 控制在 4%-8% 之间。
- **色调：** 严禁纯黑色阴影。阴影色应取 `on_surface` 的深灰蓝调，以模拟自然的漫反射。

### 4.3 幽灵边框 (Ghost Border)
当对比度极低导致识别困难时，仅允许使用 `outline_variant` 且透明度降至 15% 的“幽灵边框”。

---

## 5. 组件设计 (Components)

### 5.1 交互按钮 (Buttons)
- **Primary Button:** 使用 `primary_container` 背景。圆角设定为 `full` (胶囊型)。不添加描边，使用 `on_primary_container` 加粗文字。
- **Secondary Button:** 纯白背景，配以微弱的 `surface_tint` 投影，文字使用 `primary`。
- **状态反馈：** 点击时背景色向 `primary_dim` 偏移，禁止使用简单的透明度变化。

### 5.2 社交卡片 (Social Cards)
- **严禁分割线：** 卡片内部的头像、信息、价格之间通过 `spacing-3` 或 `spacing-4` 的垂直距离进行空间区隔。
- **圆角：** 统一使用 `xl` (1.5rem) 圆角，创造极其友好、无害的触感。

### 5.3 陪玩状态标签 (Status Chips)
- 采用“色彩浸染”法：背景使用 `tertiary_container`，文字使用 `on_tertiary_container`。
- 尺寸控制在 `label-md`，提供极高的信息密度。

### 5.4 输入框 (Input Fields)
- 背景使用 `surface_container_high`。
- 聚焦状态 (Focus) 不显示外边框，而是通过背景色切换至 `surface_container_lowest` 并增加微弱的 `primary` 色调光晕。

---

## 6. 执行准则 (Do's and Don'ts)

### ✅ 执行 (Do)
- **拥抱留白：** 页面边缘留白至少保持 `spacing-5` (1.7rem)。
- **视觉重心：** 每屏仅允许出现一个 `primary_fixed` 颜色的核心操作。
- **动态曲线：** 所有动效应具有弹性（Elastic Out），契合“Sunny”的活泼感。

### ❌ 避免 (Don't)
- **禁止使用 1px 线条：** 无论是分割列表还是区分板块，严禁使用 `#DDDDDD` 之类的硬细线。
- **禁止纯黑文字：** 所有深色文字应使用 `on_background` (#2D2F2F)，保持柔和的阅读感。
- **禁止直角：** 即使是最小的缩略图，也必须至少保持 `sm` (0.25rem) 的圆角。

---

## 7. 结语
这个设计系统不是一套模板，而是一种节奏。我们要利用 `#FFD700` 的阳光感与极致整洁的排版，在 H5 的受限环境下打造出超越原生 App 的呼吸感与精致度。请记住：**高级感源于对留白的克制与对色彩层级的极端敏锐。**```