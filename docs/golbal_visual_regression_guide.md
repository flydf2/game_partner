# 视觉回归测试指南

## 概述

本项目使用 Playwright 进行视觉回归测试（Visual Regression Testing），通过对比设计稿和实际页面的截图，自动检测样式布局差异。

## 测试架构

### 目录结构

```
tests/visual/
├── example.spec.ts          # 示例测试文件
├── discover.spec.ts         # 发现页测试
├── profile.spec.ts          # 个人主页测试
├── messages.spec.ts         # 消息列表测试
├── chat.spec.ts             # 聊天界面测试
├── confirm-order.spec.ts    # 订单确认测试
├── review.spec.ts           # 评价服务测试
└── community.spec.ts        # 社区动态测试
```

### 测试运行

```bash
# 安装依赖
npm install -D @playwright/test

# 运行所有测试
npx playwright test

# 运行特定测试文件
npx playwright test tests/visual/discover.spec.ts

# 生成新的截图基准
npx playwright test --update-snapshots

# 生成 HTML 报告
npx playwright show-report
```

## 测试配置

### playwright.config.ts

```typescript
export default defineConfig({
  testDir: './tests/visual',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

## 使用方法

### 1. 创建新的测试文件

```typescript
import { test, expect } from '@playwright/test';

test.describe('页面名称', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/path');
  });

  test('验证元素截图', async ({ page }) => {
    await expect(page.locator('.selector')).toHaveScreenshot('name.png', {
      maxDiffPixels: 50,
    });
  });
});
```

### 2. 生成基准截图

首次运行测试时，使用 `--update-snapshots` 参数生成基准截图：

```bash
npx playwright test --update-snapshots
```

### 3. 运行测试对比

后续运行测试时，会自动对比当前页面与基准截图的差异：

```bash
npx playwright test
```

### 4. 查看测试报告

```bash
npx playwright show-report
```

## 参数说明

### maxDiffPixels

允许的像素差异数量，默认值为 0（严格匹配）。

```typescript
await expect(page.locator('.element')).toHaveScreenshot('screenshot.png', {
  maxDiffPixels: 50,  // 允许 50 个像素差异
});
```

### fullPage

是否截取整个页面：

```typescript
await expect(page).toHaveScreenshot('page.png', {
  fullPage: true,  // 截取整个页面
});
```

### mask

遮罩敏感信息：

```typescript
await expect(page).toHaveScreenshot('page.png', {
  mask: [page.locator('.sensitive-data')],
});
```

## 设计稿对比流程

### 方法 1: 手动截图对比

1. 从设计稿目录获取 PNG 截图
2. 将设计稿截图保存到 `tests/visual/baselines/`
3. 运行测试进行对比

### 方法 2: 自动化截图

1. 启动开发服务器：`npm run dev`
2. 使用 Playwright 脚本自动截图
3. 与设计稿进行像素级对比

### 方法 3: 视觉差异工具

使用专门的视觉差异工具：

```bash
# 安装 image-diff
npm install -g image-diff

# 对比图片
image-diff --left design.png --right actual.png --output diff.png
```

## 常见问题

### 1. 字体渲染差异

不同系统字体渲染可能不同，建议：

- 使用 Web 字体（如 Plus Jakarta Sans、Be Vietnam Pro）
- 在测试配置中统一字体渲染设置
- 适当增加 `maxDiffPixels` 值

### 2. 动画影响

动画可能导致截图不一致，建议：

- 在测试前等待动画完成
- 使用 `setTimeout` 等待
- 或禁用动画

### 3. 响应式布局

不同屏幕尺寸可能导致布局差异，建议：

- 在测试配置中指定屏幕尺寸
- 为不同尺寸创建独立的测试

## 最佳实践

1. **基准截图管理**
   - 将基准截图纳入版本控制
   - 定期更新基准截图
   - 标注基准截图的日期和版本

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

## 相关资源

- [Playwright 官方文档](https://playwright.dev/)
- [Visual Regression Testing](https://playwright.dev/docs/visual-testing)
- [toHaveScreenshot API](https://playwright.dev/docs/test-assertions#toHaveScreenshot)
