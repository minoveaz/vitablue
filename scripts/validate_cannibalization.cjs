const fs = require('node:fs');
const path = require('node:path');

const routesPath = path.join(__dirname, '..', 'config', 'routes.ts');
const source = fs.readFileSync(routesPath, 'utf8');

const canonicalPaths = [...source.matchAll(/canonical\('([^']+)'/g)].map(([, route]) => `${route}/`.replace(/\/+$/, '/'));
const legacyRoutes = [...source.matchAll(/legacy\('([^']+)',\s*'([^']+)'\)/g)]
  .map(([, from, to]) => ({ from, to: `${to}/`.replace(/\/+$/, '/') }));

const intentMap = {
  studentVisa: '/productos/seguros-salud/seguro-medico-estudiantes/',
  foreignerHealth: '/productos/seguros-salud/seguro-salud-extranjeros/',
  expatResidence: '/productos/seguros-salud/seguro-expatriados/',
  digitalNomad: '/productos/seguros-salud/seguro-nomadas-digitales/',
  sanitasMasSalud: '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud/',
};

const errors = [];
const uniqueCanonicalPaths = new Set(canonicalPaths);

for (const [intent, route] of Object.entries(intentMap)) {
  if (!uniqueCanonicalPaths.has(route)) {
    errors.push(`Intent "${intent}" points to a route outside canonicalRoutes: ${route}`);
  }
}

for (const legacy of legacyRoutes) {
  if (!legacy.to || legacy.to === legacy.from) {
    errors.push(`Legacy route has no consolidation target: ${legacy.from}`);
  }
  if (canonicalPaths.includes(`${legacy.from}/`.replace(/\/+$/, '/'))) {
    errors.push(`Legacy route is also registered as canonical: ${legacy.from}`);
  }
}

if (new Set(canonicalPaths).size !== canonicalPaths.length) {
  errors.push('canonicalRoutes contains duplicate canonical paths');
}

if (errors.length > 0) {
  console.error('Cannibalization guard failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Cannibalization guard passed: ${Object.keys(intentMap).length} commercial intents have one canonical target and ${legacyRoutes.length} legacy routes have consolidation targets.`);
