import { test, expect } from '@playwright/test';
import { publicRoutes } from './fixtures/publicRoutes';

test.describe('Runtime audit - public pages', () => {
  for (const route of publicRoutes.filter((item) => item.indexable)) {
    test(`${route.name} no emite errores de consola ni recursos rotos`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const failedRequests: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('requestfailed', (request) => {
        const url = request.url();
        // Solo considerar recursos locales de la app para evitar que fallos externos (como Google Fonts o CDNs) rompan el test por red en CI
        if (url.includes('127.0.0.1') || url.includes('localhost') || !url.startsWith('http')) {
          failedRequests.push(`${request.method()} ${url} :: ${request.failure()?.errorText || 'failed'}`);
        }
      });

      const response = await page.goto(route.path, { waitUntil: 'networkidle' });
      expect(response?.status(), `${route.path} debe responder 200`).toBe(200);
      await expect(page.locator('body')).toBeVisible();
      await page.locator('img').evaluateAll((images) => images.forEach((image) => image.scrollIntoView({ block: 'center' })));
      await page.waitForTimeout(800);

      const brokenImages = await page.locator('img').evaluateAll((images) => images
        .map((image) => image as HTMLImageElement)
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute('src') || image.getAttribute('alt') || 'unknown-image'));
      expect(brokenImages, `${route.path} tiene imágenes rotas`).toEqual([]);
      expect(failedRequests, `${route.path} tiene requests fallidas`).toEqual([]);
      expect(consoleErrors, `${route.path} emite errores de consola`).toEqual([]);
    });

    test(`${route.name} no contiene enlaces internos rotos`, async ({ page, request }) => {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      const links = await page.locator('a[href]').evaluateAll((anchors) => anchors
        .map((anchor) => (anchor as HTMLAnchorElement).href)
        .filter((href) => href.startsWith(window.location.origin))
        .map((href) => new URL(href).pathname)
        .filter((path, index, paths) => paths.indexOf(path) === index));

      for (const link of links) {
        const linkResponse = await request.get(link);
        expect(linkResponse.status(), `${route.path} enlaza a ${link}`).toBeLessThan(400);
      }
    });
  }
});
