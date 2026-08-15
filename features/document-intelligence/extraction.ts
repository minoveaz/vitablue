import type { DocumentExtractionRequest, DocumentExtractionResult, DocumentExtractionService } from './types';

export const extractDocumentWithTimeout = async (
  service: DocumentExtractionService,
  request: DocumentExtractionRequest,
  timeoutMs: number,
): Promise<DocumentExtractionResult> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      service.extract(request),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('DOCUMENT_EXTRACTION_TIMEOUT')), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};