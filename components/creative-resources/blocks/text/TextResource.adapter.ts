import type { CreativeResourceContext } from '../../contracts/creativeResource';
import type { TextResourceAdapter, TextResourceProps } from './TextResource.contract';

export const createTextResourceAdapter = (
  context: CreativeResourceContext,
  props: Omit<TextResourceProps, 'context'> & { adapter?: TextResourceAdapter } = {},
): TextResourceProps => {
  const { adapter, ...resourceProps } = props;
  return {
    ...resourceProps,
    context: adapter
      ? { ...context, extensions: { ...context.extensions, text: adapter } }
      : context,
  };
};
