import { safeValidateCreativeDocument } from './schema';
import type { CreativeDocument } from './types';
import { imageProjectToCreativeDocument } from './adapters/imageProjectAdapter';
import { videoProjectToCreativeDocument } from './adapters/videoProjectAdapter';

/**
 * Persisted documents are deliberately migrated at the boundary.  Consumers
 * never need to understand an old envelope and migrations are additive: the
 * original payload is retained by the legacy adapters in `extensions.legacy`.
 */
export type CreativeDocumentSource =
  | 'creative-document'
  | 'legacy-image-project'
  | 'legacy-video-project'
  | 'legacy-envelope';

export interface CreativeDocumentMigrationResult {
  document: CreativeDocument;
  migrated: boolean;
  source: CreativeDocumentSource;
  sourceVersion?: number;
}

export class CreativeDocumentMigrationError extends Error {
  readonly code: 'unsupported-version' | 'invalid-document' | 'unknown-format';

  constructor(
    code: CreativeDocumentMigrationError['code'],
    message: string,
    cause?: unknown,
  ) {
    super(message);
    this.name = 'CreativeDocumentMigrationError';
    this.code = code;
    if (cause !== undefined) Object.defineProperty(this, 'cause', { configurable: true, value: cause });
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value));

const looksLikeCreativeDocument = (value: Record<string, unknown>): boolean =>
  'mode' in value && 'canvas' in value && 'scenes' in value;

const looksLikeImageProject = (value: Record<string, unknown>): boolean =>
  typeof value.id === 'string' && typeof value.title === 'string' && 'preset' in value && Array.isArray(value.layers);

const looksLikeVideoProject = (value: Record<string, unknown>): boolean =>
  typeof value.id === 'string' && typeof value.name === 'string' && Array.isArray(value.scenes)
    && typeof value.width === 'number' && typeof value.height === 'number';

const validate = (value: unknown): CreativeDocument => {
  const result = safeValidateCreativeDocument(value);
  if (!result.success) {
    throw new CreativeDocumentMigrationError('invalid-document', result.error.message, result.error);
  }
  return result.data;
};

/**
 * Convert any supported persisted composition to canonical CreativeDocument
 * v1.  `schemaVersion: 0` is accepted only as a legacy wrapper; there is no
 * silent lossy conversion of an unknown canonical version.
 */
export const migrateCreativeDocument = (value: unknown): CreativeDocumentMigrationResult => {
  if (!isRecord(value)) {
    throw new CreativeDocumentMigrationError('unknown-format', 'Creative composition must be a JSON object.');
  }

  if (looksLikeCreativeDocument(value)) {
    const version = value.schemaVersion;
    if (version !== 1) {
      throw new CreativeDocumentMigrationError(
        'unsupported-version',
        `Unsupported CreativeDocument schema version "${String(version)}".`,
      );
    }
    return { document: validate(value), migrated: false, source: 'creative-document', sourceVersion: 1 };
  }

  const version = typeof value.schemaVersion === 'number' ? value.schemaVersion : undefined;
  if (version !== undefined && version !== 0 && version !== 1) {
    throw new CreativeDocumentMigrationError(
      'unsupported-version',
      `Unsupported creative composition version "${version}".`,
    );
  }

  // Remote persistence envelopes use these keys.  Accept both current
  // envelope version 1 and the pre-versioned shape used by early drafts.
  if (isRecord(value.imageStudio)) {
    const document = imageProjectToCreativeDocument(value.imageStudio as never);
    return { document: validate(document), migrated: true, source: 'legacy-envelope', sourceVersion: version };
  }
  if (isRecord(value.videoStudio)) {
    const document = videoProjectToCreativeDocument(value.videoStudio as never);
    return { document: validate(document), migrated: true, source: 'legacy-envelope', sourceVersion: version };
  }

  // A v0 wrapper occasionally stored the composition under `document`.
  if (isRecord(value.document)) return migrateCreativeDocument(value.document);

  if (looksLikeImageProject(value)) {
    const document = imageProjectToCreativeDocument(value as never);
    return { document: validate(document), migrated: true, source: 'legacy-image-project', sourceVersion: version };
  }
  if (looksLikeVideoProject(value)) {
    const document = videoProjectToCreativeDocument(value as never);
    return { document: validate(document), migrated: true, source: 'legacy-video-project', sourceVersion: version };
  }

  throw new CreativeDocumentMigrationError('unknown-format', 'Unsupported creative composition format.');
};

export type SafeCreativeDocumentMigration =
  | { success: true; data: CreativeDocumentMigrationResult }
  | { success: false; error: CreativeDocumentMigrationError };

export const safeMigrateCreativeDocument = (value: unknown): SafeCreativeDocumentMigration => {
  try {
    return { success: true, data: migrateCreativeDocument(value) };
  } catch (error) {
    if (error instanceof CreativeDocumentMigrationError) return { success: false, error };
    return {
      success: false,
      error: new CreativeDocumentMigrationError('invalid-document', 'Could not migrate creative composition.', error),
    };
  }
};

/** Explicit version gate for callers that already have a canonical payload. */
export const validateCreativeDocumentVersion = (value: unknown, version = 1): CreativeDocument => {
  if (!isRecord(value) || value.schemaVersion !== version) {
    throw new CreativeDocumentMigrationError('unsupported-version', `Expected CreativeDocument schema version "${version}".`);
  }
  return validate(value);
};
