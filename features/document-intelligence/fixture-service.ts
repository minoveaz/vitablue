import { passportExtractionFixture } from './fixtures';
import type { DocumentExtractionRequest, DocumentExtractionResult, DocumentExtractionService } from './types';

export const fixtureDocumentExtractionService: DocumentExtractionService = {
  async extract(_request: DocumentExtractionRequest): Promise<DocumentExtractionResult> {
    return {
      ...passportExtractionFixture,
      classification: { ...passportExtractionFixture.classification },
      fields: { ...passportExtractionFixture.fields },
      validations: [...passportExtractionFixture.validations],
    };
  },
};