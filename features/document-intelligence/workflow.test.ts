import { describe, expect, it } from 'vitest';
import { passportExtractionFixture } from './fixtures';
import { getDocumentExtractionWarnings } from './workflow';

describe('document extraction workflow warnings', () => {
  it('returns no warnings for a complete high-confidence result', () => {
    expect(getDocumentExtractionWarnings(passportExtractionFixture)).toEqual([]);
  });

  it('reports low confidence, invalid fields, and missing required values', () => {
    const result = {
      ...passportExtractionFixture,
      classification: { ...passportExtractionFixture.classification, confidence: 0.4 },
      fields: { ...passportExtractionFixture.fields, fullName: null, birthDate: null },
      validations: [{ field: 'documentNumber' as const, valid: false, message: 'Número no válido.' }],
    };

    expect(getDocumentExtractionWarnings(result)).toEqual([
      'Número no válido.',
      'La confianza de la clasificación es baja. Confirma el tipo de documento.',
      'No se pudo extraer el nombre completo.',
      'No se pudo extraer la fecha de nacimiento.',
    ]);
  });
});