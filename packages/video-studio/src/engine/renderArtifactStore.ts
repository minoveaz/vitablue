import { unlink } from 'node:fs/promises';
import path from 'node:path';

export interface RenderArtifactStore {
  resolve(fileName: string): string;
  remove(fileName: string): Promise<void>;
}

export interface LocalRenderArtifactStoreOptions {
  directory?: string;
  removeFile?: (filePath: string) => Promise<void>;
}

export const createLocalRenderArtifactStore = (
  options: LocalRenderArtifactStoreOptions = {},
): RenderArtifactStore => {
  const directory = path.resolve(options.directory ?? 'out');
  const removeFile = options.removeFile ?? (async (filePath: string) => {
    await unlink(filePath).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error;
    });
  });

  return {
    resolve(fileName) {
      const resolved = path.resolve(directory, fileName);
      if (resolved !== directory && !resolved.startsWith(`${directory}${path.sep}`)) {
        throw new Error('Render artifact path escapes its storage directory.');
      }
      return resolved;
    },
    async remove(fileName) {
      await removeFile(this.resolve(fileName));
    },
  };
};