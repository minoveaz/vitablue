const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '..', 'config', 'routes.ts');
const source = fs.readFileSync(registryPath, 'utf8');
const paths = [
  ...[...source.matchAll(/canonical\('([^']+)'/g)].map((match) => match[1]),
  ...[...source.matchAll(/legacy\('([^']+)'/g)].map((match) => match[1]),
  ...[...source.matchAll(/path:\s*'([^']+)'/g)].map((match) => match[1]),
];
const duplicates = [...new Set(paths.filter((route, index) => paths.indexOf(route) !== index))];
const invalidLegacy = [...source.matchAll(/legacy\('([^']+)'\s*,\s*'([^']+)'\)/g)]
  .filter(([, from, to]) => from === to || !to.startsWith('/'))
  .map(([, from]) => from);
const privateSource = source.split('export const privateRoutes')[1] ?? '';
const privateIndexable = [...privateSource.matchAll(/path:\s*'([^']+)'[^\n]*indexable:\s*true/g)].map((match) => match[1]);
const incompleteCanonical = [...source.matchAll(/canonical\('([^']+)',\s*\{([\s\S]*?)\}\)/g)]
  .filter(([, , options]) => /indexable:\s*true/.test(options) && (!/canonical:\s*'/.test(options) || !/prerender:\s*true/.test(options) || !/sitemap:\s*true/.test(options)))
  .map(([, route]) => route);

if (duplicates.length || invalidLegacy.length || privateIndexable.length || incompleteCanonical.length) {
  console.error('Route registry validation failed.');
  if (duplicates.length) console.error(`Duplicate paths: ${duplicates.join(', ')}`);
  if (invalidLegacy.length) console.error(`Invalid legacy redirects: ${invalidLegacy.join(', ')}`);
  if (privateIndexable.length) console.error(`Private routes marked indexable: ${privateIndexable.join(', ')}`);
  if (incompleteCanonical.length) console.error(`Incomplete indexable canonical routes: ${incompleteCanonical.join(', ')}`);
  process.exit(1);
}

console.log(`Route registry OK: ${new Set(paths).size} unique definitions.`);
