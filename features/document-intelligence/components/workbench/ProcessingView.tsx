import React from 'react';
import { Check, FileScan, LoaderCircle } from 'lucide-react';

export const ProcessingView: React.FC<{
  file: File | null;
  previewUrl: string | null;
  isPdf: boolean;
}> = ({ file, previewUrl, isPdf }) => (
  <section className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 items-start gap-6 overflow-y-auto pb-4 lg:grid-cols-12">
    {/* Columna Izquierda: Visor del documento con escáner láser animado */}
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-6">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileScan className="size-4 text-primary" />
          <span className="truncate text-xs font-bold text-slate-800">
            {file?.name ?? 'Documento'}
          </span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
          <span className="size-1.5 rounded-full bg-primary animate-ping" />
          Escaneando con IA
        </span>
      </div>

      <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-slate-100 p-4">
        {/* Línea de escaneo láser animada */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-bounce z-10" />

        {isPdf && previewUrl ? (
          <iframe
            src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
            title={file?.name ?? 'PDF'}
            className="h-full min-h-[400px] w-full border-0 pointer-events-none opacity-80"
          />
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt="Escaneando documento"
            className="max-h-[440px] max-w-full object-contain opacity-90"
          />
        ) : null}
      </div>
    </div>

    {/* Columna Derecha: Indicador de Etapas y Skeleton Loaders */}
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-6">
      <div className="border-b border-slate-200 pb-3.5">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <LoaderCircle className="size-4.5 animate-spin text-primary" /> Analizando documento
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Gemini 2.5 Flash está interpretando los campos visuales y la zona ICAO.
        </p>

        {/* Pasos en tiempo real */}
        <div className="mt-3.5 space-y-2 rounded-xl bg-slate-50 p-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-700">
            <Check className="size-3.5 text-emerald-600" />
            <span>1. Preprocesamiento y orientación de imagen</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-primary animate-pulse">
            <LoaderCircle className="size-3.5 animate-spin text-primary" />
            <span>2. Reconocimiento óptico y lectura de zona MRZ...</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-slate-400">
            <span className="size-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px]">
              3
            </span>
            <span>3. Estructurando campos de identidad y validación</span>
          </div>
        </div>
      </div>

      {/* Skeletons de los campos */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="col-span-2 space-y-1">
          <div className="h-3 w-28 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="col-span-2 space-y-1">
          <div className="h-3 w-36 bg-slate-200 rounded animate-pulse" />
          <div className="h-14 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  </section>
);
