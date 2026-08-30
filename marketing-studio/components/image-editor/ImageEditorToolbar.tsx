import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  ShieldAlert,
  SlidersHorizontal,
  Download,
  LoaderCircle,
  CheckCircle2,
  Undo2,
  Redo2,
  Video,
  ChevronDown,
  Layers,
  ArrowLeft,
  Copy,
  Check,
  Pencil,
  MoreHorizontal,
  Smartphone,
  Focus,
  Ruler,
  Scan,
  PanelTop,
} from 'lucide-react';
import { ImageFormatPreset, ImagePreviewMode, ImageProject } from '../../types/imageStudio';
import { useActiveInlineEditor } from './InlineEditorContext';
import { LiveStatus } from '../../../components/backoffice-shell/primitives';
import type { CreativeStudioEditorState } from '../../../components/backoffice-shell/contracts/creativeStudioShell';

export interface ImageEditorToolbarProps {
  project: ImageProject;
  canUndo: boolean;
  canRedo: boolean;
  isExporting: boolean;
  showSafeZones: boolean;
  previewMode: ImagePreviewMode;
  isInspectorOpen: boolean;
  lastSavedAt?: string;
  saveState?: CreativeStudioEditorState;
  onRetrySave?: () => void;
  onBackToHub?: () => void;
  onToggleInspector: () => void;
  onToggleSafeZones: () => void;
  onSetPreviewMode: (mode: ImagePreviewMode) => void;
  onOpenCarouselSimulator?: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onUpdateTitle: (title: string) => void;
  onSetPreset?: (preset: ImageFormatPreset) => void;
  onCopyToClipboard?: () => void;
  onExport: (format: 'png' | 'jpeg' | 'svg') => void;
  onExportCarousel?: (format: 'zip' | 'pdf' | 'full') => void;
  onSaveToDam: () => void;
  onSendToVideoStudio?: () => void;
}

