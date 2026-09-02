import { test, expect } from '@playwright/test';

const publicSmokeRoutes = [
  { name: 'home ES', path: '/' },
  { name: 'home EN', path: '/en/' },
  { name: 'contacto', path: '/contacto/' },
  { name: 'blog', path: '/blog/' },
  { name: 'seguro estudiantes', path: '/productos/seguros-salud/seguro-medico-estudiantes/' },
];

test.describe('Public smoke checks', () => {
  for (const route of publicSmokeRoutes) {
    test(`${route.name} carga como página pública`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });

      expect(response?.status(), `${route.path} debe responder 200`).toBe(200);
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('body')).not.toContainText(/404|page not found|página no encontrada/i);
    });
  }
});
