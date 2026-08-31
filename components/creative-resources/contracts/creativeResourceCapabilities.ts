export const CREATIVE_RESOURCE_CAPABILITIES = {
  insert: 'insert',
  update: 'update',
  remove: 'remove',
  select: 'select',
  search: 'search',
  filter: 'filter',
  reorder: 'reorder',
  duplicate: 'duplicate',
  upload: 'upload',
  prepareVideo: 'prepare-video',
} as const;

export type CreativeResourceCapability =
  (typeof CREATIVE_RESOURCE_CAPABILITIES)[keyof typeof CREATIVE_RESOURCE_CAPABILITIES];

