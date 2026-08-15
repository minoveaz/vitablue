import { describe, expect, it } from 'vitest';
import type { Scene } from '../../packages/video-studio/src/domain/videoProject';
import { getVideoSceneWarnings } from './videoSceneValidation';

const scene = (overrides: Partial<Scene>): Scene => ({
  id: 'scene_1',
  templateId: 'text_hook',
  durationInFrames: 150,
  content: { text: 'Texto válido' },
  layers: [],
  ...overrides,
});

describe('video scene editor validation', () => {
  it('warns when required content is missing', () => {
    expect(getVideoSceneWarnings(scene({ content: {} }))).toContain('Falta completar: text.');
  });

  it('warns when content exceeds the recommended limit', () => {
    expect(getVideoSceneWarnings(scene({ content: { text: 'x'.repeat(181) } }))).toContain(
      'text supera el límite recomendado de 180 caracteres.',
    );
  });

  it('warns when requirements have no items', () => {
    expect(getVideoSceneWarnings(scene({
      templateId: 'requirements_list',
      content: { title: 'Requisitos' },
    }))).toContain('Añade al menos un requisito.');
  });
});
