import React from 'react';
import BackofficeShell from '@/components/layouts/BackofficeShell';
import type { SuiteCanvasMode } from '@/components/backoffice-shell';

interface MarketingStudioShellProps {
  children: React.ReactNode;
  title: string;
  mode?: SuiteCanvasMode;
  actionsSlot?: React.ReactNode;
  toolbar?: React.ReactNode;
  contextAside?: React.ReactNode;
  aside?: React.ReactNode;
}

const MarketingStudioShell: React.FC<MarketingStudioShellProps> = ({
  children,
  title,
  mode = 'overview',
  actionsSlot,
  toolbar,
  contextAside,
  aside,
}) => {
  return (
    <BackofficeShell
      title={title}
      eyebrow="Marketing Studio"
      breadcrumbs={['Marketing Studio', title]}
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
