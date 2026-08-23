import React from 'react';
import { useLocation } from 'react-router-dom';
import BackofficeShell from '@/components/layouts/BackofficeShell';
import type { SuiteCanvasMode } from '@/components/backoffice-shell';

interface MarketingStudioShellProps {
  children: React.ReactNode;
  title: string;
  modulePillar?: string;
  mode?: SuiteCanvasMode;
  actionsSlot?: React.ReactNode;
  toolbar?: React.ReactNode;
  contextAside?: React.ReactNode;
  aside?: React.ReactNode;
}

const getPillarFromPath = (pathname: string): string => {
  if (pathname.includes('identidad-de-marca') || pathname.includes('perfiles-sociales')) {
    return '1. Brand Hub';
  }
  if (pathname.includes('assets')) {
    return '2. Asset Manager (DAM)';
  }
  if (pathname.includes('generador-contenido') || pathname.includes('video')) {
    return '3. Creative Studio';
  }
  if (pathname.includes('campanas') || pathname.includes('enlaces') || pathname.includes('conexiones')) {
    return '4. Campaign Orchestrator';
  }
  return 'Marketing Studio';
};

const MarketingStudioShell: React.FC<MarketingStudioShellProps> = ({
  children,
  title,
  modulePillar,
  mode = 'overview',
  actionsSlot,
  toolbar,
  contextAside,
  aside,
}) => {
  const { pathname } = useLocation();
  const pillar = modulePillar ?? getPillarFromPath(pathname);

  return (
    <BackofficeShell
      title={title}
      eyebrow={pillar}
      breadcrumbs={['Marketing Studio', pillar, title]}
      mode={mode}
      actionsSlot={actionsSlot}
      toolbar={toolbar}
      contextAside={contextAside}
      aside={aside}
    >
      {children}
    </BackofficeShell>
  );
};

export default MarketingStudioShell;
