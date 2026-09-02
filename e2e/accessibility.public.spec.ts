import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { indexablePublicRoutes } from './fixtures/publicRoutes';

test.describe('Public accessibility checks', () => {
  for (const route of indexablePublicRoutes) {
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
