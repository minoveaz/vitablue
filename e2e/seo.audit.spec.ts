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
import { indexablePublicRoutes } from './fixtures/publicRoutes';

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

const prerenderedKeywords: Record<string, string> = {
  '/productos/seguros-salud': 'seguro',
  '/productos/seguros-salud/seguro-medico-estudiantes': 'estudiante',
  '/en/health-insurance-student-visa-spain': 'insurance',
  '/productos/seguros-salud/seguro-expatriados': 'expatriado',
  '/en/health-insurance-expatriates-spain': 'expatriate',
  '/productos/seguros-salud/seguro-nomadas-digitales': 'nómada',
  '/en/digital-nomad-insurance-spain': 'nomad',
  '/productos/seguros-salud/seguro-salud-extranjeros': 'extranjero',
  '/productos/seguros-salud/seguros-sanitas': 'Sanitas',
  '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud': 'Sanitas',
  '/productos/seguros-salud/seguros-sanitas/international-students': 'student',
  '/productos/seguro-mascotas/sanitas-mascotas': 'mascota',
  '/productos/seguro-para-decesos/asistencia-familiar': 'familiar',
  '/productos/seguro-viaje': 'viaje',
  '/productos/seguro-vida': 'vida',
  '/sobre-nosotros': 'nosotros',
  '/en/about-us': 'about',
  '/contacto': 'contacto',
  '/en/contact': 'contact',
  '/blog/requisitos-seguro-medico-visado-estudiante-espana': 'visado',
  '/blog/seguro-medico-residencia-no-lucrativa-espana': 'residencia',
  '/blog/seguro-de-salud-pareja-de-hecho-nie': 'NIE',
  '/blog/que-es-el-copago-seguro-salud': 'copago',
  '/blog/periodos-de-carencia-seguro-medico': 'carencia',
  '/blog/preexistencias-medicas-seguro-salud': 'preexistencia',
  '/blog/precios-seguro-medico-visado-estudiante-espana': 'precio',
  '/blog/certificado-seguro-medico-visado-estudiante-consulado': 'certificado',
  '/blog/seguro-salud-nomadas-digitales-espana-requisitos': 'nómada',
  '/blog/sanitas-vs-adeslas-vs-asisa-vs-dkv-comparativa-seguros-salud': 'Asisa',
  '/blog/seguro-salud-mayores-65-anos-espana-precios': 'mayores',
  '/en/blog/student-visa-spain-health-insurance-requirements': 'visa',
  '/en/blog/health-insurance-spain-non-lucrative-visa-requirements': 'non-lucrative',
  '/en/blog/digital-nomad-health-insurance-spain-requirements': 'Nomad',
  '/en/blog/student-visa-spain-health-insurance-prices': 'Prices',
  '/en/blog/consular-health-insurance-certificate-spain-visa': 'Certificate',
  '/en/blog/sanitas-vs-adeslas-vs-asisa-vs-dkv-health-insurance-spain': 'Sanitas',
  '/en/blog/health-insurance-spain-seniors-over-65-prices': 'Seniors',
  '/en/blog/pregnancy-maternity-waiting-periods-health-insurance-spain': 'Maternity',
  '/productos/seguros-salud/seguro-medico-estudiantes/colombia': 'Bogotá',
  '/productos/seguros-salud/seguro-medico-estudiantes/mexico': 'México',
  '/productos/seguros-salud/seguro-medico-estudiantes/peru': 'Lima',
  '/productos/seguros-salud/seguro-medico-estudiantes/argentina': 'Buenos Aires',
  '/productos/seguros-salud/seguro-medico-estudiantes/ecuador': 'Ecuador',
  '/validador-visado': 'Validador',
};





const indexableRoutes: SeoRoute[] = indexablePublicRoutes.map((route) => ({
  name: route.name,
  path: route.path,
  prerenderedKeyword: prerenderedKeywords[route.path] ?? (route.path === '/' || route.path === '/en' ? 'VitaBlue' : route.path.split('/').pop()?.split('-')[0] || 'VitaBlue'),
  expectedCanonical: route.expectedCanonical,
}));


