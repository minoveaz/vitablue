import type { ResourceBlockProps } from '../ResourceBlockProps';

export interface TemplatesResourceItem {
  id: string;
  label: string;
  description?: string;
  aspectRatio?: string;
}

export type TemplatesResourceProps = ResourceBlockProps<TemplatesResourceItem>;

