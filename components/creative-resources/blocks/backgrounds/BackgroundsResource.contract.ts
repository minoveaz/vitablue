import type { ResourceBlockProps } from '../ResourceBlockProps';

export interface BackgroundResourceItem {
  id: string;
  label: string;
  value?: string;
  description?: string;
}

export type BackgroundsResourceProps = ResourceBlockProps<BackgroundResourceItem>;

