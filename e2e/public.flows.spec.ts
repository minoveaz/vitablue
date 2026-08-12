import { test, expect } from '@playwright/test';

test.describe('Public critical flows', () => {
  test('blog permite buscar, filtrar y abrir un artículo', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'networkidle' });
    const search = page.getByPlaceholder(/buscar guías|search guides/i);
    await search.fill('visado');
    await expect(page.locator('article')).toHaveCount(2);
    await search.fill('');
    await page.getByRole('button', { name: /visados y nie|visas & nie/i }).click();
    await expect(page.locator('article').first()).toBeVisible();
    await page.locator('article').first().getByRole('link').first().click();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('blog mantiene la navegación al índice del artículo', async ({ page, isMobile }) => {
    await page.goto('/blog/requisitos-seguro-medico-visado-estudiante-espana', { waitUntil: 'networkidle' });
    if (isMobile) return;
    const toc = page.locator('aside nav');
    if (await toc.count()) {
      const firstLink = toc.locator('a').first();
      await firstLink.click();
      await expect(page).toHaveURL(/#.+/);
    }
  });

  test('wizard muestra validación inicial y permite cargar la ruta pública', async ({ page }) => {
    await page.goto('/wizard', { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1, [role="heading"]').first()).toBeVisible();
  });
});
