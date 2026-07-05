import { expect, test } from '@playwright/test';

test('renders a full-viewport nonblank 3D island canvas', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.waitForFunction(() => window.__EGGY_ISLAND_READY__ === true);
  await page.waitForTimeout(500);

  const canvas = page.locator('canvas[data-scene="eggy-island"]');
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();

  expect(Math.abs((box?.width ?? 0) - (viewport?.width ?? 0))).toBeLessThanOrEqual(2);
  expect(Math.abs((box?.height ?? 0) - (viewport?.height ?? 0))).toBeLessThanOrEqual(2);

  const pixels = await canvas.evaluate((element) => {
    const canvasElement = element as HTMLCanvasElement;
    const gl = (
      canvasElement.getContext('webgl2') ??
      canvasElement.getContext('webgl') ??
      canvasElement.getContext('experimental-webgl')
    ) as WebGLRenderingContext | WebGL2RenderingContext | null;

    if (!gl) {
      return { width: canvasElement.width, height: canvasElement.height, varied: 0, samples: 0 };
    }

    const width = canvasElement.width;
    const height = canvasElement.height;
    const buffer = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, buffer);

    const buckets = new Set<string>();
    let varied = 0;
    let variedLuma = 0;
    let samples = 0;

    for (let index = 0; index < buffer.length; index += 4 * 19) {
      const red = buffer[index];
      const green = buffer[index + 1];
      const blue = buffer[index + 2];
      const alpha = buffer[index + 3];
      if (alpha === 0) {
        continue;
      }

      samples += 1;
      buckets.add(`${red >> 4}-${green >> 4}-${blue >> 4}`);
      const isSky = Math.abs(red - 142) < 10 && Math.abs(green - 215) < 10 && Math.abs(blue - 255) < 10;
      if (!isSky) {
        varied += 1;
        variedLuma += red * 0.2126 + green * 0.7152 + blue * 0.0722;
      }
    }

    return {
      width,
      height,
      varied,
      samples,
      buckets: buckets.size,
      averageVariedLuma: varied === 0 ? 0 : variedLuma / varied,
    };
  });

  expect(pixels.width).toBeGreaterThan(300);
  expect(pixels.height).toBeGreaterThan(300);
  expect(pixels.samples).toBeGreaterThan(1000);
  expect(pixels.varied).toBeGreaterThan(100);
  expect(pixels.buckets).toBeGreaterThan(8);
  expect(pixels.averageVariedLuma).toBeGreaterThan(45);

  await page.screenshot({
    path: `test-results/${testInfo.project.name}-eggy-island.png`,
    fullPage: true,
  });
});
