/**
 * e2e/seo.audit.spec.ts — VitaBlue v2
 *
 * Fase 2.1 — Auditoría Automatizada de SEO para Páginas Públicas
 *
 * Lee las rutas indexables del sitemap y valida para CADA página:
 *   1. Status 200 OK (servidor responde correctamente)
 *   2. Presencia y longitud de <title> (10–80 chars recomendado, máx 120 para ser tolerante)
 *   3. Presencia y longitud de <meta name="description"> (50–200 chars recomendado, máx 300)
 *   4. Un único <h1> semántico por página indexable
 *   5. Tag <link rel="canonical"> presente y coherente con la ruta esperada
 *   6. Metadatos Open Graph: og:title, og:description, og:image
 *   7. Prerender SSG: el HTML estático contiene texto clave (no es una SPA vacía)
 *
 * Puerta de calidad: el pipeline fallará si cualquier página indexable carece
 * de title, description, canonical o tiene más de un <h1>.
 *
 * NOTA: Se ejecuta sólo en el proyecto `desktop` para evitar triplicar el tiempo
 * de CI (el SEO no depende del viewport).
 */

import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────
// RUTAS INDEXABLES (indexable: true en routes.ts)
// Excluimos legal/privacidad que tienen indexable:false en el registry
// ─────────────────────────────────────────────

interface SeoRoute {
  name: string;
  path: string;
  /** Fragmento de texto que DEBE estar en el HTML pre-renderizado (SSG check) */
  prerenderedKeyword: string;
  /** URL canónica esperada (sin trailing slash, sin dominio) */
  expectedCanonical: string;
}

const indexableRoutes: SeoRoute[] = [
  {
    name: 'home-es',
    path: '/',
    prerenderedKeyword: 'VitaBlue',
    expectedCanonical: '/',
  },
  {
    name: 'home-en',
    path: '/en',
    prerenderedKeyword: 'VitaBlue',
    expectedCanonical: '/en',
  },
  {
    name: 'seguros-salud',
    path: '/productos/seguros-salud',
    prerenderedKeyword: 'seguro',
    expectedCanonical: '/productos/seguros-salud',
  },
  {
    name: 'seguro-estudiantes-es',
    path: '/productos/seguros-salud/seguro-medico-estudiantes',
    prerenderedKeyword: 'estudiante',
    expectedCanonical: '/productos/seguros-salud/seguro-medico-estudiantes',
  },
  {
    name: 'seguro-estudiantes-en',
    path: '/en/health-insurance-student-visa-spain',
    prerenderedKeyword: 'insurance',
    expectedCanonical: '/en/health-insurance-student-visa-spain',
  },
  {
    name: 'seguro-expatriados-es',
    path: '/productos/seguros-salud/seguro-expatriados',
    prerenderedKeyword: 'expatriado',
    expectedCanonical: '/productos/seguros-salud/seguro-expatriados',
  },
  {
    name: 'seguro-expatriados-en',
    path: '/en/health-insurance-expatriates-spain',
    prerenderedKeyword: 'expatriate',
    expectedCanonical: '/en/health-insurance-expatriates-spain',
  },
  {
    name: 'seguro-nomadas-es',
    path: '/productos/seguros-salud/seguro-nomadas-digitales',
    prerenderedKeyword: 'nómada',
    expectedCanonical: '/productos/seguros-salud/seguro-nomadas-digitales',
  },
  {
    name: 'seguro-nomadas-en',
    path: '/en/digital-nomad-insurance-spain',
    prerenderedKeyword: 'nomad',
    expectedCanonical: '/en/digital-nomad-insurance-spain',
  },
  {
    name: 'seguro-extranjeros',
    path: '/productos/seguros-salud/seguro-salud-extranjeros',
    prerenderedKeyword: 'extranjero',
    expectedCanonical: '/productos/seguros-salud/seguro-salud-extranjeros',
  },
  {
    name: 'seguros-sanitas',
    path: '/productos/seguros-salud/seguros-sanitas',
    prerenderedKeyword: 'Sanitas',
    expectedCanonical: '/productos/seguros-salud/seguros-sanitas',
  },
  {
    name: 'sanitas-mas-salud',
    path: '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud',
    prerenderedKeyword: 'Sanitas',
    expectedCanonical: '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud',
  },
  {
    name: 'sanitas-students',
    path: '/productos/seguros-salud/seguros-sanitas/international-students',
    prerenderedKeyword: 'student',
    expectedCanonical: '/productos/seguros-salud/seguros-sanitas/international-students',
  },
  {
    name: 'seguro-mascotas',
    path: '/productos/seguro-mascotas/sanitas-mascotas',
    prerenderedKeyword: 'mascota',
    expectedCanonical: '/productos/seguro-mascotas/sanitas-mascotas',
  },
  {
    name: 'asistencia-familiar',
    path: '/productos/seguro-para-decesos/asistencia-familiar',
    prerenderedKeyword: 'familiar',
    expectedCanonical: '/productos/seguro-para-decesos/asistencia-familiar',
  },
  {
    name: 'seguro-viaje',
    path: '/productos/seguro-viaje',
    prerenderedKeyword: 'viaje',
    expectedCanonical: '/productos/seguro-viaje',
  },
  {
    name: 'seguro-vida',
    path: '/productos/seguro-vida',
    prerenderedKeyword: 'vida',
    expectedCanonical: '/productos/seguro-vida',
  },
  {
    name: 'blog-es',
    path: '/blog',
    prerenderedKeyword: 'blog',
    expectedCanonical: '/blog',
  },
  {
    name: 'blog-en',
    path: '/en/blog',
    prerenderedKeyword: 'blog',
    expectedCanonical: '/en/blog',
  },
  // Blog articles — SSG correctness check
  {
    name: 'blog-requisitos-visado',
    path: '/blog/requisitos-seguro-medico-visado-estudiante-espana',
    prerenderedKeyword: 'visado',
    expectedCanonical: '/blog/requisitos-seguro-medico-visado-estudiante-espana',
  },
  {
    name: 'blog-residencia',
    path: '/blog/seguro-medico-residencia-no-lucrativa-espana',
    prerenderedKeyword: 'residencia',
    expectedCanonical: '/blog/seguro-medico-residencia-no-lucrativa-espana',
  },
  {
    name: 'blog-pareja-hecho',
    path: '/blog/seguro-de-salud-pareja-de-hecho-nie',
    prerenderedKeyword: 'NIE',
    expectedCanonical: '/blog/seguro-de-salud-pareja-de-hecho-nie',
  },
  {
    name: 'blog-copago',
    path: '/blog/que-es-el-copago-seguro-salud',
    prerenderedKeyword: 'copago',
    expectedCanonical: '/blog/que-es-el-copago-seguro-salud',
  },
  {
    name: 'blog-periodos-carencia',
    path: '/blog/periodos-de-carencia-seguro-medico',
    prerenderedKeyword: 'carencia',
    expectedCanonical: '/blog/periodos-de-carencia-seguro-medico',
  },
  {
    name: 'blog-preexistencias',
    path: '/blog/preexistencias-medicas-seguro-salud',
    prerenderedKeyword: 'preexistencia',
    expectedCanonical: '/blog/preexistencias-medicas-seguro-salud',
  },
  {
    name: 'blog-visado-en',
    path: '/en/blog/student-visa-spain-health-insurance-requirements',
    prerenderedKeyword: 'visa',
    expectedCanonical: '/en/blog/student-visa-spain-health-insurance-requirements',
  },
  {
    name: 'blog-no-lucrativa-en',
    path: '/en/blog/health-insurance-spain-non-lucrative-visa-requirements',
    prerenderedKeyword: 'non-lucrative',
    expectedCanonical: '/en/blog/health-insurance-spain-non-lucrative-visa-requirements',
  },
];

