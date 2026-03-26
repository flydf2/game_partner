import { test, expect } from '@playwright/test';

test.describe('订单确认页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/confirm-order');
  });

  test('验证服务信息卡片', async ({ page }) => {
    await expect(page.locator('.service-card')).toHaveScreenshot('confirm-service.png', {
      maxDiffPixels: 50,
    });
  });

  test('验证价格明细', async ({ page }) => {
    await expect(page.locator('.price-details')).toHaveScreenshot('confirm-price.png', {
      maxDiffPixels: 30,
    });
  });

  test('验证底部支付按钮', async ({ page }) => {
    await expect(page.locator('.payment-footer')).toHaveScreenshot('confirm-footer.png', {
      maxDiffPixels: 30,
    });
  });
});
