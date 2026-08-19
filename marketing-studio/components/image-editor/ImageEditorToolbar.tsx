import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  Smartphone,
  Square,
  Tv,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Download,
  LoaderCircle,
  CheckCircle2,
  Undo2,
  Redo2,
  Video,
  ChevronDown,
  Facebook,
  Linkedin,
  Layers,
} from 'lucide-react';
import { ImageFormatPreset, IMAGE_FORMAT_PRESETS, ImageProject } from '../../types/imageStudio';

export interface ImageEditorToolbarProps {
  project: ImageProject;
  canUndo: boolean;
  canRedo: boolean;
  isExporting: boolean;
  showSafeZones: boolean;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
  onToggleSafeZones: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onUpdateTitle: (title: string) => void;
  onSetPreset: (preset: ImageFormatPreset) => void;
  onExport: (format: 'png' | 'jpeg' | 'svg') => void;
  onSaveToDam: () => void;
}

export const ImageEditorToolbar: React.FC<ImageEditorToolbarProps> = ({
  project,
  canUndo,
  canRedo,
  isExporting,
  showSafeZones,
  isInspectorOpen,
  onToggleInspector,
  onToggleSafeZones,
  onUndo,
  onRedo,
  onUpdateTitle,
  onSetPreset,
  onExport,
  onSaveToDam,
}) => {
  const [isResizeOpen, setIsResizeOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [damSaved, setDamSaved] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (resizeRef.current && !resizeRef.current.contains(e.target as Node)) {
        setIsResizeOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveDam = () => {
    onSaveToDam();
    setDamSaved(true);
    setTimeout(() => setDamSaved(false), 2500);
  };

  const getPresetIcon = (presetId: string) => {
    if (presetId.includes('story') || presetId.includes('portrait')) return <Smartphone className="size-3.5" />;
    if (presetId.includes('square')) return <Square className="size-3.5" />;
    if (presetId.includes('landscape')) return <Tv className="size-3.5" />;
    if (presetId.includes('facebook')) return <Facebook className="size-3.5" />;
    return <Linkedin className="size-3.5" />;
  };

  return (
    <div className="flex h-10 w-full items-center justify-between gap-3 text-white select-none">
      {/* SECCIÓN IZQUIERDA: TÍTULO DEL PROYECTO + PRESET ACTIVO */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800 shrink-0">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-brand-cyan">
            <ImageIcon className="size-3.5" />
          </div>
          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="truncate text-xs font-bold text-slate-100 bg-transparent hover:bg-slate-900/60 focus:bg-slate-900 border border-transparent hover:border-slate-800 focus:border-primary rounded-md px-1.5 py-0.5 max-w-[180px] sm:max-w-[220px] transition-all outline-none"
          />
        </div>

        {/* SELECTOR RÁPIDO DE FORMATOS Y MAGIC RESIZE */}
        <div className="flex items-center gap-1">
          {IMAGE_FORMAT_PRESETS.slice(0, 4).map((p) => {
            const isSelected = p.id === project.preset.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSetPreset(p)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/20 text-brand-cyan shadow-xs'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
                title={`${p.name} (${p.width}x${p.height}px)`}
              >
                {getPresetIcon(p.id)}
                <span className="hidden xl:inline">{p.aspectRatio}</span>
              </button>
            );
          })}

          {/* DROPDOWN MAGIC RESIZE */}
          <div className="relative" ref={resizeRef}>
            <button
              type="button"
              onClick={() => setIsResizeOpen(!isResizeOpen)}
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
              title="Más resoluciones y tamaños de portada"
            >
              <Sparkles className="size-3 text-accent" />
              <ChevronDown className="size-3" />
            </button>

            {isResizeOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50 animate-fadeIn">
                <div className="px-2.5 py-1.5 border-b border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="size-3 text-accent" />
                    <span>Magic Resize Presets</span>
                  </span>
                </div>
                <div className="mt-1 space-y-1 max-h-72 overflow-y-auto">
                  {IMAGE_FORMAT_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onSetPreset(p);
                        setIsResizeOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors ${
                        p.id === project.preset.id
                          ? 'bg-primary/20 text-brand-cyan font-bold'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getPresetIcon(p.id)}
                        <span>{p.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{p.aspectRatio}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* UNDO / REDO */}
        <div className="hidden lg:flex items-center rounded-lg border border-slate-800 bg-slate-950 p-0.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex size-6 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition-colors"
            title="Deshacer (Cmd+Z)"
          >
            <Undo2 className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex size-6 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition-colors"
            title="Rehacer (Cmd+Shift+Z)"
          >
            <Redo2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* SECCIÓN DERECHA: ACCIONES, ESTADO Y EXPORTACIÓN */}
      <div className="flex items-center gap-2 shrink-0">
        {/* BOTÓN SAFE ZONES */}
        <button
          type="button"
          onClick={onToggleSafeZones}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${
            showSafeZones
              ? 'border-accent bg-accent/20 text-accent shadow-xs'
              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
          title="Alternar márgenes de seguridad para historias/reels"
        >
          <ShieldAlert className="size-3.5" />
          <span className="hidden sm:inline">Safe Zones</span>
        </button>

        {/* ESTADO GUARDADO / DAM */}
        <button
          type="button"
          onClick={handleSaveDam}
          className="hidden md:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-bold text-slate-300 hover:bg-slate-900 transition-colors"
          title="Guardar en DAM de activos"
        >
          {damSaved ? <CheckCircle2 className="size-3.5 text-emerald-400" /> : <Layers className="size-3.5 text-slate-400" />}
          <span>{damSaved ? 'Guardado en DAM' : 'Guardar DAM'}</span>
        </button>

        {/* TOGGLE PANEL PROPIEDADES */}
        <button
          type="button"
          onClick={onToggleInspector}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${
            isInspectorOpen
              ? 'border-primary bg-primary text-white shadow-xs'
              : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Mostrar / Ocultar panel de propiedades"
        >
          <SlidersHorizontal className="size-3.5" />
          <span>Propiedades</span>
        </button>

        {/* ENLACE A VIDEO STUDIO */}
        <Link
          to="/backoffice/marketing-studio/generador-contenido"
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title="Abrir Video Studio (Reels & MP4)"
        >
          <Video className="size-3.5 text-brand-cyan" />
          <span className="hidden sm:inline">Video Studio</span>
        </Link>

        {/* BOTÓN PRINCIPAL DESCARGAR CON DROPDOWN */}
        <div className="relative" ref={exportRef}>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-sm transition-all disabled:opacity-50"
          >
            {isExporting ? <LoaderCircle className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            <span>Descargar</span>
            <ChevronDown className="size-3" />
          </button>

          {isExportMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-800 bg-slate-950 p-1.5 shadow-2xl z-50 animate-fadeIn text-white">
              <button
                type="button"
                onClick={() => {
                  onExport('png');
                  setIsExportMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-200 hover:bg-slate-900 transition-colors"
              >
                <span>Descargar PNG</span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-brand-cyan">1080p</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onExport('jpeg');
                  setIsExportMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-200 hover:bg-slate-900 transition-colors"
              >
                <span>Descargar JPEG</span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-400">Web</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onExport('svg');
                  setIsExportMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-200 hover:bg-slate-900 transition-colors"
              >
                <span>Descargar SVG</span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-400">Vector</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
