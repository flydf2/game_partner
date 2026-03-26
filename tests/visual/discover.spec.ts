import { test, expect } from '@playwright/test';

test.describe('陪玩师列表页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/discover');
  });

  test('验证搜索框样式', async ({ page }) => {
    await expect(page.locator('.search-box')).toHaveScreenshot('discover-search.png', {
      maxDiffPixels: 30,
    });
  });

  test('验证筛选标签', async ({ page }) => {
    await expect(page.locator('.filter-chips')).toHaveScreenshot('discover-filters.png', {
      maxDiffPixels: 30,
    });
  });

  test('验证陪玩师卡片列表', async ({ page }) => {
    await expect(page.locator('.playmate-list')).toHaveScreenshot('discover-list.png', {
      maxDiffPixels: 50,
    });
  });
});
