const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const strict = process.argv.includes('--strict');
const appPath = path.join(root, 'App.tsx');
const vitePath = path.join(root, 'vite.config.ts');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const registryPath = path.join(root, 'config', 'routes.ts');

const app = fs.readFileSync(appPath, 'utf8');
const vite = fs.readFileSync(vitePath, 'utf8');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const registry = fs.readFileSync(registryPath, 'utf8');

const appRoutes = [
  ...[...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((match) => match[1]),
  ...[...registry.matchAll(/path:\s*'([^']+)'/g)].map((match) => match[1]).filter((route) => route.startsWith('/backoffice')),
];
const prerenderBlock = vite.match(/routes:\s*\[([\s\S]*?)\n\s*\],/);
let prerenderRoutes = prerenderBlock
  ? [...prerenderBlock[1].matchAll(/'([^']+)'/g)].map((match) => match[1])
  : [];
if (prerenderRoutes.length === 0 && /routes:\s*prerenderRoutes/.test(vite)) {
  const staticRegistryRoutes = [
    ...[...registry.matchAll(/(?:canonical|legacy)\('([^']+)'/g)].map((match) => match[1]),
    ...[...registry.matchAll(/path:\s*'\/(?:cotizador\.html|wizard|resultados)'/g)].map((match) => match[0].match(/'([^']+)'/)[1]),
  ];
  const blogSlugs = [...fs.readFileSync(path.join(root, 'utils', 'blogData.ts'), 'utf8').matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
  prerenderRoutes = [...staticRegistryRoutes, ...blogSlugs.map((slug) => `${slug.startsWith('student-visa-') || slug.startsWith('health-insurance-') ? '/en' : ''}/blog/${slug}`)];
}
const sitemapRoutes = [...sitemap.matchAll(/<loc>https?:\/\/[^<]+?(\/[^<]*)<\/loc>/g)].map((match) => match[1] || '/');
const registryRoutes = [
  ...[...registry.matchAll(/(?:canonical|legacy)\('([^']+)'/g)].map((match) => match[1]),
  ...[...registry.matchAll(/path:\s*'([^']+)'/g)].map((match) => match[1]),
];
const legacyRegistryRoutes = new Set([...registry.matchAll(/legacy\('([^']+)'/g)].map((match) => match[1]));
const nonSeoRoutes = new Set([
  '/login',
  '/backoffice',
  '/backoffice/catalogo',
  '/backoffice/document-intelligence',
  '/backoffice/tools',
  '/backoffice/tools/document-intelligence',
  '/cotizador.html',
  '/wizard',
  '/resultados',
]);

const unique = (routes) => [...new Set(routes)];
const dynamicRoutes = appRoutes.filter((route) => route.includes(':'));
const routeIsCovered = (route) => appRoutes.some((appRoute) => {
  if (!appRoute.includes(':')) return appRoute === route;
  const pattern = new RegExp(`^${appRoute.split('/').map((segment) => segment.startsWith(':') ? '[^/]+' : segment.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')).join('/')}\\/?$`);
  return pattern.test(route);
});
const concreteAppRoutes = appRoutes.filter((route) =>
  !route.includes(':') &&
  route !== '*' &&
  !nonSeoRoutes.has(route) &&
  !route.startsWith('/backoffice') &&
  !legacyRegistryRoutes.has(route) &&
  !route.startsWith('/styleguide') &&
  !route.startsWith('/marketing-studio') &&
  !route.startsWith('/backoffice/marketing-studio')
);
const missingPrerender = concreteAppRoutes.filter((route) => !prerenderRoutes.includes(route));
const missingSitemap = concreteAppRoutes.filter((route) => !sitemapRoutes.includes(route));
const sitemapWithoutApp = sitemapRoutes.filter((route) => !routeIsCovered(route));
const registryWithoutApp = unique(registryRoutes).filter((route) => !routeIsCovered(route));
const appWithoutRegistry = concreteAppRoutes.filter((route) => !registryRoutes.includes(route));

console.log('=== VitaBlue route parity audit ===');
console.log(`App routes: ${unique(appRoutes).length} (${dynamicRoutes.length} dynamic)`);
console.log(`Prerender routes: ${unique(prerenderRoutes).length}`);
console.log(`Sitemap URLs: ${unique(sitemapRoutes).length}`);
console.log(`Registered routes: ${unique(registryRoutes).length}`);

const printRoutes = (label, routes) => {
  if (routes.length === 0) return;
  console.log(`\n${label} (${routes.length}):`);
  routes.forEach((route) => console.log(`- ${route}`));
};

printRoutes('Concrete app routes without prerender', missingPrerender);
printRoutes('Concrete app routes without sitemap entry', missingSitemap);
printRoutes('Sitemap URLs without concrete app route', sitemapWithoutApp);
printRoutes('Registered routes without concrete app route', registryWithoutApp);
printRoutes('Concrete app routes without registry entry', appWithoutRegistry);

if (prerenderRoutes.length === 0) {
  console.error('\nERROR: Could not locate the prerender routes array in vite.config.ts');
  process.exitCode = 1;
}

console.log('\nThis is an audit-only check. It does not modify routing, prerendering, or sitemap files.');

if (strict && (missingPrerender.length > 0 || appWithoutRegistry.length > 0 || registryWithoutApp.length > 0)) {
  console.error('\nSTRICT AUDIT FAILED: route parity requires attention.');
  process.exitCode = 1;
}
