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
    if (error) throw new Error('Document extraction request failed');
    if (!data || isExtractionError(data)) throw new Error(data?.error || 'Document extraction failed');
    return data as DocumentExtractionResult;
  },
});

export const uploadAndExtractDocument = async (
  file: File,
  userId: string,
  service: DocumentExtractionService = createSupabaseDocumentExtractionService(),
  client: SupabaseDocumentClient = supabase,
): Promise<DocumentExtractionResult> => {
  const path = createStoragePath(userId, file.name);
  const { error: uploadError } = await client.storage
    .from(DOCUMENT_INTELLIGENCE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) throw new Error('Document upload failed');

  try {
    return await service.extract({
      fileName: file.name,
      mimeType: file.type as DocumentExtractionRequest['mimeType'],
      documentReference: path,
    });
  } finally {
    await client.storage.from(DOCUMENT_INTELLIGENCE_BUCKET).remove([path]);
  }
};