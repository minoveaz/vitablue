import type { Editor } from '@tiptap/core';
import type {
  ActiveInlineEditor,
  InlineTextStyleAttributes,
} from './InlineEditorContext';

const applyToWholeDocumentWhenCollapsed = (
  editor: Editor,
  run: () => boolean,
  onWholeDocument: () => void,
) => {
  const { from, to } = editor.state.selection;
  const hasSelection = from !== to;

  if (!hasSelection) editor.commands.selectAll();
  run();
  if (hasSelection) editor.commands.setTextSelection({ from, to });
  if (!hasSelection) onWholeDocument();
};

export const applyInlineTextStyle = (
  active: ActiveInlineEditor,
  attributes: InlineTextStyleAttributes,
) => {
  const { editor } = active;
  applyToWholeDocumentWhenCollapsed(
    editor,
    () => editor.chain().focus().setMark('textStyle', attributes).run(),
    () => {
      const layerPatch: Record<string, unknown> = {};
      if ('fontFamily' in attributes) layerPatch.fontFamily = attributes.fontFamily || undefined;
      if ('fontSize' in attributes) {
        const parsed = attributes.fontSize ? Number.parseFloat(attributes.fontSize) : undefined;
        layerPatch.fontSize = Number.isFinite(parsed) ? parsed : undefined;
      }
      if ('fontWeight' in attributes) layerPatch.fontWeight = attributes.fontWeight || undefined;
      if (Object.keys(layerPatch).length > 0) active.updateLayerProps?.(layerPatch);
    },
  );
  active.save();
};

export const toggleInlineMark = (
  active: ActiveInlineEditor,
  mark: 'bold' | 'italic' | 'underline' | 'strike',
) => {
  const { editor } = active;
  applyToWholeDocumentWhenCollapsed(
    editor,
    () => {
      const chain = editor.chain().focus();
      if (mark === 'bold') return chain.toggleBold().run();
      if (mark === 'italic') return chain.toggleItalic().run();
      if (mark === 'underline') return chain.toggleUnderline().run();
      return chain.toggleStrike().run();
    },
    () => {
      if (mark === 'bold') {
        active.updateLayerProps?.({ fontWeight: editor.isActive('bold') ? '700' : undefined });
      }
    },
  );
  active.save();
};

export const setInlineColor = (active: ActiveInlineEditor, color: string) => {
  applyToWholeDocumentWhenCollapsed(
    active.editor,
    () => active.editor.chain().focus().setColor(color).run(),
    () => active.updateLayerProps?.({ fill: color }),
  );
  active.save();
};

export const setInlineHighlight = (active: ActiveInlineEditor, color: string) => {
  applyToWholeDocumentWhenCollapsed(
    active.editor,
    () => active.editor.chain().focus().setHighlight({ color }).run(),
    () => undefined,
  );
  active.save();
};

export const updateInlineBlockAttributes = (
  active: ActiveInlineEditor,
  attributes: Record<string, string | null>,
) => {
  const blockName = active.editor.state.selection.$from.parent.type.name === 'heading'
    ? 'heading'
    : 'paragraph';
  active.editor.chain().focus().updateAttributes(blockName, attributes).run();
  const layerPatch: Record<string, unknown> = {};
  if ('textAlign' in attributes) layerPatch.align = attributes.textAlign || undefined;
  if ('lineHeight' in attributes) {
    const parsed = attributes.lineHeight ? Number.parseFloat(attributes.lineHeight) : undefined;
    layerPatch.lineHeight = Number.isFinite(parsed) ? parsed : undefined;
  }
  if (Object.keys(layerPatch).length > 0) active.updateLayerProps?.(layerPatch);
  active.save();
};
