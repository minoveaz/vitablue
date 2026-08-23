const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const registryPath = path.join(root, 'config', 'routes.ts');
const blogPath = path.join(root, 'utils', 'blogData.ts');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const write = process.argv.includes('--write');

const registry = fs.readFileSync(registryPath, 'utf8');
const blogData = fs.readFileSync(blogPath, 'utf8');

// Extraer entradas canonicales con sus opciones
const canonicalMatches = [...registry.matchAll(/canonical\('([^']+)',\s*\{([\s\S]*?)\}\)/g)]
  .filter(([, , options]) => !/sitemap:\s*false/.test(options));

const alternatesMap = new Map();
const routeLocales = new Map();

for (const [, routePath, options] of canonicalMatches) {
  const alternateMatch = options.match(/alternate:\s*'([^']+)'/);
  const localeMatch = options.match(/locale:\s*'([^']+)'/);
  const locale = localeMatch ? localeMatch[1] : (routePath.startsWith('/en') ? 'en' : 'es');
  routeLocales.set(routePath, locale);

  if (alternateMatch) {
    alternatesMap.set(routePath, alternateMatch[1]);
  }
}

// Extraer posts del blog con sus alternateSlug mediante regex
const postBlocks = [...blogData.matchAll(/\{\s*slug:\s*'([^']+)'([\s\S]*?)\n\s*\}/g)];
const blogPostsRaw = postBlocks.map(([, slug, block]) => {
  const alternateMatch = block.match(/alternateSlug:\s*'([^']+)'/);
  const langMatch = block.match(/lang:\s*'([^']+)'/);
  const isEn = langMatch ? langMatch[1] === 'en' : (slug.startsWith('student-visa-') || slug.startsWith('health-insurance-'));
  return {
    slug,
    lang: isEn ? 'en' : 'es',
    alternateSlug: alternateMatch ? alternateMatch[1] : undefined,
  };
});

for (const post of blogPostsRaw) {
  const isEn = post.lang === 'en';
  const path = `${isEn ? '/en' : ''}/blog/${post.slug}`;
  routeLocales.set(path, isEn ? 'en' : 'es');

  if (post.alternateSlug) {
    const altIsEn = !isEn;
    const altPath = `${altIsEn ? '/en' : ''}/blog/${post.alternateSlug}`;
    alternatesMap.set(path, altPath);
  }
}

const canonicalRoutes = canonicalMatches.map(([, path]) => path);
const blogRoutes = blogPostsRaw.map((post) => {
  const isEn = post.lang === 'en' || post.slug.startsWith('student-visa-') || post.slug.startsWith('health-insurance-');
  return `${isEn ? '/en' : ''}/blog/${post.slug}`;
});

const routes = [...new Set([...canonicalRoutes, ...blogRoutes])];

const today = new Date().toISOString().slice(0, 10);

const createBlock = (route) => {
  const isBlogPost = route.startsWith('/blog/') || route.startsWith('/en/blog/');
  const priority = isBlogPost ? '0.60' : route === '/' || route === '/en' ? '1.00' : '0.80';
  const changefreq = isBlogPost ? 'weekly' : route === '/' || route === '/en' ? 'weekly' : 'weekly';
  const alternate = alternatesMap.get(route);
  const currentLocale = routeLocales.get(route) || (route.startsWith('/en') ? 'en' : 'es');
  const alternateLocale = currentLocale === 'en' ? 'es' : 'en';

  const lines = [
    '  <url>',
    `    <loc>https://www.vitablue.es${route}</loc>`,
  ];

  if (alternate) {
    // Hreflang cruzado
    lines.push(`    <xhtml:link rel="alternate" hreflang="${currentLocale}" href="https://www.vitablue.es${route}" />`);
    lines.push(`    <xhtml:link rel="alternate" hreflang="${alternateLocale}" href="https://www.vitablue.es${alternate}" />`);
    const defaultHref = currentLocale === 'es' ? route : alternate;
    lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.vitablue.es${defaultHref}" />`);
  }

  lines.push(`    <lastmod>${today}</lastmod>`);
  lines.push(`    <changefreq>${changefreq}</changefreq>`);
  lines.push(`    <priority>${priority}</priority>`);
  lines.push('  </url>');
  return lines.join('\n');
};

const blocks = routes.map((route) => createBlock(route));
const generated = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n${blocks.join('\n')}\n</urlset>\n`;

if (write) {
  fs.writeFileSync(sitemapPath, generated, 'utf8');
  console.log(`Sitemap generated: ${routes.length} canonical URLs with hreflang alternate links.`);
} else {
  const existingSitemap = fs.readFileSync(sitemapPath, 'utf8');
  const currentRoutes = [...existingSitemap.matchAll(/<loc>https?:\/\/[^<]+?(\/[^<]*)<\/loc>/g)].map((match) => match[1]);
  const sameRouteSet = routes.length === new Set(currentRoutes).size && routes.every((route) => currentRoutes.includes(route));
  if (sameRouteSet && existingSitemap.includes('xmlns:xhtml')) {
    console.log(`Sitemap is up to date: ${routes.length} canonical URLs with hreflang links.`);
  } else {
    console.log('Sitemap route set or hreflang tags would change public/sitemap.xml. Run with --write to apply.');
    process.exitCode = 1;
  }
}
