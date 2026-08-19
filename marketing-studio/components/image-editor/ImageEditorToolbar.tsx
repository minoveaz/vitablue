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
  ArrowLeft,
  Copy,
  Check,
  Pencil,
  MoreHorizontal,
} from 'lucide-react';
import { ImageFormatPreset, IMAGE_FORMAT_PRESETS, ImageProject } from '../../types/imageStudio';

export interface ImageEditorToolbarProps {
  project: ImageProject;
  canUndo: boolean;
  canRedo: boolean;
  isExporting: boolean;
  showSafeZones: boolean;
  isInspectorOpen: boolean;
  lastSavedAt?: string;
  onBackToHub?: () => void;
  onToggleInspector: () => void;
  onToggleSafeZones: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onUpdateTitle: (title: string) => void;
  onSetPreset: (preset: ImageFormatPreset) => void;
  onCopyToClipboard?: () => void;
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
  lastSavedAt,
  onBackToHub,
  onToggleInspector,
  onToggleSafeZones,
  onUndo,
  onRedo,
  onUpdateTitle,
  onSetPreset,
  onCopyToClipboard,
  onExport,
  onSaveToDam,
}) => {
  const [copied, setCopied] = useState(false);
  const [isResizeOpen, setIsResizeOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [damSaved, setDamSaved] = useState(false);

  const resizeRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (resizeRef.current && !resizeRef.current.contains(e.target as Node)) {
        setIsResizeOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
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
    if (presetId.includes('square')) return <Square className="size-3.5" />;
    if (presetId.includes('story') || presetId.includes('portrait')) return <Smartphone className="size-3.5" />;
    if (presetId.includes('landscape')) return <Tv className="size-3.5" />;
    if (presetId.includes('facebook')) return <Facebook className="size-3.5" />;
    return <Linkedin className="size-3.5" />;
  };

  return (
    <div className="flex h-10 w-full items-center justify-between gap-2.5 text-white select-none">
      {/* 1. SECCIÓN IZQUIERDA: VOLVER + NOMBRE DEL DISEÑO + ESTADO DE GUARDADO */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {onBackToHub && (
          <button
            type="button"
            onClick={onBackToHub}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-700 transition-colors shrink-0"
            title="Volver al Hub de proyectos"
          >
            <ArrowLeft className="size-3.5 text-slate-400" />
            <span className="hidden sm:inline">Hub</span>
          </button>
        )}

        <div className="flex items-center gap-2 min-w-0 max-w-[280px] sm:max-w-xs md:max-w-sm">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-brand-cyan shrink-0">
            <ImageIcon className="size-3.5" />
          </div>
          <div className="relative group flex items-center flex-1 min-w-0">
            <input
              type="text"
              value={project.title}
              onChange={(e) => onUpdateTitle(e.target.value)}
              placeholder="Nombre del diseño..."
              className="text-xs font-bold text-slate-100 bg-slate-900/60 hover:bg-slate-900 focus:bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-brand-cyan rounded-lg pl-2.5 pr-7 py-1 w-full transition-all outline-none shadow-inner truncate"
              title="Haz clic para cambiar el nombre de la imagen"
            />
            <Pencil className="absolute right-2 size-3 text-slate-500 group-hover:text-slate-300 pointer-events-none transition-colors" />
          </div>
        </div>

        {/* INDICADOR DISCRETO DE AUTOGUARDADO */}
        <div
          className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0"
          title={lastSavedAt ? `Guardado localmente: ${new Date(lastSavedAt).toLocaleTimeString()}` : 'Guardado en LocalStorage'}
        >
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Guardado</span>
        </div>
      </div>

      {/* 2. SECCIÓN CENTRAL: SELECTOR UNIFICADO DE FORMATO + DESHACER / REHACER */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* SELECTOR DESPLEGABLE ÚNICO DE FORMATOS */}
        <div className="relative" ref={resizeRef}>
          <button
            type="button"
            onClick={() => setIsResizeOpen(!isResizeOpen)}
            className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/15 hover:bg-primary/25 px-2.5 py-1 text-xs font-bold text-brand-cyan transition-all shadow-xs"
            title="Cambiar formato o resolución del lienzo"
          >
            {getPresetIcon(project.preset.id)}
            <span>{project.preset.aspectRatio}</span>
            <span className="hidden md:inline font-normal text-slate-400">· {project.preset.name}</span>
            <ChevronDown className="size-3 text-slate-400" />
          </button>

          {isResizeOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50 animate-fadeIn">
              <div className="px-2.5 py-1.5 border-b border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="size-3 text-accent" />
                  <span>Formatos y Resoluciones</span>
                </span>
              </div>
              <div className="mt-1 space-y-1 max-h-72 overflow-y-auto custom-scrollbar">
                {IMAGE_FORMAT_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSetPreset(p);
                      setIsResizeOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-colors ${
                      p.id === project.preset.id
                        ? 'bg-primary/25 text-brand-cyan font-bold border border-primary/40'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {getPresetIcon(p.id)}
                      <div className="flex flex-col min-w-0">
                        <strong className="truncate text-xs">{p.name}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {p.width} × {p.height} px
                        </span>
                      </div>
                    </div>
                    <span className="rounded bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 font-bold">
                      {p.aspectRatio}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DESHACER / REHACER COMPACTO */}
        <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-0.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex size-6 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-25 transition-colors"
            title="Deshacer (Cmd+Z)"
          >
            <Undo2 className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex size-6 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-25 transition-colors"
            title="Rehacer (Cmd+Shift+Z)"
          >
            <Redo2 className="size-3.5" />
          </button>
        </div>

        {/* TOGGLE SAFE ZONES (ICONO CON ESTADO) */}
        <button
          type="button"
          onClick={onToggleSafeZones}
          className={`flex items-center justify-center size-7 rounded-lg border transition-all ${
            showSafeZones
              ? 'border-accent bg-accent/20 text-accent shadow-xs'
              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
          title={showSafeZones ? 'Ocultar márgenes de seguridad (Safe Zones)' : 'Mostrar márgenes de seguridad para historias/reels'}
        >
          <ShieldAlert className="size-3.5" />
        </button>
      </div>

      {/* 3. SECCIÓN DERECHA: HERRAMIENTAS, COPIAR Y DESCARGAR */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* TOGGLE PANEL PROPIEDADES */}
        <button
          type="button"
          onClick={onToggleInspector}
          className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold transition-all ${
            isInspectorOpen
              ? 'border-primary bg-primary text-white shadow-xs'
              : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Mostrar / Ocultar panel de propiedades (Inspector)"
        >
          <SlidersHorizontal className="size-3.5" />
          <span className="hidden md:inline">Propiedades</span>
        </button>

        {/* COPIAR AL PORTAPAPELES (1-CLIC) */}
        {onCopyToClipboard && (
          <button
            type="button"
            onClick={async () => {
              await onCopyToClipboard();
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold transition-all ${
              copied
                ? 'border-teal-500 bg-teal-950/60 text-brand-cyan shadow-xs'
                : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Copiar imagen al portapapeles (lista para pegar con Ctrl+V)"
          >
            {copied ? <Check className="size-3.5 text-brand-cyan" /> : <Copy className="size-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{copied ? '¡Copiada!' : 'Copiar'}</span>
          </button>
        )}

        {/* MENÚ MÁS OPCIONES (DAM & VIDEO STUDIO) */}
        <div className="relative" ref={moreMenuRef}>
          <button
            type="button"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className="flex items-center justify-center size-7 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            title="Más opciones e integraciones"
          >
            <MoreHorizontal className="size-4" />
          </button>

          {isMoreMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-slate-800 bg-slate-950 p-1.5 shadow-2xl z-50 animate-fadeIn text-white text-xs">
              <button
                type="button"
                onClick={() => {
                  handleSaveDam();
                  setIsMoreMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-slate-200 hover:bg-slate-900 transition-colors"
              >
                {damSaved ? <CheckCircle2 className="size-4 text-emerald-400" /> : <Layers className="size-4 text-slate-400" />}
                <span>{damSaved ? 'Guardado en DAM' : 'Guardar en DAM'}</span>
              </button>

              <Link
                to="/backoffice/marketing-studio/generador-contenido"
                onClick={() => setIsMoreMenuOpen(false)}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-slate-200 hover:bg-slate-900 transition-colors"
              >
                <Video className="size-4 text-brand-cyan" />
                <span>Abrir en Video Studio</span>
              </Link>
            </div>
          )}
        </div>

        {/* BOTÓN PRINCIPAL DESCARGAR CON DROPDOWN */}
        <div className="relative" ref={exportRef}>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="flex items-center gap-1.5 rounded-xl bg-accent px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-sm transition-all disabled:opacity-50"
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
