
import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../Base';

export const HomeIllustration: React.FC = () => (
  <IllustrationBase>
    <circle cx="200" cy="150" r="130" fill="var(--color-pastel)" fillOpacity="0.4"/>
    <path d="M80 140L200 40L320 140V260H80V140Z" fill="white" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin}/>
    <path d="M170 260V180H230V260" fill="var(--color-neutral)" stroke="var(--color-secondary)" strokeWidth={strokeWidth}/>
    <circle cx="200" cy="110" r="25" fill="var(--color-pastel)" stroke="var(--color-secondary)" strokeWidth={strokeWidth/2}/>
    <g transform="translate(240, 160)">
        <path d="M0 0H80V30C80 60 50 80 40 85C30 80 0 60 0 30V0Z" fill="var(--color-primary)" stroke="white" strokeWidth="6"/>
        <path d="M25 40L35 50L55 30" stroke="white" strokeWidth="6" strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin}/>
    </g>
    <path d="M40 260C40 230 70 230 80 260" stroke="var(--color-primary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
  </IllustrationBase>
);
