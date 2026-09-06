const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const failures = [];
const ignoredProtocols = /^(?:https?:|mailto:|tel:|whatsapp:|javascript:|data:)/i;

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(target) : entry.name.endsWith('.html') ? [target] : [];
  });
}

function targetExists(href) {
  const pathname = decodeURIComponent(new URL(href, 'https://www.vitablue.es').pathname);
  if (pathname.startsWith('/assets/')) return fs.existsSync(path.join(distDir, pathname.slice(1)));
  const relative = pathname === '/' ? 'index.html' : `${pathname.replace(/^\/|\/$/g, '')}/index.html`;
  return fs.existsSync(path.join(distDir, relative)) || fs.existsSync(path.join(distDir, pathname.slice(1)));
}

if (!fs.existsSync(distDir)) {
  console.error('Internal link validation requires dist. Run npm run build first.');
  process.exit(1);
}

for (const file of htmlFiles(distDir)) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [, rawHref] of html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)) {
    const href = rawHref.trim();
    if (!href || href.startsWith('#') || ignoredProtocols.test(href)) continue;
    if (!href.startsWith('/')) continue;

    const urlPath = href.split('#')[0].split('?')[0];

    // Check if link points to a static asset or file with extension (e.g. .pdf, .svg, .png, .xml, .html)
    const hasFileExtension = path.extname(urlPath) !== '';

    // If it's a virtual route (not a static file), it MUST end with a trailing slash
    if (!hasFileExtension && !urlPath.endsWith('/')) {
      failures.push(`[TRAILING SLASH MISSING] ${path.relative(distDir, file)} -> ${href} (must end with '/')`);
      continue;
    }

    if (!targetExists(urlPath)) {
      failures.push(`[NOT FOUND] ${path.relative(distDir, file)} -> ${href}`);
    }
  }
}

console.log('Static internal link audit completed.');
if (failures.length) {
  console.error(`${failures.length} broken internal link(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('No broken internal links found.');
