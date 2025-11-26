import { test, expect } from '@playwright/test';

test.describe('PointsVerify Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render canvas with text overlay', async ({ page }) => {
    const pointsSection = page.locator('.example-section').nth(2);
    const canvas = pointsSection.locator('canvas');

    // 验证canvas存在
    await expect(canvas).toBeVisible();

    // 验证canvas尺寸
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).toBeDefined();
    expect(canvasBox!.width).toBe(310);
    expect(canvasBox!.height).toBe(155);
  });

  test('should track user clicks on canvas', async ({ page }) => {
    const pointsSection = page.locator('.example-section').nth(2);
    const canvas = pointsSection.locator('canvas');

    // 获取canvas位置
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).toBeDefined();

    // 点击canvas三次（默认需要3个点）
    await page.mouse.click(canvasBox!.x + 50, canvasBox!.y + 50);
    await page.waitForTimeout(200);

    await page.mouse.click(canvasBox!.x + 150, canvasBox!.y + 80);
    await page.waitForTimeout(200);

    await page.mouse.click(canvasBox!.x + 250, canvasBox!.y + 120);
    await page.waitForTimeout(500);

    // 验证点击后有事件日志记录
    const eventLog = page.locator('.event-log');
    const logText = await eventLog.textContent();

    // 应该有点选验证相关的日志
    expect(logText).toContain('点选验证');
  });

  test('should show refresh button', async ({ page }) => {
    const pointsSection = page.locator('.example-section').nth(2);

    // 验证刷新按钮存在
    const refreshBtn = pointsSection.locator('.verify-refresh');
    await expect(refreshBtn).toBeVisible();
  });

  test('should reset on refresh button click', async ({ page }) => {
    const pointsSection = page.locator('.example-section').nth(2);
    const canvas = pointsSection.locator('canvas');
    const refreshBtn = pointsSection.locator('.verify-refresh');

    // 获取初始状态
    const initialScreenshot = await canvas.screenshot();

    // 点击刷新
    await refreshBtn.click();
    await page.waitForTimeout(500);

    // 获取刷新后状态
    const refreshedScreenshot = await canvas.screenshot();

    // 验证内容已改变
    expect(initialScreenshot.equals(refreshedScreenshot)).toBe(false);
  });

  test('should display status text', async ({ page }) => {
    const pointsSection = page.locator('.example-section').nth(2);

    // 验证有状态文本显示
    const statusText = pointsSection.locator('.verify-msg');
    await expect(statusText).toBeVisible();
  });
});
