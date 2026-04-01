# global_post_detail_image_preview_2026-04-01

## 需求
帖子详情页 `/post/:id` 查看图片时需要支持点击放大预览

## 修改文件
- `/src/views/PostDetail.vue`

## 实现方案

### 1. 图片预览状态和方法
添加 `imagePreview` ref 状态和四个方法：
- `openImagePreview(images, index)` - 打开预览
- `closeImagePreview()` - 关闭预览
- `nextImage()` - 下一张
- `prevImage()` - 上一张

### 2. 图片点击交互
在图片外层容器添加 `cursor-pointer` 和 `@click="openImagePreview(post.images, index)"`：
- 支持点击单张或多张图片打开预览
- 传递当前点击的图片数组和索引

### 3. 图片预览弹窗
使用 `<Transition name="modal">` 包装的全屏预览组件：
- 背景：`bg-black/90` 全屏黑色半透明
- 关闭按钮：右上角 `close` 图标
- 导航按钮：左右箭头（首尾隐藏对应方向按钮）
- 页码指示器：底部居中显示 "当前/总数"
- 点击背景关闭，点击图片区域阻止冒泡

### 4. 交互细节
- 图片以 `object-contain` 模式居中显示
- 加载优化：添加 `loading="lazy"` 属性
- 动画：使用 Vue Transition 实现淡入淡出效果
- 层级：`z-[200]` 确保预览层在最顶层
