import { validateCreativeDocument } from './schema';
import type { CreativeDocument } from './types';

export interface CreativeDocumentRecord {
  document: CreativeDocument;
  version: number;
  updatedAt: string;
}

export interface CreativeDocumentSummary {
  id: string;
  name: string;
  mode: CreativeDocument['mode'];
  version: number;
  updatedAt: string;
}

export interface CreativeDocumentStorageAdapter {
  load(id: string): Promise<CreativeDocumentRecord | null>;
  save(id: string, record: CreativeDocumentRecord, expectedVersion?: number): Promise<void>;
  list(): Promise<CreativeDocumentRecord[]>;
}

export interface CreativeDocumentRepository {
  load(id: string): Promise<CreativeDocumentRecord | null>;
  save(
    document: CreativeDocument,
    options?: { expectedVersion?: number } | number,
  ): Promise<CreativeDocumentRecord>;
  list(): Promise<CreativeDocumentSummary[]>;
}

export class CreativeDocumentRepositoryError extends Error {
  readonly code: 'invalid-document' | 'conflict' | 'storage' | 'unavailable';

  constructor(
    code: CreativeDocumentRepositoryError['code'],
    message: string,
    cause?: unknown,
  ) {
    super(message);
    this.name = 'CreativeDocumentRepositoryError';
    this.code = code;
    if (cause !== undefined) Object.defineProperty(this, 'cause', { configurable: true, value: cause });
  }
}

export class CreativeDocumentConflictError extends CreativeDocumentRepositoryError {
  readonly expectedVersion: number | undefined;
  readonly actualVersion: number;

  constructor(expectedVersion: number | undefined, actualVersion: number) {
    super('conflict', `CreativeDocument was modified (expected version ${expectedVersion ?? 'none'}, current ${actualVersion}).`);
    this.name = 'CreativeDocumentConflictError';
    this.expectedVersion = expectedVersion;
    this.actualVersion = actualVersion;
  }
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const validateRecord = (record: CreativeDocumentRecord): CreativeDocumentRecord => {
  try {
    const document = validateCreativeDocument(record.document);
    if (!Number.isInteger(record.version) || record.version < 1) {
      throw new Error('Record version must be a positive integer.');
    }
    if (typeof record.updatedAt !== 'string' || Number.isNaN(Date.parse(record.updatedAt))) {
      throw new Error('Record updatedAt must be a valid timestamp.');
    }
    return { document, version: record.version, updatedAt: record.updatedAt };
  } catch (error) {
    if (error instanceof CreativeDocumentRepositoryError) throw error;
    if (error instanceof Error && error.name === 'CreativeDocumentValidationError') {
      throw new CreativeDocumentRepositoryError('invalid-document', error.message, error);
    }
    throw new CreativeDocumentRepositoryError('storage', 'Stored CreativeDocument record is invalid.', error);
  }
};

export const createCreativeDocumentRepository = (
  adapter: CreativeDocumentStorageAdapter,
  now: () => string = () => new Date().toISOString(),
): CreativeDocumentRepository => ({
  async load(id) {
    const record = await adapter.load(id);
    return record ? clone(validateRecord(record)) : null;
  },
  async save(document, options = {}) {
    const expectedVersion = typeof options === 'number' ? options : options.expectedVersion;
    let validated: CreativeDocument;
    try {
      validated = validateCreativeDocument(document);
    } catch (error) {
      throw error instanceof Error && error.name === 'CreativeDocumentValidationError'
        ? new CreativeDocumentRepositoryError('invalid-document', error.message, error)
        : new CreativeDocumentRepositoryError('invalid-document', 'Invalid CreativeDocument.', error);
    }
    const rawCurrent = await adapter.load(validated.id);
    const current = rawCurrent ? validateRecord(rawCurrent) : null;
    if (expectedVersion !== undefined && !current) {
      throw new CreativeDocumentConflictError(expectedVersion, 0);
    }
    if (current && expectedVersion !== undefined && current.version !== expectedVersion) {
      throw new CreativeDocumentConflictError(expectedVersion, current.version);
    }
    const record: CreativeDocumentRecord = {
      document: clone(validated),
      version: (current?.version ?? 0) + 1,
      updatedAt: now(),
    };
    try {
      await adapter.save(validated.id, record, expectedVersion);
    } catch (error) {
      if (error instanceof CreativeDocumentConflictError) throw error;
      throw new CreativeDocumentRepositoryError('storage', 'Could not save CreativeDocument.', error);
    }
    return clone(record);
  },
  async list() {
    const records = await adapter.list();
    return records.map((raw) => {
      const record = validateRecord(raw);
      return {
        id: record.document.id,
        name: record.document.name,
        mode: record.document.mode,
        version: record.version,
        updatedAt: record.updatedAt,
      };
    });
  },
});

export const createMemoryCreativeDocumentStorage = (): CreativeDocumentStorageAdapter => {
  const records = new Map<string, CreativeDocumentRecord>();
  return {
    async load(id) {
      const record = records.get(id);
      return record ? clone(record) : null;
    },
    async save(id, record, expectedVersion) {
      const current = records.get(id);
      if (expectedVersion !== undefined && (current?.version ?? 0) !== expectedVersion) {
        throw new CreativeDocumentConflictError(expectedVersion, current?.version ?? 0);
      }
      records.set(id, clone(record));
    },
    async list() {
      return [...records.values()].map(clone);
    },
  };
};
