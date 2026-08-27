import React, { useMemo } from 'react';
import { InlineEditingContext } from './InlineEditingContext';

interface InlineEditingProviderProps {
  children: React.ReactNode;
  editingLayerId: string | null;
  onRequestEdit: (layerId: string) => void;
  onExitEditing: () => void;
}

export const InlineEditingProvider: React.FC<InlineEditingProviderProps> = ({
  children,
  editingLayerId,
  onRequestEdit,
  onExitEditing,
}) => {
  const value = useMemo(
    () => ({ editingLayerId, requestEdit: onRequestEdit, exitEditing: onExitEditing }),
    [editingLayerId, onRequestEdit, onExitEditing]
  );

  return <InlineEditingContext.Provider value={value}>{children}</InlineEditingContext.Provider>;
};
