import { test, expect } from '@playwright/test';
import { indexablePublicRoutes } from './fixtures/publicRoutes';

test.describe('Public responsive checks', () => {
  for (const route of indexablePublicRoutes) {
    test(`${route.name} no desborda horizontalmente`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('body')).toBeVisible();
      const metrics = await page.evaluate(() => ({
        body: [document.body.scrollWidth, document.body.clientWidth],
        html: [document.documentElement.scrollWidth, document.documentElement.clientWidth],
      }));
      expect(metrics.body[0], `${route.path}: body overflow`).toBeLessThanOrEqual(metrics.body[1] + 1);
      expect(metrics.html[0], `${route.path}: html overflow`).toBeLessThanOrEqual(metrics.html[1] + 1);
    });
  }
});
