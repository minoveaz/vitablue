import { test, expect, type Page } from '@playwright/test';
import { indexablePublicRoutes } from './fixtures/publicRoutes';

const visualRoutes = indexablePublicRoutes;

const waitForStablePage = async (page: Page) => {
  await expect(page.locator('body')).toBeVisible();
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
};

test.describe('Visual baseline - all public pages', () => {
  for (const route of visualRoutes) {
    test(`${route.name} mantiene una captura estable`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'networkidle' });
      await waitForStablePage(page);
      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        fullPage: true,
        animations: 'disabled',
        caret: 'hide',
      });
    });
  }
});

test.describe('Visual geometry diagnostics - all public pages', () => {
  for (const route of visualRoutes) {
    test(`${route.name} no tiene componentes visualmente comprimidos`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'networkidle' });
      await waitForStablePage(page);

      const diagnostics = await page.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth;
        const tables = [...document.querySelectorAll('table')].map((table) => ({
          width: Math.round(table.getBoundingClientRect().width),
          narrowCells: [...table.querySelectorAll('th, td')].filter((cell) => cell.getBoundingClientRect().width < 72).length,
          clippedCells: [...table.querySelectorAll('th, td')].filter((cell) => cell.scrollWidth > cell.clientWidth + 2).length,
        }));
        const headings = [...document.querySelectorAll('h1, h2, h3')].filter((heading) => {
          const style = getComputedStyle(heading);
          return heading.scrollWidth > heading.clientWidth + 2 || style.textOverflow === 'ellipsis';
        }).length;
        const gridOverflow = [...document.querySelectorAll('[class*="grid"]')].filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.right > viewportWidth + 1;
        }).length;

        return { tables, headings, gridOverflow };
      });

      expect(diagnostics.tables.filter((table) => table.narrowCells > 0 || table.clippedCells > 0),
        `${route.path}: tabla comprimida o con celdas cortadas: ${JSON.stringify(diagnostics.tables)}`).toEqual([]);
      expect(diagnostics.headings, `${route.path}: hay headings truncados`).toBe(0);
      expect(diagnostics.gridOverflow, `${route.path}: hay grids fuera del viewport`).toBe(0);
    });
  }
});
