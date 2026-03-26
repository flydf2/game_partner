import { test, expect } from '@playwright/test';

test.describe('社区动态页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community');
  });

  test('验证搜索框', async ({ page }) => {
    await expect(page.locator('.community-search')).toHaveScreenshot('community-search.png', {
      maxDiffPixels: 30,
    });
  });

  test('验证分类标签', async ({ page }) => {
    await expect(page.locator('.category-tabs')).toHaveScreenshot('community-categories.png', {
      maxDiffPixels: 30,
    });
  });

  test('验证动态列表', async ({ page }) => {
    await expect(page.locator('.feed-list')).toHaveScreenshot('community-feed.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});
