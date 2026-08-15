import type { Scene } from '../../packages/video-studio/src/domain/videoProject';

const textValue = (scene: Scene, key: string): string =>
  typeof scene.content[key] === 'string' ? scene.content[key] as string : '';

export const getVideoSceneWarnings = (scene: Scene): string[] => {
  const warnings: string[] = [];

  if (!Number.isInteger(scene.durationInFrames) || scene.durationInFrames <= 0) {
    warnings.push('La duración debe ser mayor que cero.');
  }

  const requiredText: Record<string, string[]> = {
    text_hook: ['text'],
    provider_logos: ['text'],
    requirements_list: ['title'],
    advisor_cta: ['advisorName', 'cta'],
  };

  for (const key of requiredText[scene.templateId] ?? []) {
    if (!textValue(scene, key).trim()) warnings.push(`Falta completar: ${key}.`);
  }

  const textLimits: Record<string, number> = {
    text: 180,
    title: 70,
    cta: 100,
  };

  for (const [key, limit] of Object.entries(textLimits)) {
    const value = textValue(scene, key);
    if (value.length > limit) warnings.push(`${key} supera el límite recomendado de ${limit} caracteres.`);
  }

  const items = Array.isArray(scene.content.items) ? scene.content.items : [];
  if (scene.templateId === 'requirements_list' && items.length === 0) {
    warnings.push('Añade al menos un requisito.');
  }

  return warnings;
};
