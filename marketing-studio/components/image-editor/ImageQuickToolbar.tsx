import React from 'react';
import {
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  AlignCenter,
  Ungroup,
  FolderPlus,
  Maximize2,
  Lock,
  Unlock,
  FlipHorizontal,
  Bold,
  Italic,
  Underline,
  Strikethrough,
} from 'lucide-react';
import { ImageLayer } from '../../types/imageStudio';
import { useActiveInlineEditor } from './InlineEditableText';

interface ImageQuickToolbarProps {
  layer: ImageLayer;
  selectedCount?: number;
  onDuplicate: (id: string) => void;
  onDuplicateSelected?: () => void;
  onRemove: (id: string) => void;
  onDeleteSelected?: () => void;
  onGroup?: () => void;
  onScaleChange: (id: string, scale: number) => void;
  onCenter: (id: string) => void;
  onUngroup?: (id: string) => void;
  onFitToCanvas?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onToggleFlipHorizontal?: (id: string) => void;
}

export const ImageQuickToolbar: React.FC<ImageQuickToolbarProps> = ({
  layer,
  selectedCount = 1,
  onDuplicate,
  onDuplicateSelected,
  onRemove,
  onDeleteSelected,
  onGroup,
  onScaleChange,
  onCenter,
  onUngroup,
  onFitToCanvas,
  onToggleLock,
  onToggleFlipHorizontal,
}) => {
  const isMultiple = selectedCount > 1;
  const canUngroup = ['MotionAdvisorCard', 'MotionProviderGrid', 'MotionTrustBadge', 'MotionComparisonCard', 'CustomGroup'].includes(layer.blockType ?? '');
  const activeInlineEditor = useActiveInlineEditor();
  const textControls = [
    {
      id: 'bold',
      label: 'Negrita',
      icon: Bold,
      isActive: activeInlineEditor?.editor.isActive('bold') ?? false,
      run: (editor: NonNullable<typeof activeInlineEditor>['editor']) => editor.chain().focus().toggleBold().run(),
    },
    {
      id: 'italic',
      label: 'Cursiva',
      icon: Italic,
      isActive: activeInlineEditor?.editor.isActive('italic') ?? false,
      run: (editor: NonNullable<typeof activeInlineEditor>['editor']) => editor.chain().focus().toggleItalic().run(),
    },
    {
      id: 'underline',
      label: 'Subrayado',
      icon: Underline,
      isActive: activeInlineEditor?.editor.isActive('underline') ?? false,
      run: (editor: NonNullable<typeof activeInlineEditor>['editor']) => editor.chain().focus().toggleUnderline().run(),
    },
    {
      id: 'strike',
      label: 'Tachado',
      icon: Strikethrough,
      isActive: activeInlineEditor?.editor.isActive('strike') ?? false,
      run: (editor: NonNullable<typeof activeInlineEditor>['editor']) => editor.chain().focus().toggleStrike().run(),
    },
  ] as const;
  const activeTextColor = activeInlineEditor?.editor.getAttributes('textStyle').color;
  const colorInputValue =
    typeof activeTextColor === 'string' && /^#[0-9a-f]{6}$/i.test(activeTextColor)
      ? activeTextColor
      : '#ffffff';

  return (
    <div data-inline-editor-toolbar className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-800 bg-slate-950/95 px-2 py-1.5 shadow-2xl backdrop-blur-xl select-none z-40 animate-fadeIn text-xs text-white">
      {/* IDENTIFICADOR / TÍTULO */}
      <span className="text-[11px] font-bold text-slate-200 px-1.5 border-r border-slate-800 max-w-[160px] truncate">
        {isMultiple ? `${selectedCount} Elementos` : layer.title}
      </span>

      {/* MULTISELECCIÓN: BOTÓN AGRUPAR (⌘G) */}
      {isMultiple && onGroup && (
        <button
          type="button"
          onClick={onGroup}
          className="flex items-center gap-1 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 px-2 py-1 text-[11px] font-bold text-brand-cyan hover:bg-brand-cyan/30 transition-colors shadow-xs"
          title="Agrupar elementos seleccionados (⌘G)"
        >
          <FolderPlus className="size-3.5" />
          <span>Agrupar</span>
        </button>
      )}

      {/* SINGLE SELECTION: ESCALA ZOOM (+ / -) */}
      {!isMultiple && (
        <>
          <button
            type="button"
            onClick={() => onScaleChange(layer.id, Math.round(((layer.scale ?? 1) - 0.1) * 10) / 10)}
            className="flex size-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Reducir tamaño (-10%)"
          >
            <ZoomOut className="size-3" />
          </button>
          <span className="text-[10px] font-mono font-bold text-brand-cyan min-w-[34px] text-center">
            {Math.round((layer.scale ?? 1) * 100)}%
          </span>
          <button
            type="button"
            onClick={() => onScaleChange(layer.id, Math.round(((layer.scale ?? 1) + 0.1) * 10) / 10)}
            className="flex size-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Aumentar tamaño (+10%)"
          >
            <ZoomIn className="size-3" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          {/* CENTRAR AL 50%, 50% */}
          <button
            type="button"
            onClick={() => onCenter(layer.id)}
            className="flex size-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Centrar en el lienzo"
          >
            <AlignCenter className="size-3.5" />
          </button>

          {/* AUTO-AJUSTAR AL LIENZO */}
          {onFitToCanvas && (
            <button
              type="button"
              onClick={() => onFitToCanvas(layer.id)}
              className="flex size-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Auto-ajustar al tamaño del lienzo"
            >
              <Maximize2 className="size-3.5" />
            </button>
          )}

          {/* VOLTEAR HORIZONTAL (FLIP H) */}
          {onToggleFlipHorizontal && (
            <button
              type="button"
              onClick={() => onToggleFlipHorizontal(layer.id)}
              className={`flex size-6 items-center justify-center rounded-lg transition-colors ${
                layer.flipHorizontal ? 'bg-primary/40 text-brand-cyan border border-brand-cyan/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title="Voltear horizontalmente (Flip H)"
            >
              <FlipHorizontal className="size-3.5" />
            </button>
          )}

          {/* BLOQUEO */}
          {onToggleLock && (
            <button
              type="button"
              onClick={() => onToggleLock(layer.id)}
              className={`flex size-6 items-center justify-center rounded-lg transition-colors ${
                layer.locked ? 'text-amber-300 hover:bg-amber-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title={layer.locked ? 'Desbloquear capa' : 'Bloquear capa (⌥⇧L)'}
            >
              {layer.locked ? <Unlock className="size-3.5" /> : <Lock className="size-3.5" />}
            </button>
          )}
        </>
      )}

      {activeInlineEditor && (
        <>
          <div className="h-4 w-px bg-slate-800 mx-0.5" />
          <div className="flex items-center gap-0.5" aria-label="Formato de texto">
            {textControls.map(({ id, label, icon: Icon, isActive, run }) => (
              <button
                key={id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  run(activeInlineEditor.editor);
                  activeInlineEditor.save();
                }}
                className={`flex size-6 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/40 text-brand-cyan ring-1 ring-brand-cyan/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title={label}
                aria-label={label}
                aria-pressed={isActive}
              >
                <Icon className="size-3.5" />
              </button>
            ))}
            <label
              className="relative flex size-6 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
              title="Color del texto seleccionado"
              aria-label="Color del texto seleccionado"
              onMouseDown={(event) => event.preventDefault()}
            >
              <span
                className="size-3.5 rounded-full border border-white/40"
                style={{ backgroundColor: colorInputValue }}
              />
              <input
                type="color"
                value={colorInputValue}
                onChange={(event) => {
                  activeInlineEditor.editor.chain().focus().setColor(event.target.value).run();
                  activeInlineEditor.save();
                }}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
                aria-label="Elegir color del texto seleccionado"
              />
            </label>
          </div>
        </>
      )}

      {/* DESAGRUPAR EN ELEMENTOS LIBRES */}
      {canUngroup && onUngroup && (
        <button
          type="button"
          onClick={() => onUngroup(layer.id)}
          className="flex items-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/30 px-2 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20 transition-colors shadow-xs"
          title="Desagrupar en elementos y capas independientes (⇧⌘G)"
        >
          <Ungroup className="size-3.5 text-amber-400" />
          <span>Desagrupar</span>
        </button>
      )}

      <div className="h-4 w-px bg-slate-800 mx-0.5" />

      {/* DUPLICAR */}
      <button
        type="button"
        onClick={() => {
          if (isMultiple && onDuplicateSelected) {
            onDuplicateSelected();
          } else {
            onDuplicate(layer.id);
          }
        }}
        className="flex size-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        title="Duplicar selección (⌘D)"
      >
        <Copy className="size-3.5" />
      </button>

      {/* ELIMINAR */}
      <button
        type="button"
        onClick={() => {
          if (isMultiple && onDeleteSelected) {
            onDeleteSelected();
          } else {
            onRemove(layer.id);
          }
        }}
        className="flex size-6 items-center justify-center rounded-lg text-rose-400 hover:bg-rose-950 hover:text-rose-300 transition-colors"
        title="Eliminar selección (DELETE)"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
};
