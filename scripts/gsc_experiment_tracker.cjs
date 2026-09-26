/**
 * VitaBlue - GSC Experiment Tracker CLI
 * Compara en tiempo real las métricas de Search Console frente a la línea base del experimento.
 *
 * Uso:
 *   node scripts/gsc_experiment_tracker.cjs
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CREDENTIALS_PATH = path.join(__dirname, '..', '.credentials', 'gsc-credentials.json');
const SITE_URL = 'sc-domain:vitablue.es';

if (!fs.existsSync(CREDENTIALS_PATH)) {
  console.error(`❌ No se encontró credencial en ${CREDENTIALS_PATH}`);
  process.exit(1);
}

const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));

function base64url(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
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
  const signature = signer.sign(creds.private_key, 'base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
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
  return data.access_token;
}

const BASELINES = {
  colombia: {
    pais: '🇨🇴 Colombia',
    code: 'col',
    url: 'https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/colombia/',
    baselineClicks: 2,
    baselineImpr: 149,
    baselineCtr: 1.34,
    baselinePos: 33.1,
  },
  peru: {
    pais: '🇵🇪 Perú',
    code: 'per',
    url: 'https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/peru/',
    baselineClicks: 0,
    baselineImpr: 81,
    baselineCtr: 0.0,
    baselinePos: 22.7,
  },
};

async function queryCountry(token, countryCode, days = 28) {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 2);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days - 2);

  const encodedSite = encodeURIComponent(SITE_URL);
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      dimensions: ['country'],
      dimensionFilterGroups: [{
        filters: [{ dimension: 'country', operator: 'equals', expression: countryCode }],
      }],
    }),
  });
  const data = await res.json();
  const row = (data.rows && data.rows[0]) || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  return {
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: Number((row.ctr * 100).toFixed(2)),
    position: Number(row.position.toFixed(1)),
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

async function run() {
  console.log('\n📊 === SEGUIMIENTO DEL EXPERIMENTO SEO (Páginas Dinero LATAM) ===');
  console.log('Consultando Google Search Console API...\n');
  const token = await getAccessToken();

  for (const key of Object.keys(BASELINES)) {
    const item = BASELINES[key];
    const live = await queryCountry(token, item.code, 28);

    const diffClicks = live.clicks - item.baselineClicks;
    const diffImpr = live.impressions - item.baselineImpr;
    const diffCtr = (live.ctr - item.baselineCtr).toFixed(2);
    const diffPos = (item.baselinePos - live.position).toFixed(1); // positivo = mejora en ranking

    console.log(`----------------------------------------------------------------`);
    console.log(`${item.pais} (${live.startDate} a ${live.endDate})`);
    console.log(`URL: ${item.url}`);
    console.log(`  • Clics:        ${live.clicks} (Baseline: ${item.baselineClicks})  -> [${diffClicks >= 0 ? '+' : ''}${diffClicks}]`);
    console.log(`  • Impresiones:  ${live.impressions} (Baseline: ${item.baselineImpr}) -> [${diffImpr >= 0 ? '+' : ''}${diffImpr}]`);
    console.log(`  • CTR:          ${live.ctr}% (Baseline: ${item.baselineCtr}%) -> [${Number(diffCtr) >= 0 ? '+' : ''}${diffCtr}%]`);
    console.log(`  • Posición:     ${live.position} (Baseline: ${item.baselinePos}) -> [${Number(diffPos) >= 0 ? 'Mejora +' : 'Retroceso '}${diffPos}]`);
  }

  console.log('----------------------------------------------------------------\n');
  console.log('💡 Registro oficial guardado en: docs/seo-strategy/seo-experiments-log.md');
}

run().catch(console.error);
