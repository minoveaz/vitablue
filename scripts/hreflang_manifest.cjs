const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const routesSource = fs.readFileSync(path.join(root, 'config', 'routes.ts'), 'utf8');
const blogSource = fs.readFileSync(path.join(root, 'utils', 'blogData.ts'), 'utf8');

const siteOrigin = 'https://www.vitablue.es';
const spanishOnlyPaths = new Set([
  '/productos/seguro-mascotas/sanitas-mascotas',
  '/productos/seguro-vida',
  '/productos/seguro-viaje',
  '/productos/seguro-para-decesos/asistencia-familiar',
]);

const canonicalPages = [...routesSource.matchAll(/canonical\('([^']+)',\s*\{([\s\S]*?)\}\)/g)]
  .filter(([, , options]) => /sitemap:\s*true/.test(options))
  .map(([, pagePath, options]) => ({
    path: pagePath,
    locale: options.match(/locale:\s*'([^']+)'/)?.[1],
    alternatePath: options.match(/alternate:\s*'([^']+)'/)?.[1],
  }))
  .filter(({ locale }) => locale === 'es' || locale === 'en');

const blogPath = (locale, slug) => `${locale === 'en' ? '/en' : ''}/blog/${slug}`;
const blogPages = blogSource
  .split(/\n\s*\{\s*\n?\s*slug:\s*'/)
  .slice(1)
  .map((block) => {
    const slug = block.split("'")[0];
    const locale = block.match(/lang:\s*'([^']+)'/)?.[1] === 'en' ? 'en' : 'es';
    const alternateSlug = block.match(/alternateSlug:\s*'([^']+)'/)?.[1];
    return {
      path: blogPath(locale, slug),
      locale,
      alternatePath: alternateSlug ? blogPath(locale === 'en' ? 'es' : 'en', alternateSlug) : undefined,
    };
  });

const pages = [...canonicalPages, ...blogPages];
const pageMap = new Map(pages.map((page) => [page.path, page]));

function isLatamSpanishPage(pagePath) {
  return !spanishOnlyPaths.has(pagePath);
}

function getSpanishPage(page) {
  if (page.locale === 'es') return page;
  return page.alternatePath ? pageMap.get(page.alternatePath) : undefined;
}

function buildAlternates(page) {
  const spanishPage = getSpanishPage(page);
  const englishPath = page.locale === 'en' ? page.path : page.alternatePath;
  const alternates = [];
  const absolute = (pagePath) => `${siteOrigin}${pagePath}${pagePath.endsWith('/') ? '' : '/'}`;

  if (spanishPage) {
    alternates.push({ hreflang: 'es-ES', href: absolute(spanishPage.path) });
    if (isLatamSpanishPage(spanishPage.path)) {
      alternates.push({ hreflang: 'es-419', href: absolute(spanishPage.path) });
    }
  }
  if (englishPath && pageMap.has(englishPath)) {
    alternates.push({ hreflang: 'en', href: absolute(englishPath) });
  }

  const xDefaultPath = englishPath && pageMap.has(englishPath) ? englishPath : '/en';
  alternates.push({ hreflang: 'x-default', href: absolute(xDefaultPath) });
  return alternates;
}

function getPageForRoute(route) {
  return pageMap.get(route);
}

function validateManifest() {
  const errors = [];
  const seenPaths = new Set();

  for (const page of pages) {
    if (seenPaths.has(page.path)) errors.push(`Ruta duplicada: ${page.path}`);
    seenPaths.add(page.path);

    if (page.alternatePath && !pageMap.has(page.alternatePath)) {
      errors.push(`${page.path}: alternate inexistente ${page.alternatePath}`);
      continue;
    }
    if (page.alternatePath && pageMap.get(page.alternatePath).alternatePath !== page.path) {
      errors.push(`${page.path}: alternate no recíproco con ${page.alternatePath}`);
    }
  }

  return errors;
}

module.exports = {
  buildAlternates,
  getPageForRoute,
  pageMap,
  pages,
  siteOrigin,
  validateManifest,
};
