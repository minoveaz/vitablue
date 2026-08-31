import type { ResourceBlockProps } from '../ResourceBlockProps';

export interface ElementsResourceItem {
  id: string;
  label: string;
  description?: string;
}

export type ElementsResourceProps = ResourceBlockProps<ElementsResourceItem>;

