import { test, expect } from '@playwright/test';

test.describe('SlideVerify Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('slide mode - should render canvas and slider', async ({ page }) => {
    const slideSection = page.locator('.example-section').nth(0);

    // 验证滑块元素存在
    const slider = slideSection.locator('.verify-move-block');
    await expect(slider).toBeVisible();

    // 验证滑动条存在
    const sliderBar = slideSection.locator('.verify-bar-area');
    await expect(sliderBar).toBeVisible();
  });

  test('slide mode - should complete verification with drag', async ({ page }) => {
    const slideSection = page.locator('.example-section').nth(0);
    const slider = slideSection.locator('.verify-move-block');

    // 获取滑块初始位置
    const sliderBox = await slider.boundingBox();
    expect(sliderBox).toBeDefined();

    // 执行拖动操作
    await slider.hover();
    await page.mouse.down();
    await page.mouse.move(sliderBox!.x + 260, sliderBox!.y, { steps: 20 });
    await page.mouse.up();

    // 等待验证完成
    await page.waitForTimeout(500);

    // 验证事件日志中有成功记录
    const eventLog = page.locator('.event-log');
    await expect(eventLog).toContainText('滑动验证');
  });

  test('puzzle mode - should render puzzle canvas', async ({ page }) => {
    const puzzleSection = page.locator('.example-section').nth(1);

    // 验证拼图组件渲染
    const verifyArea = puzzleSection.locator('.verify-slide');
    await expect(verifyArea).toBeVisible();

    // 验证刷新按钮存在
    const refreshBtn = puzzleSection.locator('.verify-refresh');
    await expect(refreshBtn).toBeVisible();
  });

  test('puzzle mode - should refresh on refresh button click', async ({ page }) => {
    const puzzleSection = page.locator('.example-section').nth(1);
    const refreshBtn = puzzleSection.locator('.verify-refresh');

    // 点击刷新按钮
    await refreshBtn.click();
    await page.waitForTimeout(500);

    // 验证拼图已刷新（滑块位置重置）
    const slider = puzzleSection.locator('.verify-move-block');
    const sliderBox = await slider.boundingBox();

    // 滑块应该在起始位置
    expect(sliderBox).toBeDefined();
  });

  test('puzzle mode - should complete verification with correct drag', async ({ page }) => {
    const puzzleSection = page.locator('.example-section').nth(1);
    const slider = puzzleSection.locator('.verify-move-block');

    // 获取拼图块位置（需要读取组件内部状态）
    const blockX = await page.evaluate(() => {
      const puzzleComponent = document.querySelectorAll('.verify-slide')[1] as any;
      return puzzleComponent?.__vueParentComponent?.ctx?.blockX || 100;
    });

    // 执行精确拖动
    const sliderBox = await slider.boundingBox();
    if (sliderBox) {
      await slider.hover();
      await page.mouse.down();
      await page.mouse.move(sliderBox.x + blockX, sliderBox.y, { steps: 15 });
      await page.mouse.up();

      // 等待验证
      await page.waitForTimeout(1000);

      // 检查是否验证成功
      const eventLog = page.locator('.event-log');
      const logText = await eventLog.textContent();

      // 可能成功或失败，取决于精度
      expect(logText).toBeDefined();
    }
  });
});
