/// <reference types="vite/client" />

// Colored brand isotype paths (used for both light and dark exports)
const isotypeSvgPaths = `
  <!-- TOP ARM (Turquoise / Mint Green) -->
  <path d="M24,24 V8 C24,5.8 25.8,4 28,4 H40 V24 L32,32 Z" fill="#94D2BD" />
  
  <!-- LEFT ARM (Cyan / Medium Teal) -->
  <path d="M24,40 H12 C9.8,40 8,38.2 8,36 V24 H24 L32,32 Z" fill="#00B4C8" />

  <!-- RIGHT ARM (Light Sky Blue / Soft Cyan) -->
  <path d="M40,24 H52 C54.2,24 56,25.8 56,28 V40 H40 L32,32 Z" fill="#33C2D6" />

  <!-- BOTTOM ARM (Ocean Teal) -->
  <path d="M40,40 V56 C40,58.2 38.2,60 36,60 H24 V40 L32,32 Z" fill="#005F73" />

  <!-- CENTER-LEFT FOLD TRIANGLE (Medium Ocean Blue) -->
  <path d="M32,32 L24,40 V24 Z" fill="#00809B" />

  <!-- CENTER-RIGHT FOLD TRIANGLE (Midnight Blue Shadow) -->
  <path d="M32,32 L40,24 V40 Z" fill="#001219" />

  {/* Subtle crease fold line dividing diagonal corners */}
  <line x1="24" y1="40" x2="40" y2="24" stroke="#FFFFFF" stroke-width="1.2" opacity="0.35" stroke-linecap="round" />
`;

/**
 * Generates the SVG string for a high-res social media profile photo (800x800).
 */
