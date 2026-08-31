import React from 'react';
import { MediaResource } from '../../../../components/creative-resources';
import type { MediaResourceAdapter } from '../../../../components/creative-resources/blocks/media/MediaResource.contract';
import type { RuntimeCreativeAsset } from '../../../utils/creativeStudioRemote';

export interface ImageStudioMediaDrawerProps {
  onInsertImageLayer: (
    imageUrl: string,
    options?: {
      title?: string;
      assetId?: string;
      width?: number;
      height?: number;
      clipShape?: 'none' | 'circle' | 'squircle' | 'rounded-2xl' | 'hexagon';
    },
  ) => void;
  onSetBackgroundImage?: (imageUrl: string) => void;
  onUploadImage?: (file: File) => Promise<RuntimeCreativeAsset>;
  onListImages?: () => Promise<RuntimeCreativeAsset[]>;
  onDeleteImage?: (asset: RuntimeCreativeAsset) => Promise<void>;
}

/** @deprecated Image and Video Studio now render the shared MediaResource block. */
export const ImageStudioMediaDrawer: React.FC<ImageStudioMediaDrawerProps> = (props) => {
  const media: MediaResourceAdapter = {
    insert: props.onInsertImageLayer,
    setBackground: props.onSetBackgroundImage,
    upload: props.onUploadImage,
    list: props.onListImages,
    delete: props.onDeleteImage
      ? async (asset) => { await props.onDeleteImage?.(asset as RuntimeCreativeAsset); }
      : undefined,
  };
  return (
    <MediaResource
      context={{
        domain: 'image',
        documentId: 'image-studio',
        capabilities: ['search', 'filter', 'insert', 'upload'],
        selection: { layerIds: [] },
        state: 'ready',
        actions: {},
        extensions: { media },
      }}
    />
  );
};
