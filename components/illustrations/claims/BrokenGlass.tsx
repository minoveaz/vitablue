
import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../Base';

export const BrokenGlassIllustration: React.FC = () => (
  <IllustrationBase>
    <rect x="100" y="50" width="200" height="200" rx="5" fill="var(--color-pastel)" fillOpacity="0.2" stroke="var(--color-secondary)" strokeWidth={strokeWidth}/>
    <line x1="100" y1="150" x2="300" y2="150" stroke="var(--color-secondary)" strokeWidth={4} opacity="0.3"/>
    <line x1="200" y1="50" x2="200" y2="250" stroke="var(--color-secondary)" strokeWidth={4} opacity="0.3"/>
    <path d="M150 150L170 110L190 140L230 130L210 170L240 200" stroke="var(--color-primary)" strokeWidth={4} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} fill="none"/>
    <path d="M180 260L200 280L220 270L180 260Z" fill="var(--color-primary)"/>
  </IllustrationBase>
);
