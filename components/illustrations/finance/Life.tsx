import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap } from '../Base';

export const LifeIllustration: React.FC = () => (
  <IllustrationBase>
    {/* Background Circle */}
    <circle cx="200" cy="150" r="100" fill="var(--color-neutral)" fillOpacity="0.4" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeDasharray="8 8" />
    
    {/* Growing plant / leaf lines representing Life/Growth */}
    <path d="M200 230V80" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} />
    
    {/* Left Leaf */}
    <path d="M200 160Q150 140 150 110Q190 120 200 160" fill="var(--color-pastel)" stroke="var(--color-secondary)" strokeWidth={strokeWidth} />
    
    {/* Right Leaf */}
    <path d="M200 130Q250 110 250 80Q210 90 200 130" fill="var(--color-pastel)" stroke="var(--color-primary)" strokeWidth={strokeWidth} />

    {/* Small glowing sun on top */}
    <circle cx="200" cy="65" r="12" fill="var(--color-primary)" />
  </IllustrationBase>
);
