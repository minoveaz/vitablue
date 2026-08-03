
import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinejoin } from '../Base';

export const PetIllustration: React.FC = () => (
  <IllustrationBase>
    <path d="M50 250H150V150L100 100L50 150V250Z" fill="var(--color-neutral)" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin}/>
    <path d="M80 250V190C80 180 120 180 120 190V250" fill="var(--color-pastel)"/>
    <g transform="translate(180, 80)">
        <circle cx="50" cy="80" r="30" fill="var(--color-primary)"/>
        <circle cx="20" cy="30" r="15" fill="var(--color-primary)"/>
        <circle cx="50" cy="20" r="15" fill="var(--color-primary)"/>
        <circle cx="80" cy="30" r="15" fill="var(--color-primary)"/>
    </g>
    <path d="M200 220C190 220 190 230 200 240C190 250 190 260 200 260H260C270 260 270 250 260 240C270 230 270 220 260 220H200Z" fill="white" stroke="var(--color-secondary)" strokeWidth={4}/>
  </IllustrationBase>
);
