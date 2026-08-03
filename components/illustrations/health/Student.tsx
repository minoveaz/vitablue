import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../Base';

export const StudentIllustration: React.FC = () => (
  <IllustrationBase>
    {/* Background soft circle */}
    <circle cx="200" cy="150" r="100" fill="var(--color-pastel)" fillOpacity="0.4" />
    
    {/* Scrolled Diploma behind the cap */}
    <g transform="rotate(-12 200 190)">
      <rect x="110" y="185" width="180" height="35" rx="8" fill="white" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} />
      {/* Ribbon tying the diploma */}
      <rect x="190" y="181" width="20" height="43" rx="4" fill="var(--color-primary)" stroke="var(--color-secondary)" strokeWidth={strokeWidth} />
    </g>
    
    {/* Graduation Cap (Birrete) */}
    {/* 1. Cap skull under part */}
    <path d="M150 135 V170 C150 190 250 190 250 170 V135" fill="white" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} />
    
    {/* 2. Cap top diamond board */}
    <path d="M200 75 L310 115 L200 155 L90 115 Z" fill="var(--color-primary)" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} />
    
    {/* 3. Small central button on top */}
    <circle cx="200" cy="115" r="10" fill="var(--color-pastel)" stroke="var(--color-secondary)" strokeWidth={strokeWidth} />
    
    {/* 4. Tassel hanging down */}
    <path d="M200 115 C175 115 135 140 135 170" fill="none" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} />
    <rect x="125" y="170" width="20" height="35" rx="6" fill="var(--color-pastel)" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin} />
  </IllustrationBase>
);
