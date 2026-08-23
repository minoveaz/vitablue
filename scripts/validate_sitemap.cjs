const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const registry = fs.readFileSync(path.join(root, 'config', 'routes.ts'), 'utf8');
const blogData = fs.readFileSync(path.join(root, 'utils', 'blogData.ts'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'public', 'sitemap.xml'), 'utf8');

const registryCanonicalRoutes = [...registry.matchAll(/canonical\('([^']+)',\s*\{([\s\S]*?)\}\)/g)]
  .filter(([, , options]) => !/sitemap:\s*false/.test(options))
  .map(([, path]) => path);

const blogSlugs = [...blogData.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
const expectedRoutes = [
  ...registryCanonicalRoutes,
  ...blogSlugs.map((slug) => `${slug.startsWith('student-visa-') || slug.startsWith('health-insurance-') ? '/en' : ''}/blog/${slug}`),
];
const actualRoutes = [...sitemap.matchAll(/<loc>https?:\/\/[^<]+?(\/[^<]*)<\/loc>/g)].map((match) => match[1] || '/');

const unique = (routes) => [...new Set(routes)];
const expected = unique(expectedRoutes);
const actual = unique(actualRoutes);
const missing = expected.filter((route) => !actual.includes(route));
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

if (missing.length > 0) {
  console.log(`\nMissing from sitemap (${missing.length}):`);
  missing.forEach((route) => console.log(`- ${route}`));
}

if (unexpected.length > 0) {
  console.log(`\nNot present in canonical registry (${unexpected.length}):`);
  unexpected.forEach((route) => console.log(`- ${route}`));
}

if (missing.length === 0 && unexpected.length === 0 && forbiddenFound.length === 0) {
  console.log('\n✅ Sitemap matches the canonical registry and excludes thin legal content.');
} else {
  process.exitCode = 1;
}
