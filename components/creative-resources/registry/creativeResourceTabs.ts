import type { ReactNode } from 'react';
import type { ResourceTab } from '../shared/ResourceTabs';
import type { CreativeResourceBlockId, CreativeResourceDomain } from '../contracts/creativeResource';
import { CreativeResourceRegistry } from './CreativeResourceRegistry';

/**
 * The only navigation contract shared by Image Studio and Video Studio.
 * Domain extensions must be rendered in a separate ResourceTabs instance.
 */
export const CORE_CREATIVE_RESOURCE_IDS = [
  'text',
  'elements',
  'media',
  'layers',
  'backgrounds',
  'layout',
  'brand',
] as const satisfies readonly CreativeResourceBlockId[];

export type CoreCreativeResourceId = (typeof CORE_CREATIVE_RESOURCE_IDS)[number];

export const CORE_CREATIVE_RESOURCE_TABS: readonly ResourceTab[] =
  CORE_CREATIVE_RESOURCE_IDS.map((id) => {
    const entry = CreativeResourceRegistry.get(id);
    if (!entry) throw new Error(`Missing creative resource metadata for ${id}`);
    return {
      id,
      label: entry.label,
      icon: entry.icon,
      panelId: `creative-resource-panel-${id}`,
    };
  });

export interface CoreCreativeResourceTabOptions {
  readonly layerCount?: ReactNode;
  readonly domain?: CreativeResourceDomain;
}

export const createCoreCreativeResourceTabs = ({
  layerCount,
  domain,
}: CoreCreativeResourceTabOptions = {}): readonly ResourceTab[] =>
  CORE_CREATIVE_RESOURCE_TABS
    .filter((tab) => !domain || CreativeResourceRegistry.isAvailable(tab.id as CreativeResourceBlockId, domain))
    .map((tab) => tab.id === 'layers' && layerCount !== undefined ? { ...tab, badge: layerCount } : tab);
