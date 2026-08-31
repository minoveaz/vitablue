import type { ResourceBlockProps } from '../ResourceBlockProps';

export interface BrandKitResourceItem {
  id: string;
  label: string;
  description?: string;
  kind?: 'logo' | 'color' | 'font' | 'component' | 'image';
}

export type BrandKitResourceProps = ResourceBlockProps<BrandKitResourceItem>;

