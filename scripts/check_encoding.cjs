const fs = require('node:fs');
const path = require('node:path');

const roots = [
  path.resolve('pages'),
  path.resolve('components'),
  path.resolve('domain'),
  path.resolve('utils'),
  path.resolve('dist'),
];
const extensions = new Set(['.tsx', '.ts', '.jsx', '.js', '.html']);
const mojibake = /[ÃÂâð�]/;
const failures = [];

function visit(currentPath) {
  if (!fs.existsSync(currentPath)) return;
  const entry = fs.statSync(currentPath);
  if (entry.isDirectory()) {
    for (const child of fs.readdirSync(currentPath)) visit(path.join(currentPath, child));
    return;
  }
  if (!extensions.has(path.extname(currentPath))) return;
  const content = fs.readFileSync(currentPath, 'utf8');
  if (mojibake.test(content)) failures.push(path.relative(process.cwd(), currentPath));
}

for (const root of roots) visit(root);

if (failures.length > 0) {
  console.error('Encoding inválido detectado en:');
  for (const file of failures) console.error(`- ${file}`);
  process.exit(1);
}

console.log('Encoding check passed.');
