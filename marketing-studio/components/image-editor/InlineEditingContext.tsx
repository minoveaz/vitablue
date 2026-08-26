import { createContext, useContext } from 'react';

export interface InlineEditingState {
  editingLayerId: string | null;
  requestEdit: (layerId: string) => void;
  exitEditing: () => void;
}

export const InlineEditingContext = createContext<InlineEditingState>({
  editingLayerId: null,
  requestEdit: () => undefined,
  exitEditing: () => undefined,
});

export const useInlineEditing = (): InlineEditingState => useContext(InlineEditingContext);
