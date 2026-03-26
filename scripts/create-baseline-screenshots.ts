import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();

  // 创建基准截图目录
  const baselineDir = path.join(__dirname, 'visual-baselines');
  if (!fs.existsSync(baselineDir)) {
    fs.mkdirSync(baselineDir, { recursive: true });
  }

  console.log('正在创建基准截图...\n');

  // 1. 关注列表页面
  console.log('正在截图关注列表页面...');
  await page.goto('http://localhost:5173/following');
  await page.locator('body').screenshot({ 
    path: path.join(baselineDir, 'design-22-following.png'),
    fullPage: true 
  });
  console.log('✓ 关注列表页面截图完成');

  // 2. 绑定手机号页面
  console.log('正在截图绑定手机号页面...');
  await page.goto('http://localhost:5173/phone-bind');
  await page.locator('body').screenshot({ 
    path: path.join(baselineDir, 'design-23-phone-bind.png'),
    fullPage: true 
  });
  console.log('✓ 绑定手机号页面截图完成');

  await browser.close();
  console.log('\n所有基准截图创建完成！');
}

takeScreenshots().catch(console.error);
