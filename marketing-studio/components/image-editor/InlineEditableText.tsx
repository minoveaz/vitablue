import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Palette } from 'lucide-react';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface InlineEditableTextProps {
  text: string;
  children?: React.ReactNode;
  onSave: (newHtmlOrText: string) => void;
  className?: string;
  style?: React.CSSProperties;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'strong' | 'div';
}

const BRAND_PALETTE = [
  { label: 'Amber Gold', hex: '#EE9B00' },
  { label: 'Mint Green', hex: '#94D2BD' },
  { label: 'Ocean Teal', hex: '#005F73' },
  { label: 'Clean White', hex: '#FFFFFF' },
  { label: 'Coral Red', hex: '#F43F5E' },
  { label: 'Midnight Blue', hex: '#001219' },
  { label: 'Sky Blue', hex: '#38BDF8' },
  { label: 'Emerald Green', hex: '#10B981' },
];

export const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  text,
  children,
  onSave,
  className = '',
  style,
  as: Component = 'div',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [bubbleMenuPos, setBubbleMenuPos] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isEditingRef = useRef(false);

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
    onSelectionUpdate: () => {
      requestAnimationFrame(updateSelectionBubble);
    },
  });

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(isEditing);
    if (isEditing) {
      editor.commands.focus();
    }
  }, [editor, isEditing]);

  const updateSelectionBubble = useCallback(() => {
    if (!editor) return;

    const sel = window.getSelection();
    const editorDom = editor.view.dom;
    if (
      !sel ||
      sel.rangeCount === 0 ||
      sel.isCollapsed ||
      !sel.anchorNode ||
      !sel.focusNode ||
      !editorDom.contains(sel.anchorNode) ||
      !editorDom.contains(sel.focusNode)
    ) {
      setBubbleMenuPos(null);
      setShowColorPicker(false);
      return;
    }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect && rect.width > 0) {
      // Posicionar la barra flotante exactamente centrada encima de la palabra seleccionada
      setBubbleMenuPos({
        top: Math.max(12, rect.top - 60),
        left: Math.max(120, rect.left + rect.width / 2),
      });
    }
  }, [editor]);

  const finishEditing = useCallback(() => {
    if (!isEditingRef.current) return;

    isEditingRef.current = false;
    if (editor) {
      onSave(editor.getHTML());
      editor.setEditable(false);
    }
    setIsEditing(false);
    setBubbleMenuPos(null);
    setShowColorPicker(false);
  }, [editor, onSave]);

  const applyFormat = useCallback(
    (format: 'bold' | 'italic' | 'underline' | 'strike' | 'color', value?: string) => {
      if (!editor) return;

      const chain = editor.chain().focus();
      switch (format) {
        case 'bold':
          chain.toggleBold().run();
          break;
        case 'italic':
          chain.toggleItalic().run();
          break;
        case 'underline':
          chain.toggleUnderline().run();
          break;
        case 'strike':
          chain.toggleStrike().run();
          break;
        case 'color':
          if (value) chain.setColor(value).run();
          break;
      }
      onSave(editor.getHTML());
      updateSelectionBubble();
    },
    [editor, onSave, updateSelectionBubble]
  );

  useEffect(() => {
    if (!isEditing) return;

    const handleExternalPointerDown = (event: PointerEvent) => {
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
    setShowColorPicker(false);
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
        {/* BARRA FLOTANTE DE TIPOGRAFÍA PROFESIONAL ESTILO CANVA (BUBBLE MENU) */}
        {bubbleMenuPos && (
          <div
            className="fixed z-[999999] flex -translate-x-1/2 items-center gap-1.5 rounded-2xl border border-slate-700/90 bg-slate-950/98 px-2.5 py-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl animate-fadeIn select-none pointer-events-auto"
            style={{
              top: `${bubbleMenuPos.top}px`,
              left: `${bubbleMenuPos.left}px`,
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* NEGRITA */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('bold');
              }}
              className="flex size-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-200 hover:border-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-all shadow-xs"
              title="Negrita (B)"
            >
              <Bold className="size-4" />
            </button>

            {/* CURSIVA */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('italic');
              }}
              className="flex size-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-200 hover:border-brand-cyan hover:text-brand-cyan hover:bg-slate-800 transition-all shadow-xs"
              title="Cursiva (I)"
            >
              <Italic className="size-4" />
            </button>

            {/* SUBRAYADO */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('underline');
              }}
              className="flex size-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-200 hover:border-brand-cyan hover:text-brand-cyan hover:bg-slate-800 transition-all shadow-xs"
              title="Subrayado (U)"
            >
              <UnderlineIcon className="size-4" />
            </button>

            {/* TACHADO */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('strike');
              }}
              className="flex size-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-200 hover:border-rose-400 hover:text-rose-300 hover:bg-slate-800 transition-all shadow-xs"
              title="Tachado (S)"
            >
              <Strikethrough className="size-4" />
            </button>

            <div className="mx-1 h-5 w-px bg-slate-800" />

            {/* SELECTOR DE COLOR POR PALABRA - TAMAÑO CÓMODO & CLARO */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowColorPicker(!showColorPicker);
                }}
                className={`flex h-8 items-center gap-1.5 px-2.5 rounded-xl border transition-all shadow-xs ${
                  showColorPicker
                    ? 'border-brand-cyan bg-primary/30 text-brand-cyan'
                    : 'border-slate-800 bg-slate-900/90 text-slate-200 hover:border-brand-cyan hover:text-brand-cyan'
                }`}
                title="Cambiar color del texto seleccionado"
              >
                <Palette className="size-4 text-amber-400" />
                <span className="text-[11px] font-bold">Color</span>
              </button>

              {/* PALETA POPUP GRANDE Y NÍTIDA */}
              {showColorPicker && (
                <div
                  className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.95)] backdrop-blur-2xl animate-fadeIn z-50 min-w-[280px]"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Paleta:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {BRAND_PALETTE.map((swatch) => (
                      <button
                        key={swatch.hex}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyFormat('color', swatch.hex);
                          setShowColorPicker(false);
                        }}
                        className="size-6 rounded-full border-2 border-slate-700 hover:scale-125 hover:border-white transition-transform shadow-xs"
                        style={{ backgroundColor: swatch.hex }}
                        title={swatch.label}
                      />
                    ))}
                    {/* INPUT COLOR NATIVO CON PREVIEW */}
                    <label className="size-6 rounded-full border-2 border-dashed border-slate-500 hover:border-brand-cyan flex items-center justify-center cursor-pointer hover:scale-110 transition-transform relative overflow-hidden">
                      <input
                        type="color"
                        onMouseDown={(e) => e.preventDefault()}
                        onChange={(e) => {
                          applyFormat('color', e.target.value);
                          setShowColorPicker(false);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        title="Elegir cualquier color personalizado"
                      />
                      <span className="text-[10px] text-brand-cyan font-black">+</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          onMouseUp={updateSelectionBubble}
          onKeyUp={updateSelectionBubble}
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
