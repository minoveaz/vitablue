import React from 'react';
import type { MotionProviderGridProps } from './types';
import { defaultMotionBrandTokens } from './types';

export const MotionProviderGrid: React.FC<MotionProviderGridProps> = ({
  title = 'COMPAÑÍAS LÍDERES AUTORIZADAS',
  subtitle = 'Aceptadas oficialmente por Extranjería y Consulados',
  providers = [
    { name: 'SANITAS', tag: 'Sin Copagos', highlight: true },
    { name: 'ADESLAS', tag: 'Visa Ready' },
    { name: 'ASISA', tag: '100% Válido' },
    { name: 'DKV', tag: 'Repatriación' },
  ],
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
        border: '3px solid rgba(0, 95, 115, 0.5)',
        borderRadius: '36px',
        padding: '40px 32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 95, 115, 0.3)',
        color: mergedTokens.textColor,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* HEADER TITLE */}
      <h3
        style={{
          margin: '0 0 10px 0',
          fontSize: '40px',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: '0 0 32px 0',
          fontSize: '26px',
          fontWeight: 600,
          color: mergedTokens.mintColor,
        }}
      >
        {subtitle}
      </p>

      {/* 2X2 PROVIDERS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          width: '100%',
        }}
      >
        {providers.map((p, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: p.highlight ? 'rgba(238, 155, 0, 0.15)' : 'rgba(255, 255, 255, 0.06)',
              border: p.highlight ? '2px solid rgba(238, 155, 0, 0.5)' : '2px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '24px 20px',
            }}
          >
            <span
              style={{
                fontSize: '36px',
                fontWeight: 900,
                color: p.highlight ? '#EE9B00' : '#ffffff',
                letterSpacing: '0.05em',
                marginBottom: '8px',
              }}
            >
              {p.name}
            </span>
            {p.tag && (
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: mergedTokens.mintColor,
                  backgroundColor: 'rgba(148, 210, 189, 0.15)',
                  padding: '4px 12px',
                  borderRadius: '12px',
                }}
              >
                {p.tag}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
