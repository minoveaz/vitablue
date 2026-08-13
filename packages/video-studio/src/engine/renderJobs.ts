import type { VideoFormat, VideoProject } from '../domain/videoProject';
import { getProjectDurationInFrames } from '../domain/storyboard';
import { createRenderPlan } from './renderService';

export type RenderJobStatus = 'pending' | 'rendering' | 'completed' | 'failed' | 'cancelled';

export interface RenderJobLimits {
  maxDurationInFrames: number;
  maxProjectBytes: number;
  maxConcurrentJobs: number;
}

export interface RenderJobRequest {
  project: VideoProject;
  format?: VideoFormat;
}

export interface RenderJob {
  id: string;
  projectId: string;
  format: VideoFormat;
  status: RenderJobStatus;
  progress: number;
  outputFileName: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  outputPath?: string;
}

export interface RenderExecutor {
  execute(job: RenderJob, onProgress: (progress: number) => void, context?: RenderExecutionContext): Promise<{ outputFileName: string }>;
}

export interface RenderExecutionContext {
  project: VideoProject;
}

export const runRenderJob = async (
  store: RenderJobStore,
  jobId: string,
  executor: RenderExecutor,
): Promise<RenderJob> => {
  store.start(jobId);
  const job = store.get(jobId);
  if (!job) throw new Error(`Render job "${jobId}" was not found.`);

  try {
    const result = await executor.execute(job, (progress) => store.updateProgress(jobId, progress), {
      project: store.getProject(jobId),
    });
    return store.complete(jobId, result.outputFileName);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown render error.';
    return store.fail(jobId, message);
  }
};

export const defaultRenderJobLimits: RenderJobLimits = {
  maxDurationInFrames: 30 * 60,
  maxProjectBytes: 1_000_000,
  maxConcurrentJobs: 1,
};

const estimateProjectBytes = (project: VideoProject): number => new TextEncoder().encode(JSON.stringify(project)).byteLength;

export class RenderJobStore {
  private readonly jobs = new Map<string, RenderJob>();
  private readonly projects = new Map<string, VideoProject>();
  private sequence = 0;

  constructor(private readonly limits: RenderJobLimits = defaultRenderJobLimits) {}

  create(request: RenderJobRequest): RenderJob {
    const durationInFrames = getProjectDurationInFrames(request.project);
    if (durationInFrames > this.limits.maxDurationInFrames) {
      throw new Error('Render job exceeds the maximum duration.');
    }
    if (estimateProjectBytes(request.project) > this.limits.maxProjectBytes) {
      throw new Error('Render job exceeds the maximum project size.');
    }
    const activeJobs = [...this.jobs.values()].filter((job) => job.status === 'pending' || job.status === 'rendering');
    if (activeJobs.length >= this.limits.maxConcurrentJobs) {
      throw new Error('Render job concurrency limit reached.');
    }

    const plan = createRenderPlan(request.project, request.format ?? request.project.format);
    const id = `render-${++this.sequence}`;
    const job: RenderJob = {
      id,
      projectId: plan.projectId,
      format: request.format ?? request.project.format,
      status: 'pending',
      progress: 0,
      outputFileName: plan.outputFileName,
      createdAt: new Date().toISOString(),
    };
    this.jobs.set(id, job);
    this.projects.set(id, request.project);
    return { ...job };
  }

  get(id: string): RenderJob | null {
    const job = this.jobs.get(id);
    return job ? { ...job } : null;
  }

  getProject(id: string): VideoProject {
    const project = this.projects.get(id);
    if (!project) throw new Error(`Render project for job "${id}" was not found.`);
    return project;
  }

  list(): RenderJob[] {
    return [...this.jobs.values()].map((job) => ({ ...job }));
  }

  cancel(id: string): RenderJob {
    const job = this.requireJob(id);
    if (job.status !== 'pending') throw new Error('Only pending render jobs can be cancelled.');
    job.status = 'cancelled';
    job.completedAt = new Date().toISOString();
    return { ...job };
  }

  start(id: string): RenderJob {
    const job = this.requireJob(id);
    if (job.status !== 'pending') throw new Error('Only pending render jobs can start.');
    job.status = 'rendering';
    job.startedAt = new Date().toISOString();
    return { ...job };
  }

  complete(id: string, outputPath?: string): RenderJob {
    const job = this.requireJob(id);
    if (job.status !== 'rendering') throw new Error('Only rendering jobs can complete.');
    job.status = 'completed';
    job.progress = 100;
    job.outputPath = outputPath;
    job.completedAt = new Date().toISOString();
    return { ...job };
  }

  fail(id: string, error: string): RenderJob {
    const job = this.requireJob(id);
    if (job.status !== 'rendering') throw new Error('Only rendering jobs can fail.');
    job.status = 'failed';
    job.error = error;
    job.completedAt = new Date().toISOString();
    return { ...job };
  }

  updateProgress(id: string, progress: number): RenderJob {
    const job = this.requireJob(id);
    if (job.status !== 'rendering') throw new Error('Only rendering jobs can report progress.');
    job.progress = Math.max(0, Math.min(99, Math.round(progress)));
    return { ...job };
  }

  remove(id: string): void {
    const job = this.requireJob(id);
    if (job.status === 'rendering') throw new Error('Rendering jobs cannot be removed.');
    this.jobs.delete(id);
    this.projects.delete(id);
  }

  purgeCompleted(before: Date): string[] {
    const removedIds: string[] = [];
    for (const job of this.jobs.values()) {
      if ((job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled')
        && new Date(job.completedAt ?? job.createdAt) < before) {
        removedIds.push(job.id);
        this.jobs.delete(job.id);
        this.projects.delete(job.id);
      }
    }
    return removedIds;
  }

  private requireJob(id: string): RenderJob {
    const job = this.jobs.get(id);
    if (!job) throw new Error(`Render job "${id}" was not found.`);
    return job;
  }
}