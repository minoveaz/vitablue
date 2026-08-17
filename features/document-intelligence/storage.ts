const DB_NAME = 'vitablue_document_intelligence_db';
const DB_VERSION = 1;
const STORE_NAME = 'document_files';
const DOCUMENT_KEY = 'active_document';

type StoredDocumentRecord = {
  id: string;
  name: string;
  type: string;
  lastModified: number;
  data: Blob;
};

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveDocumentToStorage = async (file: File): Promise<void> => {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record: StoredDocumentRecord = {
        id: DOCUMENT_KEY,
        name: file.name,
        type: file.type,
        lastModified: file.lastModified,
        data: file,
      };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not persist document locally:', err);
  }
};

export const loadDocumentFromStorage = async (): Promise<File | null> => {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(DOCUMENT_KEY);
      req.onsuccess = () => {
        const record = req.result as StoredDocumentRecord | undefined;
        if (!record || !record.data) {
          resolve(null);
          return;
        }
        const file = new File([record.data], record.name, {
          type: record.type,
          lastModified: record.lastModified,
        });
        resolve(file);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
};

export const clearDocumentFromStorage = async (): Promise<void> => {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(DOCUMENT_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore cleanup error
  }
};
