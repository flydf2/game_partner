import { test, expect } from '@playwright/test';

test.describe('设计稿与页面对比测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('首页 - 对比设计稿 _1', async ({ page }) => {
    await expect(page.locator('body')).toHaveScreenshot('design-1-home.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('陪玩师主页 - 对比设计稿 _2', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.locator('.profile-container')).toHaveScreenshot('design-2-profile.png', {
      maxDiffPixels: 50,
    });
  });

  test('陪玩师列表 - 对比设计稿 _3', async ({ page }) => {
    await page.goto('/discover');
    await expect(page.locator('.playmate-list')).toHaveScreenshot('design-3-discover.png', {
      maxDiffPixels: 50,
    });
  });

  test('消息列表 - 对比设计稿 _5', async ({ page }) => {
    await page.goto('/messages');
    await expect(page.locator('.message-list')).toHaveScreenshot('design-5-messages.png', {
      maxDiffPixels: 50,
    });
  });

  test('聊天界面 - 对比设计稿 _6', async ({ page }) => {
    await page.goto('/chat');
    await expect(page.locator('.chat-interface')).toHaveScreenshot('design-6-chat.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('订单确认 - 对比设计稿 _7', async ({ page }) => {
    await page.goto('/confirm-order');
    await expect(page.locator('.order-confirm')).toHaveScreenshot('design-7-confirm.png', {
      maxDiffPixels: 50,
    });
  });

  test('支付成功 - 对比设计稿 _8', async ({ page }) => {
    await page.goto('/payment-success');
    await expect(page.locator('.payment-success')).toHaveScreenshot('design-8-success.png', {
      maxDiffPixels: 50,
    });
  });

  test('评价服务 - 对比设计稿 _9', async ({ page }) => {
    await page.goto('/review');
    await expect(page.locator('.review-page')).toHaveScreenshot('design-9-review.png', {
      maxDiffPixels: 50,
    });
  });

  test('社区动态 - 对比设计稿 _10', async ({ page }) => {
    await page.goto('/community');
    await expect(page.locator('.community-page')).toHaveScreenshot('design-10-community.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});
