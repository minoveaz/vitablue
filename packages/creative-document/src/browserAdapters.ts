import {
  createCreativeDocumentRepository,
  CreativeDocumentConflictError,
  CreativeDocumentRepositoryError,
  type CreativeDocumentRecord,
  type CreativeDocumentRepository,
  type CreativeDocumentStorageAdapter,
} from './repository';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const createLocalStorageCreativeDocumentStorage = (
  storage: StorageLike | undefined,
  key = 'vitablue_creative_documents',
): CreativeDocumentStorageAdapter => {
  const read = (): Record<string, CreativeDocumentRecord> => {
    if (!storage) throw new CreativeDocumentRepositoryError('unavailable', 'localStorage is not available.');
    const raw = storage.getItem(key);
    if (!raw) return {};
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Expected an object.');
      return parsed as Record<string, CreativeDocumentRecord>;
    } catch (error) {
      throw new CreativeDocumentRepositoryError('storage', 'Stored creative documents are corrupt.', error);
    }
  };
  const write = (records: Record<string, CreativeDocumentRecord>): void => {
    if (!storage) throw new CreativeDocumentRepositoryError('unavailable', 'localStorage is not available.');
    try {
      storage.setItem(key, JSON.stringify(records));
    } catch (error) {
      throw new CreativeDocumentRepositoryError('storage', 'Could not write creative documents.', error);
    }
  };
  return {
    async load(id) {
      const record = read()[id];
      return record ? clone(record) : null;
    },
    async save(id, record, expectedVersion) {
      const records = read();
      const current = records[id];
      if (expectedVersion !== undefined && (current?.version ?? 0) !== expectedVersion) {
        throw new CreativeDocumentConflictError(expectedVersion, current?.version ?? 0);
      }
      records[id] = clone(record);
      write(records);
    },
    async list() {
      return Object.values(read()).map(clone);
    },
  };
};

export const createLocalCreativeDocumentRepository = (
  storage?: StorageLike,
  key?: string,
): CreativeDocumentRepository => {
  const resolvedStorage = storage ?? (
    typeof localStorage !== 'undefined' ? localStorage : undefined
  );
  return createCreativeDocumentRepository(createLocalStorageCreativeDocumentStorage(resolvedStorage, key));
};