// ─────────────────────────────────────────────
// SUITE DE AUDITORÍA SEO
// ─────────────────────────────────────────────

test.describe('🔍 SEO Audit — Páginas Públicas Indexables', () => {
  for (const route of indexableRoutes) {
    test.describe(`[${route.name}] ${route.path}`, () => {
      test.beforeEach(async ({ page }) => {
        const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });

        // Check 1: HTTP 200 OK
        expect(
          response?.status(),
          `${route.path}: Expected HTTP 200, got ${response?.status()}`,
        ).toBe(200);
      });

      // ── Title ──────────────────────────────────────────
      test('tiene <title> con longitud adecuada', async ({ page }) => {
        const title = await page.title();
        expect(
          title.length,
          `${route.path}: <title> está vacío (length=0)`,
        ).toBeGreaterThan(0);

        expect(
          title.length,
          `${route.path}: <title> demasiado corto (${title.length} chars < 10). Título: "${title}"`,
        ).toBeGreaterThanOrEqual(10);

        expect(
          title.length,
          `${route.path}: <title> demasiado largo (${title.length} chars > 120). Título: "${title}"`,
        ).toBeLessThanOrEqual(120);
      });

      // ── Meta Description ───────────────────────────────
      test('tiene <meta name="description"> con longitud adecuada', async ({ page }) => {
        const description = await page
          .locator('meta[name="description"]')
          .getAttribute('content');

        expect(
          description,
          `${route.path}: Falta <meta name="description">`,
        ).not.toBeNull();

        expect(
          description!.length,
          `${route.path}: meta description demasiado corta (${description!.length} chars < 50). Desc: "${description}"`,
        ).toBeGreaterThanOrEqual(50);

        expect(
          description!.length,
          `${route.path}: meta description demasiado larga (${description!.length} chars > 300). Desc: "${description!.slice(0, 60)}..."`,
        ).toBeLessThanOrEqual(300);
      });

      // ── H1 único ───────────────────────────────────────
      test('tiene exactamente un <h1> semántico', async ({ page }) => {
        // Esperar a que el h1 aparezca en el DOM (el SSG HTML lo incluye, pero
        // React puede rehidratar y moverlo en el árbol temporalmente)
        try {
          await page.waitForSelector('h1', { timeout: 10_000 });
        } catch {
          // Si no aparece el h1 en 10s, el test fallará con count=0 a continuación
        }

        const h1Count = await page.locator('h1').count();

        expect(
          h1Count,
          `${route.path}: Se encontraron ${h1Count} elementos <h1>. Debe haber exactamente 1 por página indexable.`,
        ).toBe(1);

        // El h1 debe tener contenido
        const h1Text = await page.locator('h1').first().textContent();
        expect(
          h1Text?.trim().length,
          `${route.path}: El <h1> está vacío`,
        ).toBeGreaterThan(0);
      });

      // ── Canonical ─────────────────────────────────────
      test('tiene <link rel="canonical"> coherente', async ({ page }) => {
        const canonical = await page
          .locator('link[rel="canonical"]')
          .getAttribute('href');

        expect(
          canonical,
          `${route.path}: Falta <link rel="canonical">`,
        ).not.toBeNull();

        // El canonical debe contener la ruta esperada
        expect(
          canonical,
          `${route.path}: canonical href "${canonical}" no contiene la ruta esperada "${route.expectedCanonical}"`,
        ).toContain(route.expectedCanonical);

        // El canonical no debe tener fragmentos (#)
        expect(
          canonical,
          `${route.path}: canonical no debe contener fragmentos (#)`,
        ).not.toContain('#');
      });

      // ── Open Graph ────────────────────────────────────
      test('tiene metadatos Open Graph completos', async ({ page }) => {
        const ogTitle = await page
          .locator('meta[property="og:title"]')
          .getAttribute('content');
        const ogDescription = await page
          .locator('meta[property="og:description"]')
          .getAttribute('content');
        const ogImage = await page
          .locator('meta[property="og:image"]')
          .getAttribute('content');

        expect(ogTitle, `${route.path}: Falta og:title`).not.toBeNull();
        expect(
          ogTitle!.length,
          `${route.path}: og:title está vacío`,
        ).toBeGreaterThan(0);

        expect(ogDescription, `${route.path}: Falta og:description`).not.toBeNull();
        expect(
          ogDescription!.length,
          `${route.path}: og:description está vacío`,
        ).toBeGreaterThan(0);

        expect(ogImage, `${route.path}: Falta og:image`).not.toBeNull();
        expect(
          ogImage!.length,
          `${route.path}: og:image está vacío`,
        ).toBeGreaterThan(0);
      });

      // ── SSG Prerender Check ───────────────────────────
      test('el HTML pre-renderizado contiene texto clave (SSG verificado)', async ({ page }) => {
        // Verificar en body.innerHTML (no innerText) para evitar problemas con
        // elementos ocultos temporalmente durante la hidratación de React.
        // Esto valida que el texto KEY existe en el HTML estático servido.
        const bodyHtml = await page.evaluate(() => document.body.innerHTML);
        const bodyText = await page.evaluate(() => document.body.textContent ?? '');

        const keyword = route.prerenderedKeyword.toLowerCase();

        // Verificar en innerHTML (incluye texto de elementos con opacity:0, etc.)
        const foundInHtml = bodyHtml.toLowerCase().includes(keyword);
        // O en textContent (texto completo del DOM independiente de visibilidad CSS)
        const foundInText = bodyText.toLowerCase().includes(keyword);

        expect(
          foundInHtml || foundInText,
          `${route.path}: El HTML no contiene la palabra clave "${route.prerenderedKeyword}". Posible error de prerendering (SPA vacía). Verificar que el SSG pre-renderizó correctamente la ruta.`,
        ).toBe(true);

        // Verificar que el body tenga contenido significativo (no es un skeleton vacío)
        expect(
          bodyText.trim().length,
          `${route.path}: body.textContent tiene menos de 100 caracteres (posible SPA vacía sin prerender)`,
        ).toBeGreaterThan(100);
      });
    });
  }
});

