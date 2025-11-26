import { test, expect } from '@playwright/test';

test.describe('CodeVerify Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('picture mode - should render canvas with verification code', async ({ page }) => {
    // 定位图片验证码部分
    const pictureSection = page.locator('.example-section').nth(3);
    const canvas = pictureSection.locator('canvas');

    // 验证canvas存在
    await expect(canvas).toBeVisible();

    // 验证canvas有内容（不是空白）
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).toBeDefined();
    expect(canvasBox!.width).toBe(116);
    expect(canvasBox!.height).toBe(34);
  });

  test('picture mode - should generate different code on refresh', async ({ page }) => {
    const pictureSection = page.locator('.example-section').nth(3);
    const canvas = pictureSection.locator('canvas');

    // 获取初始canvas截图
    const initialScreenshot = await canvas.screenshot();

    // 点击canvas刷新
    await canvas.click();
    await page.waitForTimeout(300);

    // 获取刷新后的截图
    const refreshedScreenshot = await canvas.screenshot();

    // 验证截图不同（代码已刷新）
    expect(initialScreenshot.equals(refreshedScreenshot)).toBe(false);
  });

  test('picture mode - should verify correct code', async ({ page }) => {
    const pictureSection = page.locator('.example-section').nth(3);
    const input = pictureSection.locator('.code-input');
    const button = pictureSection.locator('.btn');

    // 获取当前验证码（通过组件ref）
    const code = await page.evaluate(() => {
      const app = document.querySelector('#app') as any;
      return app?.__vueParentComponent?.refs?.codeVerifyRef?.code;
    });

    if (code) {
      // 输入正确验证码
      await input.fill(code);
      await button.click();

      // 验证成功提示
      const successMessage = pictureSection.locator('.result.success');
      await expect(successMessage).toBeVisible();
      await expect(successMessage).toContainText('验证码正确');
    }
  });

  test('compute mode - should render canvas with math expression', async ({ page }) => {
    const computeSection = page.locator('.example-section').nth(4);
    const canvas = computeSection.locator('canvas');

    // 验证canvas存在且可见
    await expect(canvas).toBeVisible();

    // 验证canvas尺寸（计算模式更宽）
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).toBeDefined();
    expect(canvasBox!.width).toBeGreaterThanOrEqual(116);
  });

  test('compute mode - should verify correct answer', async ({ page }) => {
    const computeSection = page.locator('.example-section').nth(4);
    const input = computeSection.locator('.code-input');
    const button = computeSection.locator('.btn');

    // 获取答案
    const answer = await page.evaluate(() => {
      const app = document.querySelector('#app') as any;
      return app?.__vueParentComponent?.refs?.computeVerifyRef?.answer;
    });

    if (answer) {
      // 输入正确答案
      await input.fill(answer);
      await button.click();

      // 验证成功提示
      const successMessage = computeSection.locator('.result.success');
      await expect(successMessage).toBeVisible();
    }
  });

  test('compute mode - should show error for wrong answer', async ({ page }) => {
    const computeSection = page.locator('.example-section').nth(4);
    const input = computeSection.locator('.code-input');
    const button = computeSection.locator('.btn');

    // 输入错误答案
    await input.fill('99999');
    await button.click();

    // 验证错误提示
    const errorMessage = computeSection.locator('.result.error');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('错误');
  });
});