/*
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
]; */

// ─────────────────────────────────────────────
// SUITE DE AUDITORÍA SEO
// ─────────────────────────────────────────────

test.describe('🔍 SEO Audit — Páginas Públicas Indexables', () => {
  for (const route of indexableRoutes) {
    test(`[${route.name}] ${route.path} cumple todos los criterios SEO`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: 'networkidle' });

      // Check 1: HTTP 200 OK
      expect(
        response?.status(),
        `${route.path}: Expected HTTP 200, got ${response?.status()}`,
      ).toBe(200);

      // ── Title ──────────────────────────────────────────
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

      // ── Meta Description ───────────────────────────────
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

      // ── H1 único ───────────────────────────────────────
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

      const h1Text = await page.locator('h1').first().textContent();
      expect(
        h1Text?.trim().length,
        `${route.path}: El <h1> está vacío`,
      ).toBeGreaterThan(0);

      // ── Canonical ─────────────────────────────────────
      const canonicalLocator = page.locator('link[rel="canonical"]');
      await expect(canonicalLocator).toBeAttached({ timeout: 5000 });

      await expect(canonicalLocator).toHaveAttribute(
        'href',
        new RegExp(route.expectedCanonical),
        { timeout: 5000 }
      );

      const canonical = await canonicalLocator.getAttribute('href');
      expect(
        canonical,
        `${route.path}: canonical no debe contener fragmentos (#)`,
      ).not.toContain('#');

      // ── Open Graph ────────────────────────────────────
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

      // ── SSG Prerender Check ───────────────────────────
      const bodyHtml = await page.evaluate(() => document.body.innerHTML);
      const bodyText = await page.evaluate(() => document.body.textContent ?? '');

      const keyword = route.prerenderedKeyword.toLowerCase();
      const foundInHtml = bodyHtml.toLowerCase().includes(keyword);
      const foundInText = bodyText.toLowerCase().includes(keyword);

      expect(
        foundInHtml || foundInText,
        `${route.path}: El HTML no contiene la palabra clave "${route.prerenderedKeyword}". Posible error de prerendering (SPA vacía).`,
      ).toBe(true);

      expect(
        bodyText.trim().length,
        `${route.path}: body.textContent tiene menos de 100 caracteres (posible SPA vacía sin prerender)`,
      ).toBeGreaterThan(100);
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

test.describe('🛡️ Páginas Legales — Noindex y Exclusión de Sitemap', () => {
  for (const route of nonIndexableRoutes) {
    test(`[${route.name}] ${route.path} devuelve HTTP 200 y meta noindex`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      expect(
        response?.status(),
        `${route.path}: Expected 200, got ${response?.status()}`,
      ).toBe(200);

      // Debe contener explícitamente noindex
      const robotsMeta = await page
        .locator('meta[name="robots"]')
        .getAttribute('content');

      expect(
        robotsMeta?.toLowerCase() ?? '',
        `${route.path}: página legal debe tener <meta name="robots" content="noindex">`,
      ).toContain('noindex');
    });
  }

  test('El sitemap.xml no contiene ninguna URL de páginas legales ni de cookies', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const sitemapText = await response.text();

    for (const route of nonIndexableRoutes) {
      expect(
        sitemapText,
        `La URL ${route.path} no debe estar presente en el sitemap.xml`,
      ).not.toContain(`<loc>https://www.vitablue.es${route.path}</loc>`);
    }
  });

  test('El sitemap.xml incluye namespace xhtml y enlaces hreflang alternativos para páginas multilingües', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const sitemapText = await response.text();

    expect(sitemapText).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(sitemapText).toContain('<xhtml:link rel="alternate" hreflang="es" href="https://www.vitablue.es/" />');
    expect(sitemapText).toContain('<xhtml:link rel="alternate" hreflang="en" href="https://www.vitablue.es/en/" />');
    expect(sitemapText).toContain('<xhtml:link rel="alternate" hreflang="x-default" href="https://www.vitablue.es/" />');
  });
});
