/**
 * Base HTML Template for VitaBlue Branded A4 PDFs
 * Standardized styling: Brand colors (Ocean Teal, Midnight Blue, Mint Green, Amber Gold),
 * pure white background (#ffffff), surface-soft cards (#f8fafc), Poppins & Inter typography.
 */

const VITABLUE_ISOTYPE_SVG = `
<svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- TOP ARM -->
  <path d="M24,24 V8 C24,5.8 25.8,4 28,4 H40 V24 L32,32 Z" fill="#94D2BD" />
  <!-- LEFT ARM -->
  <path d="M24,40 H12 C9.8,40 8,38.2 8,36 V24 H24 L32,32 Z" fill="#00B4C8" />
  <!-- RIGHT ARM -->
  <path d="M40,24 H52 C54.2,24 56,25.8 56,28 V40 H40 L32,32 Z" fill="#33C2D6" />
  <!-- BOTTOM ARM -->
  <path d="M40,40 V56 C40,58.2 38.2,60 36,60 H24 V40 L32,32 Z" fill="#005F73" />
  <!-- CENTER-LEFT FOLD -->
  <path d="M32,32 L24,40 V24 Z" fill="#00809B" />
  <!-- CENTER-RIGHT FOLD -->
  <path d="M32,32 L40,24 V40 Z" fill="#001219" />
</svg>
`;

const VITABLUE_FULL_LOGO_SVG = `
<svg width="190" height="46" viewBox="0 0 380 92" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(4, 8) scale(1.18)">
    <path d="M24,24 V8 C24,5.8 25.8,4 28,4 H40 V24 L32,32 Z" fill="#94D2BD" />
    <path d="M24,40 H12 C9.8,40 8,38.2 8,36 V24 H24 L32,32 Z" fill="#00B4C8" />
    <path d="M40,24 H52 C54.2,24 56,25.8 56,28 V40 H40 L32,32 Z" fill="#33C2D6" />
    <path d="M40,40 V56 C40,58.2 38.2,60 36,60 H24 V40 L32,32 Z" fill="#005F73" />
    <path d="M32,32 L24,40 V24 Z" fill="#00809B" />
    <path d="M32,32 L40,24 V40 Z" fill="#001219" />
  </g>
  <text x="96" y="58" font-family="'Poppins', 'Segoe UI', sans-serif" font-weight="800" font-size="44" fill="#001219">
    vita<tspan fill="#005F73">blue</tspan>
  </text>
  <text x="98" y="78" font-family="'Inter', sans-serif" font-weight="600" font-size="11" fill="#4A5568" letter-spacing="0.5px">
    SEGUROS QUE SE ADAPTAN A TI
  </text>
</svg>
`;

function renderBaseLayout({ title, pagesHtml }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #FFFFFF;
      color: #001219;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 16mm 18mm 14mm 18mm;
      position: relative;
      background-color: #FFFFFF;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }
    .page:last-child {
      page-break-after: avoid;
    }
    /* Typography */
    h1, h2, h3, h4 {
      font-family: 'Poppins', sans-serif;
      color: #001219;
      line-height: 1.2;
    }
    /* Brand Utilities */
    .text-ocean { color: #005F73; }
    .text-midnight { color: #001219; }
    .text-gold { color: #EE9B00; }
    .text-muted { color: #4A5568; }
    .text-teal { color: #0A9396; }
    .bg-ocean { background-color: #005F73; }
    .bg-surface { background-color: #F8FAFC; }
    .bg-mint-soft { background-color: #EBF7F4; }
    .bg-gold-soft { background-color: #FFF9E6; }
    .border-ocean { border-color: #005F73; }
    .border-slate { border-color: #E2E8F0; }
    .border-gold { border-color: #EE9B00; }
    .border-mint { border-color: #94D2BD; }

    /* Page Header */
    .pdf-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 2px solid #E2E8F0;
      margin-bottom: 14px;
    }
    .official-badge {
      background-color: #EBF7F4;
      color: #005F73;
      border: 1px solid #94D2BD;
      padding: 5px 12px;
      border-radius: 9999px;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    /* Page Footer */
    .pdf-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      border-top: 1px solid #E2E8F0;
      font-size: 9.5px;
      color: #64748B;
      font-weight: 500;
    }
    .pdf-footer strong {
      color: #005F73;
    }
    .interactive-check {
      width: 17px;
      height: 17px;
      border: 2px solid #005F73;
      border-radius: 4px;
      background: #FFFFFF;
      flex-shrink: 0;
      margin-top: 2px;
    }
    a {
      color: #005F73;
      text-decoration: none;
    }
  </style>
</head>
<body>
  ${pagesHtml}
</body>
</html>`;
}

module.exports = {
  renderBaseLayout,
  VITABLUE_FULL_LOGO_SVG,
  VITABLUE_ISOTYPE_SVG,
};
