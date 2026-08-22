import { ImageProject, IMAGE_FORMAT_PRESETS } from '../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from './imageTemplates';
import { defaultMotionBrandTokens } from '../../packages/video-studio/src/motion-kit';
import { createDefaultLayoutMetadata } from '../../packages/video-studio/src/domain/layoutConstraints';

export const IMAGE_STUDIO_STORAGE_KEY = 'vitablue_image_studio_projects';
export const IMAGE_STUDIO_RECOVERY_KEY = 'vitablue_image_studio_recovery';

let inMemoryCache: ImageProject[] = INITIAL_IMAGE_TEMPLATES.map((project) => ({
  ...project,
  layout: createDefaultLayoutMetadata(),
}));

const normalizeStoredProject = (project: ImageProject): ImageProject => ({
  ...project,
  layout: {
    ...createDefaultLayoutMetadata(),
    ...(project.layout ?? {}),
  },
});

/**
 * Retrieves all stored image projects from localStorage.
 * If none exist, seeds the storage with INITIAL_IMAGE_TEMPLATES.
 */
export function getStoredImageProjects(): ImageProject[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return inMemoryCache;
  }

  try {
    const raw = localStorage.getItem(IMAGE_STUDIO_STORAGE_KEY);
    if (!raw) {
      const seeded = INITIAL_IMAGE_TEMPLATES.map(normalizeStoredProject);
      localStorage.setItem(IMAGE_STUDIO_STORAGE_KEY, JSON.stringify(seeded));
      inMemoryCache = seeded;
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Si hay nuevas plantillas oficiales que no existen en el almacenamiento local, las agregamos al inicio
      const normalizedParsed = parsed.map(normalizeStoredProject);
      const existingIds = new Set(normalizedParsed.map((p: ImageProject) => p.id));
      const missingInitialTemplates = INITIAL_IMAGE_TEMPLATES.filter((t) => !existingIds.has(t.id));
      if (missingInitialTemplates.length > 0) {
        const merged = [...missingInitialTemplates.map(normalizeStoredProject), ...normalizedParsed];
        localStorage.setItem(IMAGE_STUDIO_STORAGE_KEY, JSON.stringify(merged));
        inMemoryCache = merged;
        return merged;
      }
      inMemoryCache = normalizedParsed;
      return normalizedParsed;
    }
    const seeded = INITIAL_IMAGE_TEMPLATES.map(normalizeStoredProject);
    localStorage.setItem(IMAGE_STUDIO_STORAGE_KEY, JSON.stringify(seeded));
    inMemoryCache = seeded;
    return seeded;
  } catch (error) {
    console.error('Error loading image studio projects from localStorage:', error);
    return inMemoryCache;
  }
}

/**
 * Retrieves only user-created, user-modified or duplicated projects (excludes system initial templates).
 */
export function getUserSavedImageProjects(): ImageProject[] {
  const all = getStoredImageProjects();
  const systemTemplateIds = new Set(INITIAL_IMAGE_TEMPLATES.map((t) => t.id));
  return all.filter((p) => !systemTemplateIds.has(p.id));
}

/**
 * Saves or updates a project in localStorage.
 */
export function saveStoredImageProject(project: ImageProject): void {
  const projects = getStoredImageProjects();
  const existingIndex = projects.findIndex((p) => p.id === project.id);
  const updated = {
    ...project,
    updatedAt: new Date().toISOString(),
  };

  let nextProjects: ImageProject[];
  if (existingIndex >= 0) {
    nextProjects = [...projects];
    nextProjects[existingIndex] = updated;
  } else {
    nextProjects = [updated, ...projects];
  }

  inMemoryCache = nextProjects;

  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(IMAGE_STUDIO_STORAGE_KEY, JSON.stringify(nextProjects));
    } catch (error) {
      console.error('Error saving image studio project to localStorage:', error);
    }
  }
}

export function saveRecoveryImageProject(project: ImageProject): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(IMAGE_STUDIO_RECOVERY_KEY, JSON.stringify({ project, savedAt: new Date().toISOString() }));
  } catch (error) {
    console.error('Error saving image studio recovery snapshot:', error);
  }
}

export function getRecoveryImageProject(): { project: ImageProject; savedAt: string } | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(IMAGE_STUDIO_RECOVERY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.project && parsed?.savedAt ? parsed : null;
  } catch {
    return null;
  }
}

export function clearRecoveryImageProject(): void {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(IMAGE_STUDIO_RECOVERY_KEY);
  }
}

/**
 * Deletes a project from localStorage by ID.
 */
export function deleteStoredImageProject(id: string): void {
  const projects = getStoredImageProjects();
  const filtered = projects.filter((p) => p.id !== id);
  inMemoryCache = filtered;

  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(IMAGE_STUDIO_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting image studio project from localStorage:', error);
    }
  }
}

/**
 * Duplicates an existing project with a new ID and timestamp.
 */
export function duplicateStoredImageProject(id: string): ImageProject | null {
  const projects = getStoredImageProjects();
  const target = projects.find((p) => p.id === id);
  if (!target) return null;

  const duplicated: ImageProject = {
    ...target,
    id: `project-${Date.now()}`,
    title: `${target.title} (Copia)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveStoredImageProject(duplicated);
  return duplicated;
}

/**
 * Creates a new blank project for a given format preset.
 */
export function createBlankImageProject(presetId: string, title?: string): ImageProject {
  const preset = IMAGE_FORMAT_PRESETS.find((p) => p.id === presetId) ?? IMAGE_FORMAT_PRESETS[0];

  const blank: ImageProject = {
    id: `project-${Date.now()}`,
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveStoredImageProject(blank);
  return blank;
}
