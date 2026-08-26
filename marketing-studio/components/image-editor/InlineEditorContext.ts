import { createContext, useContext } from 'react';
import type { Editor } from '@tiptap/core';

export interface ActiveInlineEditor {
  editor: Editor;
  layerId?: string;
  revision: number;
  save: () => void;
}

export interface InlineEditorRegistry {
  activeEditor: ActiveInlineEditor | null;
  registerEditor: (editor: Editor, layerId: string | undefined, save: () => void) => void;
  activateEditor: (editor: Editor) => void;
  notifyEditor: (editor: Editor) => void;
  unregisterEditor: (editor: Editor) => void;
}

export const InlineEditorRegistryContext = createContext<InlineEditorRegistry>({
  activeEditor: null,
  registerEditor: () => undefined,
  activateEditor: () => undefined,
  notifyEditor: () => undefined,
  unregisterEditor: () => undefined,
});

export const useInlineEditorRegistry = (): InlineEditorRegistry =>
  useContext(InlineEditorRegistryContext);

export const useActiveInlineEditor = (): ActiveInlineEditor | null =>
  useInlineEditorRegistry().activeEditor;
