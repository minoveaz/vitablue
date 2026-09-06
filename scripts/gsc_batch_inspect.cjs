/**
 * VitaBlue - Batch URL Inspection via Google Search Console API
 * Issue #147: Diagnóstico Técnico y Errores de Indexación
 *
 * Concurrency: 5 workers en paralelo
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CREDENTIALS_PATH = path.join(__dirname, '..', '.credentials', 'gsc-credentials.json');
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');
const OUTPUT_DIR = path.join(__dirname, '..', '.temp_audit');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'gsc_inspection_report.json');
const SITE_URL = 'sc-domain:vitablue.es';
const CONCURRENCY = 5;

if (!fs.existsSync(CREDENTIALS_PATH)) {
  console.error(`❌ Error: No se encontró el archivo de credenciales en:\n${CREDENTIALS_PATH}`);
  process.exit(1);
}

const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));

function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken() {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedClaim = base64url(JSON.stringify(claim));
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${encodedHeader}.${encodedClaim}`);
  const signature = signer.sign(creds.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${encodedHeader}.${encodedClaim}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error de autenticación con Google: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

function extractUrlsFromSitemap() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error(`No se encontró sitemap.xml en ${SITEMAP_PATH}`);
  }
  const content = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const urls = [];
  const regex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function inspectSingleUrl(token, inspectionUrl) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inspectionUrl,
      siteUrl: SITE_URL,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return {
      url: inspectionUrl,
      error: data.error ? data.error.message : JSON.stringify(data),
    };
  }
  return {
    url: inspectionUrl,
    result: data.inspectionResult || {},
  };
}

async function runWorkerPool(items, limit, workerFn) {
  const results = new Array(items.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      results[idx] = await workerFn(items[idx], idx, items.length);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const allUrls = extractUrlsFromSitemap();
  let targetUrls = [...allUrls];

  const urlIdx = args.indexOf('--url');
  if (urlIdx !== -1 && args[urlIdx + 1]) {
    targetUrls = [args[urlIdx + 1]];
  } else if (args.includes('--blog-only')) {
    targetUrls = targetUrls.filter((u) => u.includes('/blog/'));
  } else {
    const limitIdx = args.indexOf('--limit');
    if (limitIdx !== -1 && args[limitIdx + 1]) {
      const limit = parseInt(args[limitIdx + 1], 10);
      targetUrls = targetUrls.slice(0, limit);
    }
  }

  console.log(`\n🔍 === VIRTUAL AUDIT: INSPECCIÓN MASIVA DE URLs (GSC API) ===`);
  console.log(`- Propiedad GSC:   ${SITE_URL}`);
  console.log(`- Total en sitemap: ${allUrls.length} URLs`);
  console.log(`- URLs a auditar:  ${targetUrls.length} URLs`);
  console.log(`- Concurrencia:    ${CONCURRENCY} workers en paralelo\n`);

  console.log('🔑 Obteniendo token de acceso...');
  const token = await getAccessToken();
  console.log('✅ Conexión establecida con éxito.\n');

  const startTime = Date.now();
  let completedCount = 0;

  const results = await runWorkerPool(targetUrls, CONCURRENCY, async (url, idx, total) => {
    try {
      const response = await inspectSingleUrl(token, url);
      completedCount++;

      if (response.error) {
        console.log(`[${completedCount}/${total}] ❌ ERROR ${url} (${response.error})`);
        return { url, status: 'ERROR', error: response.error };
      }

      const indexStatus = response.result.indexStatusResult || {};
      const mobileStatus = response.result.mobileUsabilityResult || {};
      const richStatus = response.result.richResultsResult || {};

      const verdict = indexStatus.verdict || 'UNKNOWN';
      const coverage = indexStatus.coverageState || 'UNKNOWN';
      const googleCanon = indexStatus.googleCanonical || 'N/A';
      const userCanon = indexStatus.userCanonical || 'N/A';
      const isIndexed = verdict === 'PASS';
      const canonMatch = googleCanon === userCanon || (!googleCanon && !userCanon);
      const detectedRichTypes = (richStatus.detectedItems || []).map((item) => item.richResultType);

      const statusIcon = isIndexed ? '✅' : '⚠️';
      console.log(`[${completedCount}/${total}] ${statusIcon} [${verdict}] ${url} -> ${coverage}`);

      return {
        url,
        verdict,
        coverageState: coverage,
        indexingState: indexStatus.indexingState || 'N/A',
        robotsTxtState: indexStatus.robotsTxtState || 'N/A',
        pageFetchState: indexStatus.pageFetchState || 'N/A',
        lastCrawlTime: indexStatus.lastCrawlTime || null,
        userCanonical: userCanon,
        googleCanonical: googleCanon,
        canonicalMatch: canonMatch,
        mobileVerdict: mobileStatus.verdict || 'N/A',
        richResultsVerdict: richStatus.verdict || 'N/A',
        richResultsTypes: detectedRichTypes,
        rawResult: response.result,
      };
    } catch (err) {
      completedCount++;
      console.log(`[${completedCount}/${total}] ❌ EXCEPCIÓN ${url}: ${err.message}`);
      return { url, status: 'EXCEPTION', error: err.message };
    }
  });

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);

  // Métricas agregadas
  const total = results.length;
  const indexed = results.filter((r) => r.verdict === 'PASS').length;
  const notIndexed = results.filter((r) => r.verdict && r.verdict !== 'PASS' && r.verdict !== 'UNKNOWN').length;
  const canonicalMismatches = results.filter((r) => r.canonicalMatch === false && r.googleCanonical !== 'N/A');
  const richIssues = results.filter((r) => r.richResultsVerdict && r.richResultsVerdict !== 'PASS' && r.richResultsVerdict !== 'N/A');
  const errors = results.filter((r) => r.status === 'ERROR' || r.status === 'EXCEPTION');

  // Cobertura por estados
  const coverageBreakdown = {};
  results.forEach((r) => {
    if (r.coverageState) {
      coverageBreakdown[r.coverageState] = (coverageBreakdown[r.coverageState] || 0) + 1;
    }
  });

  console.log(`\n================================================================`);
  console.log(`📊 INFORME DE DIAGNÓSTICO TÉCNICO GSC (Completado en ${durationSec}s)`);
  console.log(`================================================================`);
  console.log(`- URLs auditadas:              ${total}`);
  console.log(`- URLs indexadas (PASS):       ${indexed} (${((indexed / total) * 100).toFixed(1)}%)`);
  console.log(`- URLs no indexadas / neutras: ${notIndexed} (${((notIndexed / total) * 100).toFixed(1)}%)`);
  console.log(`- Discordancias de canónica:   ${canonicalMismatches.length}`);
  console.log(`- Fallos de datos estructurados:${richIssues.length}`);
  console.log(`- Errores de API:              ${errors.length}\n`);

  console.log(`📈 Desglose por Estado de Cobertura en Google:`);
  Object.entries(coverageBreakdown).forEach(([state, count]) => {
    console.log(`  • ${state}: ${count}`);
  });

  if (canonicalMismatches.length > 0) {
    console.log(`\n⚠️ URLs con Canónica Distinta en Google:`);
    canonicalMismatches.forEach((m) => {
      console.log(`  • URL:           ${m.url}`);
      console.log(`    Declarada:     ${m.userCanonical}`);
      console.log(`    Google eligió: ${m.googleCanonical}\n`);
    });
  }

  // Guardar archivo JSON con el informe completo
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        siteUrl: SITE_URL,
        totalUrls: total,
        summary: {
          indexed,
          notIndexed,
          canonicalMismatches: canonicalMismatches.length,
          richIssues: richIssues.length,
          errors: errors.length,
          coverageBreakdown,
        },
        results,
      },
      null,
      2
    )
  );

  console.log(`\n💾 Reporte detallado guardado en:\n${OUTPUT_FILE}\n`);
}

main().catch((err) => {
  console.error('❌ Error fatal en ejecución de inspección:', err);
  process.exit(1);
});
