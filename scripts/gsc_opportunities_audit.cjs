/**
 * VitaBlue - Deep Search Analytics Audit (GSC API)
 * Issue #148: Detección de Oportunidades de Alto Impacto
 *
 * Analiza:
 * 1. Keywords en Striking Distance (Posiciones 11 a 20 con alto volumen)
 * 2. Snippets con Alto Tráfico y Bajo CTR (< 1.5%)
 * 3. Canibalización Interna (Misma query posicionando en múltiples URLs)
 * 4. Rendimiento Mobile vs Desktop
 * 5. Demanda geográfica por países (LATAM)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CREDENTIALS_PATH = path.join(__dirname, '..', '.credentials', 'gsc-credentials.json');
const OUTPUT_DIR = path.join(__dirname, '..', '.temp_audit');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'gsc_opportunities_report.json');
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
    throw new Error(`Error de autenticación: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

function getDateRange(days = 90) {
  const end = new Date();
  end.setDate(end.getDate() - 2);
  const start = new Date();
  start.setDate(start.getDate() - days - 2);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

async function queryAnalytics(token, { dimensions = ['query'], days = 90, rowLimit = 1000 } = {}) {
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
    throw new Error(`Error en consulta Search Analytics: ${JSON.stringify(data)}`);
  }
  return { rows: data.rows || [], startDate, endDate };
}

async function main() {
  console.log(`\n================================================================`);
  console.log(`🎯 AUDITORÍA DE OPORTUNIDADES SEO - SEARCH ANALYTICS (GSC API)`);
  console.log(`================================================================\n`);

  console.log('🔑 Autenticando con Google Search Console...');
  const token = await getAccessToken();
  console.log('✅ Conexión establecida.\n');

  // 1. Matriz Query + Page
  console.log('📊 Consultando matriz [Query, Page] (Últimos 90 días)...');
  const qpQuery = await queryAnalytics(token, { dimensions: ['query', 'page'], days: 90, rowLimit: 5000 });
  const qpRows = qpQuery.rows;
  console.log(`✅ ${qpRows.length} combinaciones consulta-página recuperadas.\n`);

  // A. Keywords en Striking Distance (Posición 10.5 a 20.5)
  const strikingDistance = qpRows
    .filter((r) => r.position >= 10.5 && r.position <= 20.5 && r.impressions >= 10)
    .map((r) => ({
      query: r.keys[0],
      page: r.keys[1],
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.ctr,
      position: r.position,
    }))
    .sort((a, b) => b.impressions - a.impressions);

  console.log(`----------------------------------------------------------------`);
  console.log(`🚀 1. KEYWORDS EN STRIKING DISTANCE (Página 2 de Google: Pos 11 a 20)`);
  console.log(`----------------------------------------------------------------`);
  console.log(`Total identificadas: ${strikingDistance.length} términos con oportunidad de Top 10.\n`);

  strikingDistance.slice(0, 15).forEach((item, idx) => {
    console.log(`${idx + 1}. "${item.query}"`);
    console.log(`   URL:         ${item.page}`);
    console.log(`   Impresiones: ${item.impressions} | Clics: ${item.clicks} | Pos: ${item.position.toFixed(1)} | CTR: ${(item.ctr * 100).toFixed(2)}%`);
    console.log(`   Acción:      Reforzar H2 y añadir enlace interno desde post de autoridad.\n`);
  });

  // B. Detección de Canibalización
  const queryMap = {};
  qpRows.forEach((r) => {
    const q = r.keys[0];
    const p = r.keys[1];
    if (!queryMap[q]) queryMap[q] = [];
    queryMap[q].push({
      page: p,
      impressions: r.impressions,
      clicks: r.clicks,
      position: r.position,
    });
  });

  const cannibalizations = Object.entries(queryMap)
    .filter(([_, pages]) => pages.length > 1)
    .map(([query, pages]) => {
      const totalImpr = pages.reduce((acc, p) => acc + p.impressions, 0);
      const totalClicks = pages.reduce((acc, p) => acc + p.clicks, 0);
      pages.sort((a, b) => b.impressions - a.impressions);
      return { query, pages, totalImpr, totalClicks };
    })
    .sort((a, b) => b.totalImpr - a.totalImpr);

  console.log(`----------------------------------------------------------------`);
  console.log(`⚔️  2. DETECCIÓN DE CANIBALIZACIÓN SEO (Consultas con >1 URL compitiendo)`);
  console.log(`----------------------------------------------------------------`);
  console.log(`Total consultas canibalizadas: ${cannibalizations.length}\n`);

  cannibalizations.slice(0, 10).forEach((item, idx) => {
    console.log(`${idx + 1}. Query: "${item.query}" (Total Impresiones: ${item.totalImpr} | Clics: ${item.totalClicks})`);
    item.pages.forEach((p) => {
      console.log(`   - ${p.page}`);
      console.log(`     Impr: ${p.impressions} | Clics: ${p.clicks} | Pos: ${p.position.toFixed(1)}`);
    });
    console.log(`   Diagnóstico: Enlazar internamente desde la página secundaria a la principal con anchor "${item.query}".\n`);
  });

  // C. Optimización de CTR en Snippets (Impresiones >= 100 y CTR < 1.5%)
  console.log(`----------------------------------------------------------------`);
  console.log(`⚡ 3. PÁGINAS CON ALTO TRÁFICO Y BAJO CTR (Optimización de Snippets)`);
  console.log(`----------------------------------------------------------------`);
  const pageAggregates = {};
  qpRows.forEach((r) => {
    const p = r.keys[1];
    if (!pageAggregates[p]) pageAggregates[p] = { impressions: 0, clicks: 0, positions: [] };
    pageAggregates[p].impressions += r.impressions;
    pageAggregates[p].clicks += r.clicks;
    pageAggregates[p].positions.push(r.position);
  });

  const ctrOpportunities = Object.entries(pageAggregates)
    .map(([page, stats]) => {
      const ctr = stats.impressions > 0 ? stats.clicks / stats.impressions : 0;
      const avgPos = stats.positions.reduce((a, b) => a + b, 0) / stats.positions.length;
      return { page, impressions: stats.impressions, clicks: stats.clicks, ctr, avgPos };
    })
    .filter((p) => p.impressions >= 100 && p.ctr < 0.015)
    .sort((a, b) => b.impressions - a.impressions);

  console.log(`Total páginas con oportunidad de mejora de Snippet: ${ctrOpportunities.length}\n`);
  ctrOpportunities.forEach((item, idx) => {
    console.log(`${idx + 1}. ${item.page}`);
    console.log(`   Impresiones: ${item.impressions.toLocaleString()} | Clics: ${item.clicks} | CTR: ${(item.ctr * 100).toFixed(2)}% | Pos Media: ${item.avgPos.toFixed(1)}`);
    console.log(`   Acción recomendada: Incorporar precios reales (ej. "desde 39€/mes") y garantías (0€ copagos, 100% visado) en el <title> y <meta description>.\n`);
  });

  // D. Dispositivos (Mobile vs Desktop)
  console.log(`----------------------------------------------------------------`);
  console.log(`📱 4. RENDIMIENTO POR DISPOSITIVO (Mobile vs Desktop vs Tablet)`);
  console.log(`----------------------------------------------------------------`);
  const deviceQuery = await queryAnalytics(token, { dimensions: ['device'], days: 90 });
  const deviceRows = deviceQuery.rows;
  const totalDevImpr = deviceRows.reduce((a, b) => a + b.impressions, 0);

  deviceRows.forEach((d) => {
    const share = ((d.impressions / totalDevImpr) * 100).toFixed(1);
    console.log(`• ${d.keys[0].toUpperCase()}:`);
    console.log(`  Impresiones: ${d.impressions.toLocaleString()} (${share}%) | Clics: ${d.clicks} | CTR: ${(d.ctr * 100).toFixed(2)}% | Pos: ${d.position.toFixed(1)}`);
  });

  // E. Países (Demanda LATAM y España)
  console.log(`\n----------------------------------------------------------------`);
  console.log(`🌍 5. TOP PAÍSES POR VOLUMEN DE BÚSQUEDA`);
  console.log(`----------------------------------------------------------------`);
  const countryQuery = await queryAnalytics(token, { dimensions: ['country'], days: 90, rowLimit: 15 });
  countryQuery.rows.forEach((c, idx) => {
    console.log(`${idx + 1}. [${c.keys[0].toUpperCase()}] Impresiones: ${c.impressions.toLocaleString()} | Clics: ${c.clicks} | CTR: ${(c.ctr * 100).toFixed(2)}% | Pos: ${c.position.toFixed(1)}`);
  });

  // Guardar archivo JSON completo de auditoría
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        siteUrl: SITE_URL,
        period: { startDate: qpQuery.startDate, endDate: qpQuery.endDate },
        strikingDistance,
        cannibalizations,
        ctrOpportunities,
        devices: deviceRows,
        countries: countryQuery.rows,
      },
      null,
      2
    )
  );

  console.log(`\n💾 Informe completo exportado en:\n${OUTPUT_FILE}\n`);
}

main().catch((err) => {
  console.error('❌ Error en auditoría de oportunidades:', err);
  process.exit(1);
});
