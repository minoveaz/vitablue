import type { ResourceBlockProps } from '../ResourceBlockProps';

export interface LayersResourceItem {
  id: string;
  label: string;
  visible?: boolean;
  locked?: boolean;
  description?: string;
}

export type LayersResourceProps = ResourceBlockProps<LayersResourceItem>;

