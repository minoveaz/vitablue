import React, { useEffect, useRef, useState } from 'react';
import type { ImageCrop } from '../../types/imageStudio';
import {
  getCropImageStyle,
  getImageCropBounds,
  moveImageCrop,
  normalizeImageCrop,
  resizeImageCrop,
  type ImageCropHandle,
} from '../../utils/imageCrop';

interface ImageCropEditorProps {
  imageUrl: string;
  crop: ImageCrop;
  onChange: (crop: ImageCrop) => void;
}

export const ImageCropEditor: React.FC<ImageCropEditorProps> = ({ imageUrl, crop, onChange }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    crop: ImageCrop;
    type: 'move' | 'resize';
    handle?: ImageCropHandle;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      const frame = frameRef.current;
      if (!drag || drag.pointerId !== event.pointerId || !frame) return;
      const rect = frame.getBoundingClientRect();
      const delta = { x: event.clientX - drag.x, y: event.clientY - drag.y };
      onChange(
        drag.type === 'resize' && drag.handle
          ? resizeImageCrop(drag.crop, drag.handle, delta, { width: rect.width, height: rect.height })
          : moveImageCrop(drag.crop, delta, { width: rect.width, height: rect.height }),
      );
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (dragRef.current && dragRef.current.pointerId !== event.pointerId) return;
      dragRef.current = null;
      setIsDragging(false);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [onChange]);

  const beginInteraction = (
    event: React.PointerEvent<HTMLElement>,
    type: 'move' | 'resize',
    handle?: ImageCropHandle,
  ) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const nextCrop = normalizeImageCrop({ ...crop, bounds: getImageCropBounds(crop) });
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, crop: nextCrop, type, handle };
    setIsDragging(true);
  };

  const handleHandleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, handle: ImageCropHandle) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    const frame = frameRef.current;
    if (!frame) return;
    event.preventDefault();
    const step = event.shiftKey ? 10 : 2;
    const delta = {
      x: event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0,
      y: event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0,
    };
    const rect = frame.getBoundingClientRect();
    onChange(
      resizeImageCrop(
        normalizeImageCrop({ ...crop, bounds: getImageCropBounds(crop) }),
        handle,
        delta,
        { width: rect.width, height: rect.height },
      ),
    );
  };

  const bounds = getImageCropBounds(crop);
  const handles: Array<{ id: ImageCropHandle; label: string; className: string }> = [
    { id: 'nw', label: 'Redimensionar esquina superior izquierda', className: '-left-2 -top-2 cursor-nwse-resize' },
    { id: 'n', label: 'Redimensionar borde superior', className: 'left-1/2 -top-2 -translate-x-1/2 cursor-ns-resize' },
    { id: 'ne', label: 'Redimensionar esquina superior derecha', className: '-right-2 -top-2 cursor-nesw-resize' },
    { id: 'e', label: 'Redimensionar borde derecho', className: '-right-2 top-1/2 -translate-y-1/2 cursor-ew-resize' },
    { id: 'se', label: 'Redimensionar esquina inferior derecha', className: '-bottom-2 -right-2 cursor-nwse-resize' },
    { id: 's', label: 'Redimensionar borde inferior', className: '-bottom-2 left-1/2 -translate-x-1/2 cursor-ns-resize' },
    { id: 'sw', label: 'Redimensionar esquina inferior izquierda', className: '-bottom-2 -left-2 cursor-nesw-resize' },
    { id: 'w', label: 'Redimensionar borde izquierdo', className: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
  ];

  return (
    <div
      ref={frameRef}
      data-image-crop-editor
      className="relative h-full w-full overflow-visible bg-slate-950"
      style={{ touchAction: 'none' }}
      aria-label="Editor de recorte de imagen"
      onPointerDown={(event) => {
        // Keep clicks on the crop surface from starting a layer drag. The
        // bounds and handles stop propagation themselves when interacted with.
        event.stopPropagation();
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-slate-950">
        <img
          src={imageUrl}
          alt=""
          draggable={false}
          className="h-full w-full select-none"
          style={getCropImageStyle(crop)}
        />
        <div className="absolute inset-0" aria-hidden="true">
          <span className="absolute inset-x-0 top-0 bg-primary-dark/55" style={{ height: `${bounds.top}%` }} />
          <span className="absolute inset-x-0 bottom-0 bg-primary-dark/55" style={{ height: `${100 - bounds.bottom}%` }} />
          <span
            className="absolute left-0 bg-primary-dark/55"
            style={{ top: `${bounds.top}%`, bottom: `${100 - bounds.bottom}%`, width: `${bounds.left}%` }}
          />
          <span
            className="absolute right-0 bg-primary-dark/55"
            style={{ top: `${bounds.top}%`, bottom: `${100 - bounds.bottom}%`, width: `${100 - bounds.right}%` }}
          />
        </div>
      </div>
      <div
        data-image-crop-bounds
        className={`absolute border-2 border-brand-cyan shadow-[0_0_0_1px_rgba(0,18,25,0.85)] ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          left: `${bounds.left}%`,
          top: `${bounds.top}%`,
          width: `${bounds.right - bounds.left}%`,
          height: `${bounds.bottom - bounds.top}%`,
          touchAction: 'none',
        }}
        onPointerDown={(event) => beginInteraction(event, 'move')}
      >
        <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }, (_, index) => <span key={index} className="border border-white/30" />)}
        </div>
        <span className="pointer-events-none absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90 bg-primary/30" />
        {handles.map(({ id, label, className }) => (
          <button
            key={id}
            type="button"
            data-crop-handle={id}
            aria-label={label}
            className={`absolute z-10 size-4 rounded-sm border-2 border-primary-dark bg-brand-cyan shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
            onPointerDown={(event) => beginInteraction(event, 'resize', id)}
            onKeyDown={(event) => handleHandleKeyDown(event, id)}
          />
        ))}
      </div>
    </div>
  );
};
