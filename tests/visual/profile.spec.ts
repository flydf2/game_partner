import { test, expect } from '@playwright/test';

test.describe('陪玩师个人主页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
  });

  test('验证个人资料卡片', async ({ page }) => {
    await expect(page.locator('.profile-header')).toHaveScreenshot('profile-header.png', {
      maxDiffPixels: 50,
    });
  });

  test('验证技能标签', async ({ page }) => {
    await expect(page.locator('.skills-section')).toHaveScreenshot('profile-skills.png', {
      maxDiffPixels: 30,
    });
  });

  test('验证统计数据', async ({ page }) => {
    await expect(page.locator('.stats-grid')).toHaveScreenshot('profile-stats.png', {
      maxDiffPixels: 30,
    });
  });
});
