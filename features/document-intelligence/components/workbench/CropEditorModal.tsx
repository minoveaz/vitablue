import React, { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import Cropper, { type Area, type Point } from 'react-easy-crop';

export const CropEditorModal: React.FC<{
  image: string;
  onCancel: () => void;
  onApply: (blob: Blob) => void;
}> = ({ image, onCancel, onApply }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  const apply = async () => {
    if (!area) return;
    const source = new Image();
    source.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = area.width;
      canvas.height = area.height;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(
        source,
        area.x,
        area.y,
        area.width,
        area.height,
        0,
        0,
        area.width,
        area.height,
      );
      canvas.toBlob(
        (blob) => {
          if (blob) onApply(blob);
        },
        'image/jpeg',
        0.92,
      );
    };
    source.src = image;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-black text-slate-900">
            Recortar documento
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Mueve la selección o ajusta sus esquinas para conservar el área
            necesaria.
          </p>
        </div>
        <div className="relative h-[min(62vh,520px)] bg-slate-950">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setArea(pixels)}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-5 py-4">
          <label className="flex min-w-52 flex-1 items-center gap-3 text-xs font-bold text-slate-600">
            <ZoomOut className="size-4" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full accent-primary"
            />
            <ZoomIn className="size-4" />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:border-slate-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={apply}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-black text-white hover:bg-primary-dark"
            >
              Aplicar recorte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
