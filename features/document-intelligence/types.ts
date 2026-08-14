export type IdentityDocumentType =
  | 'passport'
  | 'spanish-dni'
  | 'spanish-nie'
  | 'latin-american-national-id'
  | 'unknown';

export type NullableIdentityField = string | null;

export interface IdentityDocumentFields {
  documentType: IdentityDocumentType | null;
  issuingCountry: NullableIdentityField;
  fullName: NullableIdentityField;
  givenNames: NullableIdentityField;
  surnames: NullableIdentityField;
  documentNumber: NullableIdentityField;
  birthDate: NullableIdentityField;
  nationality: NullableIdentityField;
  sex: NullableIdentityField;
  issueDate: NullableIdentityField;
  expiryDate: NullableIdentityField;
  birthplace: NullableIdentityField;
  mrz: NullableIdentityField;
}

export interface DocumentClassification {
  type: IdentityDocumentType;
  confidence: number | null;
}

export interface DocumentFieldValidation {
  field: keyof IdentityDocumentFields;
  valid: boolean;
  message: string | null;
}

export interface DocumentExtractionResult {
  classification: DocumentClassification;
  fields: IdentityDocumentFields;
  validations: DocumentFieldValidation[];
  provider: 'fixture' | 'gemini';
}

export interface DocumentExtractionRequest {
  fileName: string;
  mimeType: 'image/jpeg' | 'image/png' | 'application/pdf';
  documentReference: string;
}

export interface DocumentExtractionService {
  extract(request: DocumentExtractionRequest): Promise<DocumentExtractionResult>;
}

export const emptyIdentityDocumentFields = (): IdentityDocumentFields => ({
  documentType: null,
  issuingCountry: null,
  fullName: null,
  givenNames: null,
  surnames: null,
  documentNumber: null,
  birthDate: null,
  nationality: null,
  sex: null,
  issueDate: null,
  expiryDate: null,
  birthplace: null,
  mrz: null,
});