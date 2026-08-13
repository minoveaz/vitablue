import type { VideoProject } from '../domain/videoProject';
import { createLocalRenderArtifactStore, type RenderArtifactStore } from './renderArtifactStore';
import { RenderJobStore, runRenderJob, type RenderExecutor, type RenderJob, type RenderJobLimits } from './renderJobs';

export interface LocalRenderJobApiOptions {
  executor: RenderExecutor;
  limits?: RenderJobLimits;
  artifacts?: RenderArtifactStore;
}

export class LocalRenderJobApi {
  private readonly store: RenderJobStore;
  private readonly artifacts: RenderArtifactStore;
  private readonly executor: RenderExecutor;

  constructor(options: LocalRenderJobApiOptions) {
    this.store = new RenderJobStore(options.limits);
    this.artifacts = options.artifacts ?? createLocalRenderArtifactStore();
    this.executor = options.executor;
  }

  create(project: VideoProject, format?: VideoProject['format']): RenderJob {
    return this.store.create({ project, format });
  }

  get(id: string): RenderJob | null {
    return this.store.get(id);
  }

  list(): RenderJob[] {
    return this.store.list();
  }

  cancel(id: string): RenderJob {
    return this.store.cancel(id);
  }

  async run(id: string): Promise<RenderJob> {
    return runRenderJob(this.store, id, this.executor);
  }

  async remove(id: string): Promise<void> {
    const job = this.store.get(id);
    if (!job) throw new Error(`Render job "${id}" was not found.`);
    if (job.outputPath) await this.artifacts.remove(job.outputPath);
    this.store.remove(id);
  }

  async purge(before: Date): Promise<string[]> {
    const jobs = this.store.list();
    const removable = jobs.filter((job) => (
      (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled')
      && new Date(job.completedAt ?? job.createdAt) < before
    ));
    for (const job of removable) {
      if (job.outputPath) await this.artifacts.remove(job.outputPath);
    }
    return this.store.purgeCompleted(before);
  }
}