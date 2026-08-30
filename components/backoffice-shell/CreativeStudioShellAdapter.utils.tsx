import type { ReactNode } from 'react';
import {
  CREATIVE_STUDIO_DEFAULT_INTERACTION_OWNERSHIP,
  type CreativeStudioImageStudioExtension,
  type CreativeStudioShellExtension,
  type CreativeStudioShellInteraction,
  type CreativeStudioShellProps,
  type CreativeStudioShellSlot,
  type CreativeStudioShellSlotContext,
} from './contracts/creativeStudioShell';

export interface CreativeStudioShellMappedSlots {
  moduleHeader?: ReactNode;
  toolbar?: ReactNode;
  contextAside?: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
  overlays?: ReactNode;
  stage: ReactNode;
}

const resolveSlot = <TDomainExtension extends CreativeStudioShellExtension>(
  slot: CreativeStudioShellSlot<TDomainExtension> | undefined,
  context: CreativeStudioShellSlotContext<TDomainExtension>,
): ReactNode => (typeof slot === 'function' ? slot(context) : slot);

const composePanel = (label: string, parts: ReactNode[], direction: 'column' | 'row' = 'column'): ReactNode => {
  const visibleParts = parts.filter((part) => part !== undefined && part !== null && part !== false);
  if (visibleParts.length === 0) return undefined;
  if (visibleParts.length === 1) return visibleParts[0];

  return (
    <div className={`flex min-h-0 ${direction === 'row' ? 'flex-row' : 'flex-col'}`} aria-label={label}>
      {visibleParts}
    </div>
  );
};

/**
 * Maps the neutral contract to the existing SuiteCanvas regions.
 *
 * `toolRail` and `resourcePanel` share the left context zone for now, while
 * `layersPanel` and `inspector` share the right context zone. Keeping this
 * mapping explicit avoids introducing a second visual shell before 4.75.3.
 */
export const mapCreativeStudioShellSlots = <
  TDomainExtension extends CreativeStudioShellExtension,
>(
  props: Pick<CreativeStudioShellProps<TDomainExtension>, 'domain' | 'state' | 'slots' | 'extensions' | 'interaction'>,
): CreativeStudioShellMappedSlots => {
  const interaction: CreativeStudioShellInteraction = {
    ...props.interaction,
    ownership: {
      ...CREATIVE_STUDIO_DEFAULT_INTERACTION_OWNERSHIP,
      ...props.interaction?.ownership,
    },
  };
  const context: CreativeStudioShellSlotContext<TDomainExtension> = {
    domain: props.domain,
    extension: props.extensions,
    state: props.state,
    interaction,
  };
  const imageExtension =
    props.extensions?.domain === 'image'
      ? (props.extensions as CreativeStudioImageStudioExtension)
      : undefined;
  const imageSlideStrip = imageExtension?.slots?.slideStrip
    ? resolveSlot(
        imageExtension.slots.slideStrip as CreativeStudioShellSlot<TDomainExtension>,
        context,
      )
    : undefined;
  const imagePreview = imageExtension?.slots?.preview
    ? resolveSlot(
        imageExtension.slots.preview as CreativeStudioShellSlot<TDomainExtension>,
        context,
      )
    : undefined;

  return {
    moduleHeader: resolveSlot(props.slots.moduleHeader, context),
    toolbar: resolveSlot(props.slots.toolbar, context),
    contextAside: composePanel(
      'Herramientas y recursos del editor',
      [resolveSlot(props.slots.toolRail, context), resolveSlot(props.slots.resourcePanel, context)],
      'row',
    ),
    aside: composePanel('Capas e inspector del editor', [
      resolveSlot(props.slots.layersPanel, context),
      resolveSlot(props.slots.inspector, context),
    ]),
    footer: composePanel('Área de trabajo inferior', [
      resolveSlot(props.slots.bottomWorkspace, context),
      imageSlideStrip,
    ]),
    overlays: composePanel('Overlays del editor', [resolveSlot(props.slots.overlays, context), imagePreview]),
    stage: resolveSlot(props.slots.stage, context),
  };
};
