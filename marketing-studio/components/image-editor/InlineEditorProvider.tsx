import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Editor } from '@tiptap/core';
import {
  InlineEditorRegistryContext,
  type ActiveInlineEditor,
} from './InlineEditorContext';

interface RegisteredEditor {
  editor: Editor;
  layerId?: string;
  save: () => void;
}

interface InlineEditorProviderProps {
  children: React.ReactNode;
  activeLayerId?: string | null;
}

export const InlineEditorProvider: React.FC<InlineEditorProviderProps> = ({
  children,
  activeLayerId = null,
}) => {
  const editorsRef = useRef(new Map<Editor, RegisteredEditor>());
  const activeLayerIdRef = useRef(activeLayerId);
  const [activeEditor, setActiveEditor] = useState<ActiveInlineEditor | null>(null);

  const findEditorForLayer = useCallback((layerId: string | null | undefined) => {
    if (!layerId) return null;
    for (const registered of editorsRef.current.values()) {
      if (registered.layerId === layerId) return registered;
    }
    return null;
  }, []);

  const setRegisteredEditorActive = useCallback((registered: RegisteredEditor) => {
    setActiveEditor((current) => {
      if (current?.editor === registered.editor) {
        return {
          ...current,
          layerId: registered.layerId,
          save: registered.save,
          revision: current.revision + 1,
        };
      }
      return { ...registered, revision: 0 };
    });
  }, []);

  const registerEditor = useCallback(
    (editor: Editor, layerId: string | undefined, save: () => void) => {
      const registered = { editor, layerId, save };
      editorsRef.current.set(editor, registered);

      if (activeLayerIdRef.current !== layerId) return;
      setActiveEditor((current) => {
        if (current && current.layerId === layerId) return current;
        return { ...registered, revision: 0 };
      });
    },
    []
  );

  const activateEditor = useCallback(
    (editor: Editor) => {
      const registered = editorsRef.current.get(editor);
      if (registered) setRegisteredEditorActive(registered);
    },
    [setRegisteredEditorActive]
  );

  const notifyEditor = useCallback((editor: Editor) => {
    setActiveEditor((current) =>
      current?.editor === editor ? { ...current, revision: current.revision + 1 } : current
    );
  }, []);

  const unregisterEditor = useCallback((editor: Editor) => {
    editorsRef.current.delete(editor);
    setActiveEditor((current) => (current?.editor === editor ? null : current));
  }, []);

  useEffect(() => {
    activeLayerIdRef.current = activeLayerId;
  }, [activeLayerId]);

  useEffect(() => {
    const registered = findEditorForLayer(activeLayerId);
    if (registered) {
      setRegisteredEditorActive(registered);
    } else {
      setActiveEditor(null);
    }
  }, [activeLayerId, findEditorForLayer, setRegisteredEditorActive]);

  const contextValue = useMemo(
    () => ({ activeEditor, registerEditor, activateEditor, notifyEditor, unregisterEditor }),
    [activeEditor, registerEditor, activateEditor, notifyEditor, unregisterEditor]
  );

  return (
    <InlineEditorRegistryContext.Provider value={contextValue}>
      {children}
    </InlineEditorRegistryContext.Provider>
  );
};
