import React from 'react';
import type { DocumentBoundingBoxes } from '../../types';
import { getFieldLabel, type FieldKey } from '../../fieldLabels';

export const BoundingBoxOverlay: React.FC<{
  boundingBoxes?: DocumentBoundingBoxes | null;
  activeField?: FieldKey | null;
  onBoxClick?: (fieldKey: FieldKey) => void;
}> = ({ boundingBoxes, activeField, onBoxClick }) => {
  if (!boundingBoxes || Object.keys(boundingBoxes).length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
      {Object.entries(boundingBoxes).map(([key, box]) => {
        if (!box) return null;
        const [ymin, xmin, ymax, xmax] = box;
        const fieldKey = key as FieldKey;
        const isActive = activeField === fieldKey;
        const top = ymin / 10;
        const left = xmin / 10;
        const width = (xmax - xmin) / 10;
        const height = (ymax - ymin) / 10;

        return (
          <div
            key={key}
            onClick={(e) => {
              e.stopPropagation();
              onBoxClick?.(fieldKey);
            }}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
            className={`absolute transition-all duration-150 rounded pointer-events-auto cursor-pointer ${
              isActive
                ? 'border-2 border-amber-400 bg-amber-400/30 shadow-[0_0_25px_#f59e0b] ring-4 ring-amber-300/80 z-30 scale-[1.03]'
                : 'border border-sky-400/60 bg-sky-400/10 hover:border-amber-400 hover:bg-amber-400/20 z-10'
            }`}
            title={`Campo: ${getFieldLabel(fieldKey)}`}
          >
            {isActive && (
              <span className="absolute -top-7 left-0 rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-black text-amber-300 shadow-xl border border-amber-400/80 whitespace-nowrap z-40 flex items-center gap-1">
                <span>📍</span> {getFieldLabel(fieldKey)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
