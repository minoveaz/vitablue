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

// Extraer posts del blog con sus alternateSlug
const postEntries = blogData.split(/\n\s*\{\s*\n?\s*slug:\s*'/).slice(1);
const blogPostsRaw = postEntries.map((block) => {
  const slug = block.split("'")[0];
  const alternateMatch = block.match(/alternateSlug:\s*'([^']+)'/);
  const langMatch = block.match(/lang:\s*'([^']+)'/);
  const dateMatch = block.match(/date:\s*'([^']+)'/);
  const updatedAtMatch = block.match(/updatedAt:\s*'([^']+)'/);
  const isEn = langMatch ? langMatch[1] === 'en' : false;
  
  // Parse Spanish and English textual dates to YYYY-MM-DD
  let isoDate = '2026-08-03';
  const rawDate = (updatedAtMatch && updatedAtMatch[1]) || (dateMatch && dateMatch[1]);
  if (rawDate) {
    const months = {
      'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04', 'mayo': '05', 'junio': '06',
      'julio': '07', 'agosto': '08', 'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12',
      'january': '01', 'february': '02', 'march': '03', 'april': '04', 'may': '05', 'june': '06',
      'july': '07', 'august': '08', 'september': '09', 'october': '10', 'november': '11', 'december': '12'
    };
    const parts = rawDate.toLowerCase().split(/\s+/);
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = months[parts[1]] || '08';
      const year = parts[2];
      isoDate = `${year}-${month}-${day}`;
    }
  }

  return {
    slug,
    lang: isEn ? 'en' : 'es',
    alternateSlug: alternateMatch ? alternateMatch[1] : undefined,
    lastmod: isoDate,
  };
});


const routeLastmods = new Map();
// Fechas de última actualización canónica para páginas de producto y landings clave
const canonicalPageDates = {
  '/': '2026-08-23',
  '/en': '2026-08-23',
  '/sobre-nosotros': '2026-08-15',
  '/en/about-us': '2026-08-15',
  '/contacto': '2026-08-10',
  '/en/contact': '2026-08-10',
  '/blog': '2026-08-23',
  '/en/blog': '2026-08-23',
  '/productos/seguros-salud': '2026-08-20',
  '/productos/seguros-salud/seguro-medico-estudiantes': '2026-08-22',
  '/en/health-insurance-student-visa-spain': '2026-08-22',
  '/productos/seguros-salud/seguro-expatriados': '2026-08-20',
  '/en/health-insurance-expatriates-spain': '2026-08-20',
  '/productos/seguros-salud/seguro-nomadas-digitales': '2026-08-21',
  '/en/digital-nomad-insurance-spain': '2026-08-21',
  '/productos/seguros-salud/seguro-salud-extranjeros': '2026-08-18',
  '/productos/seguros-salud/seguros-sanitas': '2026-08-18',
  '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud': '2026-08-18',
  '/productos/seguros-salud/seguros-sanitas/international-students': '2026-08-22',
  '/productos/seguro-mascotas/sanitas-mascotas': '2026-08-15',
  '/productos/seguro-para-decesos/asistencia-familiar': '2026-08-15',
  '/productos/seguro-vida': '2026-08-15',
  '/validador-visado': '2026-08-24',
  '/productos/seguros-salud/seguro-medico-estudiantes/madrid': '2026-08-24',
  '/productos/seguros-salud/seguro-medico-estudiantes/barcelona': '2026-08-24',
  '/productos/seguros-salud/seguro-medico-estudiantes/valencia': '2026-08-24',
  '/productos/seguros-salud/seguro-medico-estudiantes/malaga': '2026-08-24',
};



for (const [route, date] of Object.entries(canonicalPageDates)) {
  routeLastmods.set(route, date);
}

for (const post of blogPostsRaw) {
  const isEn = post.lang === 'en';
  const path = `${isEn ? '/en' : ''}/blog/${post.slug}`;
  routeLocales.set(path, isEn ? 'en' : 'es');
  routeLastmods.set(path, post.lastmod);

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

/**
 * Normaliza cualquier ruta añadiendo trailing slash, excepto la raíz "/".
 * Hostinger (hcdn) redirige /page → /page/ automáticamente a nivel de CDN,
 * por lo que el sitemap y los canonical tags deben declarar la versión con
 * slash para que Google encuentre un 200 directo sin pasar por un 301.
 */
const withSlash = (route) => (route === '/' ? route : `${route}/`);

const createBlock = (route) => {
  const isBlogPost = route.startsWith('/blog/') || route.startsWith('/en/blog/');
  const priority = isBlogPost ? '0.60' : route === '/' || route === '/en' ? '1.00' : '0.80';
  const changefreq = 'weekly';
  const alternate = alternatesMap.get(route);
  const currentLocale = routeLocales.get(route) || (route.startsWith('/en') ? 'en' : 'es');
  const alternateLocale = currentLocale === 'en' ? 'es' : 'en';
  const lastmod = routeLastmods.get(route) || today;

  // URLs con trailing slash para que Hostinger CDN sirva 200 directamente
  const routeUrl  = withSlash(route);
  const altUrl    = alternate ? withSlash(alternate) : null;
  const defaultUrl = alternate
    ? withSlash(currentLocale === 'es' ? route : alternate)
    : null;

  const lines = [
    '  <url>',
    `    <loc>https://www.vitablue.es${routeUrl}</loc>`,
  ];

  if (altUrl) {
    lines.push(`    <xhtml:link rel="alternate" hreflang="${currentLocale}" href="https://www.vitablue.es${routeUrl}" />`);
    lines.push(`    <xhtml:link rel="alternate" hreflang="${alternateLocale}" href="https://www.vitablue.es${altUrl}" />`);
    lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.vitablue.es${defaultUrl}" />`);
  }

  lines.push(`    <lastmod>${lastmod}</lastmod>`);
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
  // Normaliza trailing slash en ambos lados: el registry usa /page y el
  // sitemap generado usa /page/ — stripSlash hace la comparación agnóstica.
  const stripSlash = (r) => (r === '/' ? r : r.replace(/\/$/, ''));
  const normalizedExpected = routes.map(stripSlash);
  const normalizedActual   = currentRoutes.map(stripSlash);
  const sameRouteSet = normalizedExpected.length === new Set(normalizedActual).size
    && normalizedExpected.every((route) => normalizedActual.includes(route));
  if (sameRouteSet && existingSitemap.includes('xmlns:xhtml')) {
    console.log(`Sitemap is up to date: ${routes.length} canonical URLs with hreflang links.`);
  } else {
    console.log('Sitemap route set or hreflang tags would change public/sitemap.xml. Run with --write to apply.');
    process.exitCode = 1;
  }
}
