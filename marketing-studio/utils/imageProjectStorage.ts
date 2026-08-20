import { ImageProject, IMAGE_FORMAT_PRESETS } from '../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from './imageTemplates';
import { defaultMotionBrandTokens } from '../../packages/video-studio/src/motion-kit';

export const IMAGE_STUDIO_STORAGE_KEY = 'vitablue_image_studio_projects';

let inMemoryCache: ImageProject[] = [...INITIAL_IMAGE_TEMPLATES];

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
      localStorage.setItem(IMAGE_STUDIO_STORAGE_KEY, JSON.stringify(INITIAL_IMAGE_TEMPLATES));
      inMemoryCache = [...INITIAL_IMAGE_TEMPLATES];
      return INITIAL_IMAGE_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      inMemoryCache = parsed;
      return parsed;
    }
    localStorage.setItem(IMAGE_STUDIO_STORAGE_KEY, JSON.stringify(INITIAL_IMAGE_TEMPLATES));
    inMemoryCache = [...INITIAL_IMAGE_TEMPLATES];
    return INITIAL_IMAGE_TEMPLATES;
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
    layers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveStoredImageProject(blank);
  return blank;
}
