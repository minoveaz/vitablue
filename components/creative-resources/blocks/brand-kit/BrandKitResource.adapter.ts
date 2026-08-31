import type { CreativeResourceContext } from '../../contracts/creativeResource';
import type { BrandKitResourceProps } from './BrandKitResource.contract';

export const createBrandKitResourceAdapter = (
  context: CreativeResourceContext,
  props: Omit<BrandKitResourceProps, 'context'> = {},
): BrandKitResourceProps => ({ ...props, context });

