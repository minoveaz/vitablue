import type { ResourceBlockProps } from '../ResourceBlockProps';

export interface BlocksResourceItem {
  id: string;
  label: string;
  description?: string;
  blockType?: string;
}

export type BlocksResourceProps = ResourceBlockProps<BlocksResourceItem>;

