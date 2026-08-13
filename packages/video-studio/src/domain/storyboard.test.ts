import { describe, expect, it } from 'vitest';
import {
  getActiveSceneTiming,
  getProjectDurationInFrames,
  getSceneTimings,
  validateVideoProject,
} from './storyboard';
import { defaultVisaRejectionProject } from './defaultProject';
import { resolveVideoTemplate } from '../engine/templateRegistry';
import { validateRenderProject } from '../engine/renderValidation';
import { createRenderPlan } from '../engine/renderService';
import { createPresetProject, videoTemplatePresets } from '../engine/templateLibrary';

describe('video storyboard', () => {
  it('calculates scene timings and total duration', () => {
    const timings = getSceneTimings(defaultVisaRejectionProject);

    expect(timings).toHaveLength(4);
    expect(timings[0]).toMatchObject({ startFrame: 0, endFrame: 150 });
    expect(timings[1]).toMatchObject({ startFrame: 150, endFrame: 450 });
    expect(timings[3]).toMatchObject({ startFrame: 900, endFrame: 1350 });
    expect(getProjectDurationInFrames(defaultVisaRejectionProject)).toBe(1350);
  });

  it('creates a validated render plan from the project contract', () => {
    expect(createRenderPlan(defaultVisaRejectionProject)).toEqual({
      projectId: 'visa-rejection-reel',
      durationInFrames: 1350,
      fps: 30,
      width: 1080,
      height: 1920,
      outputFileName: 'visa-rejection-reel-vertical.mp4',
    });
  });

  it('uses half-open frame ranges when resolving an active scene', () => {
    expect(getActiveSceneTiming(defaultVisaRejectionProject, 149)?.scene.id).toBe('slide_1');
    expect(getActiveSceneTiming(defaultVisaRejectionProject, 150)?.scene.id).toBe('slide_2');
    expect(getActiveSceneTiming(defaultVisaRejectionProject, 1350)).toBeNull();
    expect(getActiveSceneTiming(defaultVisaRejectionProject, -1)).toBeNull();
  });

  it('reports invalid scene contracts', () => {
    const invalidProject = {
      ...defaultVisaRejectionProject,
      id: '',
      fps: 0,
      scenes: [
        { ...defaultVisaRejectionProject.scenes[0], id: '' },
        { ...defaultVisaRejectionProject.scenes[0], id: '', durationInFrames: 0 },
      ],
    };

    const issueCodes = validateVideoProject(invalidProject).map((issue) => issue.code);

    expect(issueCodes).toEqual(expect.arrayContaining([
      'empty_project_id',
      'invalid_fps',
      'empty_scene_id',
      'duplicate_scene_id',
      'invalid_scene_duration',
    ]));
  });

  it('resolves registered templates and rejects unknown IDs', () => {
    expect(resolveVideoTemplate('advisor_cta')).toMatchObject({
      id: 'advisor_cta',
    });
    expect(resolveVideoTemplate('unknown_template')).toBeNull();
  });

  it('blocks rendering when a scene template is not registered', () => {
    const projectWithUnknownTemplate = {
      ...defaultVisaRejectionProject,
      scenes: [
        {
          ...defaultVisaRejectionProject.scenes[0],
          templateId: 'unknown_template' as never,
        },
      ],
    };

    expect(validateRenderProject(projectWithUnknownTemplate)).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'unregistered_scene_template' }),
    ]));
  });

  it('creates stable export variants from the versioned template library', () => {
    const squareProject = createPresetProject(videoTemplatePresets.visa_rejection.project, 'square');

    expect(squareProject).toMatchObject({ format: 'square', width: 1080, height: 1080 });
    expect(videoTemplatePresets.visa_rejection.version).toBe(1);
    expect(createRenderPlan(squareProject)).toMatchObject({
      outputFileName: 'visa-rejection-reel-square.mp4',
      width: 1080,
      height: 1080,
    });
  });

  it('validates timed layers against their scene duration', () => {
    const projectWithInvalidLayer = {
      ...defaultVisaRejectionProject,
      scenes: [{
        ...defaultVisaRejectionProject.scenes[0],
        layers: [{
          id: 'hook-copy',
          type: 'text' as const,
          text: 'Hook',
          timing: { startFrame: 120, durationInFrames: 60 },
        }],
      }],
    };

    expect(validateVideoProject(projectWithInvalidLayer)).toEqual(expect.arrayContaining([
      expect.objectContaining({
        code: 'invalid_layer_timing',
        sceneId: 'slide_1',
        layerId: 'hook-copy',
      }),
    ]));
  });
});
