import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../Base';

export const AccompanimentIllustration: React.FC = () => (
  <IllustrationBase>
    {/* Left/Background Chat Bubble with integrated tail (Single contiguous path) */}
    <path 
      d="M90 150L75 170L105 150H204C212.8 150 220 142.8 220 134V76C220 67.2 212.8 60 204 60H86C77.2 60 70 67.2 70 76V134C70 142.8 77.2 150 86 150Z" 
      fill="var(--color-neutral)" 
      fillOpacity="0.4"
      stroke="var(--color-secondary)" 
      strokeWidth={strokeWidth} 
      strokeLinecap={strokeLinecap} 
      strokeLinejoin={strokeLinejoin} 
    />
    
    {/* Right/Foreground Chat Bubble with integrated tail (Single contiguous path) */}
    <path 
      d="M275 210L290 230L305 210H314C322.8 210 330 202.8 330 194V126C330 117.2 322.8 110 314 110H176C167.2 110 160 117.2 160 126V194C160 202.8 167.2 210 176 210Z" 
      fill="white" 
      stroke="var(--color-primary)" 
      strokeWidth={strokeWidth} 
      strokeLinecap={strokeLinecap} 
      strokeLinejoin={strokeLinejoin} 
    />
    
    {/* Beautifully centered heart using official vector coordinates */}
    <g transform="translate(227, 142) scale(1.5)">
      <path 
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
        fill="var(--color-pastel)" 
        stroke="var(--color-primary)" 
        strokeWidth={2} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </g>
  </IllustrationBase>
);
