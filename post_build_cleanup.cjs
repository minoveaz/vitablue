const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, 'dist');

console.log('=== INICIANDO LIMPIEZA POST-BUILD PARA SEO ===\n');

function cleanHtmlFolders(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (item.endsWith('.html')) {
        const indexHtmlPath = path.join(fullPath, 'index.html');
        const targetFilePath = fullPath; // Since it ends with .html, the path is already folder.html

        if (fs.existsSync(indexHtmlPath)) {
          // Copy index.html to target path (temporarily rename folder first to avoid conflict!)
          const tempPath = fullPath + '_temp';
          fs.renameSync(fullPath, tempPath);
          
          const tempIndexHtml = path.join(tempPath, 'index.html');
          fs.copyFileSync(tempIndexHtml, targetFilePath);
          
          // Remove temp folder and its contents
          fs.rmSync(tempPath, { recursive: true, force: true });
          console.log(`✅ Convertido folder a archivo plano: ${targetFilePath.replace(distDir, '')}`);
        }
      } else {
        // Recursive search in subdirectories
        cleanHtmlFolders(fullPath);
      }
    }
  });
}

cleanHtmlFolders(distDir);

// === OPTIMIZACIÓN DE RENDERIZADO CRÍTICO (HEAD TAGS) ===

function optimizeHtmlHeadTagsRecursive(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      optimizeHtmlHeadTagsRecursive(fullPath);
    } else if (item.endsWith('.html')) {
      optimizeHeadTags(fullPath);
    }
  });
}

function optimizeHeadTags(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const stylesheetRegex = /<link rel="stylesheet"[^>]*href="\/assets\/[^>]*\.css"[^>]*>/g;
  const match = content.match(stylesheetRegex);

  if (match && match.length > 0) {
    const stylesheetTag = match[0];
    content = content.replace(stylesheetTag, '');
    
    // Insert immediately after <head> to prioritize CSS download over JS preloads
    const headIndex = content.indexOf('<head>');
    if (headIndex !== -1) {
      const insertPos = headIndex + 6;
      content = content.slice(0, insertPos) + '\n    ' + stylesheetTag + content.slice(insertPos);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}

console.log('\n⚡ Optimizando orden de carga crítica de CSS en cabeceras...');
optimizeHtmlHeadTagsRecursive(distDir);
console.log('✅ Cabeceras optimizadas con éxito para FCP ultra rápido.');

console.log('\n=== LIMPIEZA POST-BUILD COMPLETADA CON ÉXITO ===');
