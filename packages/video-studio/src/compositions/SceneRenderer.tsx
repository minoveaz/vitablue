import React from 'react';
import type { VideoBrandAdapter } from '../engine/brandAdapter';
import type { Scene, SceneTemplateId } from '../domain/videoProject';

const getText = (content: Record<string, unknown>, key: string): string =>
  typeof content[key] === 'string' ? content[key] as string : '';

const getItems = (content: Record<string, unknown>): string[] =>
  Array.isArray(content.items)
    ? content.items.filter((item): item is string => typeof item === 'string')
    : [];

interface SceneRendererProps {
  scene: Scene;
  brandAdapter: VideoBrandAdapter;
}

type TemplateRenderer = React.FC<SceneRendererProps>;

const TextHookRenderer: TemplateRenderer = ({ scene }) => (
  <div style={{ textAlign: 'center', padding: '0 20px' }}>
    <h1 style={{ fontSize: '64px', lineHeight: 1.25, fontWeight: 900, margin: 0, textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
      {getText(scene.content, 'text')}
    </h1>
  </div>
);

const ProviderLogosRenderer: TemplateRenderer = ({ scene, brandAdapter }) => (
  <div style={{ width: '100%' }}>
    <brandAdapter.ProviderGrid
      title={getText(scene.content, 'text') || 'COMPAÑÍAS LÍDERES AUTORIZADAS'}
      tokens={brandAdapter.brandTokens}
    />
  </div>
);

const RequirementsListRenderer: TemplateRenderer = ({ scene, brandAdapter }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%', maxWidth: '860px', margin: '0 auto' }}>
    <h2 style={{ fontSize: '48px', color: brandAdapter.brandTokens?.mintColor ?? '#94D2BD', fontWeight: 900, margin: '0 0 8px 0', textAlign: 'center' }}>
      {getText(scene.content, 'title') || 'Requisitos Obligatorios'}
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {getItems(scene.content).map((requirement) => (
        <div
          key={requirement}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '36px',
            fontWeight: 700,
            backgroundColor: 'rgba(0, 18, 25, 0.8)',
            backdropFilter: 'blur(20px)',
            padding: '24px 30px',
            borderRadius: '24px',
            border: '2px solid rgba(148, 210, 189, 0.25)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          <span style={{ color: brandAdapter.brandTokens?.accentColor ?? '#EE9B00', fontSize: '42px', fontWeight: 900 }}>✓</span>
          <span>{requirement}</span>
        </div>
      ))}
    </div>
  </div>
);

const AdvisorCtaRenderer: TemplateRenderer = ({ scene, brandAdapter }) => (
  <div style={{ width: '100%' }}>
    <brandAdapter.AdvisorCard
      name={getText(scene.content, 'advisorName') || 'Sofía'}
      role={getText(scene.content, 'role') || 'Asesora Especialista'}
      whatsAppText={getText(scene.content, 'cta') || 'Pregúntanos por WhatsApp'}
      tokens={brandAdapter.brandTokens}
    />
  </div>
);

export const videoTemplateRenderers: Readonly<Record<SceneTemplateId, TemplateRenderer>> = {
  text_hook: TextHookRenderer,
  provider_logos: ProviderLogosRenderer,
  requirements_list: RequirementsListRenderer,
  advisor_cta: AdvisorCtaRenderer,
};

export const SceneRenderer: React.FC<SceneRendererProps> = ({ scene, brandAdapter }) => {
  const Renderer = videoTemplateRenderers[scene.templateId];
  return Renderer ? <Renderer scene={scene} brandAdapter={brandAdapter} /> : null;
};
