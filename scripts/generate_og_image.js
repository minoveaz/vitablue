import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generate() {
  console.log('Iniciando generador de og-image...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Viewport estándar de Open Graph (1200x630) con escala x2 para máxima nitidez (Retina/High-DPI)
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          width: 1200px;
          height: 630px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          font-family: 'Poppins', sans-serif;
          overflow: hidden;
        }
        .container {
          display: flex;
          align-items: center;
          gap: 48px;
        }
        .logo-text {
          font-size: 130px;
          font-weight: 700;
          letter-spacing: -4px;
          color: #001219; /* Exact deep teal text-text-main */
          line-height: 1;
          display: flex;
          align-items: center;
        }
        .logo-text span {
          color: #00B4C8; /* Exact primary turquoise */
        }
        svg {
          width: 180px;
          height: 180px;
          filter: drop-shadow(0 12px 24px rgba(0, 95, 115, 0.08));
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Isotipo exacto de Cruz 3D copiado del favicon.svg corporativo -->
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24,24 V8 C24,5.8 25.8,4 28,4 H40 V24 L32,32 Z" fill="#94D2BD" />
          <path d="M24,40 H12 C9.8,40 8,38.2 8,36 V24 H24 L32,32 Z" fill="#00B4C8" />
          <path d="M40,24 H52 C54.2,24 56,25.8 56,28 V40 H40 L32,32 Z" fill="#33C2D6" />
          <path d="M40,40 V56 C40,58.2 38.2,60 36,60 H24 V40 L32,32 Z" fill="#005F73" />
          <path d="M32,32 L24,40 V24 Z" fill="#00809B" />
          <path d="M32,32 L40,24 V40 Z" fill="#001219" />
          <line x1="24" y1="40" x2="40" y2="24" stroke="#FFFFFF" stroke-width="1.2" opacity="0.35" stroke-linecap="round" />
        </svg>
        <div class="logo-text">vita<span>blue</span></div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);
  
  // Esperar a que la tipografía de Google Fonts esté completamente cargada
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  // Pequeña espera extra de seguridad para asegurar renderizado correcto
  await new Promise(resolve => setTimeout(resolve, 500));

  const outputPath = path.join(__dirname, '../public/og-image.jpg');
  
  await page.screenshot({
    path: outputPath,
    type: 'jpeg',
    quality: 95
  });

  console.log(`¡og-image.jpg generado exitosamente en: ${outputPath}!`);
  
  await browser.close();
}

generate().catch(err => {
  console.error('Error al generar la imagen:', err);
  process.exit(1);
});
