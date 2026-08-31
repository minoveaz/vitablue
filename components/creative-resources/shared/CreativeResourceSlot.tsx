import React from 'react';
import type { CreativeResourceBlockId, CreativeResourceContext, CreativeResourceDomain, CreativeResourceSlots } from '../contracts/creativeResource';
import { CreativeResourceRegistry } from '../registry/CreativeResourceRegistry';
import { ResourceEmptyState } from './ResourceStates';

export interface CreativeResourceSlotProps {
  id: CreativeResourceBlockId;
  domain: CreativeResourceDomain;
  context: CreativeResourceContext;
  slots?: CreativeResourceSlots;
}

/** Resolves a registered block without creating a component type in a parent render. */
export const CreativeResourceSlot: React.FC<CreativeResourceSlotProps> = ({ id, domain, context, slots }) => {
  const resource = CreativeResourceRegistry.resolve(id, domain);
  return (
    <div id={`creative-resource-panel-${id}`}>
      {resource
        ? React.createElement(resource, { context, slots })
        : <ResourceEmptyState title="Recurso no disponible" description={`Este bloque no está habilitado para ${domain === 'image' ? 'Image' : 'Video'} Studio.`} />}
    </div>
  );
};
