import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../Base';

export const PreventionIllustration: React.FC = () => (
  <IllustrationBase>
    {/* Background soft circle */}
    <circle cx="200" cy="150" r="100" fill="var(--color-pastel)" fillOpacity="0.4" />
    
    {/* Clipboard/Medical Report */}
    <rect x="130" y="70" width="140" height="170" rx="16" fill="white" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin} />
    
    {/* Clipboard clip at the top */}
    <path d="M170 70V60C170 54.4772 174.477 50 180 50H220C225.523 50 230 54.4772 230 60V70" fill="var(--color-primary)" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} />
    
    {/* Heart on the document */}
    <path d="M180 135C180 120 200 120 200 135C200 120 220 120 220 135C220 150 200 165 200 165C200 165 180 150 180 135Z" fill="var(--color-pastel)" stroke="var(--color-primary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} />
    
    {/* Text lines in the report */}
    <line x1="160" y1="190" x2="240" y2="190" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} />
    <line x1="160" y1="210" x2="220" y2="210" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} />
  </IllustrationBase>
);
