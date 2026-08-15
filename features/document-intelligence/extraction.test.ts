import { describe, expect, it } from 'vitest';
import { passportExtractionFixture } from './fixtures';
import { extractDocumentWithTimeout } from './extraction';
import type { DocumentExtractionService } from './types';

const request = { fileName: 'passport.jpg', mimeType: 'image/jpeg' as const, documentReference: 'temporary-reference' };

describe('document extraction timeout boundary', () => {
  it('returns the service result when it completes in time', async () => {
    const service: DocumentExtractionService = { extract: async () => passportExtractionFixture };
    await expect(extractDocumentWithTimeout(service, request, 50)).resolves.toEqual(passportExtractionFixture);
  });

  it('rejects when the service exceeds the timeout', async () => {
    const service: DocumentExtractionService = { extract: () => new Promise(() => {}) };
    await expect(extractDocumentWithTimeout(service, request, 1)).rejects.toThrow('DOCUMENT_EXTRACTION_TIMEOUT');
  });
});