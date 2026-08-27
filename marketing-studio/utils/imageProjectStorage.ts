/**
 * Compatibility facade for the Image Studio project API.
 *
 * All durable work is implemented by imagePersistence.ts.  The synchronous
 * functions remain for older integrations and update the repository's
 * in-memory render cache immediately; editor and hub code use the async
 * variants when transaction completion matters.
 */
import type { ImageProject } from '../types/imageStudio';
import { IMAGE_FORMAT_PRESETS } from '../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from './imageTemplates';
import {
  clearImageRecovery,
  deleteImageProject,
  getRecoveryImageProjectAsync,
  getRecoveryImageProjectSync,
  getStoredImageProjectsAsync as loadStoredImageProjectsAsync,
  getStoredImageProjectsSync,
  initializeImagePersistence,
  persistImageProject,
  persistImageRecovery,
  normalizeStoredProject,
  serializeStoredProject,
  IMAGE_PROJECTS_UPDATED_EVENT,
  IMAGE_RECOVERY_UPDATED_EVENT,
  IMAGE_STUDIO_RECOVERY_KEY,
  IMAGE_STUDIO_STORAGE_KEY,
  type ImageRecoverySnapshot,
  type PersistResult,
  type SaveProjectOptions,
} from './imagePersistence';
import { defaultMotionBrandTokens } from '../../packages/video-studio/src/motion-kit';
import { createDefaultLayoutMetadata } from '../../packages/video-studio/src/domain/layoutConstraints';

export {
  IMAGE_PROJECTS_UPDATED_EVENT,
  IMAGE_RECOVERY_UPDATED_EVENT,
  IMAGE_STUDIO_STORAGE_KEY,
  IMAGE_STUDIO_RECOVERY_KEY,
  normalizeStoredProject,
  serializeStoredProject,
  initializeImagePersistence,
};
export type { ImageRecoverySnapshot, PersistResult, SaveProjectOptions };

export function getStoredImageProjects(): ImageProject[] {
  return getStoredImageProjectsSync();
}

export async function getStoredImageProjectsAsync(): Promise<ImageProject[]> {
  return loadStoredImageProjectsAsync();
}

export function getUserSavedImageProjects(): ImageProject[] {
  const systemTemplateIds = new Set(INITIAL_IMAGE_TEMPLATES.map((template) => template.id));
  return getStoredImageProjects().filter((project) => !systemTemplateIds.has(project.id));
}

export async function getUserSavedImageProjectsAsync(): Promise<ImageProject[]> {
  const systemTemplateIds = new Set(INITIAL_IMAGE_TEMPLATES.map((template) => template.id));
  return (await getStoredImageProjectsAsync()).filter(
    (project) => !systemTemplateIds.has(project.id),
  );
}

export async function saveStoredImageProjectAsync(
  project: ImageProject,
  options: SaveProjectOptions = {},
): Promise<ImageProject> {
  const result = await persistImageProject(project, {
    ...options,
    touchUpdatedAt: options.touchUpdatedAt ?? true,
  });
  if (!result.durable) {
    throw result.error ?? new Error('No se pudo guardar el proyecto.');
  }
  return result.value;
}

/**
 * Historical API.  It never made callers await a storage operation, so keep
 * it non-throwing while returning a promise for callers that want to observe
 * completion.
 */
export function saveStoredImageProject(project: ImageProject): Promise<ImageProject> {
  return saveStoredImageProjectAsync(project, { touchUpdatedAt: true }).catch((error) => {
    if ((error as { code?: string })?.code !== 'unavailable') {
      console.warn('Could not durably save image project:', error);
    }
    return normalizeStoredProject(project);
  });
}

export function getRecoveryImageProject(): ImageRecoverySnapshot | null {
  return getRecoveryImageProjectSync();
}

export async function getAsyncRecoveryImageProject(): Promise<ImageRecoverySnapshot | null> {
  return getRecoveryImageProjectAsync();
}

export async function saveRecoveryImageProjectAsync(
  project: ImageProject,
): Promise<ImageRecoverySnapshot> {
  const result = await persistImageRecovery(project);
  if (!result.durable) {
    throw result.error ?? new Error('No se pudo guardar la recuperación.');
  }
  return result.value;
}

