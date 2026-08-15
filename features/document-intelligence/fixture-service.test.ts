import { describe, expect, it } from 'vitest';
import { fixtureDocumentExtractionService } from './fixture-service';

describe('fixture document extraction service', () => {
  it('implements the provider-neutral extraction contract without sharing mutable data', async () => {
    const result = await fixtureDocumentExtractionService.extract({
      fileName: 'passport.jpg',
      mimeType: 'image/jpeg',
      documentReference: 'temporary-reference',
    });

    expect(result.provider).toBe('fixture');
    expect(result.classification.type).toBe('passport');
    expect(result.fields.documentNumber).toBe('P0000000');

    result.fields.documentNumber = 'EDITED';
    const secondResult = await fixtureDocumentExtractionService.extract({
      fileName: 'passport.jpg',
      mimeType: 'image/jpeg',
      documentReference: 'temporary-reference',
    });
    expect(secondResult.fields.documentNumber).toBe('P0000000');
  });
});