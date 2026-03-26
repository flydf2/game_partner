# 设计稿与页面对比方案

## 方案概述

本方案提供了一套完整的视觉回归测试系统，用于对比设计稿和实际 Vue 页面的样式布局差异。

## 方案对比

### 方案 1: Playwright 视觉回归测试（推荐）

**优点：**
- ✅ 自动化程度高
- ✅ 支持 CI/CD 集成
- ✅ 提供详细的测试报告
- ✅ 支持像素级对比
- ✅ 可以测试交互和动画

**缺点：**
- ⚠️ 需要启动开发服务器
- ⚠️ 初始配置较复杂

**适用场景：**
- 需要自动化测试的项目
- 团队有持续集成流程
- 需要频繁验证页面样式

### 方案 2: 手动截图对比

**优点：**
- ✅ 简单直观
- ✅ 无需配置
- ✅ 可以快速验证

**缺点：**
- ⚠️ 手动操作，效率低
- ⚠️ 难以量化差异
- ⚠️ 不适合频繁验证

**适用场景：**
- 临时验证
- 少量页面对比
- 快速检查

### 方案 3: 专门的视觉差异工具

**优点：**
- ✅ 专业工具，功能强大
- ✅ 可视化差异展示
- ✅ 支持批量处理

**缺点：**
- ⚠️ 需要额外安装工具
- ⚠️ 配置较复杂

**适用场景：**
- 大规模视觉回归测试
- 需要详细差异报告
- 团队有专门的测试流程

## 推荐方案：Playwright + 手动截图

### 实施步骤

#### 1. 安装 Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

#### 2. 创建基准截图

从设计稿目录提取 PNG 截图，或使用 Playwright 截取实际页面：

```bash
# 启动开发服务器
npm run dev

# 使用 Playwright 截图
npx playwright codegen http://localhost:5173
```

#### 3. 运行测试对比

```bash
# 生成新的基准截图
npx playwright test --update-snapshots

# 运行测试进行对比
npx playwright test
```

#### 4. 查看测试报告

```bash
npx playwright show-report
```

### 使用示例

#### 设计稿对比测试

```typescript
import { test, expect } from '@playwright/test';

test.describe('设计稿对比测试', () => {
  test('首页 - 对比设计稿 _1', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toHaveScreenshot('design-1-home.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});
```

#### 手动截图对比

```bash
# 从设计稿目录复制截图
cp /System/Volumes/Data/webcode/UX/GamePartner/设计稿/_1/screen.png tests/visual/baselines/design-1-home.png

# 启动开发服务器并截图
npm run dev &
npx playwright screenshot http://localhost:5173 tests/visual/actual-1-home.png

# 使用图像工具对比
# 推荐工具：ImageMagick、Photoshop、Figma
```

### 配置文件

#### playwright.config.ts

```typescript
export default defineConfig({
  testDir: './tests/visual',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
});
```

### 测试文件

#### tests/visual/design-compare.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('设计稿与页面对比测试', () => {
  test('首页 - 对比设计稿 _1', async ({ page }) => {
    await expect(page.locator('body')).toHaveScreenshot('design-1-home.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});
```

### 详细对比方法

#### 方法 1: 像素级对比

使用 Playwright 的 `toHaveScreenshot` API 进行像素级对比：

```typescript
await expect(page.locator('.element')).toHaveScreenshot('screenshot.png', {
  maxDiffPixels: 50,  // 允许的像素差异
});
```

#### 方法 2: 区域对比

对比页面的特定区域：

```typescript
await expect(page.locator('.hero-section')).toHaveScreenshot('hero.png', {
  maxDiffPixels: 30,
});
```

#### 方法 3: 全页面对比

对比整个页面：

```typescript
await expect(page).toHaveScreenshot('page.png', {
  fullPage: true,
  maxDiffPixels: 100,
});
```

### 差异可视化

#### 使用 ImageMagick

```bash
# 安装 ImageMagick
brew install imagemagick

# 对比图片
compare -metric AE design.png actual.png diff.png 2> diff.txt

# 查看差异像素数量
cat diff.txt
```

#### 使用 Figma

1. 将设计稿导入 Figma
2. 将实际页面截图导入 Figma
3. 使用图层混合模式对比差异

#### 使用 Photoshop

1. 打开设计稿和实际截图
2. 将实际截图放在设计稿上方
3. 使用"差异"混合模式查看差异

### 最佳实践

1. **基准截图管理**
   - 将基准截图纳入版本控制
   - 标注基准截图的日期和版本
   - 定期更新基准截图

2. **测试覆盖率**
   - 覆盖所有关键页面
   - 覆盖所有关键组件
   - 覆盖不同状态和交互

3. **性能优化**
   - 并行运行测试
   - 只在必要时使用 `fullPage: true`
   - 使用 `maxDiffPixels` 避免过度敏感

4. **CI/CD 集成**
   - 在 CI/CD 流程中集成视觉回归测试
   - 设置失败通知
   - 生成测试报告

### 相关文档

- [Playwright 官方文档](https://playwright.dev/)
- [Visual Regression Testing](https://playwright.dev/docs/visual-testing)
- [toHaveScreenshot API](https://playwright.dev/docs/test-assertions#toHaveScreenshot)
