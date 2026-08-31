import React from 'react';
import { LayoutTemplate } from 'lucide-react';
import { ResourceActionList } from '../../shared/ResourceActionList';
import { ResourceBlockShell } from '../../shared/ResourceBlockShell';
import type { TemplatesResourceProps } from './TemplatesResource.contract';

export const TemplatesResource: React.FC<TemplatesResourceProps> = ({ context, items = [], onInsert, slots }) => (
  <ResourceBlockShell context={context} slots={slots} resourceId="templates" title="Plantillas" description="Composiciones listas para usar" icon={LayoutTemplate}>
    <ResourceActionList items={items.map((item) => ({ ...item, description: item.description ?? item.aspectRatio, onSelect: onInsert ? () => onInsert(item) : undefined }))} />
  </ResourceBlockShell>
);
