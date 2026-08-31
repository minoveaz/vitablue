import React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { CreativeResourceComponentProps } from '../contracts/creativeResource';
import { ResourceErrorState, ResourceLoadingState, ResourceEmptyState } from './ResourceStates';
import { ResourcePanelHeader } from './ResourcePanelHeader';

export interface ResourceBlockShellProps extends CreativeResourceComponentProps {
  resourceId?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  showHeader?: boolean;
  children?: React.ReactNode;
}

export const ResourceBlockShell: React.FC<ResourceBlockShellProps> = ({
  context,
  slots,
  resourceId,
  title,
  description,
  icon: Icon,
  showHeader = true,
  children,
}) => (
  <section
    id={`creative-resource-panel-${resourceId ?? title.toLowerCase().replace(/\s+/g, '-')}`}
    data-resource-block={resourceId ?? title}
    className="hidden space-y-3 md:block"
  >
    {context.state === 'loading' && <ResourceLoadingState />}
    {context.state === 'error' && <ResourceErrorState message={context.error} />}
    {context.state === 'disabled' && <ResourceEmptyState title="No disponible en este estudio" description="Este recurso pertenece a otro dominio creativo." />}
    {context.state === 'ready' && (
      <>
        {showHeader && <ResourcePanelHeader title={title} description={description} icon={Icon} />}
        {slots?.content ?? (
          children ?? <ResourceEmptyState />
        )}
        {slots?.footer}
      </>
    )}
  </section>
);
