import type { Scene } from '../../../packages/video-studio/src/domain/videoProject';
import type { CreativeResourceActions, CreativeResourceContext } from '../contracts/creativeResource';
import { CREATIVE_RESOURCE_CAPABILITIES } from '../contracts/creativeResourceCapabilities';
import type { MediaResourceAdapter } from '../blocks/media/MediaResource.contract';
import type { TextResourceAdapter } from '../blocks/text/TextResource.contract';

/**
 * Payloads stay domain-neutral at the block boundary while retaining the
 * document/scene target supplied by this adapter. The host decides how each
 * operation mutates its video project.
 */
export type VideoCreativeResourceInsertPayload = {
  readonly documentId: string;
  readonly sceneId?: string;
  readonly kind: 'text' | 'element' | 'media' | 'brand' | 'background' | 'layout';
  readonly value: unknown;
};

export type VideoCreativeResourceUpdatePayload = {
  readonly documentId: string;
  readonly sceneId?: string;
  readonly layerId?: string;
  readonly value: unknown;
};

export type VideoCreativeResourceActions = CreativeResourceActions<
  VideoCreativeResourceInsertPayload,
  VideoCreativeResourceUpdatePayload
>;

export interface VideoCreativeResourceAdapterInput {
  documentId: string;
  activeSceneId?: string;
  selectedLayerIds?: readonly string[];
  scenes?: readonly Scene[];
  capabilities?: readonly string[];
  actions?: VideoCreativeResourceActions;
  media?: MediaResourceAdapter;
  text?: TextResourceAdapter;
}

export const createVideoCreativeResourceContext = ({
  documentId,
  activeSceneId,
  selectedLayerIds = [],
  scenes,
  capabilities = [],
  actions = {},
  media,
  text,
}: VideoCreativeResourceAdapterInput): CreativeResourceContext<readonly Scene[], VideoCreativeResourceActions> => ({
  domain: 'video',
  documentId,
  capabilities: [...new Set([CREATIVE_RESOURCE_CAPABILITIES.search, CREATIVE_RESOURCE_CAPABILITIES.filter, ...capabilities])],
  selection: { layerIds: selectedLayerIds, sceneId: activeSceneId },
  state: 'ready',
  data: scenes,
  actions,
  extensions: {
    ...(media ? { media } : {}),
    ...(text ? { text } : {}),
  },
});
