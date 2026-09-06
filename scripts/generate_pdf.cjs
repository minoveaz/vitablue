#!/usr/bin/env node
/**
 * Standard VitaBlue PDF Generator Engine
 * Compiles high-resolution, pixel-perfect A4 branded PDFs using Playwright Chromium.
 * 
 * Usage:
 *   node scripts/generate_pdf.cjs --template=student-visa-checklist --output=public/downloads/checklist-visado-estudiante-espana.pdf
 *   node scripts/generate_pdf.cjs --all
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');
const { renderBaseLayout } = require('./pdf-engine/baseTemplate.cjs');
const { getStudentVisaChecklistHtml } = require('./pdf-engine/templates/studentVisaChecklist.cjs');
const { getStudentVisaChecklistEnHtml } = require('./pdf-engine/templates/studentVisaChecklistEn.cjs');

const TEMPLATES = {
  'student-visa-checklist': {
    title: 'Checklist Oficial Requisitos Médicos Visado Estudiante España - VitaBlue',
    defaultOutput: 'public/downloads/checklist-visado-estudiante-espana.pdf',
    render: getStudentVisaChecklistHtml,
  },
  'student-visa-checklist-en': {
    title: 'Definitive Checklist: Health Insurance for Spain Student Visa - VitaBlue',
    defaultOutput: 'public/downloads/spain-student-visa-health-insurance-checklist.pdf',
    render: getStudentVisaChecklistEnHtml,
  },
};

async function buildPdf({ templateKey, outputPath }) {
  const tpl = TEMPLATES[templateKey];
  if (!tpl) {
    throw new Error(`Template not found: "${templateKey}". Available: ${Object.keys(TEMPLATES).join(', ')}`);
  }

  const finalOutput = outputPath || tpl.defaultOutput;
  const fullOutputPath = path.resolve(process.cwd(), finalOutput);
  fs.mkdirSync(path.dirname(fullOutputPath), { recursive: true });

  console.log(`\n[PDF-Engine] 🚀 Building PDF for template: "${templateKey}"...`);
  
  const pagesHtml = tpl.render();
  const fullHtml = renderBaseLayout({
    title: tpl.title,
    pagesHtml,
  });

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    
    // Load HTML content and wait for network (fonts)
    await page.setContent(fullHtml, { waitUntil: 'networkidle' });
    
    // Evaluate Google Fonts readiness
    await page.evaluate(() => document.fonts.ready);

    // Generate PDF strictly formatted as A4
    await page.pdf({
      path: fullOutputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        bottom: '0mm',
        left: '0mm',
        right: '0mm',
      },
      preferCSSPageSize: true,
    });

    const stats = fs.statSync(fullOutputPath);
    const sizeKb = (stats.size / 1024).toFixed(1);
    console.log(`[PDF-Engine] ✅ Successfully generated: ${finalOutput} (${sizeKb} KB)`);
  } finally {
    await browser.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  let templateArg = 'student-visa-checklist';
  let outputArg = null;
  let allArg = false;

  for (const arg of args) {
    if (arg.startsWith('--template=')) {
      templateArg = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
      outputArg = arg.split('=')[1];
    } else if (arg === '--all') {
      allArg = true;
    }
  }

  if (allArg) {
    for (const key of Object.keys(TEMPLATES)) {
      await buildPdf({ templateKey: key });
    }
  } else {
    await buildPdf({ templateKey: templateArg, outputPath: outputArg });
  }
}

main().catch((err) => {
  console.error('[PDF-Engine] ❌ Generation failed:', err);
  process.exit(1);
});
