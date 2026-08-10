const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const sourceDirs = ['components', 'pages', 'context', 'domain', 'utils'];
const validExtensions = new Set(['.tsx', '.ts', '.jsx', '.js']);

const failOnFindings = process.argv.includes('--fail-on-findings');
const verbose = process.argv.includes('--verbose');

const findings = [];

// Clean relative path for display
function getRelativePath(filePath) {
  return path.relative(rootDir, filePath);
}

function addFinding(file, line, rule, message, snippet) {
  findings.push({
    file: getRelativePath(file),
    line,
    rule,
    message,
    snippet: snippet ? snippet.trim().slice(0, 150) : '',
  });
}

function inspectFile(file) {
  const source = fs.readFileSync(file, 'utf8');
  const lines = source.split('\n');

  lines.forEach((lineText, index) => {
    const lineNo = index + 1;
    const trimmed = lineText.trim();

    // Ignore empty lines and comments
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      return;
    }

    // 1. RULE: Fixed Width Prohibition on Outer Container Classes (w-[400px], etc.)
    // Matches w-[<number>px] or min-w-[<number>px] where px value is >= 200 (excluding max-w-[...])
    const fixedWidthMatch = lineText.match(/\b(?:w|min-w)-\[(\d+)px\]/);
    // Excluir si va acompañado de w-full o max-w-[...] (ya que es fluido)
    const isFluid = lineText.includes('w-full') || lineText.includes('max-w-[') || lineText.includes('w-[92vw]');
    if (fixedWidthMatch && !isFluid) {
      const widthVal = parseInt(fixedWidthMatch[1], 10);
      if (widthVal >= 200) {
        addFinding(
          file,
          lineNo,
          'FIXED_WIDTH_CONTAINER',
          `Fixed width 'w-[${widthVal}px]' detected. Use fluid width (w-full, max-w-xl, etc.) with responsive padding (px-4 sm:px-6).`,
          lineText
        );
      }
    }

    // 2. RULE: Hex color hardcoding (e.g., #005F73, #EE9B00)
    // Ignore SVGs, export_logo, svgGenerator or config files
    const isSvgOrConfig = file.endsWith('.svg') || file.includes('tailwind.config') || file.includes('vite.config') || file.includes('svgGenerator.ts');
    if (!isSvgOrConfig) {
      const hexColorMatch = lineText.match(/(?:bg|text|border|ring|stroke|fill)-\[#(?:[0-9a-fA-F]{3,8})\]|#(?:005F73|001219|EE9B00|94D2BD)\b/i);
      if (hexColorMatch && !file.includes('blogData.ts')) {
        addFinding(
          file,
          lineNo,
          'HARDCODED_HEX_COLOR',
          `Hardcoded hex color '${hexColorMatch[0]}' found. Use semantic classes ('primary', 'accent', 'brand-cyan', 'text-main', etc.).`,
          lineText
        );
      }
    }

    // 3. RULE: Inline typography overrides on Headings instead of visual system tokens
    if (/<h[1-6]\b[^>]*className=["'][^"']*\b(text-(?:[2-9]?xl|\d{2}px))\b/i.test(lineText)) {
      const fontMatch = lineText.match(/text-(?:[2-9]?xl|\d{2}px)/i);
      addFinding(
        file,
        lineNo,
        'TYPOGRAPHY_HIERARCHY',
        `Heading uses generic text size '${fontMatch ? fontMatch[0] : ''}'. Use predefined brand utility classes ('text-h1', 'text-h2', 'text-h3').`,
        lineText
      );
    }
  });
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (validExtensions.has(path.extname(entry.name))) {
      inspectFile(fullPath);
    }
  }
}

console.log('🔍 Running VitaBlue Frontend Rule Audit (AGENTS.md Compliance)...\n');

for (const sourceDir of sourceDirs) {
  walkDir(path.join(rootDir, sourceDir));
}

if (findings.length === 0) {
  console.log('✅ PASS: No AGENTS.md rule violations found!\n');
  process.exit(0);
} else {
  console.log(`⚠️  FOUND ${findings.length} POTENTIAL RULE VIOLATION(S):\n`);

  const ruleCounts = {};
  findings.forEach((f) => {
    ruleCounts[f.rule] = (ruleCounts[f.rule] || 0) + 1;
    console.log(`[${f.rule}] ${f.file}:${f.line}`);
    console.log(`  └─ Message: ${f.message}`);
    if (verbose && f.snippet) {
      console.log(`  └─ Snippet: ${f.snippet}`);
    }
  });

  console.log('\n📊 Summary of findings by rule:');
  Object.entries(ruleCounts).forEach(([rule, count]) => {
    console.log(`  - ${rule}: ${count}`);
  });
  console.log('');

  if (failOnFindings) {
    console.error('❌ Audit failed due to --fail-on-findings flag.');
    process.exit(1);
  }
}
