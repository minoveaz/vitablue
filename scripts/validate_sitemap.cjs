const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const registry = fs.readFileSync(path.join(root, 'config', 'routes.ts'), 'utf8');
const blogData = fs.readFileSync(path.join(root, 'utils', 'blogData.ts'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'public', 'sitemap.xml'), 'utf8');

const registryCanonicalRoutes = [...registry.matchAll(/canonical\('([^']+)',\s*\{([\s\S]*?)\}\)/g)]
  .filter(([, , options]) => !/sitemap:\s*false/.test(options))
  .map(([, path]) => path);

const postEntries = blogData.split(/\n\s*\{\s*\n?\s*slug:\s*'/).slice(1);
const blogExpectedRoutes = postEntries.map((block) => {
  const slug = block.split("'")[0];
  const langMatch = block.match(/lang:\s*'([^']+)'/);
  const isEn = langMatch ? langMatch[1] === 'en' : false;
  return `${isEn ? '/en' : ''}/blog/${slug}`;
});

const expectedRoutes = [
  ...registryCanonicalRoutes,
  ...blogExpectedRoutes,
];
const actualRoutes = [...sitemap.matchAll(/<loc>https?:\/\/[^<]+?(\/[^<]*)<\/loc>/g)].map((match) => match[1] || '/');


// Normaliza trailing slash para comparar: /page y /page/ son equivalentes
const stripSlash = (r) => (r === '/' ? r : r.replace(/\/$/, ''));
const unique = (routes) => [...new Set(routes)];
const expected = unique(expectedRoutes.map(stripSlash));
const actual   = unique(actualRoutes.map(stripSlash));
const missing    = expected.filter((route) => !actual.includes(route));
const unexpected = actual.filter((route) => !expected.includes(route));

// Forbidden routes that must NEVER be in sitemap (thin content, legal, duplications)
const forbiddenLegalRoutes = [
  '/aviso-legal',
  '/politica-privacidad',
  '/politica-cookies',
  '/privacidad',
  '/cookies',
];
const forbiddenFound = actual.filter((route) => forbiddenLegalRoutes.includes(route));

console.log('=== VitaBlue sitemap parity audit ===');
console.log(`Expected registry URLs: ${expected.length}`);
console.log(`Actual sitemap URLs: ${actual.length}`);

if (forbiddenFound.length > 0) {
  console.error(`\n❌ Error: Sitemap contains forbidden legal/thin content URLs (${forbiddenFound.length}):`);
  forbiddenFound.forEach((route) => console.error(`  - ${route}`));
}

const hasXhtmlNamespace = sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
const alternateLinksCount = [...sitemap.matchAll(/<xhtml:link\s+rel="alternate"/g)].length;

if (!hasXhtmlNamespace) {
  console.error('\n❌ Error: Sitemap is missing xmlns:xhtml namespace for hreflang links.');
}

if (alternateLinksCount === 0) {
  console.error('\n❌ Error: Sitemap has no <xhtml:link rel="alternate"> tags for multilingual SEO.');
}

if (missing.length === 0 && unexpected.length === 0 && forbiddenFound.length === 0 && hasXhtmlNamespace && alternateLinksCount > 0) {
  console.log(`\n✅ Sitemap matches canonical registry, excludes thin legal content, and includes ${alternateLinksCount} hreflang alternate links.`);
} else {
  process.exitCode = 1;
}
