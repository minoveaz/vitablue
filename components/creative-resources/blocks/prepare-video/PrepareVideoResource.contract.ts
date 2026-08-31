import type { ResourceBlockProps } from '../ResourceBlockProps';

export interface PrepareVideoResourceItem {
  id: string;
  label: string;
  description?: string;
}

export type PrepareVideoResourceProps = ResourceBlockProps<PrepareVideoResourceItem>;

