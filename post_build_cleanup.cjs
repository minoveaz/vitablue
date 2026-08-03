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
console.log('\n=== LIMPIEZA POST-BUILD COMPLETADA CON ÉXITO ===');