export function saveRecoveryImageProject(project: ImageProject): Promise<ImageRecoverySnapshot | null> {
  return saveRecoveryImageProjectAsync(project).catch((error) => {
    if ((error as { code?: string })?.code !== 'unavailable') {
      console.warn('Could not durably save image recovery:', error);
    }
    return null;
  });
}

export async function clearRecoveryImageProjectAsync(): Promise<void> {
  const result = await clearImageRecovery();
  if (!result.durable && result.error) throw result.error;
}

export function clearRecoveryImageProject(): void {
  void clearRecoveryImageProjectAsync().catch((error) => {
    if ((error as { code?: string })?.code !== 'unavailable') {
      console.warn('Could not clear image recovery:', error);
    }
  });
}

export async function deleteStoredImageProjectAsync(id: string): Promise<void> {
  const result = await deleteImageProject(id);
  if (!result.durable && result.error) throw result.error;
}

export function deleteStoredImageProject(id: string): void {
  void deleteStoredImageProjectAsync(id).catch((error) => {
    if ((error as { code?: string })?.code !== 'unavailable') {
      console.warn('Could not delete image project:', error);
    }
  });
}

const createProjectId = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const cloneProject = (project: ImageProject): ImageProject =>
  JSON.parse(JSON.stringify(project)) as ImageProject;

const createProjectFromTemplate = (template: ImageProject, title?: string): ImageProject => {
  const now = new Date().toISOString();
  return {
    ...cloneProject(template),
    id: createProjectId('project'),
    title: title?.trim() || `${template.title} (Nuevo)`,
    createdAt: now,
    updatedAt: now,
  };
};

const duplicateProject = (target: ImageProject): ImageProject => ({
  ...cloneProject(target),
  id: createProjectId('project'),
  title: `${target.title} (Copia)`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function duplicateStoredImageProject(id: string): ImageProject | null {
  const target = getStoredImageProjects().find((project) => project.id === id);
  if (!target) return null;
  const duplicated = duplicateProject(target);
  void saveStoredImageProject(duplicated);
  return duplicated;
}

export async function duplicateStoredImageProjectAsync(
  id: string,
): Promise<ImageProject | null> {
  const target = (await getStoredImageProjectsAsync()).find((project) => project.id === id);
  if (!target) return null;
  const duplicated = duplicateProject(target);
  return saveStoredImageProjectAsync(duplicated, { touchUpdatedAt: false });
}

export function createImageProjectFromTemplate(
  template: ImageProject,
  title?: string,
): ImageProject {
  const project = createProjectFromTemplate(template, title);
  void saveStoredImageProject(project);
  return project;
}

export async function createImageProjectFromTemplateAsync(
  template: ImageProject,
  title?: string,
): Promise<ImageProject> {
  const project = createProjectFromTemplate(template, title);
  return saveStoredImageProjectAsync(project, { touchUpdatedAt: false });
}

const buildBlankImageProject = (
  presetId: string,
  title?: string,
  projectId?: string,
): ImageProject => {
  const preset = IMAGE_FORMAT_PRESETS.find((item) => item.id === presetId) ?? IMAGE_FORMAT_PRESETS[0];
  const timestamp = new Date().toISOString();
  return {
    id: projectId ?? createProjectId('project'),
    title: title || `Nuevo Diseño ${preset.name} (${preset.aspectRatio})`,
    preset,
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 25%, rgba(0, 95, 115, 0.75) 0%, #001219 80%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layout: createDefaultLayoutMetadata(),
    layers: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const createBlankImageProjectDraft = buildBlankImageProject;

export function createBlankImageProject(
  presetId: string,
  title?: string,
  projectId?: string,
): ImageProject {
  const blank = buildBlankImageProject(presetId, title, projectId);
  void saveStoredImageProject(blank);
  return blank;
}

export async function createBlankImageProjectAsync(
  presetId: string,
  title?: string,
  projectId?: string,
): Promise<ImageProject> {
  const blank = buildBlankImageProject(presetId, title, projectId);
  return saveStoredImageProjectAsync(blank, { touchUpdatedAt: false });
}
