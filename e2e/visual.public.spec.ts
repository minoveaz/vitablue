import { test, expect } from '@playwright/test';

const visualRoutes = [
  { name: 'home', path: '/' },
  { name: 'blog', path: '/blog/' },
];

test.describe('Public visual baselines', () => {
  for (const route of visualRoutes) {
    test(`${route.name} mantiene su estructura visual pública`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'networkidle' });
      await expect(page.locator('body')).toBeVisible();
      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});
