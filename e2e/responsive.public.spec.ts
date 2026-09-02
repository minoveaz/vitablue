import { test, expect } from '@playwright/test';

const publicResponsiveRoutes = [
  { name: 'home', path: '/' },
  { name: 'blog', path: '/blog/' },
  { name: 'contacto', path: '/contacto/' },
  { name: 'producto estudiantes', path: '/productos/seguros-salud/seguro-medico-estudiantes/' },
  { name: 'ciudad estudiantes', path: '/productos/seguros-salud/seguro-medico-estudiantes/madrid/' },
];

test.describe('Public responsive checks', () => {
  for (const route of publicResponsiveRoutes) {
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
