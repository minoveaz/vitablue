const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const registryPath = path.join(root, 'config', 'routes.ts');
const blogPath = path.join(root, 'utils', 'blogData.ts');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const write = process.argv.includes('--write');

const registry = fs.readFileSync(registryPath, 'utf8');
const blogData = fs.readFileSync(blogPath, 'utf8');
const existingSitemap = fs.readFileSync(sitemapPath, 'utf8');

const canonicalRoutes = [...registry.matchAll(/canonical\('([^']+)',\s*\{([\s\S]*?)\}\)/g)]
  .filter(([, , options]) => !/sitemap:\s*false/.test(options))
  .map(([, path]) => path);
const blogSlugs = [...blogData.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
const routes = [...new Set([
  ...canonicalRoutes,
  ...blogSlugs.map((slug) => `${slug.startsWith('student-visa-') || slug.startsWith('health-insurance-') ? '/en' : ''}/blog/${slug}`),
])];

const blockByPath = new Map();
for (const match of existingSitemap.matchAll(/\s*<url>[\s\S]*?<loc>https?:\/\/[^<]+?(\/[^<]*)<\/loc>[\s\S]*?<\/url>/g)) {
  blockByPath.set(match[1], match[0].trim());
}

const today = new Date().toISOString().slice(0, 10);
const createBlock = (route) => {
  const isBlogPost = route.startsWith('/blog/') || route.startsWith('/en/blog/');
  const isLegal = ['/aviso-legal', '/politica-privacidad', '/politica-cookies', '/privacidad', '/cookies'].includes(route);
  const priority = isLegal ? '0.30' : isBlogPost ? '0.60' : route === '/' || route === '/en' ? '1.00' : '0.80';
  const changefreq = isLegal ? 'monthly' : isBlogPost ? 'weekly' : route === '/' || route === '/en' ? 'weekly' : 'weekly';
  return [
    '  <url>',
    `    <loc>https://www.vitablue.es${route}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
};

const blocks = routes.map((route) => blockByPath.get(route) || createBlock(route));
const generated = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n${blocks.join('\n')}\n</urlset>\n`;

if (write) {
  fs.writeFileSync(sitemapPath, generated, 'utf8');
  console.log(`Sitemap generated: ${routes.length} canonical URLs.`);
} else {
  const currentRoutes = [...existingSitemap.matchAll(/<loc>https?:\/\/[^<]+?(\/[^<]*)<\/loc>/g)].map((match) => match[1]);
  const sameRouteSet = routes.length === new Set(currentRoutes).size && routes.every((route) => currentRoutes.includes(route));
  if (sameRouteSet) {
    console.log(`Sitemap is up to date: ${routes.length} canonical URLs.`);
  } else {
    console.log('Sitemap route set would change public/sitemap.xml. Run with --write to apply.');
    process.exitCode = 1;
  }
}
