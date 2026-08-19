import React from 'react';
import type { MotionComparisonCardProps } from './types';
import { defaultMotionBrandTokens } from './types';

export const MotionComparisonCard: React.FC<MotionComparisonCardProps> = ({
  title = '¿SEGURO DE VIAJE O SEGURO DE VISADO?',
  wrongOptionTitle = 'Seguro de Viaje Común',
  wrongOptionDesc = '❌ Denegación inmediata: no cumple requisitos de Extranjería ni tiene red médica completa en España.',
  correctOptionTitle = 'Seguro VitaBlue Extranjería',
  correctOptionDesc = '✅ Aprobación garantizada: sin copagos, cobertura total y repatriación incluida.',
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
        border: '3px solid rgba(148, 210, 189, 0.35)',
        borderRadius: '36px',
        padding: '40px 32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 95, 115, 0.3)',
        color: mergedTokens.textColor,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* TITLE */}
      <h3
        style={{
          margin: '0 0 28px 0',
          fontSize: '38px',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        {/* WRONG OPTION (RED ACCENT) */}
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '24px',
            padding: '24px 28px',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>❌</span>
            <strong style={{ fontSize: '32px', fontWeight: 800, color: '#F87171' }}>
              {wrongOptionTitle}
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.4 }}>
            {wrongOptionDesc}
          </p>
        </div>

        {/* CORRECT OPTION (GREEN/GOLD ACCENT) */}
        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid rgba(16, 185, 129, 0.6)',
            borderRadius: '24px',
            padding: '24px 28px',
            textAlign: 'left',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>✅</span>
            <strong style={{ fontSize: '32px', fontWeight: 800, color: '#34D399' }}>
              {correctOptionTitle}
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: '#ffffff', lineHeight: 1.4 }}>
            {correctOptionDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
