import type { DocumentFieldValidation, IdentityDocumentFields } from './types';

export const isDDMMAAAA = (value: string): boolean => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [dayStr, monthStr, yearStr] = value.split('/');
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  return true;
};

export const normalizeDateToDDMMAAAA = (value: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Already DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    return trimmed;
  }

  // YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
  const ymdMatch = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymdMatch) {
    const [, yyyy, mm, dd] = ymdMatch;
    return `${dd.padStart(2, '0')}/${mm.padStart(2, '0')}/${yyyy}`;
  }

  // DD-MM-YYYY or DD.MM.YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[-.](\d{1,2})[-.](\d{4})$/);
  if (dmyMatch) {
    const [, dd, mm, yyyy] = dmyMatch;
    return `${dd.padStart(2, '0')}/${mm.padStart(2, '0')}/${yyyy}`;
  }

  // D/M/YYYY or DD/M/YYYY or D/MM/YYYY
  const dmySlashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmySlashMatch) {
    const [, dd, mm, yyyy] = dmySlashMatch;
    return `${dd.padStart(2, '0')}/${mm.padStart(2, '0')}/${yyyy}`;
  }

  // YYYYMMDD (8 digits)
  const numeric8Match = trimmed.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (numeric8Match) {
    const [, yyyy, mm, dd] = numeric8Match;
    return `${dd}/${mm}/${yyyy}`;
  }

  // DDMMYYYY (8 digits)
  const ddmmyyyyMatch = trimmed.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, dd, mm, yyyy] = ddmmyyyyMatch;
    return `${dd}/${mm}/${yyyy}`;
  }

  return trimmed;
};

export const normalizeIdentityDocumentDates = (
  fields: IdentityDocumentFields,
): IdentityDocumentFields => ({
  ...fields,
  birthDate: normalizeDateToDDMMAAAA(fields.birthDate),
  issueDate: normalizeDateToDDMMAAAA(fields.issueDate),
  expiryDate: normalizeDateToDDMMAAAA(fields.expiryDate),
});

export const validateIdentityDocumentFields = (fields: IdentityDocumentFields): DocumentFieldValidation[] => {
  const validations: DocumentFieldValidation[] = [];
  if (fields.documentNumber && !/^[A-Z0-9-]{5,20}$/i.test(fields.documentNumber)) {
    validations.push({ field: 'documentNumber', valid: false, message: 'Revisa el formato del número de documento.' });
  }
  if (fields.birthDate && !isDDMMAAAA(fields.birthDate)) {
    validations.push({ field: 'birthDate', valid: false, message: 'Usa el formato DD/MM/AAAA.' });
  }
  if (fields.issueDate && !isDDMMAAAA(fields.issueDate)) {
    validations.push({ field: 'issueDate', valid: false, message: 'Usa el formato DD/MM/AAAA.' });
  }
  if (fields.expiryDate && !isDDMMAAAA(fields.expiryDate)) {
    validations.push({ field: 'expiryDate', valid: false, message: 'Usa el formato DD/MM/AAAA.' });
  }
  return validations;
};