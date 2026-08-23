import React, { useRef, useState } from 'react';
import {
  ArrowLeftRight,
  Camera,
  FileCheck,
  FileScan,
  Globe,
  Info,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';

const acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

export const Dropzone: React.FC<{
  onFiles: (files: File[]) => void;
  onDemo?: () => void;
}> = ({ onFiles, onDemo }) => {
  const input = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') input.current?.click();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`group flex min-h-56 p-6 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-all ${
          dragging
            ? 'border-primary bg-primary/10 scale-[1.01]'
            : 'border-slate-300 bg-white hover:border-primary hover:bg-slate-50/50 shadow-sm'
        }`}
      >
        <input
          ref={input}
          className="sr-only"
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
        />
        <input
          ref={cameraInput}
          className="sr-only"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
        />

        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
          <UploadCloud className="size-8" />
        </div>

        <p className="mt-4 text-base font-black text-slate-900">
          Arrastra tu documento aquí (1 o 2 caras)
        </p>
        <p className="mt-1.5 max-w-md text-xs text-slate-500 leading-relaxed">
          Suelta 1 archivo (Pasaporte) o 2 archivos a la vez (Anverso y Reverso), o{' '}
          <span className="font-bold text-primary underline">haz clic para explorar</span>.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
          <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">
            Soporta 1 o 2 archivos
          </span>
          <span>·</span>
          <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">
            PDF, JPG, PNG
          </span>
          <span>·</span>
          <span>Máx. 10 MB</span>
          <span>·</span>
          <span>⌘+V para pegar</span>
        </div>
      </div>

      {/* Opciones de entrada secundarias */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => cameraInput.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors shadow-2xs"
        >
          <Camera className="size-3.5 text-slate-500" /> Cámara
        </button>
        {onDemo && (
          <button
            type="button"
            onClick={onDemo}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors shadow-2xs"
          >
            <Sparkles className="size-3.5 text-primary" /> Documento demo
          </button>
        )}
      </div>
    </div>
  );
};

export const PreparationView: React.FC<{
  file: File | null;
  backFile: File | null;
  activeViewerSide: 'front' | 'back';
  onToggleViewerSide: (side: 'front' | 'back') => void;
  viewer: React.ReactNode;
  onFiles: (files: File[]) => void;
  onSelectFront: (file: File) => void;
  onSelectBack: (file: File) => void;
  onClear: () => void;
  onClearBack: () => void;
  onSwap: () => void;
  onDemo: () => void;
  onExtract: () => void;
}> = ({
  file,
  backFile,
  activeViewerSide,
  onToggleViewerSide,
  viewer,
  onFiles,
  onSelectFront,
  onSelectBack,
  onClear,
  onClearBack,
  onSwap,
  onDemo,
  onExtract,
}) => {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-2 items-start gap-6 overflow-y-auto pb-4 max-[640px]:grid-cols-1">
      {/* Columna Principal: Carga / Visor Unificado */}
      <div className="col-span-1 flex min-w-0 flex-col gap-4">
        {!file && !backFile ? (
          /* Estado 1: Dropzone Inteligente Universal (1 o 2 archivos) */
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileScan className="size-4 text-primary" />
                <h3 className="text-sm font-black text-slate-900">Documento fuente</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Paso 1 de 2</span>
            </div>

            <Dropzone onFiles={onFiles} onDemo={onDemo} />
          </div>
        ) : (
          /* Estado 2: Tarjeta de Archivos Cargados y Visor Interactivo */
          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header con resumen de archivos y acciones rápidas */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-3.5">
              <div className="flex flex-wrap items-center gap-2.5">
                {file && (
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-2xs">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[11px] font-black text-primary">
                      1
                    </span>
                    <div className="min-w-0">
                      <p
                        className="max-w-[140px] truncate text-xs font-bold text-slate-800"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {(file.size / 1024).toFixed(0)} KB · Anverso
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => frontInputRef.current?.click()}
                      className="ml-1 text-[11px] font-bold text-slate-400 hover:text-primary"
                      title="Cambiar archivo anverso"
                    >
                      Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={onClear}
                      className="text-slate-400 hover:text-red-600"
                      title="Quitar anverso"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}

                {backFile ? (
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-2xs">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded bg-accent/20 text-[11px] font-black text-accent">
                      2
                    </span>
                    <div className="min-w-0">
                      <p
                        className="max-w-[140px] truncate text-xs font-bold text-slate-800"
                        title={backFile.name}
                      >
                        {backFile.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {(backFile.size / 1024).toFixed(0)} KB · Reverso
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => backInputRef.current?.click()}
                      className="ml-1 text-[11px] font-bold text-slate-400 hover:text-primary"
                      title="Cambiar archivo reverso"
                    >
                      Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={onClearBack}
                      className="text-slate-400 hover:text-red-600"
                      title="Quitar reverso"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => backInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Plus className="size-3.5" /> Añadir reverso (opcional)
                  </button>
                )}

                {/* Inputs ocultos para reemplazar o añadir individualmente */}
                <input
                  ref={frontInputRef}
                  className="sr-only"
                  type="file"
                  accept={acceptedTypes.join(',')}
                  onChange={(e) => {
                    if (e.target.files?.[0]) onSelectFront(e.target.files[0]);
                  }}
                />
                <input
                  ref={backInputRef}
                  className="sr-only"
                  type="file"
                  accept={acceptedTypes.join(',')}
                  onChange={(e) => {
                    if (e.target.files?.[0]) onSelectBack(e.target.files[0]);
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                {file && backFile && (
                  <button
                    type="button"
                    onClick={onSwap}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors"
                    title="Invertir cuál es el anverso y el reverso"
                  >
                    <ArrowLeftRight className="size-3.5" /> Invertir caras
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClear}
                  aria-label="Eliminar todo"
                  title="Eliminar todo y empezar de nuevo"
                  className="flex size-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Pestañas de previsualización de cara activa si hay 2 archivos */}
            {backFile && (
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
                <span className="text-[11px] font-bold text-slate-500">Vista previa activa:</span>
                <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => onToggleViewerSide('front')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      activeViewerSide === 'front'
                        ? 'bg-white text-primary shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🪪 Cara 1 (Anverso)
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleViewerSide('back')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      activeViewerSide === 'back'
                        ? 'bg-white text-primary shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🔄 Cara 2 (Reverso)
                  </button>
                </div>
              </div>
            )}

            {/* Visor interactivo */}
            <div className="p-3 bg-slate-50">{viewer}</div>

            {/* CTA Primario */}
            <div className="border-t border-slate-200 bg-white p-4">
              <button
                type="button"
                onClick={onExtract}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-6 text-sm font-black text-white shadow-md hover:bg-primary-dark transition-all"
              >
                <Sparkles className="size-4.5" />
                {backFile
                  ? 'Extraer y correlacionar ambas caras con IA (2 Caras listas)'
                  : 'Extraer y validar campos con IA'}
                <span className="opacity-70 text-xs font-normal">(↵ Enter)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Columna Lateral (35%): Guía Inicial o Metadata Predictiva tras la subida */}
      <div className="col-span-1 flex min-w-0 flex-col gap-4">
        {file ? (
          /* Estado Activo: Metadata predictiva y Checklist de pre-vuelo */
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                <FileCheck className="size-4 text-emerald-600" /> Pre-validación de archivo
              </h4>

              <div className="mt-3.5 space-y-3 text-xs">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Modalidad</p>
                  <p className="mt-0.5 font-bold text-slate-800">
                    {backFile
                      ? 'Documento de 2 Caras (Anverso + Reverso)'
                      : 'Documento de 1 Cara / Pasaporte'}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Especificaciones técnicas
                  </p>
                  <p className="mt-0.5 font-bold text-slate-800">
                    {file.type === 'application/pdf' ? 'PDF Multipágina' : 'Imagen de alta resolución'} ·{' '}
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                  <p className="mt-0.5 text-[11px] text-emerald-700 font-medium">
                    ✓ Tamaño óptimo para OCR multimodal
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Motor de extracción</p>
                  <p className="mt-0.5 font-bold text-slate-800">Gemini 2.5 Flash Vision</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Lectura de campos visuales + parseo MRZ
                  </p>
                </div>
              </div>
            </div>

            {/* Privacidad & RGPD */}
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4">
              <ShieldCheck className="size-5 shrink-0 text-emerald-700 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-emerald-900">Procesamiento seguro</p>
                <p className="mt-0.5 text-[11px] text-emerald-700 leading-relaxed">
                  Extracción efímera en memoria. Los datos no se almacenan para entrenamiento.
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Estado Inicial: Documentos compatibles y Consejos */
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                <Globe className="size-4 text-primary" /> Documentos compatibles
              </h4>
              <ul className="mt-3.5 space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[11px] font-bold text-primary">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">Pasaportes ICAO (TD3)</p>
                    <p className="text-[11px] text-slate-500">
                      Zona visual y lectura óptica de MRZ de 44 caracteres.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[11px] font-bold text-primary">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">DNI / NIE / 2 Caras</p>
                    <p className="text-[11px] text-slate-500">
                      Arrastra ambas fotos a la vez o añádelas sucesivamente.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[11px] font-bold text-primary">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">Licencias de conducir</p>
                    <p className="text-[11px] text-slate-500">Permisos oficiales con fotografía.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4.5">
              <h4 className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Info className="size-4 text-sky-600" /> Para una extracción 100% precisa
              </h4>
              <ul className="mt-2.5 space-y-1.5 text-[11px] text-slate-500">
                <li>• Puedes soltar los 2 archivos de golpe (Anverso y Reverso).</li>
                <li>• Asegúrate de que los bordes del documento sean visibles.</li>
                <li>• Evita reflejos de luz o flash sobre el documento.</li>
              </ul>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4">
              <ShieldCheck className="size-5 shrink-0 text-emerald-700 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-emerald-900">Privacidad garantizada</p>
                <p className="mt-0.5 text-[11px] text-emerald-700 leading-relaxed">
                  Procesamiento efímero en memoria local conforme a RGPD.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
