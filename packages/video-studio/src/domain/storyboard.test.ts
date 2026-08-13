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
import { RenderJobStore, runRenderJob } from '../engine/renderJobs';
import { createLocalRenderExecutor } from '../engine/localRenderExecutor';
import { LocalRenderJobApi } from '../engine/localRenderJobApi';
import { createRenderHttpServer } from '../engine/renderHttpServer';

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

  it('tracks a render job through progress and completion', () => {
    const store = new RenderJobStore();
    const created = store.create({ project: defaultVisaRejectionProject });
    expect(created).toMatchObject({ status: 'pending', progress: 0, outputFileName: 'visa-rejection-reel-vertical.mp4' });

    store.start(created.id);
    expect(store.updateProgress(created.id, 42)).toMatchObject({ status: 'rendering', progress: 42 });
    expect(store.complete(created.id, 'out/video.mp4')).toMatchObject({ status: 'completed', progress: 100, outputPath: 'out/video.mp4' });
  });

  it('rejects jobs over duration and concurrency limits', () => {
    const limitedStore = new RenderJobStore({ maxDurationInFrames: 100, maxProjectBytes: 1_000_000, maxConcurrentJobs: 1 });
    expect(() => limitedStore.create({ project: defaultVisaRejectionProject })).toThrow('maximum duration');

    const store = new RenderJobStore();
    const first = store.create({ project: defaultVisaRejectionProject });
    expect(() => store.create({ project: defaultVisaRejectionProject })).toThrow('concurrency limit');
    store.start(first.id);
    expect(() => store.fail(first.id, 'Chromium unavailable')).not.toThrow();
    expect(store.get(first.id)).toMatchObject({ status: 'failed', error: 'Chromium unavailable' });
  });

  it('keeps execution separate from job state', async () => {
    const store = new RenderJobStore();
    const job = store.create({ project: defaultVisaRejectionProject });
    let receivedProjectId = '';
    const completed = await runRenderJob(store, job.id, {
      execute: async (_renderJob, onProgress, context) => {
        receivedProjectId = context?.project.id ?? '';
        onProgress(50);
        return { outputFileName: 'worker-output.mp4' };
      },
    });

    expect(completed).toMatchObject({ status: 'completed', progress: 100 });
    expect(receivedProjectId).toBe(defaultVisaRejectionProject.id);
  });

  it('converts executor failures into failed jobs', async () => {
    const store = new RenderJobStore();
    const job = store.create({ project: defaultVisaRejectionProject });
    const failed = await runRenderJob(store, job.id, {
      execute: async () => { throw new Error('Worker failed'); },
    });

    expect(failed).toMatchObject({ status: 'failed', error: 'Worker failed' });
  });

  it('lists jobs and cancels work before it starts', () => {
    const store = new RenderJobStore();
    const job = store.create({ project: defaultVisaRejectionProject });

    expect(store.list()).toHaveLength(1);
    expect(store.cancel(job.id)).toMatchObject({ status: 'cancelled' });
    expect(() => store.start(job.id)).toThrow('Only pending render jobs can start');
  });

  it('removes finished jobs and purges them by completion date', () => {
    const store = new RenderJobStore();
    const job = store.create({ project: defaultVisaRejectionProject });
    store.cancel(job.id);

    expect(() => store.remove(job.id)).not.toThrow();
    expect(store.get(job.id)).toBeNull();

    const secondJob = store.create({ project: defaultVisaRejectionProject });
    store.cancel(secondJob.id);
    expect(store.purgeCompleted(new Date(Date.now() + 1_000))).toEqual([secondJob.id]);
    expect(store.get(secondJob.id)).toBeNull();
  });

  it('creates a local executor with deterministic Remotion arguments', () => {
    const calls: string[][] = [];
    const executor = createLocalRenderExecutor({
      entryPoint: 'custom-entry.ts',
      outputDirectory: 'tmp',
      remotionBinary: 'remotion-cli',
      run: async (_binary, args) => { calls.push(args); },
    });

    return executor.execute({
      id: 'render-1', projectId: defaultVisaRejectionProject.id, format: 'landscape', status: 'rendering',
      progress: 0, outputFileName: 'output.mp4', createdAt: new Date().toISOString(),
    }, () => {}, { project: defaultVisaRejectionProject }).then(() => {
      expect(calls[0]).toEqual(expect.arrayContaining([
        'render', 'custom-entry.ts', 'ReelVisaRejectionLandscape', 'tmp/output.mp4', '--props',
      ]));
      expect(JSON.parse(calls[0][calls[0].length - 1])).toEqual({ slides: defaultVisaRejectionProject.scenes });
    });
  });

  it('runs and removes a job through the local API', async () => {
    const removedPaths: string[] = [];
    const api = new LocalRenderJobApi({
      executor: {
        execute: async () => ({ outputFileName: 'render.mp4' }),
      },
      artifacts: {
        resolve: (fileName) => `out/${fileName}`,
        remove: async (fileName) => { removedPaths.push(fileName); },
      },
    });
    const created = api.create(defaultVisaRejectionProject);
    const completed = await api.run(created.id);
    expect(completed.status).toBe('completed');
    expect(completed.outputPath).toBe('render.mp4');
    await api.remove(created.id);
    expect(removedPaths).toEqual(['render.mp4']);
    expect(api.get(created.id)).toBeNull();
  });

  it('exposes create and get through the local HTTP API', async () => {
    const api = new LocalRenderJobApi({
      executor: { execute: async () => ({ outputFileName: 'render.mp4' }) },
    });
    const httpApi = createRenderHttpServer({ api, port: 18787 });
    await httpApi.start();
    try {
      const response = await fetch('http://127.0.0.1:18787/render-jobs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ project: defaultVisaRejectionProject }),
      });
      expect(response.status).toBe(202);
      const created = await response.json() as { id: string };
      const statusResponse = await fetch(`http://127.0.0.1:18787/render-jobs/${created.id}`);
      expect(statusResponse.status).toBe(200);
    } finally {
      await httpApi.stop();
    }
  });
});
