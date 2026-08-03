const fs = require('fs');
const path = require('path');

// Paths
const blogDataPath = path.join(__dirname, '../utils/blogData.ts');
const viteConfigPath = path.join(__dirname, '../vite.config.ts');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

console.log('=== INICIANDO SINCRONIZACIÓN AUTOMÁTICA DEL BLOG ===');

// 1. Read blogData.ts and extract slugs
try {
  const blogDataContent = fs.readFileSync(blogDataPath, 'utf8');
  const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
  const slugs = [];
  let match;

  while ((match = slugRegex.exec(blogDataContent)) !== null) {
    slugs.push(match[1]);
  }

  if (slugs.length === 0) {
    console.error('❌ Error: No se encontraron slugs en blogData.ts');
    process.exit(1);
  }

  console.log(`✅ Slugs de blog detectados (${slugs.length}):`);
  slugs.forEach(s => console.log(`   - /blog/${s}`));

  // 2. Synchronize vite.config.ts
  console.log('\n2. Sincronizando vite.config.ts...');
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');

  // Regex to match the routes array block in vite.config.ts
  const routesRegex = /(routes:\s*\[)([\s\S]*?)(\s*\])/;
  const routesMatch = viteConfig.match(routesRegex);

  if (routesMatch) {
    const existingRoutesText = routesMatch[2];
    
    // Split routes into lines, clean whitespace
    let routeLines = existingRoutesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Filter out any existing blog posts (routes starting with '/blog/')
    // Keep '/blog' index page and other pages
    routeLines = routeLines.filter(line => !line.includes("'/blog/") || line === "'/blog',");

    // Add new blog post routes
    const newBlogRoutes = slugs.map(slug => `        '/blog/${slug}',`);
    
    // Find index of '/blog' to insert after it, or append at the end
    const blogIndexRoute = routeLines.findIndex(line => line.includes("'/blog'"));
    if (blogIndexRoute !== -1) {
      routeLines.splice(blogIndexRoute + 1, 0, ...newBlogRoutes);
    } else {
      // If '/blog' doesn't exist, append '/blog' and the routes
      routeLines.push("        '/blog',", ...newBlogRoutes);
    }

    // Format new block (ensuring clean lines with commas)
    const formattedRoutes = '\n' + routeLines.map(line => {
      // Ensure leading spaces are correct for indent
      if (line.startsWith("'")) {
        return '        ' + line;
      }
      return '        ' + line.replace(/^\s*/, '');
    }).join('\n') + '\n      ';

    viteConfig = viteConfig.replace(routesRegex, `$1${formattedRoutes}$3`);
    fs.writeFileSync(viteConfigPath, viteConfig, 'utf8');
    console.log('✅ vite.config.ts actualizado correctamente.');
  } else {
    console.warn('⚠️ Advertencia: No se pudo localizar la sección de rutas en vite.config.ts');
  }

  // 3. Synchronize sitemap.xml
  console.log('\n3. Sincronizando sitemap.xml...');
  let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

  // Strip all existing <url> blocks containing /blog to avoid duplicates
  // We match the <url>...</url> block containing https://www.vitablue.es/blog (non-crossing)
  const urlBlockRegex = /\s*<url>(?:(?!<\/url>)[\s\S])*?<loc>https:\/\/www\.vitablue\.es\/blog[\s\S]*?<\/url>/g;
  sitemapContent = sitemapContent.replace(urlBlockRegex, '');

  // Generate new sitemap XML block for blog index and articles
  let newSitemapBlocks = `
  <url>
    <loc>https://www.vitablue.es/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.70</priority>
  </url>`;

  slugs.forEach(slug => {
    newSitemapBlocks += `
  <url>
    <loc>https://www.vitablue.es/blog/${slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.60</priority>
  </url>`;
  });

  // Insert before the closing </urlset> tag
  sitemapContent = sitemapContent.replace('</urlset>', `${newSitemapBlocks}\n</urlset>`);
  // Clean up any double blank lines
  sitemapContent = sitemapContent.replace(/\n\s*\n\s*\n/g, '\n\n');

  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log('✅ sitemap.xml actualizado correctamente.');

  console.log('\n=== SINCRONIZACIÓN COMPLETADA CON ÉXITO ===');
  console.log('💡 Recuerda correr "npm run build" para generar los HTML estáticos actualizados.');

} catch (error) {
  console.error('❌ Error en el proceso de sincronización:', error.message);
  process.exit(1);
}
