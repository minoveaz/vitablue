import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Undo2,
  Redo2,
  Download,
  Video,
  Layers,
  ChevronDown,
  Check,
  Smartphone,
  Square,
  Tv,
  Facebook,
  Linkedin,
  Twitter,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { ImageFormatPreset, IMAGE_FORMAT_PRESETS, ImageProject } from '../../types/imageStudio';

interface ImageEditorTopBarProps {
  project: ImageProject;
  canUndo: boolean;
  canRedo: boolean;
  isExporting: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onUpdateTitle: (title: string) => void;
  onSetPreset: (preset: ImageFormatPreset) => void;
  onExport: (format: 'png' | 'jpeg' | 'svg') => void;
  onSaveToDam: () => void;
}

export const ImageEditorTopBar: React.FC<ImageEditorTopBarProps> = ({
  project,
  canUndo,
  canRedo,
  isExporting,
  onUndo,
  onRedo,
  onUpdateTitle,
  onSetPreset,
  onExport,
  onSaveToDam,
}) => {
  const navigate = useNavigate();
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

  const getPresetIcon = (preset: ImageFormatPreset) => {
    if (preset.id.includes('story') || preset.id.includes('portrait')) return <Smartphone className="size-4 text-primary" />;
    if (preset.id.includes('square')) return <Square className="size-4 text-amber-500" />;
    if (preset.id.includes('landscape')) return <Tv className="size-4 text-purple-500" />;
    if (preset.id.includes('facebook')) return <Facebook className="size-4 text-blue-600" />;
    if (preset.id.includes('linkedin')) return <Linkedin className="size-4 text-sky-600" />;
    return <Twitter className="size-4 text-slate-800" />;
  };

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-xs select-none">
      {/* LEFT: BACK BUTTON & EDITABLE TITLE */}
      <div className="flex items-center gap-3">
        <Link
          to="/backoffice"
          className="flex size-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          title="Volver al Backoffice"
        >
          <ChevronLeft className="size-5" />
        </Link>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-bold text-slate-900 hover:border-slate-300 focus:border-primary focus:bg-slate-50 focus:outline-none transition-all max-w-[280px] sm:max-w-xs"
            placeholder="Título del diseño..."
          />
          <span className="hidden sm:inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200">
            {project.preset.aspectRatio}
          </span>
        </div>
      </div>

      {/* CENTER: MAGIC RESIZE / PRESET SELECTOR & UNDO/REDO */}
      <div className="flex items-center gap-2">
        <div className="relative" ref={resizeRef}>
          <button
            type="button"
            onClick={() => setIsResizeOpen(!isResizeOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-300 shadow-xs transition-all"
          >
            {getPresetIcon(project.preset)}
            <span className="hidden md:inline">{project.preset.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">({project.preset.width}×{project.preset.height})</span>
            <ChevronDown className="size-3.5 text-slate-400" />
          </button>

          {isResizeOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="size-3 text-primary" />
                  <span>Redimensionar (Magic Resize)</span>
                </span>
              </div>
              <div className="mt-1 space-y-1 max-h-80 overflow-y-auto">
                {IMAGE_FORMAT_PRESETS.map((preset) => {
                  const isSelected = preset.id === project.preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        onSetPreset(preset);
                        setIsResizeOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {getPresetIcon(preset)}
                        <div>
                          <strong className="block text-xs">{preset.name}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {preset.width} × {preset.height} px
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="size-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* UNDO / REDO */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex size-7 items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Deshacer (Cmd+Z)"
          >
            <Undo2 className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex size-7 items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Rehacer (Cmd+Shift+Z)"
          >
            <Redo2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* RIGHT: SAVE TO DAM, SEND TO VIDEO & EXPORT PNG */}
      <div className="flex items-center gap-2">
        {/* GUARDAR EN DAM */}
        <button
          type="button"
          onClick={handleSaveDam}
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-all"
          title="Guardar en Biblioteca DAM de Activos"
        >
          {damSaved ? <Check className="size-3.5 text-emerald-600" /> : <Layers className="size-3.5 text-slate-500" />}
          <span>{damSaved ? 'Guardado en DAM' : 'Guardar en DAM'}</span>
        </button>

        {/* ENVIAR A VIDEO STUDIO */}
        <button
          type="button"
          onClick={() => navigate('/backoffice/marketing-studio/generador-contenido')}
          className="hidden md:flex items-center gap-1.5 rounded-xl bg-[#005F73]/10 px-3 py-1.5 text-xs font-bold text-[#005F73] hover:bg-[#005F73]/20 transition-all"
          title="Abrir este asset en Video Studio"
        >
          <Video className="size-3.5" />
          <span>A Video Studio</span>
        </button>

        {/* DESCARGAR DROPDOWN */}
        <div className="relative" ref={exportRef}>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary-dark shadow-sm transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            <span>Descargar</span>
            <ChevronDown className="size-3" />
          </button>

          {isExportMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  onExport('png');
                  setIsExportMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <span>Descargar PNG</span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">1080p Alta Res</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onExport('jpeg');
                  setIsExportMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <span>Descargar JPEG</span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">Web</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onExport('svg');
                  setIsExportMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <span>Descargar SVG</span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">Vector</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
