import { test, expect } from '@playwright/test';

test.describe('页面视觉回归测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('首页 - 验证整体布局', async ({ page }) => {
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('首页 - 验证 hero 区域', async ({ page }) => {
    await page.locator('.hero-section').screenshot({ path: 'home-hero.png' });
    await expect(page.locator('.hero-section')).toHaveScreenshot('home-hero.png', {
      maxDiffPixels: 50,
    });
  });

  test('首页 - 验证游戏分类卡片', async ({ page }) => {
    await page.locator('.game-categories').screenshot({ path: 'home-game-cards.png' });
    await expect(page.locator('.game-categories')).toHaveScreenshot('home-game-cards.png', {
      maxDiffPixels: 30,
    });
  });
});
