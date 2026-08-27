import React from 'react';
import { AlignHorizontalJustifyCenter, AlignHorizontalJustifyStart, AlignHorizontalJustifyEnd, AlignVerticalJustifyCenter, AlignVerticalJustifyStart, AlignVerticalJustifyEnd, Group, Rows3, Columns3 } from 'lucide-react';

interface MultiSelectionContextualToolbarProps {
  count: number;
  onAlign: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistribute?: (direction: 'horizontal' | 'vertical') => void;
  onGroup?: () => void;
}

const buttonClass = 'flex size-8 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/80 text-slate-200 hover:border-brand-cyan/60 hover:bg-primary/20 hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan';

export const MultiSelectionContextualToolbar: React.FC<MultiSelectionContextualToolbarProps> = ({ count, onAlign, onDistribute, onGroup }) => (
  <div className="flex w-full flex-wrap items-center justify-center gap-1.5" aria-label={`Herramientas para ${count} elementos seleccionados`}>
    <span className="mr-1 border-r border-slate-800 px-2 text-[11px] font-bold text-slate-300">{count} elementos</span>
    {([
      ['left', AlignHorizontalJustifyStart, 'Alinear a la izquierda'],
      ['center', AlignHorizontalJustifyCenter, 'Centrar horizontalmente'],
      ['right', AlignHorizontalJustifyEnd, 'Alinear a la derecha'],
      ['top', AlignVerticalJustifyStart, 'Alinear arriba'],
      ['middle', AlignVerticalJustifyCenter, 'Centrar verticalmente'],
      ['bottom', AlignVerticalJustifyEnd, 'Alinear abajo'],
    ] as const).map(([alignment, Icon, label]) => (
      <button key={alignment} type="button" className={buttonClass} onClick={() => onAlign(alignment)} title={label} aria-label={label}>
        <Icon className="size-3.5" />
      </button>
    ))}
    {onDistribute && (
      <>
        <button type="button" className={buttonClass} onClick={() => onDistribute('horizontal')} title="Distribuir horizontalmente" aria-label="Distribuir horizontalmente"><Columns3 className="size-3.5" /></button>
        <button type="button" className={buttonClass} onClick={() => onDistribute('vertical')} title="Distribuir verticalmente" aria-label="Distribuir verticalmente"><Rows3 className="size-3.5" /></button>
      </>
    )}
    {onGroup && <button type="button" className={buttonClass} onClick={onGroup} title="Agrupar elementos" aria-label="Agrupar elementos"><Group className="size-3.5" /></button>}
  </div>
);
