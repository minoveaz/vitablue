import React, { useMemo, useState } from 'react';
import { ImageProject } from '../../../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from '../../../utils/imageTemplates';
import { TEMPLATE_CATALOG, TEMPLATE_SCOPE_OPTIONS } from '../../../data/templateCatalog';

interface Props {
  onLoadTemplate: (template: ImageProject) => void;
}

export const ImageStudioTemplatesDrawer: React.FC<Props> = ({ onLoadTemplate }) => {
  const [scope, setScope] = useState<'system' | 'organization' | 'user'>('system');
  const [category, setCategory] = useState('all');
  const templates = useMemo(() => TEMPLATE_CATALOG.filter((item) => item.scope === scope && (category === 'all' || item.category === category)), [scope, category]);
  const categories = ['all', ...new Set(TEMPLATE_CATALOG.filter((item) => item.scope === scope).map((item) => item.category))];
  const sourceTemplates = scope === 'user' ? [] : INITIAL_IMAGE_TEMPLATES;
  return (
    <div className="space-y-3">
      <nav className="grid grid-cols-3 gap-1.5">
        {TEMPLATE_SCOPE_OPTIONS.map((item) => <button key={item.id} type="button" onClick={() => { setScope(item.id); setCategory('all'); }} className={`rounded-lg border px-2 py-2 text-[10px] font-semibold ${scope === item.id ? 'border-brand-cyan/60 bg-primary/40 text-brand-cyan' : 'border-slate-700 text-slate-400'}`}>{item.label}</button>)}
      </nav>
      {scope !== 'user' && <div className="flex flex-wrap gap-1.5">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-md border px-2 py-1 text-[9px] ${category === item ? 'border-brand-cyan/50 text-brand-cyan' : 'border-slate-800 text-slate-400'}`}>{item === 'all' ? 'Todos' : item}</button>)}</div>}
      {scope === 'user' ? <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-[10px] text-slate-500">Guarda una composición para verla en Míos.</div> : (
        <div className="grid grid-cols-2 gap-2.5">
          {templates.map((item, index) => {
            const template = sourceTemplates[index % Math.max(sourceTemplates.length, 1)];
            const preparedTemplate = template ? { ...template, id: `${template.id}-${item.id}`, title: item.name } : undefined;
            return <button key={item.id} type="button" disabled={!preparedTemplate} onClick={() => preparedTemplate && onLoadTemplate(preparedTemplate)} className="rounded-2xl border border-slate-800 bg-slate-950 p-2.5 text-left hover:border-primary transition-all">
              <div className="mb-2 flex h-24 items-center justify-center rounded-xl border border-slate-700/40 bg-primary/20"><span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">{item.aspectRatio}</span></div>
              <strong className="block truncate text-[11px] text-slate-100">{item.name}</strong><span className="text-[9px] text-slate-500">{item.category}</span>
            </button>;
          })}
        </div>
      )}
    </div>
  );
};
