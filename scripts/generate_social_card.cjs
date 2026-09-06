const fs = require('fs');
const path = require('path');

let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch {
  puppeteer = require('/Users/minoveaz/Documents/Proyectos/Estar Protegidos/vitablue-v2/node_modules/puppeteer');
}

async function generateSocialCard() {
  console.log('🎨 Generating VitaBlue Open Graph & Twitter Social Card...');

  const repoDir = path.resolve(__dirname, '..');
  const studentImgPath = path.join(repoDir, 'public/images/international-students.jpg');
  const studentImgBase64 = fs.readFileSync(studentImgPath).toString('base64');
  const studentImgSrc = `data:image/jpeg;base64,${studentImgBase64}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800;900&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 1200px;
      height: 630px;
      background: radial-gradient(circle at 15% 20%, #003847 0%, #001e28 40%, #001219 90%);
      font-family: 'Inter', sans-serif;
      color: #ffffff;
      display: flex;
      position: relative;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Ambient glowing lights */
    .glow-top-left {
      position: absolute;
      top: -120px;
      left: -100px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(0, 180, 200, 0.25) 0%, rgba(0, 95, 115, 0) 70%);
      pointer-events: none;
    }

    .glow-bottom-right {
      position: absolute;
      bottom: -150px;
      right: -100px;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(238, 155, 0, 0.15) 0%, rgba(148, 210, 189, 0.1) 40%, transparent 70%);
      pointer-events: none;
    }

    /* Left Side: Brand Value Proposition */
    .left-col {
      width: 58%;
      height: 100%;
      padding: 56px 40px 56px 64px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      z-index: 10;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-cross {
      width: 48px;
      height: 48px;
    }

    .brand-title {
      font-family: 'Poppins', sans-serif;
      font-size: 38px;
      font-weight: 900;
      letter-spacing: -0.5px;
      line-height: 1;
    }

    .brand-vita {
      color: #ffffff;
    }

    .brand-blue {
      color: #00B4C8;
    }

    .pill-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(148, 210, 189, 0.12);
      border: 1px solid rgba(148, 210, 189, 0.35);
      color: #94D2BD;
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 6px 14px;
      border-radius: 999px;
      align-self: flex-start;
      margin-top: 24px;
    }

    .headline {
      font-family: 'Poppins', sans-serif;
      font-size: 42px;
      font-weight: 800;
      line-height: 1.18;
      letter-spacing: -0.8px;
      color: #ffffff;
      margin-top: 14px;
    }

    .headline-highlight {
      background: linear-gradient(135deg, #33C2D6 0%, #94D2BD 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .value-props {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 18px;
    }

    .prop-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 15px;
      font-weight: 600;
      color: #E2E8F0;
    }

    .prop-icon {
      width: 24px;
      height: 24px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      flex-shrink: 0;
    }

    .footer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      padding-top: 20px;
      margin-top: auto;
    }

    .insurer-logos {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 13px;
      font-weight: 700;
      color: #94A3B8;
      letter-spacing: 0.5px;
    }

    .insurer-tag {
      background: rgba(255, 255, 255, 0.07);
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #CBD5E1;
    }

    .official-agent-tag {
      background: rgba(238, 155, 0, 0.15);
      border: 1px solid rgba(238, 155, 0, 0.4);
      color: #FFB703;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .domain-badge {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #00B4C8;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Right Side: Visual & Human Experience */
    .right-col {
      width: 42%;
      height: 100%;
      padding: 40px 48px 40px 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 10;
    }

    .photo-card {
      width: 100%;
      height: 100%;
      border-radius: 28px;
      overflow: hidden;
      position: relative;
      border: 2px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 180, 200, 0.2);
    }

    .photo-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
      filter: saturate(1.08) contrast(1.04);
    }

    .photo-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0, 18, 25, 0.05) 0%, rgba(0, 18, 25, 0.35) 60%, rgba(0, 18, 25, 0.85) 100%);
    }

    .floating-badge {
      position: absolute;
      bottom: 24px;
      left: 20px;
      right: 20px;
      background: rgba(0, 18, 25, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 18px;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }

    .badge-left {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .badge-title {
      font-size: 13px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .badge-sub {
      font-size: 11px;
      font-weight: 500;
      color: #94D2BD;
    }

    .badge-pill {
      background: #005F73;
      border: 1px solid #00B4C8;
      color: #ffffff;
      font-size: 12px;
      font-weight: 800;
      padding: 6px 12px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="glow-top-left"></div>
  <div class="glow-bottom-right"></div>

  <div class="left-col">
    <div>
      <div class="logo-container">
        <!-- Official VitaBlue 3D Folded Cross -->
        <svg class="logo-cross" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M48,48 V16 C48,11.6 51.6,8 56,8 H80 V48 L64,64 Z" fill="#94D2BD" />
          <path d="M48,80 H24 C19.6,80 16,76.4 16,72 V48 H48 L64,64 Z" fill="#00B4C8" />
          <path d="M80,48 H104 C108.4,48 112,51.6 112,56 V80 H80 L64,64 Z" fill="#33C2D6" />
          <path d="M80,80 V112 C80,116.4 76.4,120 72,120 H48 V80 L64,64 Z" fill="#005F73" />
          <path d="M64,64 L48,80 V48 Z" fill="#00809B" />
          <path d="M64,64 L80,48 V80 Z" fill="#001219" />
        </svg>
        <span class="brand-title">
          <span class="brand-vita">vita</span><span class="brand-blue">blue</span>
        </span>
      </div>

      <div class="pill-eyebrow">
        <span>🛡️ Seguros de Salud & Visados en España</span>
      </div>

      <h1 class="headline">
        El comparador oficial <br/>
        <span class="headline-highlight">para vivir y estudiar</span><br/>
        en España.
      </h1>

      <div class="value-props">
        <div class="prop-item">
          <div class="prop-icon">✓</div>
          <span><strong>100% Homologado</strong> para Visado de Estudiante y NIE</span>
        </div>
        <div class="prop-item">
          <div class="prop-icon">⚡</div>
          <span><strong>Certificado en 24h</strong> con firma consular verificable</span>
        </div>
        <div class="prop-item">
          <div class="prop-icon">🛡️</div>
          <span><strong>0€ Copagos & Sin Carencias</strong> con Garantía de Reembolso</span>
        </div>
      </div>
    </div>

    <div class="footer-bar">
      <div class="insurer-logos">
        <span class="official-agent-tag">Agente Oficial Sanitas</span>
        <span class="insurer-tag">Adeslas</span>
        <span class="insurer-tag">ASISA</span>
        <span class="insurer-tag">DKV</span>
      </div>
      <div class="domain-badge">
        <span>vitablue.es</span>
        <span>→</span>
      </div>
    </div>
  </div>

  <div class="right-col">
    <div class="photo-card">
      <img src="${studentImgSrc}" alt="Estudiantes y residentes en España protegidos con VitaBlue" />
      <div class="photo-overlay"></div>
      <div class="floating-badge">
        <div class="badge-left">
          <div class="badge-title">
            <span>🇪🇸 España 2026</span>
          </div>
          <div class="badge-sub">Certificado Oficial Aprobado</div>
        </div>
        <div class="badge-pill">Desde 38€/mes</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const chromePath = fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2 // 2400 x 1260 retina resolution
  });

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Save public preview
  const previewPath = path.join(repoDir, 'public/og-image-preview.png');
  await page.screenshot({ path: previewPath, type: 'png' });
  console.log(`✅ Saved preview to ${previewPath}`);

  // Save production image to public/
  const ogPath = path.join(repoDir, 'public/og-image.jpg');
  const legacySocialPath = path.join(repoDir, 'public/vitablue_logo_social.jpg');

  await page.screenshot({ path: ogPath, type: 'jpeg', quality: 92 });
  fs.copyFileSync(ogPath, legacySocialPath);
  console.log(`✅ Updated ${ogPath} and ${legacySocialPath}`);

  await browser.close();
}

generateSocialCard().catch(err => {
  console.error('Error generating card:', err);
  process.exit(1);
});
