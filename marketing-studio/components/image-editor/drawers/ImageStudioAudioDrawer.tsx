import React, { useState } from 'react';
import { Headphones, Play, Pause, Send, SlidersHorizontal } from 'lucide-react';

const AUDIO_TRACKS = [
  { name: 'Upbeat Corporate Lofi', type: 'Música', duration: '0:30', bpm: 110, license: 'VitaBlue' },
  { name: 'Warm Ambient Trust', type: 'Música', duration: '0:45', bpm: 90, license: 'Universal' },
  { name: 'Soft Notification', type: 'SFX', duration: '0:04', bpm: 0, license: 'Universal' },
  { name: 'Asesoría cercana', type: 'Locución', duration: '0:18', bpm: 0, license: 'VitaBlue' },
];

export const ImageStudioAudioDrawer: React.FC = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  return <div className="space-y-3">
    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4">
      <div className="flex items-center gap-2"><Headphones className="size-4 text-purple-300" /><strong className="text-xs text-purple-100">Audio para composiciones animadas</strong></div>
      <p className="mt-1 text-[10px] leading-relaxed text-purple-200/70">Recursos listos para acompañar el diseño o enviarlos a Video Studio.</p>
    </div>
    <div className="flex flex-wrap gap-1.5">{['Todos', 'Música', 'SFX', 'Locuciones'].map((item) => <button key={item} type="button" className="rounded-md border border-slate-700 px-2 py-1 text-[9px] text-slate-300">{item}</button>)}</div>
    <div className="space-y-2">{AUDIO_TRACKS.map((track) => <div key={track.name} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
      <div className="flex items-center gap-3"><button type="button" onClick={() => setPlaying(playing === track.name ? null : track.name)} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-300">{playing === track.name ? <Pause className="size-4" /> : <Play className="ml-0.5 size-4" />}</button><div className="min-w-0 flex-1"><strong className="block truncate text-[11px] text-slate-100">{track.name}</strong><span className="text-[9px] text-slate-500">{track.type} · {track.duration} · {track.bpm ? `${track.bpm} BPM · ` : ''}{track.license}</span></div><span className="text-[9px] text-purple-300">Preview</span></div>
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-2"><button type="button" className="inline-flex items-center gap-1 rounded-md border border-purple-500/30 px-2 py-1 text-[9px] text-purple-200"><SlidersHorizontal className="size-3" /> Ajustar</button><button type="button" className="inline-flex items-center gap-1 rounded-md border border-brand-cyan/30 px-2 py-1 text-[9px] text-brand-cyan"><Send className="size-3" /> Video Studio</button></div>
    </div>)}</div>
  </div>;
};
