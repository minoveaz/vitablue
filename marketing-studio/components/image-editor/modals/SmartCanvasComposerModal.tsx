import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Sun,
  Moon,
  GraduationCap,
  ShieldCheck,
  MessageCircle,
  SplitSquareVertical,
  Mail,
  Flame,
  Check,
  ChevronRight,
  Wand2,
} from 'lucide-react';
import { ImageFormatPreset } from '../../../types/imageStudio';
import {
  SMART_OBJECTIVES,
  SmartCanvasObjective,
  SmartComposerOptions,
} from '../../../utils/smartCanvasComposer';

export interface SmartCanvasComposerModalProps {
  isOpen: boolean;
  currentPreset: ImageFormatPreset;
  onCompose: (options: SmartComposerOptions) => void;
  onClose: () => void;
}

export const SmartCanvasComposerModal: React.FC<SmartCanvasComposerModalProps> = ({
  isOpen,
  currentPreset,
  onCompose,
  onClose,
}) => {
  const [selectedObjective, setSelectedObjective] = useState<SmartCanvasObjective>('visa_student');
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('light');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(currentPreset?.id ?? 'instagram-portrait');

  const popularPresets = [
    { id: 'instagram-portrait', name: 'Post Instagram (4:5)', ratio: '4:5', dims: '1080 × 1350' },
    { id: 'story-vertical', name: 'Historia & Reel (9:16)', ratio: '9:16', dims: '1080 × 1920' },
    { id: 'instagram-square', name: 'Cuadrado (1:1)', ratio: '1:1', dims: '1080 × 1080' },
    { id: 'twitter-post', name: 'Twitter / X (16:9)', ratio: '16:9', dims: '1200 × 675' },
    { id: 'email-header-newsletter', name: 'Newsletter (Email)', ratio: '2.4:1', dims: '600 × 250' },
  ];

  const getObjectiveIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="size-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="size-5" />;
      case 'MessageCircle':
        return <MessageCircle className="size-5" />;
      case 'SplitSquareVertical':
        return <SplitSquareVertical className="size-5" />;
      case 'Mail':
        return <Mail className="size-5" />;
      case 'Sparkles':
      default:
        return <Flame className="size-5" />;
    }
  };

  const handleGenerate = () => {
    onCompose({
      objective: selectedObjective,
      theme: selectedTheme,
      presetId: selectedPresetId,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="relative flex flex-col w-full max-w-3xl max-h-[90vh] rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-accent text-slate-950 shadow-lg shadow-amber-500/20">
              <Wand2 className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-100">
                  Generador Mágico de Lienzo por Objetivo
                </h2>
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  Auto-Composer IA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Compone instantáneamente un arte publicitario de alta conversión calibrado para tu canal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 2. BODY CON PASOS */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-5">
          {/* PASO 1: SELECCIONAR OBJETIVO DE CONVERSIÓN */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-brand-cyan text-[10px]">
                  1
                </span>
                <span>Objetivo de la Publicación</span>
              </label>
              <span className="text-[11px] text-slate-500">Elige el mensaje clave</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {SMART_OBJECTIVES.map((obj) => {
                const isSelected = selectedObjective === obj.id;
                return (
                  <div
                    key={obj.id}
                    onClick={() => {
                      setSelectedObjective(obj.id);
                      if (obj.recommendedPreset) {
                        setSelectedPresetId(obj.recommendedPreset);
                      }
                    }}
                    className={`group relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 shadow-lg ring-1 ring-amber-400/40'
                        : 'border-slate-800/90 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`flex size-8 items-center justify-center rounded-xl border ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-amber-400'
                              : 'bg-slate-800 text-slate-400 border-slate-700 group-hover:text-slate-200'
                          }`}
                        >
                          {getObjectiveIcon(obj.icon)}
                        </div>

                        {isSelected && (
                          <span className="flex size-5 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-xs">
                            <Check className="size-3 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300 block mb-1">
                        {obj.name}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                        {obj.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">
                        {obj.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PASO 2: TEMA Y PALETA VISUAL */}
          <div className="space-y-2.5 pt-2 border-t border-slate-900">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-brand-cyan text-[10px]">
                  2
                </span>
                <span>Estilo & Tono Visual</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* MODO CLARO */}
              <button
                type="button"
                onClick={() => setSelectedTheme('light')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  selectedTheme === 'light'
                    ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400/40 shadow-md'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300">
                  <Sun className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-100 block">☀️ Modo Claro Luminoso</span>
                  <span className="text-[11px] text-slate-400">Fondos Ocean Breeze & Amber Sunrise con alto contraste</span>
                </div>
              </button>

              {/* MODO OSCURO */}
              <button
                type="button"
                onClick={() => setSelectedTheme('dark')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  selectedTheme === 'dark'
                    ? 'border-brand-cyan bg-primary/20 ring-1 ring-brand-cyan/40 shadow-md'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/30 border border-brand-cyan/40 text-brand-cyan">
                  <Moon className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-100 block">🌙 Modo Oscuro Premium</span>
                  <span className="text-[11px] text-slate-400">Fondos Ocean Mesh & Midnight Deep para anuncios nocturnos</span>
                </div>
              </button>
            </div>
          </div>

          {/* PASO 3: FORMATO DESTINO */}
          <div className="space-y-2.5 pt-2 border-t border-slate-900">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-brand-cyan text-[10px]">
                  3
                </span>
                <span>Formato de Salida</span>
              </label>
              <span className="text-[11px] text-slate-500">Se adapta automáticamente</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {popularPresets.map((p) => {
                const isSelected = selectedPresetId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPresetId(p.id)}
                    className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-cyan bg-primary/30 text-white shadow-xs ring-1 ring-brand-cyan/40'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold truncate">{p.name}</span>
                      <span className="text-[10px] font-mono font-bold text-brand-cyan">{p.ratio}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{p.dims}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. FOOTER CON BOTÓN DE GENERACIÓN */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="size-4 text-amber-400" />
            <span>Genera automáticamente el fondo, titular, bloques y botón CTA.</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-accent text-slate-950 text-xs font-black shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Wand2 className="size-4" />
              <span>Componer Lienzo Automáticamente</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
