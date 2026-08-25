import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/core';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export interface ActiveInlineEditor {
  editor: Editor;
  revision: number;
  save: () => void;
}

interface InlineEditorRegistry {
  activeEditor: ActiveInlineEditor | null;
  registerEditor: (editor: Editor, save: () => void) => void;
  unregisterEditor: (editor: Editor) => void;
}

const InlineEditorRegistryContext = createContext<InlineEditorRegistry>({
  activeEditor: null,
  registerEditor: () => undefined,
  unregisterEditor: () => undefined,
});

export const InlineEditorProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [activeEditor, setActiveEditor] = useState<ActiveInlineEditor | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const unregisterEditor = useCallback((editor: Editor) => {
    setActiveEditor((current) => {
      if (current?.editor !== editor) return current;
      cleanupRef.current?.();
      cleanupRef.current = null;
      return null;
    });
  }, []);

  const registerEditor = useCallback((editor: Editor, save: () => void) => {
    cleanupRef.current?.();

    const notify = () => {
      setActiveEditor((current) =>
        current?.editor === editor
          ? { ...current, save, revision: current.revision + 1 }
          : current
      );
    };

    editor.on('selectionUpdate', notify);
    editor.on('transaction', notify);
    cleanupRef.current = () => {
      editor.off('selectionUpdate', notify);
      editor.off('transaction', notify);
    };
    setActiveEditor({ editor, save, revision: 0 });
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);

  return (
    <InlineEditorRegistryContext.Provider value={{ activeEditor, registerEditor, unregisterEditor }}>
      {children}
    </InlineEditorRegistryContext.Provider>
  );
};

export const useInlineEditorRegistry = () => useContext(InlineEditorRegistryContext);
export const useActiveInlineEditor = () => useInlineEditorRegistry().activeEditor;

interface InlineEditableTextProps {
  text: string;
  children?: React.ReactNode;
  onSave: (newHtmlOrText: string) => void;
  className?: string;
  style?: React.CSSProperties;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'strong' | 'div';
}

export const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  text,
  children,
  onSave,
  className = '',
  style,
  as: Component = 'div',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isEditingRef = useRef(false);
  const onSaveRef = useRef(onSave);
  const { registerEditor, unregisterEditor } = useInlineEditorRegistry();

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      Underline,
      Highlight.configure({ multicolor: true }),
    ],
    content: text || '',
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(isEditing);
    if (isEditing) {
      editor.commands.focus();
      const save = () => onSaveRef.current(editor.getHTML());
      registerEditor(editor, save);
      return () => unregisterEditor(editor);
    }
  }, [editor, isEditing, registerEditor, unregisterEditor]);

  const finishEditing = useCallback(() => {
    if (!isEditingRef.current) return;

    isEditingRef.current = false;
    if (editor) {
      onSaveRef.current(editor.getHTML());
      editor.setEditable(false);
    }
    setIsEditing(false);
  }, [editor]);

  useEffect(() => {
    if (!isEditing) return;

    const handleExternalPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('[data-inline-editor-toolbar]')) {
        return;
      }
      if (!containerRef.current?.contains(event.target as Node)) {
        finishEditing();
      }
    };

    document.addEventListener('pointerdown', handleExternalPointerDown, true);
    return () => document.removeEventListener('pointerdown', handleExternalPointerDown, true);
  }, [finishEditing, isEditing]);

  const startEditing = () => {
    isEditingRef.current = true;
    setIsEditing(true);
    if (editor) {
      editor.setEditable(true);
      editor.commands.setContent(text || '', { emitUpdate: false });
    }
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (event.relatedTarget && containerRef.current?.contains(event.relatedTarget as Node)) {
      return;
    }
    finishEditing();
  };

  if (isEditing) {
    return (
      <div
        ref={containerRef}
        className="relative inline-block w-full"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onBlur={handleBlur}
      >
        <div
          className={`${className} !cursor-text outline-none ring-2 ring-brand-cyan bg-white/10 rounded-xs p-1 select-text`}
          style={style}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }

  return (
    <Component
      onDoubleClick={(e) => {
        // Entrar con doble clic deja el primer clic disponible para seleccionar.
        e.stopPropagation();
        startEditing();
      }}
      className={`${className} cursor-text hover:outline-dashed hover:outline-1 hover:outline-brand-cyan/60 rounded-xs transition-all`}
      style={style}
      title="Doble clic para seleccionar y formatear palabras"
    >
      {children ?? (
        <span dangerouslySetInnerHTML={{ __html: text || '' }} />
      )}
    </Component>
  );
};
