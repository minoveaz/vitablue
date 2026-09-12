/**
 * VitaBlue - Google Search Console (GSC) API CLI
 * Herramienta de auditoría, métricas de rendimiento e inspección de URLs en vivo.
 *
 * Uso:
 *   node scripts/gsc_audit.cjs --summary
 *   node scripts/gsc_audit.cjs --opportunities
 *   node scripts/gsc_audit.cjs --pages [limit=25]
 *   node scripts/gsc_audit.cjs --queries [limit=25]
 *   node scripts/gsc_audit.cjs --countries [limit=15]
 *   node scripts/gsc_audit.cjs --inspect <url>
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CREDENTIALS_PATH = path.join(__dirname, '..', '.credentials', 'gsc-credentials.json');
const SITE_URL = 'sc-domain:vitablue.es';

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

function getDateRange(days = 90) {
  const end = new Date();
  end.setDate(end.getDate() - 2); // Datos de GSC tienen 2-3 días de retraso
  const start = new Date();
  start.setDate(start.getDate() - days - 2);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

async function queryAnalytics(token, { dimensions = ['page'], days = 90, rowLimit = 25 } = {}) {
  const { startDate, endDate } = getDateRange(days);
  const encodedSite = encodeURIComponent(SITE_URL);
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions,
      rowLimit,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error en consulta de Search Analytics: ${JSON.stringify(data)}`);
  }
  return { rows: data.rows || [], startDate, endDate };
}

async function inspectUrl(token, inspectionUrl) {
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
    throw new Error(`Error en URL Inspection: ${JSON.stringify(data)}`);
  }
  return data.inspectionResult;
}

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || '--summary';

  console.log(`\n🔑 Conectando a Google Search Console (${SITE_URL})...`);
  const token = await getAccessToken();

  if (mode === '--summary') {
    const { rows, startDate, endDate } = await queryAnalytics(token, { dimensions: ['date'], days: 90, rowLimit: 100 });
    const totalClicks = rows.reduce((acc, r) => acc + r.clicks, 0);
    const totalImpr = rows.reduce((acc, r) => acc + r.impressions, 0);
    const avgCtr = totalImpr > 0 ? (totalClicks / totalImpr) * 100 : 0;
    const avgPos = rows.length > 0 ? rows.reduce((acc, r) => acc + r.position, 0) / rows.length : 0;

    console.log(`\n📊 === RESUMEN SEARCH CONSOLE (${startDate} a ${endDate}) ===`);
    console.log(`- Clics totales:      ${totalClicks}`);
    console.log(`- Impresiones:        ${totalImpr.toLocaleString()}`);
    console.log(`- CTR Medio:          ${avgCtr.toFixed(2)}%`);
    console.log(`- Posición Media:     ${avgPos.toFixed(1)}`);
    console.log(`\n💡 Tip: Ejecuta 'npm run gsc:opportunities' para ver qué páginas tienen alta impresión y bajo CTR.`);
    return;
  }

  if (mode === '--opportunities') {
    const { rows, startDate, endDate } = await queryAnalytics(token, { dimensions: ['page'], days: 90, rowLimit: 50 });
    const opportunities = rows
      .filter((r) => r.impressions >= 100 && r.ctr < 0.015)
      .sort((a, b) => b.impressions - a.impressions);

    console.log(`\n🎯 === OPORTUNIDADES DE ALTO IMPACTO (Impresiones >= 100 y CTR < 1.5%) ===`);
    console.log(`Periodo: ${startDate} a ${endDate}\n`);

    if (opportunities.length === 0) {
      console.log('No se encontraron URLs con este filtro en los últimos 90 días.');
      return;
    }

    opportunities.forEach((r, idx) => {
      console.log(`${idx + 1}. ${r.keys[0]}`);
      console.log(`   Impresiones: ${r.impressions.toLocaleString()} | Clics: ${r.clicks} | CTR: ${(r.ctr * 100).toFixed(2)}% | Posición: ${r.position.toFixed(1)}`);
      console.log(`   Acción recomendada: Reescribir <title> y <meta description> con gancho transaccional y precio.\n`);
    });
    return;
  }

  if (mode === '--pages') {
    const limit = parseInt(args[1] || '25', 10);
    const { rows } = await queryAnalytics(token, { dimensions: ['page'], days: 90, rowLimit: limit });
    rows.sort((a, b) => b.impressions - a.impressions);

    console.log(`\n📄 === TOP PÁGINAS POR IMPRESIONES (Últimos 90 días) ===\n`);
    rows.forEach((r, idx) => {
      console.log(`${idx + 1}. ${r.keys[0]}`);
      console.log(`   Impr: ${r.impressions.toLocaleString()} | Clics: ${r.clicks} | CTR: ${(r.ctr * 100).toFixed(2)}% | Pos: ${r.position.toFixed(1)}`);
    });
    return;
  }

  if (mode === '--queries') {
    const limit = parseInt(args[1] || '25', 10);
    const { rows } = await queryAnalytics(token, { dimensions: ['query'], days: 90, rowLimit: limit });
    rows.sort((a, b) => b.impressions - a.impressions);

    console.log(`\n🔍 === TOP CONSULTAS DE BÚSQUEDA (Últimos 90 días) ===\n`);
    rows.forEach((r, idx) => {
      console.log(`${idx + 1}. "${r.keys[0]}"`);
      console.log(`   Impr: ${r.impressions} | Clics: ${r.clicks} | CTR: ${(r.ctr * 100).toFixed(2)}% | Pos: ${r.position.toFixed(1)}`);
    });
    return;
  }

  if (mode === '--query-pages') {
    const limit = parseInt(args[1] || '250', 10);
    const { rows, startDate, endDate } = await queryAnalytics(token, {
      dimensions: ['query', 'page'],
      days: 90,
      rowLimit: limit,
    });
    rows.sort((a, b) => b.impressions - a.impressions);

    console.log(`\n🔍 === CONSULTAS Y PÁGINAS (Últimos 90 días) ===`);
    console.log(`Periodo: ${startDate} a ${endDate}\n`);
    rows.forEach((r) => {
      console.log(JSON.stringify({
        query: r.keys[0],
        page: r.keys[1],
        impressions: r.impressions,
        clicks: r.clicks,
        ctr: Number((r.ctr * 100).toFixed(2)),
        position: Number(r.position.toFixed(1)),
      }));
    });
    return;
  }

  if (mode === '--countries') {
    const limit = parseInt(args[1] || '15', 10);
    const { rows } = await queryAnalytics(token, { dimensions: ['country'], days: 90, rowLimit: limit });
    rows.sort((a, b) => b.impressions - a.impressions);

    console.log(`\n🌍 === TRÁFICO POR PAÍS (Últimos 90 días) ===\n`);
    rows.forEach((r, idx) => {
      console.log(`${idx + 1}. País: ${r.keys[0].toUpperCase()} | Impr: ${r.impressions.toLocaleString()} | Clics: ${r.clicks} | CTR: ${(r.ctr * 100).toFixed(2)}%`);
    });
    return;
  }

  if (mode === '--inspect') {
    const targetUrl = args[1];
    if (!targetUrl) {
      console.error('❌ Falta la URL a inspeccionar. Ejemplo:\nnode scripts/gsc_audit.cjs --inspect https://www.vitablue.es/productos/seguro-estudiantes');
      process.exit(1);
    }
    console.log(`\n🕵️ Inspeccionando en Google: ${targetUrl}...\n`);
    const result = await inspectUrl(token, targetUrl);
    const status = result.indexStatusResult || {};

    console.log(`=== RESULTADO DE INSPECCIÓN GSC ===`);
    console.log(`- Veredicto:            ${status.verdict || 'N/A'}`);
    console.log(`- Estado de cobertura:  ${status.coverageState || 'N/A'}`);
    console.log(`- Robots.txt:           ${status.robotsTxtState || 'N/A'}`);
    console.log(`- Indexación permitida: ${status.indexingState || 'N/A'}`);
    console.log(`- Último rastreo:       ${status.lastCrawlTime || 'Nunca rastreado'}`);
    console.log(`- Rastreado como:       ${status.crawledAs || 'N/A'}`);
    console.log(`- Canónica Google:      ${status.googleCanonical || 'N/A'}`);
    console.log(`- Canónica declarada:   ${status.userCanonical || 'N/A'}`);
    return;
  }

  console.log(`Opción no reconocida: ${mode}`);
  console.log(`Uso: --summary | --opportunities | --pages | --queries | --query-pages | --countries | --inspect <url>`);
}

main().catch((err) => {
  console.error('\n❌ Error ejecutando auditoría GSC:', err.message);
  process.exit(1);
});
