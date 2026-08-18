import type { IdentityDocumentFields } from './types';

export type FieldKey = keyof IdentityDocumentFields;

export const FIELD_LABELS: Array<{
  key: FieldKey;
  label: string;
  fullWidth?: boolean;
  isMonospace?: boolean;
}> = [
  { key: 'fullName', label: 'Nombre completo', fullWidth: true },
  { key: 'givenNames', label: 'Nombre(s)' },
  { key: 'firstSurname', label: 'Primer apellido' },
  { key: 'secondSurname', label: 'Segundo apellido' },
  { key: 'surnames', label: 'Apellidos (Completo)' },
  { key: 'documentNumber', label: 'Número de documento' },
  { key: 'supportNumber', label: 'Número de soporte (IDESP)' },
  { key: 'birthDate', label: 'Fecha de nacimiento' },
  { key: 'nationality', label: 'Nacionalidad' },
  { key: 'sex', label: 'Sexo' },
  { key: 'issueDate', label: 'Fecha de expedición' },
  { key: 'expiryDate', label: 'Fecha de caducidad' },
  { key: 'birthplace', label: 'Lugar de nacimiento' },
  { key: 'address', label: 'Domicilio / Dirección', fullWidth: true },
  { key: 'mrz', label: 'Código MRZ (Machine Readable Zone)', fullWidth: true, isMonospace: true },
];

export function getFieldLabel(key: FieldKey): string {
  return FIELD_LABELS.find((f) => f.key === key)?.label ?? String(key);
}
