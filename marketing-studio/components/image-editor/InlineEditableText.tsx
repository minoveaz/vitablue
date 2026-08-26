import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Extension, type Editor } from '@tiptap/core';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Strikethrough, Underline as UnderlineIcon } from 'lucide-react';
import { legacyTextToTiptapHtml, sanitizeTiptapHtml } from '../../utils/tiptapHtml';

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
    const notify = () => setActiveEditor((current) =>
      current?.editor === editor ? { ...current, save, revision: current.revision + 1 } : current
    );
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

/**
 * Adds the partial typography attributes used by Image Studio to Tiptap's
 * existing marks/nodes without requiring extra Tiptap packages.
 */
const ImageStudioTypography = Extension.create({
  name: 'imageStudioTypography',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontFamily || null,
            renderHTML: (attributes: Record<string, string | null>) =>
              attributes.fontFamily ? { style: `font-family: ${attributes.fontFamily}` } : {},
          },
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attributes: Record<string, string | null>) =>
              attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {},
          },
          fontWeight: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontWeight || null,
            renderHTML: (attributes: Record<string, string | null>) =>
              attributes.fontWeight ? { style: `font-weight: ${attributes.fontWeight}` } : {},
          },
          lineHeight: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.lineHeight || null,
            renderHTML: (attributes: Record<string, string | null>) =>
              attributes.lineHeight ? { style: `line-height: ${attributes.lineHeight}` } : {},
          },
        },
      },
      {
        types: ['paragraph', 'heading'],
        attributes: {
          textAlign: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.textAlign || null,
            renderHTML: (attributes: Record<string, string | null>) =>
              attributes.textAlign ? { style: `text-align: ${attributes.textAlign}` } : {},
          },
          lineHeight: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.lineHeight || null,
            renderHTML: (attributes: Record<string, string | null>) =>
              attributes.lineHeight ? { style: `line-height: ${attributes.lineHeight}` } : {},
          },
        },
      },
    ];
  },
});

interface InlineEditableTextProps {
  text: string;
  children?: React.ReactNode;
  onSave: (newHtml: string) => void;
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
  const windowBlurredRef = useRef(false);
  const selectionRef = useRef<{ from: number; to: number } | null>(null);
  const onSaveRef = useRef(onSave);
  const { registerEditor, unregisterEditor } = useInlineEditorRegistry();

  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      Highlight.configure({ multicolor: true }),
      ImageStudioTypography,
    ],
    content: legacyTextToTiptapHtml(text || ''),
    editable: false,
    immediatelyRender: false,
    editorProps: {
      transformPastedHTML: (html) => sanitizeTiptapHtml(html),
      transformPastedText: (plainText) => plainText,
    },
  });

  const lastContentRef = useRef('');
  useEffect(() => {
    if (!editor || isEditing) return;
    const content = legacyTextToTiptapHtml(text || '');
    if (content !== lastContentRef.current) {
      editor.commands.setContent(content, { emitUpdate: false });
      lastContentRef.current = content;
    }
  }, [editor, isEditing, text]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(isEditing);
    if (isEditing) {
      const focusEditor = requestAnimationFrame(() => {
        editor.commands.focus('end');
      });
      const save = () => onSaveRef.current(sanitizeTiptapHtml(editor.getHTML()));
      registerEditor(editor, save);
      return () => cancelAnimationFrame(focusEditor);
    }
  }, [editor, isEditing, registerEditor, unregisterEditor]);

  useEffect(() => {
    if (!editor) return;
    return () => unregisterEditor(editor);
  }, [editor, unregisterEditor]);

  useEffect(() => {
    if (!editor || !isEditing) return;
    const rememberSelection = () => {
      const { from, to } = editor.state.selection;
      selectionRef.current = { from, to };
    };
    const restoreSelection = () => {
      if (document.visibilityState !== 'visible') return;
      const selection = selectionRef.current;
      if (!selection) return;
      requestAnimationFrame(() => {
        if (!isEditingRef.current) return;
        editor.commands.setTextSelection(selection);
        editor.commands.focus();
      });
    };
    const handleWindowBlur = () => {
      windowBlurredRef.current = true;
      rememberSelection();
    };
    const handleWindowFocus = () => {
      windowBlurredRef.current = false;
      restoreSelection();
    };
    editor.on('selectionUpdate', rememberSelection);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', restoreSelection);
    rememberSelection();
    return () => {
      editor.off('selectionUpdate', rememberSelection);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', restoreSelection);
    };
  }, [editor, isEditing]);

  const finishEditing = useCallback(() => {
    if (!isEditingRef.current) return;
    isEditingRef.current = false;
    if (editor) {
      onSaveRef.current(sanitizeTiptapHtml(editor.getHTML()));
      editor.setEditable(false);
    }
    setIsEditing(false);
  }, [editor]);

  const startEditing = () => {
    isEditingRef.current = true;
    setIsEditing(true);
    if (editor) {
      const content = legacyTextToTiptapHtml(text || '');
      editor.commands.setContent(content, { emitUpdate: false });
      lastContentRef.current = content;
      editor.setEditable(true);
    }
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (windowBlurredRef.current || document.visibilityState === 'hidden') return;
    if (event.relatedTarget && containerRef.current?.contains(event.relatedTarget as Node)) return;
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
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            finishEditing();
          }
        }}
      >
        <div className={`${className} !cursor-text outline-none ring-2 ring-brand-cyan bg-white/10 rounded-xs p-1 select-text`} style={style}>
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }

  return (
    <Component
      data-inline-edit-trigger="true"
      onClick={(e) => { e.stopPropagation(); startEditing(); }}
      onDoubleClick={(e) => { e.stopPropagation(); startEditing(); }}
      className={`${className} cursor-text hover:outline-dashed hover:outline-1 hover:outline-brand-cyan/60 rounded-xs transition-all`}
      style={style}
      title="Doble clic para seleccionar y formatear palabras"
    >
      {children ?? <span dangerouslySetInnerHTML={{ __html: sanitizeTiptapHtml(legacyTextToTiptapHtml(text || '')) }} />}
    </Component>
  );
};

