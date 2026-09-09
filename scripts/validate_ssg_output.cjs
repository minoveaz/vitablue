#!/usr/bin/env node
/**
 * validate_ssg_output.cjs
 *
 * Post-build SSG validation script.
 * Verifies that each pre-rendered HTML page has:
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
  'en/health-insurance-expatriates-spain/index.html':                       'Expatriates',
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

let errors = 0;
let warnings = 0;
const results = [];

console.log('\n🔍 SSG Output Validation\n');
console.log(`   Dist dir: ${DIST_DIR}\n`);

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
  const isGenericTitle = title === GENERIC_TITLE;
  const needsSchema = SCHEMA_REQUIRED.includes(relPath);

  const pageErrors = [];

  // Rule 1: Title must not be generic
  if (isGenericTitle) {
    pageErrors.push(
      `Title is GENERIC fallback — Puppeteer SSG failed to capture React-rendered content.\n` +
      `     Expected title to contain: "${titleMustContain}"\n` +
      `     Got: "${title}"\n\n` +
      `     Cause: Puppeteer timed out before React mounted (lazy load + heavy page).\n` +
      `     Fix:   Ensure PrerenderSignal is inside <Suspense> in App.tsx and\n` +
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
