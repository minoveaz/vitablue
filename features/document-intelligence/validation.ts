import type { DocumentFieldValidation, IdentityDocumentFields } from './types';

export const validateIdentityDocumentFields = (fields: IdentityDocumentFields): DocumentFieldValidation[] => {
  const validations: DocumentFieldValidation[] = [];
  if (fields.documentNumber && !/^[A-Z0-9-]{5,20}$/i.test(fields.documentNumber)) {
    validations.push({ field: 'documentNumber', valid: false, message: 'Revisa el formato del número de documento.' });
  }
  if (fields.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(fields.birthDate)) {
    validations.push({ field: 'birthDate', valid: false, message: 'Usa el formato AAAA-MM-DD.' });
  }
  return validations;
};