import type { CreativeResourceBlockId, CreativeResourceDomain } from '../contracts/creativeResource';

export const CREATIVE_RESOURCE_AVAILABILITY: Readonly<Record<CreativeResourceBlockId, readonly CreativeResourceDomain[]>> = {
  text: ['image', 'video'],
  elements: ['image', 'video'],
  media: ['image', 'video'],
  layers: ['image', 'video'],
  backgrounds: ['image', 'video'],
  layout: ['image', 'video'],
  brand: ['image', 'video'],
  blocks: ['image'],
  templates: ['image'],
  'prepare-video': ['image'],
};

export const isCreativeResourceAvailable = (
  id: CreativeResourceBlockId,
  domain: CreativeResourceDomain,
): boolean => CREATIVE_RESOURCE_AVAILABILITY[id].includes(domain);
