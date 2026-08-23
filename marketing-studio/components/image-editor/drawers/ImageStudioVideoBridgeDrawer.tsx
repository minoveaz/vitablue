import React, { useState } from 'react';
import { Film, Music2, MoveRight, Sparkles } from 'lucide-react';

export interface VideoPreparationSettings {
  format: 'vertical' | 'square' | 'landscape';
  durationInSeconds: 5 | 10 | 15 | 30;
  structure: 'single-scene' | 'sequence';
  audio: 'none' | 'music' | 'voiceover';
  motion: 'subtle-zoom' | 'text-entrance' | 'transitions' | 'automatic';
}

interface Props {
  onPrepare: (settings: VideoPreparationSettings) => void;
}

export const ImageStudioVideoBridgeDrawer: React.FC<Props> = ({ onPrepare }) => {
  const [settings, setSettings] = useState<VideoPreparationSettings>({
    format: 'vertical', durationInSeconds: 15, structure: 'single-scene', audio: 'music', motion: 'automatic',
  });
  const update = <K extends keyof VideoPreparationSettings>(key: K, value: VideoPreparationSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-teal-500/30 bg-teal-950/20 p-4">
        <div className="flex items-center gap-2 text-teal-200"><Film className="size-4" /><strong className="text-xs font-bold">Preparar composición de vídeo</strong></div>
        <p className="mt-2 text-[11px] leading-relaxed text-teal-300/80">Define el punto de partida. La edición temporal continuará en Video Studio.</p>
      </div>
      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs">
        <label className="block font-bold text-slate-300">Formato
          <select value={settings.format} onChange={(e) => update('format', e.target.value as VideoPreparationSettings['format'])} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-200">
            <option value="vertical">Reel / Story · 9:16</option><option value="square">Cuadrado · 1:1</option><option value="landscape">Horizontal · 16:9</option>
          </select>
        </label>
        <label className="block font-bold text-slate-300">Duración inicial
          <select value={settings.durationInSeconds} onChange={(e) => update('durationInSeconds', Number(e.target.value) as VideoPreparationSettings['durationInSeconds'])} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-200">
            {[5, 10, 15, 30].map((value) => <option key={value} value={value}>{value} segundos</option>)}
          </select>
        </label>
        <label className="block font-bold text-slate-300">Estructura
          <select value={settings.structure} onChange={(e) => update('structure', e.target.value as VideoPreparationSettings['structure'])} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-200">
            <option value="single-scene">Composición actual como una escena</option><option value="sequence">Preparar secuencia de recursos</option>
          </select>
        </label>
        <label className="block font-bold text-slate-300">Audio
          <select value={settings.audio} onChange={(e) => update('audio', e.target.value as VideoPreparationSettings['audio'])} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-200">
            <option value="music">Música</option><option value="voiceover">Locución</option><option value="none">Sin audio</option>
          </select>
        </label>
        <label className="block font-bold text-slate-300">Movimiento inicial
          <select value={settings.motion} onChange={(e) => update('motion', e.target.value as VideoPreparationSettings['motion'])} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-200">
            <option value="automatic">Automático</option><option value="subtle-zoom">Zoom suave</option><option value="text-entrance">Entrada de textos</option><option value="transitions">Transiciones</option>
          </select>
        </label>
      </div>
      <button type="button" onClick={() => onPrepare(settings)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2.5 text-xs font-black text-primary-dark shadow-md">
        <Sparkles className="size-3.5" /> Preparar y continuar en Video Studio <MoveRight className="size-3.5" />
      </button>
      <div className="flex items-center gap-2 text-[10px] text-slate-500"><Music2 className="size-3" /> El audio, timeline y animaciones se añadirán allí.</div>
    </div>
  );
};
