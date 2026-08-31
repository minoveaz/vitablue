import React from 'react';
import { Video } from 'lucide-react';
import { ResourceActionList } from '../../shared/ResourceActionList';
import { ResourceBlockShell } from '../../shared/ResourceBlockShell';
import type { PrepareVideoResourceProps } from './PrepareVideoResource.contract';

export const PrepareVideoResource: React.FC<PrepareVideoResourceProps> = ({ context, items = [], onInsert, slots }) => (
  <ResourceBlockShell context={context} slots={slots} resourceId="prepare-video" title="Preparar para Video" description="Entrega esta composición al flujo de vídeo" icon={Video}>
    <ResourceActionList items={items.map((item) => ({ ...item, onSelect: onInsert ? () => onInsert(item) : undefined }))} />
  </ResourceBlockShell>
);
