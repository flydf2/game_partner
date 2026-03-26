import { test, expect } from '@playwright/test';

test.describe('聊天界面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
  });

  test('验证聊天界面', async ({ page }) => {
    await expect(page.locator('.chat-interface')).toHaveScreenshot('chat-interface.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('验证消息气泡', async ({ page }) => {
    await expect(page.locator('.message-bubble')).toHaveScreenshot('chat-bubble.png', {
      maxDiffPixels: 30,
    });
  });

  test('验证订单卡片', async ({ page }) => {
    await expect(page.locator('.appointment-card')).toHaveScreenshot('chat-appointment.png', {
      maxDiffPixels: 50,
    });
  });
});
