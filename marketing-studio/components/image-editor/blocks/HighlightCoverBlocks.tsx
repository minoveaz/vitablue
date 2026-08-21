import React from 'react';
import { ImageLayer } from '../../../types/imageStudio';

export interface InstagramHighlightBadgeProps {
  layer: ImageLayer;
  onUpdateLayerProps?: (layerId: string, patch: Record<string, unknown>) => void;
}

export type HighlightIconKey = 'approved' | 'visa' | 'process' | 'faq' | 'contact';

export interface HighlightPresetDef {
  id: HighlightIconKey;
  label: string;
  sublabel: string;
  defaultRingColor: string;
  defaultGlowColor: string;
  defaultAccentColor: string;
}

export const HIGHLIGHT_PRESETS: HighlightPresetDef[] = [
  {
    id: 'approved',
    label: 'Aprobados',
    sublabel: 'Prueba Social y Éxitos de Visado',
    defaultRingColor: '#94D2BD',
    defaultGlowColor: 'rgba(148, 210, 189, 0.55)',
    defaultAccentColor: '#94D2BD',
  },
  {
    id: 'visa',
    label: 'Visados',
    sublabel: 'Seguro Médico Consular 100%',
    defaultRingColor: '#94D2BD',
    defaultGlowColor: 'rgba(148, 210, 189, 0.55)',
    defaultAccentColor: '#94D2BD',
  },
  {
    id: 'process',
    label: 'Paso a Paso',
    sublabel: 'Proceso de Emisión en 3 Pasos',
    defaultRingColor: '#94D2BD',
    defaultGlowColor: 'rgba(148, 210, 189, 0.55)',
    defaultAccentColor: '#94D2BD',
  },
  {
    id: 'faq',
    label: 'Dudas & FAQ',
    sublabel: 'Preguntas Frecuentes y Respuestas',
    defaultRingColor: '#94D2BD',
    defaultGlowColor: 'rgba(148, 210, 189, 0.55)',
    defaultAccentColor: '#94D2BD',
  },
  {
    id: 'contact',
    label: 'Contacto',
    sublabel: 'WhatsApp Directo con Asesora',
    defaultRingColor: '#94D2BD',
    defaultGlowColor: 'rgba(148, 210, 189, 0.55)',
    defaultAccentColor: '#94D2BD',
  },
];

