import { test, expect } from '@playwright/test';

test.describe('消息列表页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/messages');
  });

  test('验证消息列表', async ({ page }) => {
    await expect(page.locator('.message-list')).toHaveScreenshot('messages-list.png', {
      maxDiffPixels: 50,
    });
  });

  test('验证未读标记', async ({ page }) => {
    await expect(page.locator('.unread-indicator')).toHaveScreenshot('messages-unread.png', {
      maxDiffPixels: 20,
    });
  });
});