export const InlineTextControls: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const active = useActiveInlineEditor();
  const editor = active?.editor;
  const [colorInput, setColorInput] = useState('#001219');
  const [highlightInput, setHighlightInput] = useState('#fff3a3');
  useEffect(() => {
    if (editor) setColorInput(editor.getAttributes('textStyle').color ?? '#001219');
  }, [editor, active?.revision]);
  useEffect(() => {
    if (editor) setHighlightInput(editor.getAttributes('highlight').color ?? '#fff3a3');
  }, [editor, active?.revision]);
  if (!active || !editor) return null;
  const controls = [
    ['bold', 'Negrita', Bold, () => editor.chain().focus().toggleBold().run()],
    ['italic', 'Cursiva', Italic, () => editor.chain().focus().toggleItalic().run()],
    ['underline', 'Subrayado', UnderlineIcon, () => editor.chain().focus().toggleUnderline().run()],
    ['strike', 'Tachado', Strikethrough, () => editor.chain().focus().toggleStrike().run()],
  ] as const;
  const color = editor.getAttributes('textStyle').color ?? colorInput;
  const highlight = editor.getAttributes('highlight').color ?? highlightInput;
  const blockType = editor.state.selection.$from.parent.type.name;
  const blockName = blockType === 'heading' ? 'heading' : 'paragraph';
  const paragraph = editor.getAttributes(blockName);
  const textStyle = editor.getAttributes('textStyle');
  const buttonClass = 'flex size-7 items-center justify-center rounded-lg border border-slate-800 text-slate-300 hover:border-brand-cyan hover:text-brand-cyan';
  const save = () => active.save();
  const brandColors = [
    ['Ocean', '#005F73'],
    ['Midnight', '#001219'],
    ['Gold', '#EE9B00'],
    ['Mint', '#94D2BD'],
    ['White', '#FFFFFF'],
  ] as const;
  const applyColor = (value: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(value)) return;
    editor.chain().focus().setColor(value).run();
    save();
  };
  return (
    <div data-inline-editor-toolbar className={`flex w-full flex-wrap items-center justify-center gap-1.5 ${compact ? 'border-b border-slate-800/90 bg-slate-950/95 px-4 py-1.5' : 'rounded-xl border border-slate-800 bg-slate-950/90 p-1.5'}`} aria-label="Formato de texto Tiptap">
      {controls.map(([id, label, Icon, run]) => (
        <button key={id} type="button" className={`${buttonClass} ${editor.isActive(id) ? 'bg-primary/30 text-brand-cyan' : ''}`} title={label} aria-label={label} aria-pressed={editor.isActive(id)} onMouseDown={(e) => e.preventDefault()} onClick={() => { run(); save(); }}>
          <Icon className="size-3.5" />
        </button>
      ))}
      <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-1.5 py-1" data-inline-editor-toolbar>
        <span className="size-3.5 rounded-full border border-white/50" style={{ backgroundColor: color }} title="Color del texto" />
        <input
          className="w-16 bg-transparent text-[10px] font-mono uppercase text-slate-200 outline-none"
          value={colorInput}
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            setColorInput(value);
            if (/^#[0-9A-F]{6}$/i.test(value)) applyColor(value);
          }}
          aria-label="Código HEX del color del texto"
          spellCheck={false}
        />
        <input type="color" value={color} onMouseDown={(e) => e.preventDefault()} onChange={(e) => applyColor(e.target.value)} className="size-4 cursor-pointer rounded opacity-80" aria-label="Selector visual de color del texto" />
        <div className="flex gap-0.5">
          {brandColors.map(([label, value]) => (
            <button key={value} type="button" className="size-3.5 rounded-full border border-white/20 hover:scale-125" style={{ backgroundColor: value }} title={`${label} ${value}`} aria-label={`Usar color ${label}`} onMouseDown={(e) => e.preventDefault()} onClick={() => applyColor(value)} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-1.5 py-1" data-inline-editor-toolbar>
        <span className="size-3.5 rounded border border-white/50" style={{ backgroundColor: highlight }} title="Resaltado" />
        <input
          className="w-16 bg-transparent text-[10px] font-mono uppercase text-slate-200 outline-none"
          value={highlightInput}
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            setHighlightInput(value);
            if (/^#[0-9A-F]{6}$/i.test(value)) {
              editor.chain().focus().setHighlight({ color: value }).run();
              save();
            }
          }}
          aria-label="Código HEX del resaltado"
          spellCheck={false}
        />
        <input type="color" value={highlight} onMouseDown={(e) => e.preventDefault()} onChange={(e) => { editor.chain().focus().setHighlight({ color: e.target.value }).run(); save(); }} className="size-4 cursor-pointer rounded opacity-80" aria-label="Selector visual de resaltado" />
      </div>
      <select className="h-7 max-w-28 rounded-lg border border-slate-800 bg-slate-950 px-1 text-[10px] text-slate-200" value={String(textStyle.fontFamily ?? '')} onMouseDown={(e) => e.preventDefault()} onChange={(e) => { const value = e.target.value; editor.chain().focus().setMark('textStyle', { fontFamily: value || null }).run(); save(); }} aria-label="Familia tipográfica">
        <option value="">Fuente</option>
        <option value="Poppins, sans-serif">Poppins</option>
        <option value="Inter, sans-serif">Inter</option>
        <option value="Montserrat, sans-serif">Montserrat</option>
        <option value="Oswald, sans-serif">Oswald</option>
        <option value="Playfair Display, serif">Playfair</option>
      </select>
      <input className="h-7 w-12 rounded-lg border border-slate-800 bg-slate-950 px-1 text-center text-[10px] text-slate-200" type="number" min="8" max="200" value={parseInt(String(textStyle.fontSize ?? '').replace('px', ''), 10) || ''} onMouseDown={(e) => e.preventDefault()} onChange={(e) => { const value = e.target.value ? `${Math.max(8, Math.min(200, Number(e.target.value)))}px` : null; editor.chain().focus().setMark('textStyle', { fontSize: value }).run(); save(); }} aria-label="Tamaño de fuente" placeholder="px" />
      <div className="flex items-center gap-0.5">
        {([['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]] as const).map(([align, Icon]) => (
          <button key={align} type="button" className={`${buttonClass} ${paragraph.textAlign === align ? 'bg-primary/30 text-brand-cyan' : ''}`} title={`Alinear ${align}`} aria-label={`Alinear ${align}`} onMouseDown={(e) => e.preventDefault()} onClick={() => { editor.chain().focus().updateAttributes(blockName, { textAlign: align }).run(); save(); }}>
            <Icon className="size-3.5" />
          </button>
        ))}
      </div>
      <select className="h-7 rounded-lg border border-slate-800 bg-slate-950 px-1 text-[10px] text-slate-200" value={String(paragraph.lineHeight ?? '')} onMouseDown={(e) => e.preventDefault()} onChange={(e) => { editor.chain().focus().updateAttributes(blockName, { lineHeight: e.target.value || null }).run(); save(); }} aria-label="Interlineado">
        <option value="">Interlineado</option><option value="1">1</option><option value="1.15">1.15</option><option value="1.25">1.25</option><option value="1.5">1.5</option><option value="2">2</option>
      </select>
    </div>
  );
};