export const ImageEditorToolbar: React.FC<ImageEditorToolbarProps> = ({
  project,
  canUndo,
  canRedo,
  isExporting,
  showSafeZones,
  previewMode,
  isInspectorOpen,
  lastSavedAt,
  saveState,
  onRetrySave,
  onBackToHub,
  onToggleInspector,
  onToggleSafeZones,
  onSetPreviewMode,
  onOpenCarouselSimulator,
  onUndo,
  onRedo,
  onUpdateTitle,
  onCopyToClipboard,
  onExport,
  onExportCarousel,
  onSaveToDam,
  onSendToVideoStudio,
}) => {
  const activeInlineEditor = useActiveInlineEditor();
  const [copied, setCopied] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [damSaved, setDamSaved] = useState(false);

  const exportRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
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

  return (
    <div role="toolbar" aria-label="Controles de Image Studio" className="flex min-h-11 w-full max-w-full flex-wrap items-center justify-between gap-2.5 overflow-x-auto py-0.5 text-white select-none">
      {/* 1. SECCIÓN IZQUIERDA: VOLVER + NOMBRE DEL DISEÑO + ESTADO DE GUARDADO */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {onBackToHub && (
          <button
            type="button"
            onClick={onBackToHub}
            aria-label="Volver al Hub de proyectos"
            className="flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-700 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
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

        {/* INDICADOR DINÁMICO DE AUTOGUARDADO */}
        <LiveStatus
          status={saveState ?? 'saved'}
          lastSavedAt={lastSavedAt}
          onRetry={onRetrySave}
          className="min-h-0 shrink-0 rounded-full border border-slate-800 px-2 py-0.5 text-[10px] font-mono"
        />
      </div>

      {/* 2. SECCIÓN CENTRAL: DESHACER / REHACER COMPACTO */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-0.5 shadow-xs">
          <button
            type="button"
            onClick={() => {
              if (activeInlineEditor) {
                activeInlineEditor.editor.commands.undo();
                activeInlineEditor.save();
              } else {
                onUndo();
              }
            }}
            disabled={activeInlineEditor ? !activeInlineEditor.editor.can().undo() : !canUndo}
            aria-label="Deshacer"
            className="flex min-h-11 min-w-11 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
            title="Deshacer (Cmd+Z)"
          >
            <Undo2 className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (activeInlineEditor) {
                activeInlineEditor.editor.commands.redo();
                activeInlineEditor.save();
              } else {
                onRedo();
              }
            }}
            disabled={activeInlineEditor ? !activeInlineEditor.editor.can().redo() : !canRedo}
            aria-label="Rehacer"
            className="flex min-h-11 min-w-11 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
            title="Rehacer (Cmd+Shift+Z)"
          >
            <Redo2 className="size-3.5" />
          </button>
        </div>
        <div className="hidden lg:flex items-center gap-0.5 rounded-xl border border-slate-800 bg-slate-950 p-0.5">
          {([
            ['normal', PanelTop, 'Vista normal'],
            ['focus', Focus, 'Enfocar slide activo'],
            ['guides', Ruler, 'Vista de guías'],
            ['overview', Scan, 'Vista panorámica'],
          ] as const).map(([mode, Icon, label]) => (
            <button
              key={mode}
              type="button"
              aria-pressed={previewMode === mode}
              onClick={() => onSetPreviewMode(mode)}
              aria-label={label}
              className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
                previewMode === mode
                  ? 'bg-primary/30 text-brand-cyan'
                  : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
              }`}
              title={label}
            >
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>

        {/* TOGGLE SAFE ZONES (ICONO CON ESTADO) */}
        <button
          type="button"
          onClick={onToggleSafeZones}
          aria-label={showSafeZones ? 'Ocultar zonas seguras' : 'Mostrar zonas seguras'}
          aria-pressed={showSafeZones}
          className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
            showSafeZones
              ? 'border-accent bg-accent/20 text-accent shadow-xs'
              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
          title={showSafeZones ? 'Ocultar reglas, guías y zonas seguras' : 'Mostrar reglas, guías y zonas seguras de plataforma'}
        >
          <ShieldAlert className="size-3.5" />
        </button>

        {/* VISTA PREVIA MÓVIL (SIMULADOR DE SWIPE) SI ES CARRUSEL */}
        {project.preset.isCarousel && onOpenCarouselSimulator && (
          <button
            type="button"
            onClick={onOpenCarouselSimulator}
            className="flex min-h-11 items-center gap-1.5 rounded-lg border border-brand-cyan/40 bg-brand-cyan/15 px-2.5 py-1 text-xs font-bold text-brand-cyan hover:bg-brand-cyan/25 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
            title="Abrir simulador móvil interactivo para probar el deslizamiento (swipe)"
          >
            <Smartphone className="size-3.5" />
            <span className="hidden sm:inline">Vista Previa Móvil</span>
          </button>
        )}
      </div>

      {/* 3. SECCIÓN DERECHA: HERRAMIENTAS, COPIAR Y DESCARGAR */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* TOGGLE PANEL PROPIEDADES */}
        <button
          type="button"
          onClick={onToggleInspector}
          aria-label="Mostrar panel de propiedades"
          aria-pressed={isInspectorOpen}
          className={`flex min-h-11 items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
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
            className={`flex min-h-11 items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
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
            aria-label="Más opciones e integraciones"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
            title="Más opciones e integraciones"
          >
            <MoreHorizontal className="size-4" />
          </button>

          {isMoreMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-slate-800 bg-slate-950 p-1.5 shadow-2xl z-[100] animate-fadeIn text-white text-xs">
              <button
                type="button"
                onClick={() => {
                  handleSaveDam();
                  setIsMoreMenuOpen(false);
                }}
                className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-slate-200 hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
              >
                {damSaved ? <CheckCircle2 className="size-4 text-emerald-400" /> : <Layers className="size-4 text-slate-400" />}
                <span>{damSaved ? 'Guardado en DAM' : 'Guardar en DAM'}</span>
              </button>

              <Link
                to="/backoffice/marketing-studio/generador-contenido?from=image-studio"
                onClick={() => {
                  onSendToVideoStudio?.();
                  setIsMoreMenuOpen(false);
                }}
                className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-slate-200 hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
              >
                <Video className="size-4 text-brand-cyan" />
                <span>Preparar para Video Studio</span>
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
            aria-haspopup="menu"
            aria-expanded={isExportMenuOpen}
            aria-label="Descargar diseño"
            className="flex min-h-11 items-center gap-1.5 rounded-xl bg-accent px-3 py-1.5 text-xs font-bold text-primary-dark hover:bg-amber-400 shadow-sm transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
          >
            {isExporting ? <LoaderCircle className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            <span>Descargar</span>
            <ChevronDown className="size-3" />
          </button>

          {isExportMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-950 p-1.5 shadow-2xl z-[100] animate-fadeIn text-white">
              {project.preset.isCarousel ? (
                <>
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-cyan border-b border-slate-800/80 mb-1">
                    Exportación de Carrusel
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onExportCarousel) onExportCarousel('zip');
                      else onExport('png');
                      setIsExportMenuOpen(false);
                    }}
                    className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-200 hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                  >
                    <span>Pack de Diapositivas (ZIP)</span>
                    <span className="rounded bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.5 text-[9px] font-mono font-bold">1-Click</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onExportCarousel) onExportCarousel('pdf');
                      else onExport('png');
                      setIsExportMenuOpen(false);
                    }}
                    className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-200 hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                  >
                    <span>Documento LinkedIn (PDF)</span>
                    <span className="rounded bg-blue-500/20 text-blue-300 px-1.5 py-0.5 text-[9px] font-mono font-bold">Doc</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onExportCarousel) onExportCarousel('full');
                      else onExport('png');
                      setIsExportMenuOpen(false);
                    }}
                    className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-200 hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                  >
                    <span>Tira Panorámica Completa</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-400">PNG</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onExport('png');
                      setIsExportMenuOpen(false);
                    }}
                    className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-200 hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
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
                    className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-200 hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
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
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
