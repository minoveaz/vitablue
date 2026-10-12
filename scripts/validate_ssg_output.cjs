#!/usr/bin/env node
/**
 * validate_ssg_output.cjs
 *
 * Post-build SSG validation script.
 * Verifies that every sitemap route is pre-rendered with exactly one non-empty H1
 * and that required pages have:
 *   1. A page-specific <title> (not the generic fallback)
 *   2. At least one <script type="application/ld+json"> block (Schema)
 *   3. A <meta name="description"> with content > 60 chars
 *
 * Run after `npm run build` as part of the CI quality gate.
 * Exits 1 if any page fails — prevents broken SSG deploys.
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, '../dist');
const GENERIC_TITLE = 'VitaBlue | Comparador de Seguros de Salud y Asistencia';
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap.xml');

// Pages that MUST have a specific (non-generic) title + schema.
// Key: relative path from dist/   Value: substring that must appear in <title>
const REQUIRED_PAGES = {
  'index.html':                                                              'VitaBlue',
  'productos/seguros-salud/seguro-medico-estudiantes/index.html':           'Estudiante',
  'productos/seguros-salud/seguro-expatriados/index.html':                  'Expatriados',
  'productos/seguros-salud/seguro-nomadas-digitales/index.html':            'Nómad',
  'productos/seguros-salud/seguro-salud-extranjeros/index.html':            'Extranjeros',
  'productos/seguros-salud/seguros-sanitas/sanitas-mas-salud/index.html':   'Sanitas Más Salud',
  'productos/seguro-viaje/index.html':                                       'Viaje',
  'productos/seguro-mascotas/sanitas-mascotas/index.html':                  'Mascotas',
  'productos/seguro-vida/index.html':                                        'Vida',
  'productos/seguro-para-decesos/asistencia-familiar/index.html':           'Asistencia Familiar',
  'en/health-insurance-student-visa-spain/index.html':                      'Student',
  'en/health-insurance-expatriates-spain/index.html':                       'Expat',
  'en/digital-nomad-insurance-spain/index.html':                            'Nomad',
  'blog/index.html':                                                         'Blog',
  'contacto/index.html':                                                     'Contacto',
};

// Pages where Schema LD+JSON is required
const SCHEMA_REQUIRED = [
  'productos/seguros-salud/seguro-medico-estudiantes/index.html',
  'productos/seguros-salud/seguro-expatriados/index.html',
  'productos/seguros-salud/seguro-nomadas-digitales/index.html',
  'productos/seguros-salud/seguro-salud-extranjeros/index.html',
  'productos/seguros-salud/seguros-sanitas/sanitas-mas-salud/index.html',
  'productos/seguro-viaje/index.html',
  'productos/seguro-mascotas/sanitas-mascotas/index.html',
  'productos/seguro-vida/index.html',
  'productos/seguro-para-decesos/asistencia-familiar/index.html',
];

function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : null;
}

function countSchemaBlocks(html) {
  return (html.match(/application\/ld\+json/g) || []).length;
}

function extractDescription(html) {
  const m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
           || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  return m ? m[1].trim() : null;
}

function decodeXmlEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function getPrerenderedPath(loc) {
  const value = decodeXmlEntities(loc.trim());
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Malformed sitemap URL: "${loc}"`);
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`Unsupported sitemap URL protocol: "${loc}"`);
  }

  let urlPath;
  try {
    urlPath = decodeURIComponent(url.pathname);
  } catch {
    throw new Error(`Malformed URL path encoding: "${loc}"`);
  }

  if (urlPath.includes('\\') || urlPath.includes('\0')) {
    throw new Error(`Invalid sitemap URL path: "${loc}"`);
  }

  const rawPath = value.match(/^https?:\/\/[^/?#]*(\/[^?#]*)?/i)?.[1] ?? '/';
  let decodedRawPath;
  try {
    decodedRawPath = decodeURIComponent(rawPath);
  } catch {
    throw new Error(`Malformed URL path encoding: "${loc}"`);
  }
  if (decodedRawPath.split('/').some((segment) => segment === '.' || segment === '..')) {
    throw new Error(`Invalid sitemap URL path traversal: "${loc}"`);
  }

  const relativePath = urlPath.replace(/^\/+/, '').replace(/\/+$/, '');
  const pagePath = path.resolve(DIST_DIR, relativePath, 'index.html');
  if (pagePath !== path.join(DIST_DIR, 'index.html')
      && !pagePath.startsWith(`${DIST_DIR}${path.sep}`)) {
    throw new Error(`Sitemap URL resolves outside dist: "${loc}"`);
  }

  return pagePath;
}

function validateSitemapRoutes() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`❌ MISSING SITEMAP: ${path.relative(DIST_DIR, SITEMAP_PATH)}`);
    errors++;
    return;
  }

  const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const locations = [...sitemap.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc\s*>/gi)]
    .map((match) => match[1]);

  if (locations.length === 0) {
    console.error('❌ EMPTY SITEMAP: no <loc> URLs found in dist/sitemap.xml');
    errors++;
    return;
  }

  for (const [index, loc] of locations.entries()) {
    let pagePath;
    try {
      pagePath = getPrerenderedPath(loc);
    } catch (error) {
      console.error(`❌ INVALID SITEMAP URL #${index + 1}: ${error.message}`);
      errors++;
      continue;
    }

    const relPath = path.relative(DIST_DIR, pagePath);
    if (!fs.existsSync(pagePath)) {
      console.error(`❌ MISSING PRERENDERED PAGE: ${relPath}`);
      errors++;
      continue;
    }

    const html = fs.readFileSync(pagePath, 'utf-8');
    const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/gi)];
    if (headings.length !== 1) {
      console.error(`❌ ${relPath}: expected exactly one <h1>, found ${headings.length}`);
      errors++;
      continue;
    }

    const headingText = headings[0][1]
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;|&#160;|&#x0*a0;/gi, ' ')
      .trim();
    if (!headingText) {
      console.error(`❌ ${relPath}: <h1> is empty`);
      errors++;
    }
  }

  console.log(`   Sitemap routes checked: ${locations.length}`);
}

let errors = 0;
let warnings = 0;
const results = [];

console.log('\n🔍 SSG Output Validation\n');
console.log(`   Dist dir: ${DIST_DIR}\n`);

validateSitemapRoutes();

for (const [relPath, titleMustContain] of Object.entries(REQUIRED_PAGES)) {
  const fullPath = path.join(DIST_DIR, relPath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ MISSING FILE: ${relPath}`);
    errors++;
    continue;
  }

  const html = fs.readFileSync(fullPath, 'utf-8');
  const title = extractTitle(html);
  const schemaCount = countSchemaBlocks(html);
  const description = extractDescription(html);
  const isGenericTitle = relPath !== 'index.html' && title === GENERIC_TITLE;
  const needsSchema = SCHEMA_REQUIRED.includes(relPath);

  const pageErrors = [];

  // Rule 1: Title must not be generic
  if (isGenericTitle) {
    pageErrors.push(
      `Title is GENERIC fallback — Puppeteer SSG failed to capture React-rendered content.\n` +
      `     Expected title to contain: "${titleMustContain}"\n` +
      `     Got: "${title}"\n\n` +
      `     Cause: Puppeteer timed out before React mounted (lazy load + heavy page).\n` +
      `     Fix:   Ensure PrerenderReady is inside <Suspense> in App.tsx and\n` +
      `            renderAfterDocumentEvent: 'app-prerendered' is set in vite.config.ts`
    );
  } else if (title && !title.includes(titleMustContain)) {
    pageErrors.push(`Title missing expected keyword "${titleMustContain}". Got: "${title}"`);
  }

  // Rule 2: Schema must be present on product pages
  if (needsSchema && schemaCount === 0) {
    pageErrors.push(
      `No LD+JSON schema found — page was not properly pre-rendered.\n` +
      `     Schema is required for SEO rich results on this page.`
    );
  }

  // Rule 3: Description must exist and be substantial
  if (!description || description.length < 60) {
    pageErrors.push(
      `Meta description missing or too short (${description?.length ?? 0} chars, min 60).\n` +
      `     Got: "${description ?? 'none'}"`
    );
  }

  if (pageErrors.length > 0) {
    console.error(`❌ ${relPath}`);
    pageErrors.forEach(e => console.error(`   └─ ${e}\n`));
    errors += pageErrors.length;
  } else {
    console.log(`✅ ${relPath}`);
    console.log(`   Title:  "${title}"`);
    console.log(`   Schema: ${schemaCount} block(s) | Description: ${description.length} chars\n`);
  }
}

console.log('\n── Summary ──────────────────────────────────────────');
console.log(`   Pages checked: ${Object.keys(REQUIRED_PAGES).length}`);
console.log(`   Errors:        ${errors}`);
if (warnings > 0) console.log(`   Warnings:      ${warnings}`);
console.log('─────────────────────────────────────────────────────\n');

if (errors > 0) {
  console.error(`❌ SSG validation FAILED with ${errors} error(s). Fix before deploying.\n`);
  process.exit(1);
} else {
  console.log(`✅ All SSG pages validated successfully.\n`);
  process.exit(0);
}
