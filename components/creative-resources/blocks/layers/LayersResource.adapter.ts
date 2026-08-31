import type { CreativeResourceContext } from '../../contracts/creativeResource';
import type { LayersResourceProps } from './LayersResource.contract';

export const createLayersResourceAdapter = (
  context: CreativeResourceContext,
  props: Omit<LayersResourceProps, 'context'> = {},
): LayersResourceProps => ({ ...props, context });

