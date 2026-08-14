import { describe, expect, it } from 'vitest';
import { passportExtractionFixture } from './fixtures';
import { emptyIdentityDocumentFields } from './types';
import { validateIdentityDocumentFields } from './validation';

describe('identity document validation', () => {
  it('does not flag null optional values', () => {
    expect(validateIdentityDocumentFields(passportExtractionFixture.fields)).toEqual([]);
  });

  it('flags invalid document numbers and dates', () => {
    const fields = { ...emptyIdentityDocumentFields(), documentNumber: '??', birthDate: '12/04/1988' };

    expect(validateIdentityDocumentFields(fields)).toEqual([
      { field: 'documentNumber', valid: false, message: 'Revisa el formato del número de documento.' },
      { field: 'birthDate', valid: false, message: 'Usa el formato AAAA-MM-DD.' },
    ]);
  });
});