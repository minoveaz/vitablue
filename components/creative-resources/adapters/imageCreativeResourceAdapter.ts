import type { ImageProject } from '../../../marketing-studio/types/imageStudio';
import type { CreativeResourceActions, CreativeResourceContext } from '../contracts/creativeResource';
import { CREATIVE_RESOURCE_CAPABILITIES } from '../contracts/creativeResourceCapabilities';
import type { MediaResourceAdapter } from '../blocks/media/MediaResource.contract';
import type { TextResourceAdapter, TextResourceItem } from '../blocks/text/TextResource.contract';
import { getSavedCustomElements } from '../../../marketing-studio/utils/savedElementsStorage';

export interface ImageCreativeResourceAdapterInput {
  project: ImageProject;
  selectedLayerIds?: readonly string[];
  capabilities?: readonly string[];
  actions?: CreativeResourceActions<any, any>;
  media?: MediaResourceAdapter;
  text?: TextResourceAdapter;
}

const getSavedTextPresets = (): readonly TextResourceItem[] =>
  getSavedCustomElements()
    .filter((element) => element.category === 'text')
    .map((element) => ({
      id: element.id,
      title: element.title,
      category: 'basics',
      previewText: String(element.layer.props?.text ?? element.layer.title),
      subText: '⭐ Guardado en tu kit de diseños',
      defaultText: String(element.layer.props?.text ?? element.layer.title),
      tag: (element.layer.props?.tag as TextResourceItem['tag']) ?? 'h2',
      fontSize: element.layer.fontSize ?? 36,
      fontWeight: (element.layer.fontWeight as TextResourceItem['fontWeight']) ?? '700',
      fontFamily: element.layer.fontFamily ?? 'Poppins, sans-serif',
      fill: element.layer.fill ?? '#FFFFFF',
      align: element.layer.align ?? 'center',
      letterSpacing: element.layer.letterSpacing,
      lineHeight: element.layer.lineHeight,
      textEffect: element.layer.textEffect,
      boxColor: element.layer.boxColor,
      scope: 'user',
    }));

export const createImageCreativeResourceContext = ({
  project,
  selectedLayerIds = [],
  capabilities = [],
  actions = {},
  media,
  text,
}: ImageCreativeResourceAdapterInput): CreativeResourceContext<ImageProject, CreativeResourceActions<any, any>> => ({
  domain: 'image',
  documentId: project.id,
  capabilities: [...new Set([CREATIVE_RESOURCE_CAPABILITIES.search, CREATIVE_RESOURCE_CAPABILITIES.filter, ...capabilities])],
  selection: { layerIds: selectedLayerIds },
  state: 'ready',
  data: project,
  actions,
  extensions: {
    ...(media ? { media } : {}),
    text: text ?? { getSavedPresets: getSavedTextPresets },
  },
});
