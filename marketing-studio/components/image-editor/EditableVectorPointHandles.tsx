import React, { useEffect, useRef, useState } from 'react';
import type { EditableVectorGeometry, EditableVectorPoint } from '../../types/vectorGeometry';

interface EditableVectorPointHandlesProps {
  geometry: EditableVectorGeometry;
  onChange: (geometry: EditableVectorGeometry) => void;
}

interface ActiveDrag {
  index: number;
  pointerId: number;
}

/**
 * Canvas handles for point-backed vector geometry. The parent layer owns the
 * geometry, while this overlay only translates pointer coordinates into the
 * layer's normalized coordinate space.
 */
export const EditableVectorPointHandles: React.FC<EditableVectorPointHandlesProps> = ({
  geometry,
  onChange,
}) => {
  const points = geometry.points;
  const rootRef = useRef<HTMLDivElement>(null);
  const geometryRef = useRef(geometry);
  const onChangeRef = useRef(onChange);
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    geometryRef.current = geometry;
  }, [geometry]);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const activeDrag = activeDragRef.current;
      const root = rootRef.current;
      if (!activeDrag || !root || event.pointerId !== activeDrag.pointerId) return;

      const layer = root.parentElement;
      if (!layer) return;
      const width = layer.offsetWidth;
      const height = layer.offsetHeight;
      if (!width || !height) return;

      // The layer can be rotated and scaled by the stage. Invert its CSS
      // transform around its visual center before calculating local percent.
      const rect = layer.getBoundingClientRect();
      let localX = (event.clientX - rect.left) / rect.width;
      let localY = (event.clientY - rect.top) / rect.height;
      if (typeof DOMMatrix !== 'undefined') {
        try {
          const transform = getComputedStyle(layer).transform;
          const matrix = transform === 'none' ? new DOMMatrix() : new DOMMatrix(transform);
          const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
          if (Math.abs(determinant) > 0.0001) {
            const deltaX = event.clientX - (rect.left + rect.width / 2);
            const deltaY = event.clientY - (rect.top + rect.height / 2);
            const localDeltaX = (matrix.d * deltaX - matrix.c * deltaY) / determinant;
            const localDeltaY = (-matrix.b * deltaX + matrix.a * deltaY) / determinant;
            localX = (localDeltaX + width / 2) / width;
            localY = (localDeltaY + height / 2) / height;
          }
        } catch {
          // The axis-aligned fallback above is sufficient in older browsers.
        }
      }

      const nextPoints: EditableVectorPoint[] = (geometryRef.current.points ?? []).map((point, index) =>
        index === activeDrag.index
          ? {
              x: Math.max(0, Math.min(1, localX)),
              y: Math.max(0, Math.min(1, localY)),
            }
          : point,
      );
      const nextGeometry = { ...geometryRef.current, points: nextPoints };
      geometryRef.current = nextGeometry;
      onChangeRef.current(nextGeometry);
    };

    const endDrag = (event: PointerEvent) => {
      if (activeDragRef.current?.pointerId !== event.pointerId) return;
      activeDragRef.current = null;
      setActiveIndex(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, []);

  if (!points || points.length < 2) return null;

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-40" data-export-exclude="true">
      {points.map((point, index) => (
        <button
          key={index}
          type="button"
          data-vector-point-handle={index}
          aria-label={`Editar punto ${index + 1}`}
          className={`pointer-events-auto absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-950 shadow-md transition-transform hover:scale-125 ${
            activeIndex === index ? 'bg-amber-400 ring-2 ring-white/80' : 'bg-brand-cyan'
          }`}
          style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
              // Pointer capture is not available in some embedded contexts.
            }
            activeDragRef.current = { index, pointerId: event.pointerId };
            geometryRef.current = geometry;
            setActiveIndex(index);
          }}
          onClick={(event) => event.stopPropagation()}
        />
      ))}
    </div>
  );
};