export const HighlightVectorIcon: React.FC<{
  iconKey: HighlightIconKey;
  strokeColor?: string;
  accentColor?: string;
  className?: string;
}> = ({
  iconKey,
  strokeColor = '#FFFFFF',
  accentColor = '#EE9B00',
  className = 'w-full h-full',
}) => {
  switch (iconKey) {
    // 🎓 1. APROBADOS (Birrete académico + Check consular)
    case 'approved':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Birrete Superior */}
          <path
            d="M50 20L86 36L50 52L14 36L50 20Z"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Base del Gorro */}
          <path
            d="M26 42.5V59C26 67 36 73 50 73C64 73 74 67 74 59V42.5"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Borla Colgante */}
          <path
            d="M80 39V56C80 58 78 60 76 60C74 60 72 58 72 56"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="80" cy="38" r="2.5" fill={accentColor} />

          {/* Sello Circular con Check Aprobado */}
          <circle cx="50" cy="54" r="14" fill="#001219" stroke={accentColor} strokeWidth="3" />
          <path
            d="M44 54L48 58L57 49"
            stroke={accentColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    // 🛡️ 2. VISADOS (Pasaporte oficial + Escudo de salud)
    case 'visa':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Libreta de Pasaporte */}
          <rect
            x="24"
            y="16"
            width="52"
            height="68"
            rx="7"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Línea de Lomo / Dobladillo */}
          <line x1="32" y1="16" x2="32" y2="84" stroke={strokeColor} strokeWidth="2.5" strokeOpacity="0.4" />
          
          {/* Escudo Central */}
          <path
            d="M52 35C52 35 63 33 66 38C66 52 56 62 52 65C48 62 38 52 38 38C41 33 52 35 52 35Z"
            stroke={accentColor}
            strokeWidth="3"
            strokeLinejoin="round"
            fill="#001219"
          />
          {/* Cruz Médica en Escudo */}
          <path
            d="M52 42V54M46 48H58"
            stroke={accentColor}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          
          {/* Línea de datos inferior */}
          <line x1="40" y1="72" x2="64" y2="72" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // ⚡ 3. PROCESO (3 Nodos conectados en ruta de pasos)
    case 'process':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Líneas de Ruta Conectora */}
          <path
            d="M32 30H68C72 30 76 34 76 38V46C76 50 72 54 68 54H32C28 54 24 58 24 62V70C24 74 28 78 32 78H68"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Nodo 1: Inicio */}
          <circle cx="32" cy="30" r="7" fill="#001219" stroke={accentColor} strokeWidth="3.5" />
          <circle cx="32" cy="30" r="2.5" fill={accentColor} />

          {/* Nodo 2: Intermedio */}
          <circle cx="50" cy="54" r="7" fill="#001219" stroke={strokeColor} strokeWidth="3" />
          <circle cx="50" cy="54" r="2.5" fill={strokeColor} />

          {/* Nodo 3: Meta / Éxito */}
          <circle cx="68" cy="78" r="7" fill="#001219" stroke={accentColor} strokeWidth="3.5" />
          <circle cx="68" cy="78" r="2.5" fill={accentColor} />
        </svg>
      );

    // ❓ 4. FAQS (Bocadillo de diálogo + Signo de interrogación)
    case 'faq':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Bocadillo de Chat */}
          <path
            d="M50 18C31.5 18 16.5 31.5 16.5 48C16.5 56.5 20.5 64 27 69.5L24 82L37.5 76C41.5 77.5 45.5 78 50 78C68.5 78 83.5 64.5 83.5 48C83.5 31.5 68.5 18 50 18Z"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Signo de Interrogación */}
          <path
            d="M44 38C44 34.5 46.5 32 50 32C53.5 32 56 34.5 56 38C56 42 51.5 43.5 50 48"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="59" r="2.5" fill={accentColor} />
        </svg>
      );

    // 📱 5. CONTACTO (Smartphone con mensaje WhatsApp)
    case 'contact':
    default:
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Silueta Smartphone */}
          <rect
            x="22"
            y="14"
            width="42"
            height="72"
            rx="8"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Altavoz Superior */}
          <line x1="38" y1="22" x2="48" y2="22" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Botón Home Inferior */}
          <circle cx="43" cy="77" r="2" fill={strokeColor} fillOpacity="0.6" />

          {/* Burbuja de Chat Superpuesta */}
          <path
            d="M44 32H74C78.5 32 82 35.5 82 40V54C82 58.5 78.5 62 74 62H60L50 68V62H44C39.5 62 36 58.5 36 54V40C36 35.5 39.5 32 44 32Z"
            fill="#001219"
            stroke={accentColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Líneas de conversación en burbuja */}
          <line x1="46" y1="42" x2="68" y2="42" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="46" y1="49" x2="60" y2="49" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Punto Live Pulse */}
          <circle cx="76" cy="36" r="3.5" fill={accentColor} />
        </svg>
      );
  }
};

