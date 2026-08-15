import type { DocumentExtractionResult } from './types';

const requiredIdentityFields = [
  ['fullName', 'nombre completo'],
  ['documentNumber', 'número de documento'],
  ['birthDate', 'fecha de nacimiento'],
] as const;

export const getDocumentExtractionWarnings = (result: DocumentExtractionResult): string[] => {
  const warnings = result.validations.filter((validation) => !validation.valid).map((validation) => validation.message ?? 'Hay un campo que requiere revisión.');
  if (result.classification.confidence !== null && result.classification.confidence < 0.8) {
    warnings.push('La confianza de la clasificación es baja. Confirma el tipo de documento.');
  }
  for (const [field, label] of requiredIdentityFields) {
    if (!result.fields[field]) warnings.push(`No se pudo extraer ${field === 'birthDate' ? 'la' : 'el'} ${label}.`);
  }
  return warnings;
};