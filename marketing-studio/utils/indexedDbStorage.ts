/**
 * Compatibility exports for callers that used the old low-level adapter.
 *
 * Image Studio persistence now lives in imagePersistence.ts.  Keeping these
 * names avoids breaking integrations while ensuring there is only one
 * IndexedDB connection, schema and transaction implementation.
 */
import type { ImageProject } from '../types/imageStudio';
import type { UploadedImageMedia, ImageRecoverySnapshot } from './imagePersistence';
import {
  clearImageRecovery,
  deleteImageMedia,
  deleteImageProject,
  getRecoveryImageProjectAsync,
  getStoredImageMediaAsync,
  getStoredImageProjectsAsync,
  initializeImagePersistence,
  persistImageProject,
  persistImageRecovery,
  saveImageMedia,
} from './imagePersistence';

export {
  IMAGE_PERSISTENCE_DB_NAME as DB_NAME,
  IMAGE_PERSISTENCE_DB_VERSION as DB_VERSION,
  IMAGE_PERSISTENCE_STORE_PROJECTS as STORE_PROJECTS,
  IMAGE_PERSISTENCE_STORE_RECOVERY as STORE_RECOVERY,
  IMAGE_PERSISTENCE_STORE_MEDIA as STORE_MEDIA,
  openImageStudioDatabase,
  runImageStudioTransaction,
  closeImageStudioDatabase,
  deleteImageStudioDatabase,
  ImagePersistenceError,
  resetImagePersistenceForTests,
} from './imagePersistence';

export async function idbGetAllMedia(): Promise<UploadedImageMedia[]> {
  return getStoredImageMediaAsync();
}

export async function idbSaveMedia(media: UploadedImageMedia[]): Promise<void> {
  await Promise.all(media.map((item) => saveImageMedia(item)));
}

export async function idbDeleteMedia(id: string): Promise<void> {
  const result = await deleteImageMedia(id);
  if (!result.durable && result.error) throw result.error;
}

export async function idbSaveProject(project: ImageProject): Promise<void> {
  const result = await persistImageProject(project, { touchUpdatedAt: false });
  if (!result.durable && result.error) throw result.error;
}

export async function idbGetAllProjects(): Promise<ImageProject[]> {
  return getStoredImageProjectsAsync();
}

export async function idbGetProject(id: string): Promise<ImageProject | null> {
  const projects = await getStoredImageProjectsAsync();
  return projects.find((project) => project.id === id) ?? null;
}

export async function idbDeleteProject(id: string): Promise<void> {
  const result = await deleteImageProject(id);
  if (!result.durable && result.error) throw result.error;
}

export async function idbSaveRecovery(project: ImageProject): Promise<void> {
  const result = await persistImageRecovery(project);
  if (!result.durable && result.error) throw result.error;
}

export async function idbGetRecovery(): Promise<ImageRecoverySnapshot | null> {
  return getRecoveryImageProjectAsync();
}

export async function idbClearRecovery(): Promise<void> {
  const result = await clearImageRecovery();
  if (!result.durable && result.error) throw result.error;
}

export { initializeImagePersistence };
