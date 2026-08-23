import { supabase } from '@/marketing-studio/utils/supabaseClient';
import type { DocumentExtractionRequest, DocumentExtractionResult, DocumentExtractionService } from './types';

export const DOCUMENT_INTELLIGENCE_BUCKET = 'document-intelligence-temp';

type SupabaseDocumentClient = {
  storage: {
    from: (bucket: string) => {
      upload: (path: string, file: File, options: { contentType: string; upsert: boolean }) => Promise<{ error: Error | null }>;
      remove: (paths: string[]) => Promise<{ error: Error | null }>;
    };
  };
  functions: {
    invoke: (name: string, options: { body: DocumentExtractionRequest }) => Promise<{ data: DocumentExtractionResult | { error?: string } | null; error: Error | null }>;
  };
};

const isExtractionError = (data: DocumentExtractionResult | { error?: string } | null): data is { error?: string } => (
  Boolean(data && 'error' in data)
);

const createStoragePath = (userId: string, fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || 'bin';
  return `${userId}/${crypto.randomUUID()}.${extension}`;
};

export const createSupabaseDocumentExtractionService = (
  client: SupabaseDocumentClient = supabase,
): DocumentExtractionService => ({
  async extract(request: DocumentExtractionRequest): Promise<DocumentExtractionResult> {
    const { data, error } = await client.functions.invoke('extract-identity-document', { body: request });
    if (error) {
      let serverMessage = '';
      if ('context' in error && error.context && typeof error.context === 'object') {
        const ctx = error.context as { json?: () => Promise<{ error?: string }>; response?: Response };
        if (typeof ctx.json === 'function') {
          try {
            const body = await ctx.json();
            serverMessage = body?.error || '';
          } catch {
            // ignore
          }
        }
      }
      const message = serverMessage || (data && isExtractionError(data) ? data.error : null) || error.message || 'Document extraction request failed';
      throw new Error(message);
    }
    if (!data || isExtractionError(data)) throw new Error(data?.error || 'Document extraction failed');
    return data as DocumentExtractionResult;
  },
});

export const uploadAndExtractDualDocument = async (
  frontFile: File,
  backFile: File | null | undefined,
  userId: string,
  service: DocumentExtractionService = createSupabaseDocumentExtractionService(),
  client: SupabaseDocumentClient = supabase,
): Promise<DocumentExtractionResult> => {
  const frontPath = createStoragePath(userId, frontFile.name);
  const { error: frontUploadError } = await client.storage
    .from(DOCUMENT_INTELLIGENCE_BUCKET)
    .upload(frontPath, frontFile, { contentType: frontFile.type, upsert: false });

  if (frontUploadError) throw new Error('Document upload failed');

  let backPath: string | undefined;
  if (backFile) {
    backPath = createStoragePath(userId, backFile.name);
    const { error: backUploadError } = await client.storage
      .from(DOCUMENT_INTELLIGENCE_BUCKET)
      .upload(backPath, backFile, { contentType: backFile.type, upsert: false });

    if (backUploadError) {
      await client.storage.from(DOCUMENT_INTELLIGENCE_BUCKET).remove([frontPath]);
      throw new Error('Document upload failed');
    }
  }

  try {
    return await service.extract({
      fileName: frontFile.name,
      mimeType: frontFile.type as DocumentExtractionRequest['mimeType'],
      documentReference: frontPath,
      ...(backFile && backPath
        ? {
            backFileName: backFile.name,
            backMimeType: backFile.type as DocumentExtractionRequest['mimeType'],
            backDocumentReference: backPath,
          }
        : {}),
    });
  } finally {
    const pathsToRemove = [frontPath, ...(backPath ? [backPath] : [])];
    await client.storage.from(DOCUMENT_INTELLIGENCE_BUCKET).remove(pathsToRemove);
  }
};

export const uploadAndExtractDocument = async (
  file: File,
  userId: string,
  service: DocumentExtractionService = createSupabaseDocumentExtractionService(),
  client: SupabaseDocumentClient = supabase,
): Promise<DocumentExtractionResult> => (
  uploadAndExtractDualDocument(file, null, userId, service, client)
);