import React from 'react';
import { Activity, Clock3 } from 'lucide-react';

export interface CampaignActivityEntry {
  id: string;
  label: string;
  detail?: string;
  createdAt: string;
}

interface CampaignActivityPanelProps {
  entries: CampaignActivityEntry[];
}

export const CampaignActivityPanel: React.FC<CampaignActivityPanelProps> = ({ entries }) => (
  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="campaign-activity-title">
    <div className="flex items-center gap-2 text-primary"><Activity size={18} /><p className="text-[10px] font-black uppercase tracking-[0.18em]">Trazabilidad</p></div>
    <h2 id="campaign-activity-title" className="mt-1 font-display text-xl font-black text-slate-800">Actividad reciente</h2>
    {entries.length === 0 ? <p className="mt-3 text-xs font-semibold text-slate-500">Los cambios de esta campaña aparecerán aquí.</p> : <div className="mt-4 space-y-3">{entries.map((entry) => <div key={entry.id} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><Clock3 size={14} className="mt-0.5 shrink-0 text-slate-400" /><div><p className="text-xs font-black text-slate-700">{entry.label}</p>{entry.detail && <p className="mt-0.5 text-[10px] font-semibold text-slate-500">{entry.detail}</p>}<p className="mt-1 text-[10px] text-slate-400">{new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(entry.createdAt))}</p></div></div>)}</div>}
  </section>
);