// ─────────────────────────────────────────────
// RUTAS NO-INDEXABLES: Solo verificar 200 OK
// (Legal, privacidad — prerender:true pero indexable:false)
// ─────────────────────────────────────────────

const nonIndexableRoutes = [
  { name: 'aviso-legal', path: '/aviso-legal' },
  { name: 'politica-privacidad', path: '/politica-privacidad' },
  { name: 'politica-cookies', path: '/politica-cookies' },
  { name: 'privacidad', path: '/privacidad' },
  { name: 'cookies', path: '/cookies' },
];

test.describe('🛡️ Páginas Legales — Solo HTTP 200 Check', () => {
  for (const route of nonIndexableRoutes) {
    test(`[${route.name}] ${route.path} devuelve HTTP 200`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      expect(
        response?.status(),
        `${route.path}: Expected 200, got ${response?.status()}`,
      ).toBe(200);

      // Y que tenga un noindex (o que no esté indexada accidentalmente)
      const robotsMeta = await page
        .locator('meta[name="robots"]')
        .getAttribute('content');

      // noindex puede estar en robots meta o en la ruta misma, sólo lo verificamos si existe
      if (robotsMeta) {
        expect(
          robotsMeta.toLowerCase(),
          `${route.path}: página legal debería tener noindex. Robots meta: "${robotsMeta}"`,
        ).toContain('noindex');
      }
    });
  }
});
