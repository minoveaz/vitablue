import type { DocumentExtractionResult } from './types';

export const passportExtractionFixture: DocumentExtractionResult = {
  classification: {
    type: 'passport',
    confidence: 0.98,
  },
  fields: {
    documentType: 'passport',
    issuingCountry: 'ESP',
    fullName: 'MARIA SAMPLE',
    givenNames: 'MARIA',
    surnames: 'SAMPLE',
    documentNumber: 'P0000000',
    birthDate: '12/04/1988',
    nationality: 'ESP',
    sex: 'F',
    issueDate: null,
    expiryDate: '11/04/2030',
    birthplace: null,
    mrz: 'P<ESPSAMPLE<<MARIA<<<<<<<<<<<<<<<<<<<<<<<<',
  },
  validations: [],
  provider: 'fixture',
};