import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const publicAccessibilityRoutes = [
  { name: 'home', path: '/' },
  { name: 'contacto', path: '/contacto/' },
  { name: 'blog', path: '/blog/' },
  { name: 'producto estudiantes', path: '/productos/seguros-salud/seguro-medico-estudiantes/' },
  { name: 'artículo blog', path: '/blog/requisitos-seguro-medico-visado-estudiante-espana/' },
];

test.describe('Public accessibility checks', () => {
  for (const route of publicAccessibilityRoutes) {
    test(`${route.name} no tiene violaciones críticas`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'networkidle' });
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter((violation) =>
        ['critical', 'serious'].includes(violation.impact ?? ''),
      );
      expect(serious, `${route.path}: ${serious.map((item) => item.id).join(', ')}`).toEqual([]);
    });
  }
});
