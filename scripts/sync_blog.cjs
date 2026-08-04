const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const blogDataPath = path.join(root, 'utils', 'blogData.ts');
const generateSitemapPath = path.join(__dirname, 'generate_sitemap.cjs');
const validateRoutesPath = path.join(__dirname, 'validate_routes.cjs');

console.log('=== INICIANDO SINCRONIZACIÓN DEL BLOG ===');

const blogData = fs.readFileSync(blogDataPath, 'utf8');
const slugs = [...blogData.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);

if (slugs.length === 0) {
  console.error('Error: no se encontraron slugs en blogData.ts.');
  process.exit(1);
}

console.log(`Slugs detectados: ${slugs.length}`);
slugs.forEach((slug) => console.log(`- ${slug}`));

console.log('\nGenerando sitemap desde config/routes.ts y blogData.ts...');
const sitemapResult = spawnSync(process.execPath, [generateSitemapPath, '--write'], {
  cwd: root,
  stdio: 'inherit',
});

if (sitemapResult.status !== 0) {
  process.exit(sitemapResult.status || 1);
}

console.log('\nValidando paridad de rutas...');
const routeResult = spawnSync(process.execPath, [validateRoutesPath, '--strict'], {
  cwd: root,
  stdio: 'inherit',
});

if (routeResult.status !== 0) {
  process.exit(routeResult.status || 1);
}

console.log('\n=== SINCRONIZACIÓN COMPLETADA ===');
console.log('Las rutas de prerender se generan desde config/routes.ts.');
console.log('El sitemap se genera desde el registro tipado y blogData.ts.');
console.log('Ejecuta npm run build para regenerar el HTML estático.');
