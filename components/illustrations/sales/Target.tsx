
import React from 'react';
import { IllustrationBase, strokeLinecap } from '../Base';

export const TargetIllustration: React.FC = () => (
  <IllustrationBase>
    <circle cx="200" cy="150" r="100" fill="white" stroke="var(--color-secondary)" strokeWidth={4}/>
    <circle cx="200" cy="150" r="70" fill="var(--color-pastel)" stroke="var(--color-secondary)" strokeWidth={4}/>
    <circle cx="200" cy="150" r="40" fill="white" stroke="var(--color-secondary)" strokeWidth={4}/>
    <circle cx="200" cy="150" r="15" fill="var(--color-primary)"/>
    <path d="M280 80L210 140" stroke="var(--color-secondary)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
    <path d="M280 80L290 70M280 80L270 70M280 80L285 65" stroke="var(--color-secondary)" strokeWidth={4}/>
    <path d="M100 100L110 110M90 110L100 100" stroke="var(--color-primary)" strokeWidth={4}/>
    <path d="M300 220L310 230M290 230L300 220" stroke="var(--color-primary)" strokeWidth={4}/>
  </IllustrationBase>
);
