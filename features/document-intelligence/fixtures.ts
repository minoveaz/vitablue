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
    firstSurname: 'SAMPLE',
    secondSurname: null,
    documentNumber: 'P0000000',
    birthDate: '12/04/1988',
    nationality: 'ESP',
    sex: 'F',
    issueDate: null,
    expiryDate: '11/04/2030',
    birthplace: null,
    mrz: 'P<ESPSAMPLE<<MARIA<<<<<<<<<<<<<<<<<<<<<<<<',
  },
  boundingBoxes: {
    documentNumber: [600, 320, 650, 480],
    surnames: [270, 320, 310, 620],
    firstSurname: [270, 320, 310, 620],
    givenNames: [340, 320, 380, 520],
    nationality: [410, 320, 450, 560],
    birthDate: [480, 320, 520, 620],
    sex: [550, 320, 590, 400],
    expiryDate: [620, 320, 660, 620],
    mrz: [780, 60, 910, 940],
  },
  validations: [],
  provider: 'fixture',
};