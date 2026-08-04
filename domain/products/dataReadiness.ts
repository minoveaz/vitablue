import { PRODUCT_INVENTORY } from './inventory';

export type DataReadinessStatus = 'verified' | 'pending' | 'needs-review';

export interface ProductDataReadiness {
  productId: string;
  sourceType: 'official-document' | 'provider-confirmation' | 'api' | 'pending';
  sourceReference?: string;
  lastVerifiedAt?: string;
  fields: {
    price: DataReadinessStatus;
    coverages: DataReadinessStatus;
    exclusions: DataReadinessStatus;
    waitingPeriods: DataReadinessStatus;
    eligibility: DataReadinessStatus;
    documents: DataReadinessStatus;
  };
  notes?: string;
}

const pendingFields = {
  price: 'pending',
  coverages: 'pending',
  exclusions: 'pending',
  waitingPeriods: 'pending',
  eligibility: 'pending',
  documents: 'pending',
} as const;

/** Readiness register. Pending is a valid state until official data is supplied. */
export const PRODUCT_DATA_READINESS: ProductDataReadiness[] = PRODUCT_INVENTORY.map((product) => ({
  productId: product.id,
  sourceType: 'pending',
  fields: { ...pendingFields },
  notes: 'Pendiente de tarifa, condicionado y confirmación oficial de la aseguradora.',
}));

export const getPendingData = () => PRODUCT_DATA_READINESS.filter((entry) =>
  Object.values(entry.fields).some((status) => status !== 'verified'),
);
