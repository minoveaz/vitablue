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
    birthDate: '1988-04-12',
    nationality: 'ESP',
    sex: 'F',
    issueDate: null,
    expiryDate: '2030-04-11',
    birthplace: null,
    mrz: 'P<ESPSAMPLE<<MARIA<<<<<<<<<<<<<<<<<<<<<<<<',
  },
  validations: [],
  provider: 'fixture',
};