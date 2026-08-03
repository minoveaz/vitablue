import React from 'react';

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  showTagline?: boolean;
  variant?: 'default' | 'white' | 'dark' | 'colored-on-dark';
  orientation?: 'horizontal' | 'vertical';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  iconSize = 42, 
  showText = true,
  showTagline = true,
  variant = 'default',
  orientation = 'horizontal'
}) => {
  
  const isDefault = variant === 'default';
  const isWhite = variant === 'white';
  const isColoredOnDark = variant === 'colored-on-dark';
  
  // Text coloring variables
  const isTextWhite = isWhite || isColoredOnDark;
  
  // Unique gradient and mask IDs
  const trGradId = "vb-logo-tr-grad-v2";
  const blGradId = "vb-logo-bl-grad-v2";
  const maskId = "vb-logo-cross-mask-v2";
  const radialGlowId = "vb-logo-dark-radial-glow";

  return (
    <div className={`flex select-none items-center ${
      orientation === 'vertical' ? 'flex-col gap-3 text-center' : 'flex-row gap-3.5'
    } ${className}`}>
      
      {/* 3D Folded Cross Isotype with asymmetric leaf ends */}
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Top-Right Half Gradient: Mint Green to Ocean Teal */}
          <linearGradient id={trGradId} x1="50%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#94D2BD" /> {/* vb-mint */}
            <stop offset="100%" stopColor="#005F73" /> {/* vb-ocean */}
          </linearGradient>

          {/* Bottom-Left Half Gradient: Ocean Teal to Midnight Blue */}
          <linearGradient id={blGradId} x1="0%" y1="50%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#005F73" /> {/* vb-ocean */}
            <stop offset="100%" stopColor="#001219" /> {/* vb-midnight */}
          </linearGradient>

          {/* Soft background radial halo glow for dark background variant (pops the colored logo) */}
          <radialGradient id={radialGlowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#94D2BD" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#005F73" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#001219" stopOpacity="0" />
          </radialGradient>

          {/* Mask representing the union of horizontal and vertical rounded pills */}
          <mask id={maskId}>
            <rect x="0" y="0" width="64" height="64" fill="black" />
            {/* Vertical pill */}
            <rect x="24" y="8" width="16" height="48" rx="8" fill="white" />
            {/* Horizontal pill */}
            <rect x="8" y="24" width="48" height="16" rx="8" fill="white" />
          </mask>
        </defs>

        {/* 1. Luminous Backglow Halo (Only for colored-on-dark variant to prevent contrast loss) */}
        {isColoredOnDark && (
          <circle cx="32" cy="32" r="30" fill={`url(#${radialGlowId})`} className="opacity-90" />
        )}

        {/* 2. Render Isotype Elements */}
        {isDefault || isColoredOnDark ? (
          <>
            {/* TOP ARM (Turquoise / Mint Green - Top-Left rounded, Top-Right sharp) */}
            <path 
              d="M24,24 V8 C24,5.8 25.8,4 28,4 H40 V24 L32,32 Z" 
              fill="#94D2BD" 
            />
            
            {/* LEFT ARM (Cyan / Medium Teal - Bottom-Left rounded, Top-Left sharp) */}
            <path 
              d="M24,40 H12 C9.8,40 8,38.2 8,36 V24 H24 L32,32 Z" 
              fill="#00B4C8" 
            />

            {/* RIGHT ARM (Light Sky Blue / Soft Cyan - Top-Right rounded, Bottom-Right sharp) */}
            <path 
              d="M40,24 H52 C54.2,24 56,25.8 56,28 V40 H40 L32,32 Z" 
              fill="#33C2D6" 
            />

            {/* BOTTOM ARM (Ocean Teal - Bottom-Right rounded, Bottom-Left sharp) */}
            <path 
              d="M40,40 V56 C40,58.2 38.2,60 36,60 H24 V40 L32,32 Z" 
              fill="#005F73" 
            />

            {/* CENTER-LEFT FOLD TRIANGLE (Medium Ocean Blue) */}
            <path 
              d="M32,32 L24,40 V24 Z" 
              fill="#00809B" 
            />

            {/* CENTER-RIGHT FOLD TRIANGLE (Midnight Blue Shadow) */}
            <path 
              d="M32,32 L40,24 V40 Z" 
              fill="#001219" 
            />
          </>
        ) : isWhite ? (
          <>
            {/* Monochrome White version uses varying opacities to retain the 3D folded facets */}
            <path 
              d="M24,24 V8 C24,5.8 25.8,4 28,4 H40 V24 L32,32 Z" 
              fill="#FFFFFF" 
              fillOpacity="0.8"
            />
            <path 
              d="M24,40 H8 C5.8,40 4,38.2 4,36 V28 C4,25.8 5.8,24 8,24 H24 L32,32 Z" 
              fill="#FFFFFF" 
              fillOpacity="0.7"
            />
            <path 
              d="M40,24 H52 C54.2,24 56,25.8 56,28 V40 H40 L32,32 Z" 
              fill="#FFFFFF" 
              fillOpacity="0.75"
            />
            <path 
              d="M40,40 V56 C40,58.2 38.2,60 36,60 H24 V40 L32,32 Z" 
              fill="#FFFFFF" 
              fillOpacity="0.9"
            />
            <path 
              d="M32,32 L24,40 V24 Z" 
              fill="#FFFFFF" 
              fillOpacity="0.65"
            />
            <path 
              d="M32,32 L40,24 V40 Z" 
              fill="#FFFFFF" 
              fillOpacity="0.5"
            />
          </>
        ) : (
          <>
            {/* Dark variant for plain light branding */}
            <path 
              d="M24,24 V8 C24,5.8 25.8,4 28,4 H40 V24 L32,32 Z" 
              fill="#001219" 
              fillOpacity="0.8"
            />
            <path 
              d="M24,40 H8 C5.8,40 4,38.2 4,36 V28 C4,25.8 5.8,24 8,24 H24 L32,32 Z" 
              fill="#001219" 
              fillOpacity="0.75"
            />
            <path 
              d="M40,24 H52 C54.2,24 56,25.8 56,28 V40 H40 L32,32 Z" 
              fill="#001219" 
              fillOpacity="0.85"
            />
            <path 
              d="M40,40 V56 C40,58.2 38.2,60 36,60 H24 V40 L32,32 Z" 
              fill="#001219" 
            />
            <path 
              d="M32,32 L24,40 V24 Z" 
              fill="#001219" 
              fillOpacity="0.7"
            />
            <path 
              d="M32,32 L40,24 V40 Z" 
              fill="#001219" 
              fillOpacity="0.6"
            />
          </>
        )}

        {/* Subtle crease fold line dividing diagonal corners */}
        <line 
          x1="24" 
          y1="40" 
          x2="40" 
          y2="24" 
          stroke={isWhite ? '#001219' : '#FFFFFF'} 
          strokeWidth="1.2" 
          opacity="0.35" 
          strokeLinecap="round" 
        />
      </svg>
      
      {/* Brand typography */}
      {showText && (
        <div className={`flex flex-col ${orientation === 'vertical' ? 'items-center' : 'items-start'}`}>
          <span className={`font-display tracking-tight font-bold leading-none ${
            orientation === 'vertical' ? 'text-xl sm:text-2xl' : 'text-2xl'
          } ${
            isTextWhite ? 'text-white' : 'text-text-main'
          }`}>
            vita<span className="text-primary">blue</span>
          </span>
          
          {showTagline && (
            <span className={`text-[9px] font-semibold tracking-wide mt-1.5 leading-none whitespace-nowrap ${
              isTextWhite ? 'text-white/60' : 'text-text-secondary/70'
            }`}>
              Seguros que se adaptan a ti
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
export type { LogoProps };
