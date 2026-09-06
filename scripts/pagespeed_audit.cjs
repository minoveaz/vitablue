#!/usr/bin/env node

/**
 * VitaBlue - Automated Google PageSpeed & Core Web Vitals Audit CLI
 *
 * Runs official performance, accessibility, best practices, and SEO audits.
 * Supports:
 *   1. Google PageSpeed Insights API (Cloud + CrUX field data) when API Key is provided.
 *   2. Google Lighthouse 12 Engine (Local emulation) with zero quota limits.
 *
 * Usage:
 *   node scripts/pagespeed_audit.cjs
 *   node scripts/pagespeed_audit.cjs --strategy=mobile
 *   node scripts/pagespeed_audit.cjs --strategy=desktop
 *   node scripts/pagespeed_audit.cjs --url=https://www.vitablue.es/blog/
 *   node scripts/pagespeed_audit.cjs --save
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CREDENTIALS_DIR = path.join(__dirname, '..', '.credentials');
const KEY_FILE = path.join(CREDENTIALS_DIR, 'pagespeed-api-key.txt');
const OUTPUT_DIR = path.join(__dirname, '..', 'SEO & SEM', 'PageSpeed');

// Parse CLI flags
const args = process.argv.slice(2);
const targetUrl = (args.find(a => a.startsWith('--url=')) || '--url=https://www.vitablue.es/').split('=')[1];
const strategyArg = (args.find(a => a.startsWith('--strategy=')) || '--strategy=both').split('=')[1].toLowerCase();
const shouldSave = args.includes('--save') || args.includes('--save-report');

function getApiKey() {
  if (process.env.PAGESPEED_API_KEY) return process.env.PAGESPEED_API_KEY.trim();
  if (fs.existsSync(KEY_FILE)) {
    const content = fs.readFileSync(KEY_FILE, 'utf8').trim();
    if (content) return content;
  }
  return null;
}

async function fetchPageSpeedApi(url, strategy, apiKey) {
  const apiUrl = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo&key=${apiKey}`;
  const response = await fetch(apiUrl);
  const json = await response.json();

  if (json.error) {
    throw new Error(`API Error [${json.error.code}]: ${json.error.message}`);
  }

  return formatLighthouseResult(json.lighthouseResult, json.loadingExperience, 'Google PageSpeed Insights Cloud API (Servidores Oficiales de Google)');
}

function runLocalLighthouse(url, strategy) {
  const isMobile = strategy === 'mobile';
  const flags = [
    '--chrome-flags="--headless=new --no-sandbox"',
    isMobile ? '--form-factor=mobile --screenEmulation.mobile=true' : '--preset=desktop',
    '--output=json',
    '--output-path=stdout',
    '--quiet'
  ].join(' ');

  try {
    const stdout = execSync(`npx --yes lighthouse "${url}" ${flags}`, {
      maxBuffer: 50 * 1024 * 1024,
      encoding: 'utf8'
    });
    const result = JSON.parse(stdout);
    return formatLighthouseResult(result, null, 'Lighthouse 12 Engine (Emulación Local Chrome)');
  } catch (e) {
    throw new Error(`Lighthouse execution failed: ${e.message}`);
  }
}

function formatLighthouseResult(lh, crux, source) {
  const cats = lh.categories || {};
  const audits = lh.audits || {};

  const getScore = (cat) => cat ? Math.round(cat.score * 100) : 'N/A';
  const getAudit = (key) => audits[key] ? audits[key].displayValue || `${audits[key].numericValue?.toFixed(2)}` : 'N/A';

  return {
    source,
    fetchTime: lh.fetchTime || new Date().toISOString(),
    url: lh.requestedUrl || targetUrl,
    scores: {
      performance: getScore(cats.performance),
      accessibility: getScore(cats.accessibility),
      bestPractices: getScore(cats['best-practices']),
      seo: getScore(cats.seo)
    },
    metrics: {
      fcp: getAudit('first-contentful-paint'),
      lcp: getAudit('largest-contentful-paint'),
      tbt: getAudit('total-blocking-time'),
      cls: getAudit('cumulative-layout-shift'),
      speedIndex: getAudit('speed-index'),
      ttfb: getAudit('server-response-time')
    },
    crux: crux ? {
      overallCategory: crux.overall_category || 'N/A',
      metrics: crux.metrics || {}
    } : null
  };
}

async function auditStrategy(strategy) {
  const apiKey = getApiKey();
  console.log(`\n🔍 Auditando [${strategy.toUpperCase()}] para: ${targetUrl}`);

  if (apiKey) {
    try {
      console.log('⚡ Conectando a Google PageSpeed Insights Cloud API (Datacenter Google)...');
      return await fetchPageSpeedApi(targetUrl, strategy, apiKey);
    } catch (err) {
      console.warn(`⚠️ Error en PageSpeed Cloud API (${err.message}). Cambiando a Lighthouse Local Engine...`);
    }
  } else {
    console.log('ℹ️ PAGESPEED_API_KEY no detectada. Usando motor oficial Lighthouse de Google (Ilimitado)...');
  }

  return runLocalLighthouse(targetUrl, strategy);
}

function printSummary(result, strategy) {
  const { scores, metrics, source } = result;
  const s = strategy.toUpperCase();

  const colorize = (score) => {
    if (score >= 90) return `🟢 ${score} (Excelente)`;
    if (score >= 50) return `🟡 ${score} (Mejorable)`;
    return `🔴 ${score} (Crítico)`;
  };

  console.log(`\n======================================================`);
  console.log(`📋 RESULTADOS AUDITORÍA ${s} - VITABLUE`);
  console.log(`Fuente: ${source}`);
  console.log(`URL:    ${result.url}`);
  console.log(`Fecha:  ${result.fetchTime}`);
  console.log(`======================================================`);
  console.log(`🏆 PUNTUACIONES GOOGLE (0-100):`);
  console.log(`  • Rendimiento (Speed):     ${colorize(scores.performance)}`);
  console.log(`  • Accesibilidad:           ${colorize(scores.accessibility)}`);
  console.log(`  • Mejores Prácticas:       ${colorize(scores.bestPracticas || scores.bestPractices)}`);
  console.log(`  • SEO Técnico:             ${colorize(scores.seo)}`);
  console.log(`------------------------------------------------------`);
  console.log(`⚡ CORE WEB VITALS & TIEMPOS DE CARGA:`);
  console.log(`  • First Contentful Paint (FCP):   ${metrics.fcp}`);
  console.log(`  • Largest Contentful Paint (LCP): ${metrics.lcp}`);
  console.log(`  • Total Blocking Time (TBT):      ${metrics.tbt}`);
  console.log(`  • Cumulative Layout Shift (CLS):  ${metrics.cls}`);
  console.log(`  • Speed Index:                    ${metrics.speedIndex}`);
  console.log(`  • Tiempo de Respuesta Servidor:   ${metrics.ttfb}`);

  if (result.crux) {
    console.log(`------------------------------------------------------`);
    console.log(`👥 DATOS REALES DE USUARIOS (Google CrUX 28 días):`);
    console.log(`  • Categoría general: ${result.crux.overallCategory}`);
  }
  console.log(`======================================================\n`);
}

async function main() {
  const strategies = strategyArg === 'both' ? ['mobile', 'desktop'] : [strategyArg];
  const results = {};

  for (const strat of strategies) {
    try {
      const res = await auditStrategy(strat);
      results[strat] = res;
      printSummary(res, strat);
    } catch (e) {
      console.error(`❌ Error en auditoría ${strat}:`, e.message);
    }
  }

  if (shouldSave) {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeUrl = targetUrl.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `pagespeed_${safeUrl}_${timestamp}.json`;
    const filepath = path.join(OUTPUT_DIR, filename);

    fs.writeFileSync(filepath, JSON.stringify(results, null, 2), 'utf8');
    console.log(`💾 Reporte guardado con éxito en:\n   ${filepath}\n`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
