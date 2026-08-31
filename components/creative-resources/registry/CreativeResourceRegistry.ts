import type { ComponentType } from 'react';
import type {
  CreativeResourceBlockId,
  CreativeResourceComponentProps,
  CreativeResourceDomain,
} from '../contracts/creativeResource';
import { BlocksResource } from '../blocks/blocks/BlocksResource';
import { BrandKitResource } from '../blocks/brand-kit/BrandKitResource';
import { BackgroundsResource } from '../blocks/backgrounds/BackgroundsResource';
import { ElementsResource } from '../blocks/elements/ElementsResource';
import { LayersResource } from '../blocks/layers/LayersResource';
import { LayoutResource } from '../blocks/layout/LayoutResource';
import { MediaResource } from '../blocks/media/MediaResource';
import { PrepareVideoResource } from '../blocks/prepare-video/PrepareVideoResource';
import { TemplatesResource } from '../blocks/templates/TemplatesResource';
import { TextResource } from '../blocks/text/TextResource';
import { CREATIVE_RESOURCE_CATALOG, type CreativeResourceMetadata } from './creativeResourceCatalog';
import { isCreativeResourceAvailable } from './creativeResourceAvailability';

export interface CreativeResourceRegistryEntry extends CreativeResourceMetadata {
  readonly resolve: () => ComponentType<CreativeResourceComponentProps>;
}

const COMPONENTS: Readonly<Record<CreativeResourceBlockId, ComponentType<CreativeResourceComponentProps>>> = {
  text: TextResource,
  elements: ElementsResource,
  media: MediaResource,
  layers: LayersResource,
  backgrounds: BackgroundsResource,
  layout: LayoutResource,
  brand: BrandKitResource,
  blocks: BlocksResource,
  templates: TemplatesResource,
  'prepare-video': PrepareVideoResource,
};

export class CreativeResourceRegistryStore {
  private readonly entries: ReadonlyMap<CreativeResourceBlockId, CreativeResourceRegistryEntry>;

  constructor(catalog = CREATIVE_RESOURCE_CATALOG) {
    this.entries = new Map(catalog.map((metadata) => [
      metadata.id,
      { ...metadata, resolve: () => COMPONENTS[metadata.id] },
    ]));
  }

  list(domain?: CreativeResourceDomain): readonly CreativeResourceRegistryEntry[] {
    return [...this.entries.values()]
      .filter((entry) => !domain || entry.availableDomains.includes(domain))
      .sort((a, b) => a.order - b.order);
  }

  get(id: CreativeResourceBlockId): CreativeResourceRegistryEntry | undefined {
    return this.entries.get(id);
  }

  isAvailable(id: CreativeResourceBlockId, domain: CreativeResourceDomain): boolean {
    return isCreativeResourceAvailable(id, domain);
  }

  resolve(id: CreativeResourceBlockId, domain?: CreativeResourceDomain): ComponentType<CreativeResourceComponentProps> | undefined {
    const entry = this.get(id);
    if (!entry || (domain && !entry.availableDomains.includes(domain))) return undefined;
    return entry.resolve();
  }
}

export const CreativeResourceRegistry = new CreativeResourceRegistryStore();

