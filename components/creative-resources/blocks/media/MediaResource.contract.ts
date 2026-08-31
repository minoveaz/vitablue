import type { ResourceBlockProps } from '../ResourceBlockProps';

export type MediaClipShape = 'none' | 'circle' | 'squircle' | 'rounded-2xl' | 'hexagon';

export interface MediaResourceItem {
  id: string;
  label: string;
  src?: string;
  kind?: 'image' | 'video' | 'audio';
  description?: string;
}

export interface MediaResourceAsset {
  id: string;
  name: string;
  signedUrl: string;
  storagePath?: string;
  kind?: 'image' | 'video' | 'audio';
}

export interface MediaInsertOptions {
  title?: string;
  assetId?: string;
  width?: number;
  height?: number;
  clipShape?: MediaClipShape;
  kind?: MediaResourceAsset['kind'];
}

export interface MediaResourceAdapter {
  insert?: (source: string, options?: MediaInsertOptions) => void;
  setBackground?: (source: string) => void;
  upload?: (file: File) => Promise<MediaResourceAsset>;
  list?: () => Promise<MediaResourceAsset[]>;
  delete?: (asset: MediaResourceAsset) => Promise<void>;
  accept?: string;
  validateFile?: (file: File) => string | undefined;
}

export type MediaResourceProps = ResourceBlockProps<MediaResourceItem>;