export const generateProfileSvg = (useDarkBackground: boolean): string => {
  const bgColor = useDarkBackground ? '#001219' : '#FFFFFF';
  
  let definitions = '';
  let radialGlowElement = '';
  
  if (useDarkBackground) {
    definitions = `
      <defs>
        <radialGradient id="vb-logo-dark-radial-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#94D2BD" stop-opacity="0.22" />
          <stop offset="60%" stop-color="#005F73" stop-opacity="0.08" />
          <stop offset="100%" stop-color="#001219" stop-opacity="0" />
        </radialGradient>
      </defs>
    `;
    radialGlowElement = `<circle cx="400" cy="400" r="375" fill="url(#vb-logo-dark-radial-glow)" opacity="0.9" />`;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      ${definitions}
      <!-- Solid Background -->
      <rect width="800" height="800" fill="${bgColor}" />
      
      <!-- Backglow Halo (Only for dark background) -->
      ${radialGlowElement}
      
      <!-- Isotype (Centered, size 420x420) -->
      <!-- Center is 400. 64 viewBox scaled by 6.5625 = 420. Transform offset is 400 - (32 * 6.5625) = 190 -->
      <g transform="translate(190, 190) scale(6.5625)">
        ${isotypeSvgPaths}
      </g>
    </svg>
  `.trim();
};

/**
 * Generates the SVG string for a social media cover banner.
 */
export const generateCoverSvg = (
  width: number,
  height: number,
  logoSize: number,
  titleSize: number,
  subtitleSize: number
): string => {
  // Vertically align elements: Logo + Spacers + Title + Subtitle
  const spacing1 = Math.max(16, Math.round(height * 0.05));
  const spacing2 = Math.max(10, Math.round(height * 0.03));
  
  const totalContentHeight = logoSize + spacing1 + titleSize + spacing2 + subtitleSize;
  const startY = (height - totalContentHeight) / 2;
  
  const scale = logoSize / 64;
  const logoX = (width - logoSize) / 2;
  
  const titleY = startY + logoSize + spacing1 + titleSize - (titleSize * 0.15);
  const subtitleY = startY + logoSize + spacing1 + titleSize + spacing2 + subtitleSize - (subtitleSize * 0.15);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <!-- Background Gradient -->
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#005F73" />
          <stop offset="50%" stop-color="#003f4e" />
          <stop offset="100%" stop-color="#001219" />
        </linearGradient>
        
        <!-- Corner Glow Gradients -->
        <radialGradient id="glowTop" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#94D2BD" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#94D2BD" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="glowBottom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#94D2BD" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#94D2BD" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Gradient Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
      
      <!-- Decorative Bubbles -->
      <circle cx="${width - 100}" cy="-100" r="400" fill="url(#glowTop)" />
      <circle cx="-100" cy="${height + 100}" r="400" fill="url(#glowBottom)" />
      
      <!-- Centered Isotype Logo -->
      <g transform="translate(${logoX}, ${startY}) scale(${scale})">
        ${isotypeSvgPaths}
      </g>
      
      <!-- Title text -->
      <text 
        x="${width / 2}" 
        y="${titleY}" 
        text-anchor="middle" 
        fill="#FFFFFF" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        font-weight="900" 
        font-size="${titleSize}"
      >
        VitaBlue
      </text>
      
      <!-- Tagline text -->
      <text 
        x="${width / 2}" 
        y="${subtitleY}" 
        text-anchor="middle" 
        fill="#94D2BD" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        font-weight="600" 
        font-size="${subtitleSize}"
      >
        Protección que se adapta a tu vida
      </text>
    </svg>
  `.trim();
};

/**
 * Generates the SVG string for a campaign promo banner, post or story.
 */
export const generateCampaignBannerSvg = (
  width: number,
  height: number,
  type: 'post' | 'story' | 'banner',
  theme: 'dark' | 'light' | 'gradient',
  title: string,
  tagline: string
): string => {
  const isLight = theme === 'light';
  
  const primaryBg = isLight ? '#FFFFFF' : (theme === 'dark' ? '#001219' : 'url(#bgGrad)');
  const titleColor = isLight ? '#001219' : '#FFFFFF';
  const taglineColor = isLight ? '#005F73' : '#94D2BD';

  let layoutContent = '';

  if (type === 'post') {
    const logoSize = 180;
    const logoScale = logoSize / 64;
    const logoX = (width - logoSize) / 2;
    const logoY = 160;
    
    layoutContent = `
      <g transform="translate(${logoX}, ${logoY}) scale(${logoScale})">
        ${isotypeSvgPaths}
      </g>
      <text x="${width / 2}" y="460" text-anchor="middle" fill="${titleColor}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="56">${title}</text>
      <text x="${width / 2}" y="530" text-anchor="middle" fill="${taglineColor}" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="28">${tagline}</text>
      <rect x="${width / 2 - 120}" y="850" width="240" height="48" rx="24" fill="#005F73" opacity="0.1" />
      <text x="${width / 2}" y="880" text-anchor="middle" fill="${isLight ? '#005F73' : '#94D2BD'}" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="18">vitablue.es</text>
    `;
  } else if (type === 'story') {
    const logoSize = 240;
    const logoScale = logoSize / 64;
    const logoX = (width - logoSize) / 2;
    const logoY = 400;

    layoutContent = `
      <circle cx="${width / 2}" cy="520" r="350" fill="url(#glowTop)" opacity="0.8" />
      <g transform="translate(${logoX}, ${logoY}) scale(${logoScale})">
        ${isotypeSvgPaths}
      </g>
      <text x="${width / 2}" y="800" text-anchor="middle" fill="${titleColor}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="64">${title}</text>
      <text x="${width / 2}" y="890" text-anchor="middle" fill="${taglineColor}" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="32">${tagline}</text>
      <g transform="translate(${(width - 450) / 2}, 1450)">
        <rect width="450" height="90" rx="45" fill="#005F73" />
        <text x="225" y="54" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="28">COTIZAR ONLINE</text>
      </g>
      <text x="${width / 2}" y="1600" text-anchor="middle" fill="${isLight ? '#001219' : '#FFFFFF'}" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="22" opacity="0.8">vitablue.es</text>
    `;
  } else {
    const logoSize = 140;
    const logoScale = logoSize / 64;
    const logoX = 120;
    const logoY = (height - logoSize) / 2;

    layoutContent = `
      <g transform="translate(${logoX}, ${logoY}) scale(${logoScale})">
        ${isotypeSvgPaths}
      </g>
      <text x="320" y="290" fill="${titleColor}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="52">${title}</text>
      <text x="320" y="360" fill="${taglineColor}" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="24">${tagline}</text>
      <text x="320" y="420" fill="${isLight ? '#475569' : '#94D2BD'}" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="18" opacity="0.9">visita vitablue.es/wizard</text>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#005F73" />
          <stop offset="50%" stop-color="#003f4e" />
          <stop offset="100%" stop-color="#001219" />
        </linearGradient>
        <radialGradient id="glowTop" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#94D2BD" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#94D2BD" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="${primaryBg}" />
      <circle cx="${width - 100}" cy="-100" r="${Math.max(width, height) * 0.4}" fill="url(#glowTop)" />
      ${layoutContent}
    </svg>
  `.trim();
};

/**
 * Downloads a dynamically constructed SVG string as a high-quality PNG.
 */
export const downloadSvgAsPng = (
  svgString: string,
  width: number,
  height: number,
  filename: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      
      const image = new Image();
      image.crossOrigin = 'anonymous';
      
      image.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const context = canvas.getContext('2d');
          if (!context) {
            URL.revokeObjectURL(blobURL);
            reject(new Error('Could not get 2D context from canvas'));
            return;
          }
          
          // Render SVG image to canvas
          context.drawImage(image, 0, 0, width, height);
          
          // Export canvas as PNG Data URL
          const pngDataUrl = canvas.toDataURL('image/png');
          
          // Trigger browser download
          const link = document.createElement('a');
          link.download = filename;
          link.href = pngDataUrl;
          link.click();
          
          URL.revokeObjectURL(blobURL);
          resolve();
        } catch (err) {
          URL.revokeObjectURL(blobURL);
          reject(err);
        }
      };
      
      image.onerror = (err) => {
        URL.revokeObjectURL(blobURL);
        reject(err);
      };
      
      image.src = blobURL;
    } catch (err) {
      reject(err);
    }
  });
};
