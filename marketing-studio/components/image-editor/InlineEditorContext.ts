import { createContext, useContext } from 'react';
import type { Editor } from '@tiptap/core';

export type InlineTextStyleAttributes = {
  fontFamily?: string | null;
  fontSize?: string | null;
  fontWeight?: string | null;
};

export interface ActiveInlineEditor {
  editor: Editor;
  layerId?: string;
  revision: number;
  save: () => void;
  updateLayerProps?: (patch: Record<string, unknown>) => void;
}

export interface InlineEditorRegistry {
  activeEditor: ActiveInlineEditor | null;
  registerEditor: (
    editor: Editor,
    layerId: string | undefined,
    save: () => void,
    updateLayerProps?: (patch: Record<string, unknown>) => void
  ) => void;
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

export interface InlineTextFormattingController {
  activeEditor: ActiveInlineEditor | null;
  applyTextStyle: (attributes: InlineTextStyleAttributes) => void;
  toggleMark: (mark: 'bold' | 'italic' | 'underline' | 'strike') => void;
  setColor: (color: string) => void;
  setHighlight: (color: string) => void;
  updateBlockAttributes: (attributes: Record<string, string | null>) => void;
}

export const InlineTextFormattingContext = createContext<InlineTextFormattingController>({
  activeEditor: null,
  applyTextStyle: () => undefined,
  toggleMark: () => undefined,
  setColor: () => undefined,
  setHighlight: () => undefined,
  updateBlockAttributes: () => undefined,
});

export const useInlineTextFormatting = (): InlineTextFormattingController =>
  useContext(InlineTextFormattingContext);
