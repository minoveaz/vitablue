import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { RenderExecutor, RenderExecutionContext, RenderJob } from './renderJobs';

const execFileAsync = promisify(execFile);

export interface LocalRenderExecutorOptions {
  entryPoint?: string;
  outputDirectory?: string;
  remotionBinary?: string;
  run?: (binary: string, args: string[]) => Promise<void>;
}

const compositionByFormat = {
  vertical: 'ReelVisaRejection',
  square: 'ReelVisaRejectionSquare',
  landscape: 'ReelVisaRejectionLandscape',
} as const;

export const createLocalRenderExecutor = (
  options: LocalRenderExecutorOptions = {},
): RenderExecutor => ({
  async execute(job: RenderJob, onProgress, context?: RenderExecutionContext) {
    const entryPoint = options.entryPoint ?? 'src/index.ts';
    const compositionId = compositionByFormat[job.format];
    const outputDirectory = options.outputDirectory ?? 'out';
    const remotionBinary = options.remotionBinary ?? './node_modules/.bin/remotion';
    const outputPath = `${outputDirectory}/${job.outputFileName}`;

    const args = ['render', entryPoint, compositionId, outputPath];
    if (context) args.push('--props', JSON.stringify({ slides: context.project.scenes }));

    onProgress(1);
    if (options.run) {
      await options.run(remotionBinary, args);
    } else {
      await execFileAsync(remotionBinary, args, { maxBuffer: 10 * 1024 * 1024 });
    }
    onProgress(99);
    return { outputFileName: job.outputFileName };
  },
});