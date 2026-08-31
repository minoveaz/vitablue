import {
  creativeDocumentToImageProject,
  imageProjectToCreativeDocument,
} from '../../packages/creative-document/src/adapters/imageProjectAdapter';
import { CreativeDocumentSchema } from '../../packages/creative-document/src/schema';
import { migrateCreativeDocument } from '../../packages/creative-document/src/migrations';
import type { CreativeDocument } from '../../packages/creative-document/src/types';
import type { ImageProject } from '../types/imageStudio';
import { imageStudioComposition } from './creativeStudioRemote';

export type ImagePersistenceSample = ImageProject | CreativeDocument | Record<string, unknown>;

export interface ImagePersistenceRehearsalResult {
  loaded: {
    document: CreativeDocument;
    project: ImageProject;
  };
  saved: {
    canonical: Record<string, unknown>;
    legacy: Record<string, unknown>;
  };
  reopened: {
    canonical: ImageProject;
    legacy: ImageProject;
  };
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const imageDocumentFromSample = (sample: ImagePersistenceSample): CreativeDocument => {
  const migrated = migrateCreativeDocument(sample).document;
  if (migrated.mode !== 'image' && migrated.mode !== 'mixed') {
    throw new Error(`Image persistence rehearsal received a ${migrated.mode} document.`);
  }
  return migrated;
};

const reopenImageProject = (persisted: Record<string, unknown>): ImageProject =>
  creativeDocumentToImageProject(migrateCreativeDocument(clone(persisted)).document);

/**
 * Runs the Image Studio persistence boundary without contacting Supabase.
 *
 * The JSON clone between save and reopen intentionally models a durable row:
 * it catches non-serializable state and verifies that both persisted formats
 * remain readable after a process/browser restart.
 */
export const rehearseImageStudioPersistence = (
  sample: ImagePersistenceSample,
): ImagePersistenceRehearsalResult => {
  const document = imageDocumentFromSample(sample);
  const loaded = creativeDocumentToImageProject(document);
  const canonicalDocument = CreativeDocumentSchema.parse(
    imageProjectToCreativeDocument(loaded),
  ) as CreativeDocument;
  const saved = {
    canonical: clone(canonicalDocument) as unknown as Record<string, unknown>,
    legacy: clone(imageStudioComposition(loaded, 'legacy')),
  };

  return {
    loaded: { document, project: loaded },
    saved,
    reopened: {
      canonical: reopenImageProject(saved.canonical),
      legacy: reopenImageProject(saved.legacy),
    },
  };
};
