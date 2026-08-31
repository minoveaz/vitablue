import type { CreativeResourceContext } from '../../contracts/creativeResource';
import type { TemplatesResourceProps } from './TemplatesResource.contract';

export const createTemplatesResourceAdapter = (
  context: CreativeResourceContext,
  props: Omit<TemplatesResourceProps, 'context'> = {},
): TemplatesResourceProps => ({ ...props, context });

