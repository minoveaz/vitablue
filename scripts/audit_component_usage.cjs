const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourceDirs = [path.join(root, 'pages', 'public'), path.join(root, 'pages', 'funnel')];
const structuralPattern = /<(section|article|aside|header|footer|form|table|nav)\b[^>]*className=(?:"([^"]+)"|'([^']+)'|\{`([^`]+)`\})/g;
const componentPattern = /<([A-Z][A-Za-z0-9]*)\b/g;
const excludedComponents = new Set(['Helmet', 'Link', 'Navigate', 'Route']);
const ignoredFiles = new Set(['AvisoLegal.tsx', 'CookiesPolicy.tsx', 'Privacy.tsx']);
const genericClasses = new Set(['w-full', 'flex', 'flex-col', 'relative', 'overflow-hidden', 'mx-auto', 'text-left']);

const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx|jsx)$/.test(entry.name)) files.push(full);
  }
};
sourceDirs.forEach(walk);

const importedNames = (source) => new Set([...source.matchAll(/import\s+([\s\S]*?)\s+from\s+['"]@\/components\/[^'"]+['"]/g)]
  .flatMap((match) => match[1].replace(/[{}]/g, '').split(',').map((name) => name.trim().split(/\s+as\s+/)[0])));

const normalizeClasses = (value) => value
  .replace(/\$\{[^}]+\}/g, '*')
  .replace(/\s+/g, ' ')
  .trim()
  .split(' ')
  .filter((className) => className && !genericClasses.has(className))
  .sort()
  .join(' ');

const childSignature = (source, match) => {
  const start = match.index + match[0].length;
  const end = source.indexOf(`</${match[1]}>`, start);
  const content = source.slice(start, end === -1 ? start : end);
  const components = [...content.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((item) => item[1]);
  const elements = [...content.matchAll(/<(h[1-6]|p|form|article|div|ol|ul|table)\b/g)].map((item) => item[1]);
  return [...new Set([...components, ...elements])].join('|');
};

const rows = files.map((file) => {
  const source = fs.readFileSync(file, 'utf8');
  const lines = source.split('\n');
  const imported = importedNames(source);
  const components = [...source.matchAll(componentPattern)]
    .map((match) => match[1])
    .filter((name) => !excludedComponents.has(name) && imported.has(name));
  const blocks = ignoredFiles.has(path.basename(file)) ? [] : [...source.matchAll(structuralPattern)].map((match) => {
    const line = source.slice(0, match.index).split('\n').length;
    const classes = match[2] || match[3] || match[4] || '';
    return {
      tag: match[1],
      line,
      classes: normalizeClasses(classes),
      children: childSignature(source, match),
      file: path.relative(root, file),
      preview: lines[line - 1].trim().slice(0, 140),
    };
  });
  return { file: path.relative(root, file), reusableBlocks: components.length, blocks };
});

const signatures = new Map();
rows.flatMap((row) => row.blocks).forEach((block) => {
  if (!block.classes) return;
  if (!block.children) return;
  const signature = `${block.tag}:${block.children}`;
  const group = signatures.get(signature) || [];
  group.push(block);
  signatures.set(signature, group);
});

const candidateSignatures = new Set([...signatures.entries()]
  .filter(([, blocks]) => new Set(blocks.map((block) => block.file)).size >= 2)
  .map(([signature]) => signature));

const pages = rows.map((row) => {
  const candidates = row.blocks.filter((block) => candidateSignatures.has(`${block.tag}:${block.children}`));
  return {
    file: row.file,
    reusableBlocks: row.reusableBlocks,
    legitimateInlineBlocks: row.blocks.length - candidates.length,
    candidateBlocks: candidates.length,
    candidates,
  };
});

const reusableBlocks = pages.reduce((sum, page) => sum + page.reusableBlocks, 0);
const legitimateInlineBlocks = pages.reduce((sum, page) => sum + page.legitimateInlineBlocks, 0);
const candidateBlocks = pages.reduce((sum, page) => sum + page.candidateBlocks, 0);
const functionalTotal = reusableBlocks + candidateBlocks;
const functionalCoverage = functionalTotal ? Math.round((reusableBlocks / functionalTotal) * 100) : 100;
const result = {
  filesAudited: pages.length,
  reusableBlocks,
  legitimateInlineBlocks,
  candidateBlocks,
  functionalCoverage,
  candidateRatio: functionalTotal ? 100 - functionalCoverage : 0,
  candidateDetails: pages.flatMap((page) => page.candidates),
  pages: pages.filter((page) => page.reusableBlocks || page.legitimateInlineBlocks || page.candidateBlocks),
};

const format = process.argv.includes('--format=json') ? 'json' : process.argv.includes('--format=markdown') ? 'markdown' : 'text';
if (format === 'json') {
  console.log(JSON.stringify(result, null, 2));
} else if (format === 'markdown') {
  console.log('# Component reuse audit\n');
  console.log(`- Files audited: ${result.filesAudited}`);
  console.log(`- Reusable components: ${result.reusableBlocks}`);
  console.log(`- Legitimate inline blocks: ${result.legitimateInlineBlocks}`);
  console.log(`- Reuse candidates: ${result.candidateBlocks}`);
  console.log(`- Functional coverage: ${result.functionalCoverage}%`);
  console.log(`- Candidate ratio: ${result.candidateRatio}%\n`);
  console.log('## Candidates\n');
  result.candidateDetails.forEach((candidate) => console.log(`- ${candidate.file}:${candidate.line} <${candidate.tag}> ${candidate.preview}`));
} else {
  console.log('=== VitaBlue component reuse audit ===');
  console.log(`Files audited: ${result.filesAudited}`);
  console.log(`Reusable components: ${result.reusableBlocks}`);
  console.log(`Legitimate inline blocks: ${result.legitimateInlineBlocks}`);
  console.log(`Reuse candidates: ${result.candidateBlocks}`);
  console.log(`Functional coverage: ${result.functionalCoverage}%`);
  console.log(`Candidate ratio: ${result.candidateRatio}%`);
  result.candidateDetails.forEach((candidate) => console.log(`- ${candidate.file}:${candidate.line} <${candidate.tag}> ${candidate.preview}`));
}

const threshold = Number((process.argv.find((arg) => arg.startsWith('--fail-under=')) || '').split('=')[1]);
if (Number.isFinite(threshold) && result.functionalCoverage < threshold) process.exitCode = 1;
