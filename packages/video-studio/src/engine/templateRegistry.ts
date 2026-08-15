import type { SceneTemplateId } from '../domain/videoProject';

export interface VideoTemplateDefinition {
  id: SceneTemplateId;
  label: string;
}

export const videoTemplateRegistry: Readonly<Record<SceneTemplateId, VideoTemplateDefinition>> = {
  text_hook: { id: 'text_hook', label: 'Text hook' },
  provider_logos: { id: 'provider_logos', label: 'Provider logos' },
  requirements_list: { id: 'requirements_list', label: 'Requirements list' },
  advisor_cta: { id: 'advisor_cta', label: 'Advisor CTA' },
};

export const getVideoTemplate = (templateId: SceneTemplateId): VideoTemplateDefinition =>
  videoTemplateRegistry[templateId];

export const isRegisteredVideoTemplate = (templateId: string): templateId is SceneTemplateId =>
  Object.prototype.hasOwnProperty.call(videoTemplateRegistry, templateId);

export const resolveVideoTemplate = (templateId: string): VideoTemplateDefinition | null =>
  isRegisteredVideoTemplate(templateId) ? videoTemplateRegistry[templateId] : null;