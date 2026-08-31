import type { ResourceBlockProps } from '../ResourceBlockProps';

export interface LayoutResourceItem {
  id: string;
  label: string;
  description?: string;
}

export type LayoutResourceProps = ResourceBlockProps<LayoutResourceItem>;

