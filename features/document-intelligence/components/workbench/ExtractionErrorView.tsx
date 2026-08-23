import React from 'react';
import { RotateCcw, Upload } from 'lucide-react';

export const ExtractionErrorView: React.FC<{
  message: string;
  onRetry: () => void;
  onClear: () => void;
}> = ({ message, onRetry, onClear }) => (
  <section className="flex flex-1 items-center justify-center">
    <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
      <div
        className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-xl font-black text-red-700"
        aria-hidden="true"
      >
        !
      </div>
      <h3 className="mt-5 text-h3 font-black text-red-950">
        No hemos podido completar la extracción
      </h3>
      <p role="alert" className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-red-800">
        {message}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-black text-white hover:bg-primary-dark"
        >
          <RotateCcw className="size-4" /> Reintentar
        </button>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-800 hover:bg-red-100"
        >
          <Upload className="size-4" /> Cambiar documento
        </button>
      </div>
    </div>
  </section>
);
