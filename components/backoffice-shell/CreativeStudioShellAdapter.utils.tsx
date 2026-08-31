import type { ReactNode } from 'react';
import { BottomWorkspace } from './primitives';
import {
  CREATIVE_STUDIO_DEFAULT_INTERACTION_OWNERSHIP,
  type CreativeStudioImageStudioExtension,
  type CreativeStudioVideoStudioExtension,
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
  const videoExtension =
    props.extensions?.domain === 'video'
      ? (props.extensions as CreativeStudioVideoStudioExtension)
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
  const videoScenes = videoExtension?.slots?.scenes
    ? resolveSlot(
        videoExtension.slots.scenes as CreativeStudioShellSlot<TDomainExtension>,
        context,
      )
    : undefined;
  const videoTransport = videoExtension?.slots?.transport
    ? resolveSlot(
        videoExtension.slots.transport as CreativeStudioShellSlot<TDomainExtension>,
        context,
      )
    : undefined;
  const videoTimeline = videoExtension?.slots?.timeline
    ? resolveSlot(
        videoExtension.slots.timeline as CreativeStudioShellSlot<TDomainExtension>,
        context,
      )
    : undefined;
  const videoAudio = videoExtension?.slots?.audio
    ? resolveSlot(
        videoExtension.slots.audio as CreativeStudioShellSlot<TDomainExtension>,
        context,
      )
    : undefined;
  const resourcePanel = resolveSlot(props.slots.resourcePanel, context);
  const footerParts = [
    resolveSlot(props.slots.bottomWorkspace, context),
    imageSlideStrip,
    videoTransport,
    videoTimeline,
    videoAudio,
  ].filter((part) => part !== undefined && part !== null && part !== false);
  const footer = footerParts.length === 0
    ? undefined
    : (
      <BottomWorkspace aria-label="Área de trabajo inferior">
        {footerParts}
      </BottomWorkspace>
    );

  return {
    moduleHeader: resolveSlot(props.slots.moduleHeader, context),
    toolbar: resolveSlot(props.slots.toolbar, context),
    contextAside: composePanel(
      'Herramientas y recursos del editor',
      [
        resolveSlot(props.slots.toolRail, context),
        resourcePanel,
        // Hosts that provide a contextual resource panel own the placement of
        // the scene extension; legacy hosts keep the automatic mapping.
        resourcePanel ? undefined : videoScenes,
      ],
      'row',
    ),
    aside: composePanel('Capas e inspector del editor', [
      resolveSlot(props.slots.layersPanel, context),
      resolveSlot(props.slots.inspector, context),
    ]),
    footer,
    overlays: composePanel('Overlays del editor', [resolveSlot(props.slots.overlays, context), imagePreview]),
    stage: resolveSlot(props.slots.stage, context),
  };
};
