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
const allBlogPosts = blogSource
  .split(/\n\s*\{\s*\n?\s*slug:\s*'/)
  .slice(1)
  .map((block) => {
    const slug = block.split("'")[0];
    const locale = block.match(/lang:\s*'([^']+)'/)?.[1] === 'en' ? 'en' : 'es';
    const alternateSlug = block.match(/alternateSlug:\s*'([^']+)'/)?.[1];
    const date = block.match(/^\s*date:\s*'([^']+)'/m)?.[1];
    const publishDate = block.match(/publishDate:\s*'([^']+)'/)?.[1];
    const updatedAt = block.match(/updatedAt:\s*'([^']+)'/)?.[1];
    return {
      slug,
      path: blogPath(locale, slug),
      locale,
      alternateSlug,
      date,
      publishDate,
      updatedAt,
    };
  });

const blogPages = allBlogPosts
  .filter(({ publishDate }) => !publishDate || publishDate <= new Date().toISOString().slice(0, 10))
  .map((post) => ({ ...post }));

const publishedBlogKeys = new Set(blogPages.map((page) => `${page.locale}:${page.path.split('/').pop()}`));
for (const page of blogPages) {
  const alternateLocale = page.locale === 'en' ? 'es' : 'en';
  page.alternatePath = page.alternateSlug && publishedBlogKeys.has(`${alternateLocale}:${page.alternateSlug}`)
    ? blogPath(alternateLocale, page.alternateSlug)
    : undefined;
  delete page.alternateSlug;
  delete page.publishDate;
}

const pages = [...canonicalPages, ...blogPages];
const pageMap = new Map(pages.map((page) => [page.path, page]));

function isLatamSpanishPage(pagePath) {
  return !spanishOnlyPaths.has(pagePath);
}

function getSpanishPage(page) {
  if (page.locale === 'es') return page;
  return page.alternatePath ? pageMap.get(page.alternatePath) : undefined;
}

function getEnglishPage(page) {
  if (page.locale === 'en') return page;
  return page.alternatePath ? pageMap.get(page.alternatePath) : undefined;
}

function buildAlternates(page) {
  const spanishPage = getSpanishPage(page);
  const englishPage = getEnglishPage(page);
  const alternates = [];
  const absolute = (pagePath) => `${siteOrigin}${pagePath}${pagePath.endsWith('/') ? '' : '/'}`;

  if (spanishPage) {
    alternates.push({ hreflang: 'es-ES', href: absolute(spanishPage.path) });
    if (isLatamSpanishPage(spanishPage.path)) {
      alternates.push({ hreflang: 'es-419', href: absolute(spanishPage.path) });
    }
  }
  if (englishPage) {
    alternates.push({ hreflang: 'en', href: absolute(englishPage.path) });
  }
  if (spanishPage && englishPage) {
    alternates.push({ hreflang: 'x-default', href: absolute(spanishPage.path) });
  }
  return alternates;
}

function getPageForRoute(route) {
  return pageMap.get(route);
}

const monthNumbers = {
  enero: '01', january: '01',
  febrero: '02', february: '02',
  marzo: '03', march: '03',
  abril: '04', april: '04',
  mayo: '05', may: '05',
  junio: '06', june: '06',
  julio: '07', july: '07',
  agosto: '08', august: '08',
  septiembre: '09', september: '09',
  octubre: '10', october: '10',
  noviembre: '11', november: '11',
  diciembre: '12', december: '12',
};

function parseDisplayDate(value) {
  const match = value?.trim().toLowerCase().match(/^(\d{1,2})\s+([a-záéíóúñ]+)\s+(\d{4})$/);
  if (!match) return undefined;
  const [, day, monthName, year] = match;
  const month = monthNumbers[monthName];
  if (!month) return undefined;
  const isoDate = `${year}-${month}-${day.padStart(2, '0')}`;
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== isoDate
    ? undefined
    : isoDate;
}

function validateBlogTranslations() {
  const errors = [];
  const blogPostMap = new Map();

  for (const post of allBlogPosts) {
    const key = `${post.locale}:${post.slug}`;
    if (blogPostMap.has(key)) errors.push(`Blog post locale/slug duplicated: ${key}`);
    blogPostMap.set(key, post);

    if (post.publishDate) {
      const publishedDate = new Date(`${post.publishDate}T00:00:00Z`);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(post.publishDate)
        || Number.isNaN(publishedDate.getTime())
        || publishedDate.toISOString().slice(0, 10) !== post.publishDate
      ) {
        errors.push(`${post.path}: invalid publishDate ${post.publishDate}`);
      }
      if (!post.alternateSlug) {
        errors.push(`${post.path}: dated publication is missing its translated alternateSlug`);
      }
      if (parseDisplayDate(post.date) !== post.publishDate) {
        errors.push(`${post.path}: displayed date does not match publishDate ${post.publishDate}`);
      }
    }
    if (post.updatedAt) {
      const updatedDate = new Date(`${post.updatedAt}T00:00:00Z`);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(post.updatedAt)
        || Number.isNaN(updatedDate.getTime())
        || updatedDate.toISOString().slice(0, 10) !== post.updatedAt
      ) {
        errors.push(`${post.path}: invalid updatedAt ${post.updatedAt}`);
      }
    }
  }

  for (const post of allBlogPosts) {
    if (!post.alternateSlug) continue;
    const alternateLocale = post.locale === 'en' ? 'es' : 'en';
    const alternate = blogPostMap.get(`${alternateLocale}:${post.alternateSlug}`);
    if (!alternate) {
      errors.push(`${post.path}: translated alternate is missing (${alternateLocale}:${post.alternateSlug})`);
      continue;
    }
    if (alternate.alternateSlug !== post.slug) {
      errors.push(`${post.path}: translated alternate does not point back to ${post.slug}`);
    }

    if (Boolean(post.publishDate) !== Boolean(alternate.publishDate)) {
      errors.push(`${post.path}: translated alternate must also declare publishDate`);
    } else if (post.publishDate && post.publishDate !== alternate.publishDate) {
      errors.push(`${post.path}: publishDate ${post.publishDate} differs from ${alternate.path} (${alternate.publishDate})`);
    }
    if (Boolean(post.updatedAt) !== Boolean(alternate.updatedAt)) {
      errors.push(`${post.path}: translated alternate must also declare updatedAt`);
    } else if (post.updatedAt && post.updatedAt !== alternate.updatedAt) {
      errors.push(`${post.path}: updatedAt ${post.updatedAt} differs from ${alternate.path} (${alternate.updatedAt})`);
    }
  }

  return errors;
}

function validateManifest() {
  const errors = validateBlogTranslations();
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
