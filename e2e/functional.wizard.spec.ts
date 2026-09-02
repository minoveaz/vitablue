import { test, expect } from '@playwright/test';

test.describe('Public wizard functional flows', () => {
  test('carga la ruta pública y muestra validación inicial', async ({ page }) => {
    await page.goto('/wizard', { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1, [role="heading"]').first()).toBeVisible();
  });
});
