const fs = require('fs');
const path = require('path');
const {
  buildAlternates,
  getPageForRoute,
  pageMap,
  validateManifest,
} = require('./hreflang_manifest.cjs');

const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  console.error('Static SEO validation requires dist/sitemap.xml. Run npm run build first.');
  process.exit(1);
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
const failures = validateManifest().map((error) => `hreflang manifest: ${error}`);
if (new Set(urls).size !== urls.length) {
  failures.push(`sitemap contains duplicate URLs (${urls.length - new Set(urls).size} duplicate(s))`);
}
const getAttribute = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*(['"])(.*?)\\1`, 'i'))?.[2] ?? '';
const getTags = (html, tagName) => html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? [];
const normalizeRoute = (route) => (route === '/' ? route : route.replace(/\/+$/, ''));

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
  for (const tag of ['card', 'title', 'description', 'image']) {
    const twitterTag = html.match(new RegExp(`<meta[^>]+name="twitter:${tag}"[^>]*>`, 'i'))?.[0];
    if (!twitterTag || !getAttribute(twitterTag, 'content').trim()) {
      failures.push(`${url}: missing twitter:${tag}`);
    }
  }
  for (const property of ['title', 'description', 'type', 'url', 'image']) {
    const openGraphTag = html.match(new RegExp(`<meta[^>]+property="og:${property}"[^>]*>`, 'i'))?.[0];
    if (!openGraphTag || !getAttribute(openGraphTag, 'content').trim()) {
      failures.push(`${url}: missing og:${property}`);
    }
  }

  const route = normalizeRoute(new URL(url).pathname);
  const page = getPageForRoute(route);
  if (!page) {
    failures.push(`${url}: missing hreflang manifest entry`);
    continue;
  }

  const alternates = getTags(html, 'link')
    .filter((tag) => getAttribute(tag, 'rel').toLowerCase() === 'alternate' && getAttribute(tag, 'hreflang'))
    .map((tag) => `${getAttribute(tag, 'hreflang')}|${getAttribute(tag, 'href')}`);
  const expectedAlternates = buildAlternates(page).map(({ hreflang, href }) => `${hreflang}|${href}`);
  if (new Set(alternates).size !== alternates.length) failures.push(`${url}: duplicate hreflang links`);
  if (alternates.length !== expectedAlternates.length || expectedAlternates.some((key) => !alternates.includes(key))) {
    failures.push(`${url}: incomplete or incorrect hreflang links`);
  }
  for (const alternate of alternates) {
    const href = alternate.split('|').slice(1).join('|');
    try {
      if (!pageMap.has(normalizeRoute(new URL(href).pathname))) {
        failures.push(`${url}: hreflang points to unknown route ${href}`);
      }
    } catch {
      failures.push(`${url}: invalid hreflang URL ${href}`);
    }
  }
}

console.log(`Static SEO audit: ${urls.length} sitemap URLs checked.`);
if (failures.length) {
  console.error(`Static SEO audit failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Static SEO audit passed.');
