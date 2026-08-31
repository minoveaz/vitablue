import React from 'react';
import { Component } from 'lucide-react';
import { ResourceActionList } from '../../shared/ResourceActionList';
import { ResourceBlockShell } from '../../shared/ResourceBlockShell';
import type { BlocksResourceProps } from './BlocksResource.contract';

export const BlocksResource: React.FC<BlocksResourceProps> = ({ context, items = [], onInsert, slots }) => (
  <ResourceBlockShell context={context} slots={slots} resourceId="blocks" title="Bloques" description="Bloques visuales reutilizables" icon={Component}>
    <ResourceActionList items={items.map((item) => ({ ...item, onSelect: onInsert ? () => onInsert(item) : undefined }))} />
  </ResourceBlockShell>
);
