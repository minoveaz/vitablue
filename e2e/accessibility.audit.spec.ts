import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { publicRoutes } from './fixtures/publicRoutes';

test.describe('Accessibility audit - public pages', () => {
  for (const route of publicRoutes.filter((item) => item.indexable)) {
    test(`${route.name} no tiene violaciones Axe críticas`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'networkidle' });
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact || ''));
      expect(serious, `${route.path}: ${serious.map((item) => item.id).join(', ')}`).toEqual([]);
    });
  }
});
