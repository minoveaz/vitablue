import { describe, expect, it } from 'vitest';
import { passportExtractionFixture } from './fixtures';
import { emptyIdentityDocumentFields } from './types';
import {
  normalizeDateToDDMMAAAA,
  normalizeIdentityDocumentDates,
  validateIdentityDocumentFields,
} from './validation';

describe('identity document validation', () => {
  it('does not flag null optional values or valid DD/MM/AAAA dates', () => {
    expect(validateIdentityDocumentFields(passportExtractionFixture.fields)).toEqual([]);
  });

  it('flags invalid document numbers and non-DD/MM/AAAA dates', () => {
    const fields = { ...emptyIdentityDocumentFields(), documentNumber: '??', birthDate: '1988-04-12' };

    expect(validateIdentityDocumentFields(fields)).toEqual([
      { field: 'documentNumber', valid: false, message: 'Revisa el formato del número de documento.' },
      { field: 'birthDate', valid: false, message: 'Usa el formato DD/MM/AAAA.' },
    ]);
  });

  it('normalizes various date formats into DD/MM/AAAA', () => {
    expect(normalizeDateToDDMMAAAA('1988-04-12')).toBe('12/04/1988');
    expect(normalizeDateToDDMMAAAA('1988/4/12')).toBe('12/04/1988');
    expect(normalizeDateToDDMMAAAA('12-04-1988')).toBe('12/04/1988');
    expect(normalizeDateToDDMMAAAA('12.04.1988')).toBe('12/04/1988');
    expect(normalizeDateToDDMMAAAA('12/04/1988')).toBe('12/04/1988');
    expect(normalizeDateToDDMMAAAA('19880412')).toBe('12/04/1988');
    expect(normalizeDateToDDMMAAAA(null)).toBeNull();
  });

  it('normalizes all date fields in identity document object', () => {
    const raw = {
      ...emptyIdentityDocumentFields(),
      birthDate: '1988-04-12',
      issueDate: '2020-01-15',
      expiryDate: '2030-01-14',
    };
    const normalized = normalizeIdentityDocumentDates(raw);
    expect(normalized.birthDate).toBe('12/04/1988');
    expect(normalized.issueDate).toBe('15/01/2020');
    expect(normalized.expiryDate).toBe('14/01/2030');
  });
});