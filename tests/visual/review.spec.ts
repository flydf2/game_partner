import { test, expect } from '@playwright/test';

test.describe('评价服务页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/review');
  });

  test('验证评分组件', async ({ page }) => {
    await expect(page.locator('.rating-section')).toHaveScreenshot('review-rating.png', {
      maxDiffPixels: 30,
    });
  });

  test('验证维度评价', async ({ page }) => {
    await expect(page.locator('.dimension-ratings')).toHaveScreenshot('review-dimensions.png', {
      maxDiffPixels: 30,
    });
  });

  test('验证评价标签', async ({ page }) => {
    await expect(page.locator('.review-tags')).toHaveScreenshot('review-tags.png', {
      maxDiffPixels: 30,
    });
  });
});
