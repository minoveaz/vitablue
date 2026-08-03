import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap } from '../Base';

export const ProfileIllustration: React.FC = () => (
  <IllustrationBase>
    {/* Background Circle */}
    <circle cx="200" cy="150" r="100" fill="var(--color-neutral)" fillOpacity="0.4" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeDasharray="8 8" />
    
    {/* User Head */}
    <circle cx="200" cy="110" r="32" fill="var(--color-pastel)" stroke="var(--color-secondary)" strokeWidth={strokeWidth} />
    
    {/* User Shoulders */}
    <path d="M120 210C120 170 150 160 200 160C250 160 280 170 280 210" fill="white" stroke="var(--color-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} />
    
    {/* Customizing badge */}
    <circle cx="260" cy="130" r="22" fill="var(--color-primary)" stroke="white" strokeWidth={4} />
    <path d="M252 130L257 135L268 124" stroke="white" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
  </IllustrationBase>
);
