import React from 'react';
import type { ReactNode } from 'react';
import type { CreativeResourceBlockId, CreativeResourceDomain } from '../contracts/creativeResource';
import { CreativeResourceRegistry } from './CreativeResourceRegistry';
import { CORE_CREATIVE_RESOURCE_IDS } from './creativeResourceTabs';

export type CreativeResourceRailSection = 'core' | 'extensions';

export interface CreativeResourceRailItem {
  readonly id: CreativeResourceBlockId;
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly badge?: ReactNode;
  readonly section?: CreativeResourceRailSection;
  readonly sectionLabel?: string;
}

export interface CreativeResourceToolRailOptions {
  readonly domain: CreativeResourceDomain;
  readonly layerCount?: ReactNode;
}

/**
 * Builds the shared core rail from registry metadata. Hosts append their
 * domain-specific extension items, keeping the selection UI identical.
 */
export const createCreativeResourceToolRail = ({
  domain,
  layerCount,
}: CreativeResourceToolRailOptions): readonly CreativeResourceRailItem[] =>
  CORE_CREATIVE_RESOURCE_IDS
    .map((id) => CreativeResourceRegistry.get(id))
    .filter((entry): entry is NonNullable<typeof entry> =>
      Boolean(entry && CreativeResourceRegistry.isAvailable(entry.id, domain)),
    )
    .map((entry) => ({
      id: entry.id,
      label: entry.label,
      icon: React.createElement(entry.icon, { className: 'size-4', 'aria-hidden': true }),
      badge: entry.id === 'layers' ? layerCount : undefined,
      section: 'core' as const,
    }));
