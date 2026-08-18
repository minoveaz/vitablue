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
  firstSurname?: NullableIdentityField;
  secondSurname?: NullableIdentityField;
  documentNumber: NullableIdentityField;
  birthDate: NullableIdentityField;
  nationality: NullableIdentityField;
  sex: NullableIdentityField;
  issueDate: NullableIdentityField;
  expiryDate: NullableIdentityField;
  birthplace: NullableIdentityField;
  supportNumber?: NullableIdentityField;
  address?: NullableIdentityField;
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

export interface DocumentExtractionUsage {
  promptTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export type BoundingBox = [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalizado 0..1000

export type DocumentBoundingBoxes = Partial<Record<keyof IdentityDocumentFields, BoundingBox>>;

export interface DocumentExtractionResult {
  classification: DocumentClassification;
  fields: IdentityDocumentFields;
  rawFields?: IdentityDocumentFields;
  boundingBoxes?: DocumentBoundingBoxes | null;
  validations: DocumentFieldValidation[];
  provider: 'fixture' | 'gemini';
  usage?: DocumentExtractionUsage;
}

export interface DocumentExtractionRequest {
  fileName: string;
  mimeType: 'image/jpeg' | 'image/png' | 'application/pdf';
  documentReference: string;
  backFileName?: string;
  backMimeType?: 'image/jpeg' | 'image/png' | 'application/pdf';
  backDocumentReference?: string;
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
  firstSurname: null,
  secondSurname: null,
  documentNumber: null,
  birthDate: null,
  nationality: null,
  sex: null,
  issueDate: null,
  expiryDate: null,
  birthplace: null,
  supportNumber: null,
  address: null,
  mrz: null,
});