export const InstagramHighlightBadge: React.FC<InstagramHighlightBadgeProps> = ({ layer }) => {
  const props = (layer.props ?? {}) as Record<string, unknown>;
  const iconKey = (props.iconKey as HighlightIconKey) || 'approved';
  const label = String(props.label ?? 'Aprobados');
  const showLabel = props.showLabel !== false;
  const ringColor = String(props.ringColor ?? '#94D2BD');
  const glowColor = String(props.glowColor ?? 'rgba(148, 210, 189, 0.55)');
  const strokeColor = String(props.strokeColor ?? '#FFFFFF');
  const accentColor = String(props.accentColor ?? ringColor);
  const bgColor = String(props.bgColor ?? '#001219');
  const isFullCover = props.isFullCover === true;

  if (isFullCover) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center select-none relative overflow-hidden bg-transparent">
        {/* DISCO CIRCULAR CON GLOW RING */}
        <div
          className="relative rounded-full flex items-center justify-center shadow-2xl transition-transform"
          style={{
            width: '78%',
            height: '78%',
            background: `radial-gradient(circle at 50% 35%, rgba(0, 95, 115, 0.75) 0%, ${bgColor} 80%)`,
            border: `6px solid ${ringColor}`,
            boxShadow: `0 0 45px ${glowColor}, inset 0 0 25px rgba(0, 95, 115, 0.5)`,
          }}
        >
          {/* ARO INTERIOR FINO */}
          <div
            className="absolute inset-3 rounded-full border border-white/20 pointer-events-none"
          />

          {/* ICONO VECTORIAL */}
          <div className="w-[58%] h-[58%] flex items-center justify-center relative z-10 drop-shadow-md">
            <HighlightVectorIcon
              iconKey={iconKey}
              strokeColor={strokeColor}
              accentColor={accentColor}
            />
          </div>
        </div>

        {/* ETIQUETA INFERIOR OPCIONAL */}
        {showLabel && (
          <span
            className="mt-6 font-display font-bold text-white tracking-wider uppercase text-center"
            style={{ fontSize: 'clamp(18px, 3.5vw, 36px)' }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }

  // MODO INSIGNIA / BADGE AISLADO EN LIENZO
  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none relative">
      <div
        className="w-full aspect-square rounded-full flex items-center justify-center relative overflow-hidden shadow-xl"
        style={{
          background: `radial-gradient(circle at 50% 35%, rgba(0, 95, 115, 0.8) 0%, ${bgColor} 85%)`,
          border: `4px solid ${ringColor}`,
          boxShadow: `0 0 25px ${glowColor}`,
        }}
      >
        <div className="w-[62%] h-[62%] flex items-center justify-center">
          <HighlightVectorIcon
            iconKey={iconKey}
            strokeColor={strokeColor}
            accentColor={accentColor}
          />
        </div>
      </div>

      {showLabel && (
        <span className="mt-2 text-xs font-display font-bold text-slate-100 tracking-wide text-center">
          {label}
        </span>
      )}
    </div>
  );
};

/**
 * Genera el SVG completo a 1080x1080 px para la portada de Instagram Story Highlights.
 */
export function generateHighlightCoverSvg(
  iconKey: HighlightIconKey,
  options?: {
    ringColor?: string;
    accentColor?: string;
    strokeColor?: string;
    width?: number;
    height?: number;
  }
): string {
  const width = options?.width ?? 1080;
  const height = options?.height ?? 1080;
  const ringColor = options?.ringColor ?? '#94D2BD';
  const accentColor = options?.accentColor ?? '#94D2BD';
  const strokeColor = options?.strokeColor ?? '#FFFFFF';

  let iconInnerSvg = '';
  switch (iconKey) {
    case 'approved':
      iconInnerSvg = `
        <path d="M50 20L86 36L50 52L14 36L50 20Z" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M26 42.5V59C26 67 36 73 50 73C64 73 74 67 74 59V42.5" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M80 39V56C80 58 78 60 76 60C74 60 72 58 72 56" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="80" cy="38" r="2.5" fill="${accentColor}"/>
        <circle cx="50" cy="54" r="14" fill="#001219" stroke="${accentColor}" stroke-width="3"/>
        <path d="M44 54L48 58L57 49" stroke="${accentColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      `;
      break;
    case 'visa':
      iconInnerSvg = `
        <rect x="24" y="16" width="52" height="68" rx="7" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="32" y1="16" x2="32" y2="84" stroke="${strokeColor}" stroke-width="2.5" stroke-opacity="0.4"/>
        <path d="M52 35C52 35 63 33 66 38C66 52 56 62 52 65C48 62 38 52 38 38C41 33 52 35 52 35Z" stroke="${accentColor}" stroke-width="3" stroke-linejoin="round" fill="#001219"/>
        <path d="M52 42V54M46 48H58" stroke="${accentColor}" stroke-width="2.8" stroke-linecap="round"/>
        <line x1="40" y1="72" x2="64" y2="72" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round"/>
      `;
      break;
    case 'process':
      iconInnerSvg = `
        <path d="M32 30H68C72 30 76 34 76 38V46C76 50 72 54 68 54H32C28 54 24 58 24 62V70C24 74 28 78 32 78H68" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="32" cy="30" r="7" fill="#001219" stroke="${accentColor}" stroke-width="3.5"/>
        <circle cx="32" cy="30" r="2.5" fill="${accentColor}"/>
        <circle cx="50" cy="54" r="7" fill="#001219" stroke="${strokeColor}" stroke-width="3"/>
        <circle cx="50" cy="54" r="2.5" fill="${strokeColor}"/>
        <circle cx="68" cy="78" r="7" fill="#001219" stroke="${accentColor}" stroke-width="3.5"/>
        <circle cx="68" cy="78" r="2.5" fill="${accentColor}"/>
      `;
      break;
    case 'faq':
      iconInnerSvg = `
        <path d="M50 18C31.5 18 16.5 31.5 16.5 48C16.5 56.5 20.5 64 27 69.5L24 82L37.5 76C41.5 77.5 45.5 78 50 78C68.5 78 83.5 64.5 83.5 48C83.5 31.5 68.5 18 50 18Z" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M44 38C44 34.5 46.5 32 50 32C53.5 32 56 34.5 56 38C56 42 51.5 43.5 50 48" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="50" cy="59" r="2.5" fill="${accentColor}"/>
      `;
      break;
    case 'contact':
    default:
      iconInnerSvg = `
        <rect x="22" y="14" width="42" height="72" rx="8" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="38" y1="22" x2="48" y2="22" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="43" cy="77" r="2" fill="${strokeColor}" fill-opacity="0.6"/>
        <path d="M44 32H74C78.5 32 82 35.5 82 40V54C82 58.5 78.5 62 74 62H60L50 68V62H44C39.5 62 36 58.5 36 54V40C36 35.5 39.5 32 44 32Z" fill="#001219" stroke="${accentColor}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="46" y1="42" x2="68" y2="42" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="46" y1="49" x2="60" y2="49" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="76" cy="36" r="3.5" fill="${accentColor}"/>
      `;
      break;
  }

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGrad_${iconKey}" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stop-color="#005F73" stop-opacity="0.85"/>
          <stop offset="80%" stop-color="#001219"/>
          <stop offset="100%" stop-color="#00080C"/>
        </radialGradient>
      </defs>

      <!-- Fondo Completo -->
      <rect width="1080" height="1080" fill="#001219"/>

      <!-- Disco Central con Mesh -->
      <circle cx="540" cy="540" r="420" fill="url(#bgGrad_${iconKey})"/>

      <!-- Resplandor Glow Neón -->
      <circle cx="540" cy="540" r="420" stroke="${ringColor}" stroke-width="16" opacity="0.4"/>

      <!-- Aro Principal Nítido -->
      <circle cx="540" cy="540" r="420" stroke="${ringColor}" stroke-width="8"/>

      <!-- Aro Interior Sutil -->
      <circle cx="540" cy="540" r="390" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.2"/>

      <!-- Icono Vectorial Centrado -->
      <g transform="translate(290, 290) scale(5)">
        ${iconInnerSvg}
      </g>
    </svg>
  `;
}

/**
 * Descarga directa en 1-clic de la portada en formato PNG a resolución nativa 1080x1080 px.
 */
export async function downloadHighlightCoverPng(
  iconKey: HighlightIconKey,
  filename?: string
): Promise<void> {
  if (typeof window === 'undefined') return;

  const svgString = generateHighlightCoverSvg(iconKey);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve();
          return;
        }

        ctx.drawImage(img, 0, 0);
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            const downloadUrl = URL.createObjectURL(pngBlob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename || `vitablue-destacado-${iconKey}-1080p.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
          }
          URL.revokeObjectURL(url);
          resolve();
        }, 'image/png');
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

