import React from 'react';
import type { MotionTrustBadgeProps } from './types';
import { defaultMotionBrandTokens } from './types';

export const MotionTrustBadge: React.FC<MotionTrustBadgeProps> = ({
  title = 'PÓLIZA 100% VÁLIDA PARA VISADO',
  subtitle = 'Sin Copagos · Cobertura Completa · Repatriación Incluida',
  highlight = 'GARANTÍA CONSULAR',
  verifiedLabel = 'VERIFICADO',
  tokens = {},
  style,
}) => {
  const mergedTokens = { ...defaultMotionBrandTokens, ...tokens };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        backgroundColor: 'rgba(0, 18, 25, 0.85)',
        backdropFilter: 'blur(30px)',
        border: '3px solid rgba(238, 155, 0, 0.5)',
        borderRadius: '36px',
        padding: '44px 36px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(238, 155, 0, 0.25)',
        color: mergedTokens.textColor,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* SHIELD BADGE ICON */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'rgba(238, 155, 0, 0.2)',
          border: '2px solid rgba(238, 155, 0, 0.6)',
          padding: '8px 24px',
          borderRadius: '9999px',
          fontSize: '22px',
          fontWeight: 800,
          color: '#EE9B00',
          letterSpacing: '0.12em',
          marginBottom: '24px',
        }}
      >
        <span>🛡️</span>
        <span>{highlight}</span>
      </div>

      {/* TITLE */}
      <h3
        style={{
          margin: '0 0 16px 0',
          fontSize: '48px',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>

      {/* SUBTITLE */}
      <p
        style={{
          margin: '0 0 24px 0',
          fontSize: '28px',
          fontWeight: 600,
          color: mergedTokens.mintColor,
          lineHeight: 1.4,
        }}
      >
        {subtitle}
      </p>

      {/* VERIFIED PILL */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          border: '2px solid #10B981',
          padding: '10px 24px',
          borderRadius: '20px',
          fontSize: '22px',
          fontWeight: 800,
          color: '#34D399',
        }}
      >
        <span style={{ fontSize: '26px' }}>✓</span>
        <span>{verifiedLabel}</span>
      </div>
    </div>
  );
};
