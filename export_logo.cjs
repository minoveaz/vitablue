const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&family=Poppins:wght@700;800&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 1000px;
      height: 1000px;
      background-color: #001219; /* Midnight Blue */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Poppins', 'Inter', sans-serif;
      overflow: hidden;
      position: relative;
    }
    
    /* Subtle background radial glow to make the logo pop */
    .glow {
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(148, 210, 189, 0.15) 0%, rgba(0, 95, 115, 0.05) 50%, rgba(0, 18, 25, 0) 100%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }
    
    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 40px;
      z-index: 2;
    }
    
    .brand-text {
      color: #ffffff;
      font-size: 80px;
      font-weight: 800;
      letter-spacing: -2px;
      line-height: 1;
    }
    
    .brand-text .blue {
      color: #94D2BD; /* Mint green / Cyan color accent */
    }
    
    .tagline {
      font-family: 'Inter', sans-serif;
      color: rgba(255, 255, 255, 0.6);
      font-size: 26px;
      font-weight: 600;
      letter-spacing: 1px;
      margin-top: 10px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="glow"></div>
  <div class="logo-container">
    <!-- SVG Isotype exactly from Logo.tsx -->
    <svg width="320" height="320" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- TOP ARM (Turquoise / Mint Green - Top-Left rounded, Top-Right sharp) -->
      <path d="M24,24 V8 C24,5.8 25.8,4 28,4 H40 V24 L32,32 Z" fill="#94D2BD" />
      
      <!-- LEFT ARM (Cyan / Medium Teal - Bottom-Left rounded, Top-Left sharp) -->
      <path d="M24,40 H12 C9.8,40 8,38.2 8,36 V24 H24 L32,32 Z" fill="#00B4C8" />

      <!-- RIGHT ARM (Light Sky Blue / Soft Cyan - Top-Right rounded, Bottom-Right sharp) -->
      <path d="M40,24 H52 C54.2,24 56,25.8 56,28 V40 H40 L32,32 Z" fill="#33C2D6" />

      <!-- BOTTOM ARM (Ocean Teal - Bottom-Right rounded, Bottom-Left sharp) -->
      <path d="M40,40 V56 C40,58.2 38.2,60 36,60 H24 V40 L32,32 Z" fill="#005F73" />

      <!-- CENTER-LEFT FOLD TRIANGLE (Medium Ocean Blue) -->
      <path d="M32,32 L24,40 V24 Z" fill="#00809B" />

      <!-- CENTER-RIGHT FOLD TRIANGLE (Midnight Blue Shadow) -->
      <path d="M32,32 L40,24 V40 Z" fill="#001219" />

      <!-- Subtle crease fold line dividing diagonal corners -->
      <line x1="24" y1="40" x2="40" y2="24" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />
    </svg>
    
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div class="brand-text">vita<span class="blue">blue</span></div>
      <div class="tagline">Seguros que se adaptan a ti</div>
    </div>
  </div>
</body>
</html>
  `;

  console.log('Iniciando Puppeteer...');
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });
  await page.setContent(htmlContent);
  
  // Wait for Google Fonts to load
  await page.evaluateHandle('document.fonts.ready');
  
  const destPath = '/Users/minoveaz/Documents/Proyectos/Estar Protegidos/vitablue-v2/vitablue_official_logo.png';
  console.log('Capturando imagen oficial del logotipo...');
  await page.screenshot({
    path: destPath,
    type: 'png'
  });
  
  console.log('Logo exportado correctamente en: ' + destPath);
  await browser.close();
})();
