import { test, expect } from '@playwright/test';

test.describe('设计稿与页面对比测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('关注列表 - 对比设计稿 _22', async ({ page }) => {
    await page.goto('/following');
    await expect(page.locator('body')).toHaveScreenshot('design-22-following.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('绑定手机号 - 对比设计稿 _23', async ({ page }) => {
    await page.goto('/phone-bind');
    await expect(page.locator('body')).toHaveScreenshot('design-23-phone-bind.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});
