const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  console.error('Static SEO validation requires dist/sitemap.xml. Run npm run build first.');
  process.exit(1);
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
const failures = [];

const htmlPathFor = (url) => {
  const pathname = new URL(url).pathname;
  return pathname === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, pathname.replace(/^\/|\/$/g, ''), 'index.html');
};

for (const url of urls) {
  const filePath = htmlPathFor(url);
  if (!fs.existsSync(filePath)) {
    failures.push(`${url}: missing prerendered HTML`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1];
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim();
  const description = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/)?.[1]?.trim();
  if (canonical !== url) failures.push(`${url}: canonical is ${canonical ?? 'missing'}`);
  if (!title) failures.push(`${url}: missing title`);
  if (!description) failures.push(`${url}: missing meta description`);
}

console.log(`Static SEO audit: ${urls.length} sitemap URLs checked.`);
if (failures.length) {
  console.error(`Static SEO audit failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Static SEO audit passed.');
