import {
  CreativeDocumentConflictError,
  createCreativeDocumentRepository,
  type CreativeDocument,
  type CreativeDocumentRepository,
  type CreativeDocumentStorageAdapter,
} from '../../packages/creative-document';
import type { CreativeScope } from '../contracts/creativePersistence';
import type {
  CreativeProjectRepository,
  CreativeProjectSaveInput,
} from './creativeProjectRepository';

export interface CreativeDocumentProjectDefaults {
  organizationId: string;
  workspaceId: string;
  brandId: string;
  name?: string;
  type?: CreativeProjectSaveInput['type'];
  ownerUserId?: string | null;
}

export interface CreativeDocumentProjectRepositoryOptions {
  projects: CreativeProjectRepository;
  scope: CreativeScope;
  defaults?: CreativeDocumentProjectDefaults;
  /** Optional explicit decoder for legacy draftDocument payloads. */
  legacyDocumentAdapter?: (draftDocument: Record<string, unknown>, projectId: string) => CreativeDocument | null;
}

const asDocument = (
  value: Record<string, unknown>,
  projectId: string,
  options: CreativeDocumentProjectRepositoryOptions,
): CreativeDocument =>
  options.legacyDocumentAdapter?.(value, projectId) ?? (value as unknown as CreativeDocument);

const createStorageAdapter = (
  options: CreativeDocumentProjectRepositoryOptions,
): CreativeDocumentStorageAdapter => ({
  async load(id) {
    const project = await options.projects.get(id, options.scope);
    if (!project) return null;
    return {
      document: asDocument(project.draftDocument, project.id, options),
      version: Math.max(1, project.currentVersionNumber),
      updatedAt: project.updatedAt,
    };
  },
  async save(id, record, expectedVersion) {
    const current = await options.projects.get(id, options.scope);
    if (
      current &&
      expectedVersion !== undefined &&
      current.currentVersionNumber > 0 &&
      current.currentVersionNumber !== expectedVersion
    ) {
      throw new CreativeDocumentConflictError(expectedVersion, current.currentVersionNumber);
    }
    if (!current && expectedVersion !== undefined) {
      throw new CreativeDocumentConflictError(expectedVersion, 0);
    }
    const defaults = options.defaults;
    if (!current && !defaults) {
      throw new Error('CreativeDocument project defaults are required to create a remote project.');
    }
    const input: CreativeProjectSaveInput = current
      ? {
          ...current,
          id,
          draftDocument: record.document as unknown as Record<string, unknown>,
          expectedUpdatedAt: current.updatedAt,
        }
      : {
          id,
          organizationId: defaults!.organizationId,
          workspaceId: defaults!.workspaceId,
          brandId: defaults!.brandId,
          ownerUserId: defaults!.ownerUserId ?? null,
          name: defaults!.name ?? record.document.name,
          type: defaults!.type ?? 'other',
          draftDocument: record.document as unknown as Record<string, unknown>,
        };
    await options.projects.save(input);
  },
  async list() {
    const projects = await options.projects.list(options.scope);
    return projects.map((project) => ({
      document: asDocument(project.draftDocument, project.id, options),
      version: Math.max(1, project.currentVersionNumber),
      updatedAt: project.updatedAt,
    }));
  },
});

/** Remote boundary for LoopDev's CreativeProjectRepository; the core remains backend-agnostic. */
export const createCreativeDocumentProjectRepository = (
  options: CreativeDocumentProjectRepositoryOptions,
): CreativeDocumentRepository => createCreativeDocumentRepository(createStorageAdapter(options));
