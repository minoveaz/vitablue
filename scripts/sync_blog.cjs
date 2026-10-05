const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const blogDataPath = path.join(root, 'utils', 'blogData.ts');
const generateSitemapPath = path.join(__dirname, 'generate_sitemap.cjs');
const validateRoutesPath = path.join(__dirname, 'validate_routes.cjs');

console.log('=== INICIANDO SINCRONIZACIÓN DEL BLOG ===');

const blogData = fs.readFileSync(blogDataPath, 'utf8');
const todayIso = new Date().toISOString().slice(0, 10);
const postEntries = blogData.split(/\n\s*\{\s*\n?\s*slug:\s*'/).slice(1);
const postsInfo = postEntries.map((block) => {
  const slug = block.split("'")[0];
  const publishDateMatch = block.match(/publishDate:\s*'([^']+)'/);
  const publishDate = publishDateMatch ? publishDateMatch[1] : null;
  const isPublished = !publishDate || publishDate <= todayIso;
  return { slug, publishDate, isPublished };
});

const activePosts = postsInfo.filter((p) => p.isPublished);
const scheduledPosts = postsInfo.filter((p) => !p.isPublished);

if (postsInfo.length === 0) {
  console.error('Error: no se encontraron posts en blogData.ts.');
  process.exit(1);
}

console.log(`Total artículos en base de datos: ${postsInfo.length}`);
console.log(`Artículos activos hoy (${todayIso}): ${activePosts.length}`);
activePosts.forEach((p) => console.log(`  ✅ [PUBLICADO] ${p.slug}`));

if (scheduledPosts.length > 0) {
  console.log(`\nArtículos programados para fechas futuras: ${scheduledPosts.length}`);
  scheduledPosts.forEach((p) => console.log(`  ⏳ [PROGRAMADO ${p.publishDate}] ${p.slug}`));
}

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

// Notificación opcional/automática a Google Search Console
const gscCredentialsPath = path.join(root, '.credentials', 'gsc-credentials.json');
const gscSitemapsPath = path.join(__dirname, 'gsc_sitemaps.cjs');
if (fs.existsSync(gscCredentialsPath) && fs.existsSync(gscSitemapsPath)) {
  console.log('\nNotificando sitemap actualizado a Google Search Console...');
  const gscResult = spawnSync(process.execPath, [gscSitemapsPath, '--submit'], {
    cwd: root,
    stdio: 'inherit',
  });
  if (gscResult.status === 0) {
    console.log('✅ Google Search Console notificado correctamente con el sitemap actualizado.');
  } else {
    console.warn('⚠️ No se pudo enviar el sitemap a GSC automáticamente (no bloqueante).');
  }
}

console.log('\n=== SINCRONIZACIÓN COMPLETADA ===');
console.log('Las rutas de prerender se generan desde config/routes.ts.');
console.log('El sitemap se genera desde el registro tipado y blogData.ts.');
console.log('Ejecuta npm run build para regenerar el HTML estático.');
