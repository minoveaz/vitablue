import type {
  DocumentBoundingBoxes,
  DocumentExtractionResult,
  IdentityDocumentFields,
} from './types';

export interface ExtractionHistoryRecord {
  id: string;
  fileName: string;
  createdAt: string;
  fields: IdentityDocumentFields;
  rawFields: IdentityDocumentFields;
  boundingBoxes?: DocumentBoundingBoxes | null;
  usage?: DocumentExtractionResult['usage'] | null;
  hasWarnings: boolean;
}

const STORAGE_KEY = 'vitablue.document-intelligence.history';
const MAX_HISTORY_ITEMS = 25;

const readHistory = (): ExtractionHistoryRecord[] => {
  if (typeof window === 'undefined') return [];

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is ExtractionHistoryRecord => (
      typeof item === 'object'
      && item !== null
      && typeof (item as ExtractionHistoryRecord).id === 'string'
      && typeof (item as ExtractionHistoryRecord).fileName === 'string'
      && typeof (item as ExtractionHistoryRecord).createdAt === 'string'
    ));
  } catch {
    return [];
  }
};

const writeHistory = (records: ExtractionHistoryRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_HISTORY_ITEMS)));
  } catch {
    // History is a convenience and should never interrupt an extraction.
  }
};

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const getExtractionHistory = (): ExtractionHistoryRecord[] => (
  readHistory().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
);

export const getExtractionHistoryRecord = (id: string): ExtractionHistoryRecord | null => (
  readHistory().find((record) => record.id === id) ?? null
);

export const saveExtractionHistory = (record: Omit<ExtractionHistoryRecord, 'id' | 'createdAt'>) => {
  const nextRecord: ExtractionHistoryRecord = {
    ...record,
    id: createId(),
    createdAt: new Date().toISOString(),
  };
  writeHistory([nextRecord, ...readHistory()]);
  return nextRecord.id;
};

export const removeExtractionHistory = (id: string) => {
  writeHistory(readHistory().filter((record) => record.id !== id));
};
