import React from 'react';
import type { MotionAdvisorCardProps } from './types';
import { defaultMotionBrandTokens } from './types';

export const MotionAdvisorCard: React.FC<MotionAdvisorCardProps> = ({
  name = 'Sofía',
  role = 'Asesora Especialista en Visados',
  badge = 'ASESORA ASIGNADA · EN DIRECTO',
  message = '"Te ayudo a verificar que tu póliza cumple el 100% de los requisitos del consulado sin copagos."',
  avatarUrl,
  whatsAppText = 'Pregúntanos por WhatsApp',
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
        borderRadius: '40px',
        padding: '50px 40px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 95, 115, 0.25)',
        color: mergedTokens.textColor,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* STATUS BADGE */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'rgba(148, 210, 189, 0.15)',
          border: '2px solid rgba(148, 210, 189, 0.5)',
          padding: '10px 24px',
          borderRadius: '9999px',
          fontSize: '22px',
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: mergedTokens.mintColor,
          marginBottom: '32px',
        }}
      >
        <span
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 12px #10B981',
          }}
        />
        <span>{badge}</span>
      </div>

      {/* AVATAR CIRCLE */}
      <div
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          border: '4px solid #EE9B00',
          boxShadow: '0 0 30px rgba(238, 155, 0, 0.4)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#005F73',
          marginBottom: '28px',
        }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '64px', fontWeight: 900, color: '#ffffff' }}>
            {name.charAt(0)}
          </span>
        )}
      </div>

      {/* NAME & ROLE */}
      <h2
        style={{
          margin: '0 0 8px 0',
          fontSize: '56px',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        }}
      >
        {name}
      </h2>
      <p
        style={{
          margin: '0 0 28px 0',
          fontSize: '32px',
          fontWeight: 700,
          color: mergedTokens.mintColor,
          letterSpacing: '-0.01em',
        }}
      >
        {role}
      </p>

      {/* MESSAGE QUOTE */}
      {message && (
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '24px 32px',
            marginBottom: '36px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '30px',
              fontWeight: 500,
              lineHeight: 1.4,
              color: 'rgba(255, 255, 255, 0.9)',
              fontStyle: 'italic',
            }}
          >
            {message}
          </p>
        </div>
      )}

      {/* CTA BUTTON */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          width: '100%',
          backgroundColor: '#25D366',
          color: '#ffffff',
          padding: '24px 36px',
          borderRadius: '28px',
          fontSize: '34px',
          fontWeight: 800,
          boxShadow: '0 12px 30px rgba(37, 211, 102, 0.45)',
          letterSpacing: '-0.01em',
        }}
      >
        <span>💬</span>
        <span>{whatsAppText}</span>
      </div>
    </div>
  );
};
