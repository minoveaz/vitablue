/**
 * e2e/responsive.diagnostic.spec.ts — VitaBlue v2
 *
 * Fase 1.2 — Detector de Overflow Horizontal (overflow-x)
 *
 * Recorre TODAS las rutas públicas pre-renderizadas del sitemap y verifica que
 * ningún elemento tenga scrollWidth > clientWidth (desbordamiento horizontal).
 *
 * Puerta de calidad: el pipeline de CI fallará si cualquier página pública
 * presenta desbordamiento horizontal en mobile.
 *
 * Se ejecuta en los 3 proyectos: desktop, mobile y mobile-compact (375px).
 */

import { test, expect } from '@playwright/test';

/** Rutas públicas canónicas según config/routes.ts y public/sitemap.xml */
const publicRoutes = [
  // Home & EN landing
  { name: 'home-es', path: '/' },
  { name: 'home-en', path: '/en' },

  // Seguros de Salud
  { name: 'seguros-salud', path: '/productos/seguros-salud' },
  { name: 'seguro-estudiantes', path: '/productos/seguros-salud/seguro-medico-estudiantes' },
  { name: 'seguro-estudiantes-en', path: '/en/health-insurance-student-visa-spain' },
  { name: 'seguro-expatriados', path: '/productos/seguros-salud/seguro-expatriados' },
  { name: 'seguro-expatriados-en', path: '/en/health-insurance-expatriates-spain' },
  { name: 'seguro-nomadas', path: '/productos/seguros-salud/seguro-nomadas-digitales' },
  { name: 'seguro-nomadas-en', path: '/en/digital-nomad-insurance-spain' },
  { name: 'seguro-extranjeros', path: '/productos/seguros-salud/seguro-salud-extranjeros' },

  // Sanitas
  { name: 'seguros-sanitas', path: '/productos/seguros-salud/seguros-sanitas' },
  { name: 'sanitas-mas-salud', path: '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud' },
  { name: 'sanitas-students', path: '/productos/seguros-salud/seguros-sanitas/international-students' },

  // Otros productos
  { name: 'seguro-mascotas', path: '/productos/seguro-mascotas/sanitas-mascotas' },
  { name: 'asistencia-familiar', path: '/productos/seguro-para-decesos/asistencia-familiar' },
  { name: 'seguro-viaje', path: '/productos/seguro-viaje' },
  { name: 'seguro-vida', path: '/productos/seguro-vida' },

  // Blog
  { name: 'blog-es', path: '/blog' },
  { name: 'blog-en', path: '/en/blog' },
  { name: 'blog-requisitos-visado', path: '/blog/requisitos-seguro-medico-visado-estudiante-espana' },
  { name: 'blog-residencia-no-lucrativa', path: '/blog/seguro-medico-residencia-no-lucrativa-espana' },
  { name: 'blog-pareja-hecho', path: '/blog/seguro-de-salud-pareja-de-hecho-nie' },
  { name: 'blog-copago', path: '/blog/que-es-el-copago-seguro-salud' },
  { name: 'blog-periodos-carencia', path: '/blog/periodos-de-carencia-seguro-medico' },
  { name: 'blog-preexistencias', path: '/blog/preexistencias-medicas-seguro-salud' },
  { name: 'blog-visado-en', path: '/en/blog/student-visa-spain-health-insurance-requirements' },
  { name: 'blog-no-lucrativa-en', path: '/en/blog/health-insurance-spain-non-lucrative-visa-requirements' },

  // Legales
  { name: 'aviso-legal', path: '/aviso-legal' },
  { name: 'politica-privacidad', path: '/politica-privacidad' },
  { name: 'politica-cookies', path: '/politica-cookies' },
];

test.describe('📐 Mobile Responsive Layout Diagnostic — Overflow-X Detection', () => {
  for (const route of publicRoutes) {
    test(`[${route.name}] no horizontal overflow on ${route.path}`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });

      // Esperar a que el cuerpo sea visible
      await expect(page.locator('body')).toBeVisible();

      // Pequeña pausa para que animaciones CSS iniciales completen
      await page.waitForTimeout(300);

      // Check 1: body no tiene overflow horizontal
      const bodyMetrics = await page.locator('body').evaluate((el) => ({
        clientWidth: el.clientWidth,
        scrollWidth: el.scrollWidth,
        hasOverflowX: el.scrollWidth > el.clientWidth,
      }));

      expect(
        bodyMetrics.hasOverflowX,
        `[BODY] Horizontal overflow on ${route.path}! scrollWidth (${bodyMetrics.scrollWidth}px) > clientWidth (${bodyMetrics.clientWidth}px)`,
      ).toBe(false);

      // Check 2: document.documentElement tampoco debe desbordarse
      const htmlMetrics = await page.evaluate(() => {
        const el = document.documentElement;
        return {
          clientWidth: el.clientWidth,
          scrollWidth: el.scrollWidth,
          hasOverflowX: el.scrollWidth > el.clientWidth,
        };
      });

      expect(
        htmlMetrics.hasOverflowX,
        `[HTML] Horizontal overflow on ${route.path}! scrollWidth (${htmlMetrics.scrollWidth}px) > clientWidth (${htmlMetrics.clientWidth}px)`,
      ).toBe(false);

      // Check 3: ningún elemento hijo directo de body excede el viewport
      const offendingElements = await page.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth;
        const offenders: { tag: string; className: string; width: number }[] = [];
        document.querySelectorAll('body > *').forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.right > viewportWidth + 1) {
            offenders.push({
              tag: el.tagName,
              className: el.className?.toString().slice(0, 60) ?? '',
              width: Math.round(rect.right),
            });
          }
        });
        return offenders;
      });

      expect(
        offendingElements.length,
        `[CHILDREN] Overflowing child elements on ${route.path}: ${JSON.stringify(offendingElements)}`,
      ).toBe(0);
    });
  }
});
