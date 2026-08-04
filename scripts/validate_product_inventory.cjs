const fs = require('node:fs');
const path = require('node:path');

const file = path.resolve('domain/products/inventory.ts');
const source = fs.readFileSync(file, 'utf8');
const entries = [...source.matchAll(/\{ id: '([^']+)', name: '([^']+)', category: '([^']+)', provider: '([^']+)', canonicalPath: '([^']+)', status: '(catalogued|landing-only)', sourcePage: '([^']+)' \}/g)];

if (entries.length === 0) {
  console.error('PRODUCT INVENTORY FAILED: no entries found.');
  process.exit(1);
}

const ids = new Set();
const errors = [];
for (const [, id, name, category, provider, canonicalPath, status, sourcePage] of entries) {
  if (ids.has(id)) errors.push(`duplicate id: ${id}`);
  ids.add(id);
  if (!name.trim()) errors.push(`${id}: empty name`);
  if (!provider.trim()) errors.push(`${id}: empty provider`);
  if (!canonicalPath.startsWith('/')) errors.push(`${id}: canonicalPath must be absolute`);
  if (!sourcePage.includes('/')) errors.push(`${id}: sourcePage must identify a source file`);
  if (!['health', 'pet', 'life', 'travel', 'funeral'].includes(category)) errors.push(`${id}: invalid category`);
  if (!['catalogued', 'landing-only'].includes(status)) errors.push(`${id}: invalid status`);
}

if (errors.length) {
  console.error('PRODUCT INVENTORY FAILED:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const catalogued = entries.filter(([, , , , , , status]) => status === 'catalogued').length;
console.log(`Product inventory OK: ${entries.length} entries (${catalogued} catalogued, ${entries.length - catalogued} landing-only).`);
