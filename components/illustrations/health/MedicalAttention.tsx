import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../Base';

export const MedicalAttentionIllustration: React.FC = () => (
  <IllustrationBase>
    {/* Background soft circle */}
    <circle cx="200" cy="150" r="100" fill="var(--color-pastel)" fillOpacity="0.4" />
    
    {/* A shield of protection */}
    <path d="M130 90C130 90 170 70 200 60C230 70 270 90 270 90C270 160 230 210 200 240C170 210 130 160 130 90Z" fill="white" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} />
    
    {/* A Euro coin symbol inside or overlapping the shield representing money back (reimbursement) */}
    <circle cx="200" cy="150" r="40" fill="var(--color-pastel)" stroke="var(--color-primary)" strokeWidth={strokeWidth} />
    
    {/* Euro symbol lines */}
    <path d="M215 135C210 130 200 130 195 135C188 142 188 158 195 165C200 170 210 170 215 165" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} fill="none" />
    <line x1="183" y1="145" x2="200" y2="145" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} />
    <line x1="183" y1="155" x2="200" y2="155" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} />
  </IllustrationBase>
);
