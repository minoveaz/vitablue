import { test, expect } from '@playwright/test';

test.describe('Public blog functional flows', () => {
  test('permite buscar, filtrar y abrir un artículo', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'networkidle' });
    const search = page.getByPlaceholder(/buscar guías|search guides/i);
    await search.fill('visado');
    await expect(page.locator('article').first()).toBeVisible();
    expect(await page.locator('article').count()).toBeGreaterThanOrEqual(2);
    await search.fill('');
    await page.getByRole('button', { name: /visados y nie|visas & nie/i }).click();
    await page.locator('article').first().getByRole('link').first().click();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('mantiene la navegación al índice del artículo', async ({ page, isMobile }) => {
    await page.goto('/blog/requisitos-seguro-medico-visado-estudiante-espana', { waitUntil: 'networkidle' });
    if (isMobile) return;
    const firstLink = page.locator('aside nav a').first();
    if (await firstLink.count()) {
      await firstLink.click();
      await expect(page).toHaveURL(/#.+/);
    }
  });
});
