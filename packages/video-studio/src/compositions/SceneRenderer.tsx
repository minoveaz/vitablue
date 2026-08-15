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
  <div>
    <h1 style={{ fontSize: '72px', lineHeight: 1.25, fontWeight: 800, margin: 0 }}>
      {getText(scene.content, 'text')}
    </h1>
  </div>
);

const ProviderLogosRenderer: TemplateRenderer = ({ scene }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
    <h1 style={{ fontSize: '60px', lineHeight: 1.3, fontWeight: 800, margin: 0 }}>
      {getText(scene.content, 'text')}
    </h1>
    <div style={{ display: 'flex', gap: '20px', fontSize: '24px', opacity: 0.6, fontWeight: 'bold', marginTop: '20px' }}>
      <span>SANITAS</span> · <span>ADESLAS</span> · <span>ASISA</span>
    </div>
  </div>
);

const RequirementsListRenderer: TemplateRenderer = ({ scene }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
    <h2 style={{ fontSize: '48px', color: '#94D2BD', fontWeight: 800 }}>
      {getText(scene.content, 'title') || 'Requisitos'}
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {getItems(scene.content).map((requirement) => (
        <div
          key={requirement}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '42px',
            fontWeight: 700,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '24px 32px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span style={{ color: '#EE9B00', fontSize: '48px' }}>✓</span>
          <span>{requirement}</span>
        </div>
      ))}
    </div>
  </div>
);

const AdvisorCtaRenderer: TemplateRenderer = ({ scene, brandAdapter }) => (
  <div style={{ transform: 'scale(1.6)', transformOrigin: 'center' }}>
    <brandAdapter.AdvisorCard
      name={getText(scene.content, 'advisorName')}
      role={getText(scene.content, 'role')}
      whatsAppText={getText(scene.content, 'cta')}
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
