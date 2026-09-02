/**
 * Backwards-compatible media API.
 *
 * The repository in imagePersistence.ts owns IndexedDB, legacy migration,
 * media references and the render cache.  This module intentionally contains
 * no second storage implementation.
 */
import {
  getImageMediaReference,
  getStoredImageMediaAsync as loadStoredImageMediaAsync,
  getStoredImageMediaSync,
  IMAGE_MEDIA_REFERENCE_PREFIX,
  IMAGE_MEDIA_STORAGE_KEY,
  IMAGE_MEDIA_UPDATED_EVENT,
  isImageMediaPersisted,
  resolveImageMediaReference,
  resolveImageMediaReferenceAsync,
  saveUploadedImageMediaAsync as persistUploadedImageMediaAsync,
  saveUploadedImageMediaSync,
  deleteImageMedia,
  type UploadedImageMedia,
  MAX_IMAGE_MEDIA_BYTES,
  MAX_IMAGE_MEDIA_ITEM_BYTES,
} from './imagePersistence';

export type { UploadedImageMedia };
export {
  IMAGE_MEDIA_STORAGE_KEY,
  IMAGE_MEDIA_UPDATED_EVENT,
  IMAGE_MEDIA_REFERENCE_PREFIX,
  MAX_IMAGE_MEDIA_BYTES,
  MAX_IMAGE_MEDIA_ITEM_BYTES,
  isImageMediaPersisted,
  getImageMediaReference,
  resolveImageMediaReference,
  resolveImageMediaReferenceAsync,
};

/**
 * Synchronous compatibility accessor for existing render/UI integrations.
 * New initialization paths should await getStoredImageMediaAsync().
 */
export function getStoredImageMedia(): UploadedImageMedia[] {
  return getStoredImageMediaSync();
}

export async function getStoredImageMediaAsync(): Promise<UploadedImageMedia[]> {
  return loadStoredImageMediaAsync();
}

/**
 * Preserve the historical synchronous return shape.  The cache is updated
 * immediately, while the canonical transaction runs in the background.
 */
export function saveUploadedImageMedia(
  dataUrl: string,
  metadata: { title: string; fileName: string; mimeType: string },
): {
  media: UploadedImageMedia | null;
  persisted: boolean;
  error?: string;
  warning?: string;
} {
  return saveUploadedImageMediaSync(dataUrl, metadata);
}

export async function saveUploadedImageMediaAsync(
  dataUrl: string,
  metadata: { title: string; fileName: string; mimeType: string },
): Promise<{
  media: UploadedImageMedia | null;
  persisted: boolean;
  error?: string;
  warning?: string;
}> {
  return persistUploadedImageMediaAsync(dataUrl, metadata);
}

export { saveUploadedImageMediaAsync as saveUploadedImageMediaDurably };

export function deleteStoredImageMedia(id: string): void {
  void deleteImageMedia(id).catch((error) => {
    console.warn('Could not delete uploaded image media:', error);
  });
}

export async function deleteStoredImageMediaAsync(id: string): Promise<void> {
  const result = await deleteImageMedia(id);
  if (!result.durable && result.error) throw result.error;
}

export { getStoredImageMedia as getStoredImageMediaSnapshot };
