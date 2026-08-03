
import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap } from '../Base';

export const WaterLeakIllustration: React.FC = () => (
  <IllustrationBase>
    <rect x="50" y="50" width="300" height="200" rx="10" fill="var(--color-neutral)" fillOpacity="0.5"/>
    <path d="M50 120H150C161.046 120 170 128.954 170 140V250" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <path d="M170 140V120H350" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <path d="M170 140L160 160" stroke="var(--color-primary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
    <path d="M170 140L180 155" stroke="var(--color-primary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
    <circle cx="165" cy="180" r="5" fill="var(--color-primary)"/>
    <circle cx="175" cy="200" r="7" fill="var(--color-primary)"/>
    <circle cx="170" cy="230" r="6" fill="var(--color-primary)"/>
    <ellipse cx="170" cy="260" rx="40" ry="10" fill="var(--color-pastel)" />
  </IllustrationBase>
);
