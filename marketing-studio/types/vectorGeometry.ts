/**
 * JSON-safe geometry shared by the image and carousel editors.
 *
 * Coordinates are normalized to the unit square so a geometry can be reused
 * at any layer size (and survives changes to the carousel format).
 */
export interface EditableVectorPoint {
  x: number;
  y: number;
}

export interface EditableVectorGeometry {
  version: 1;
  kind: 'bezier' | 'path';
  /** Normalized anchor points for an editable cubic Bézier geometry. */
  points?: EditableVectorPoint[];
  /** Optional normalized SVG path for geometries that need exact commands. */
  path?: string;
  closed?: boolean;
  fillRule?: 'nonzero' | 'evenodd';
}

/** Input accepted by editors before the persistence version is stamped. */
export type EditableVectorGeometryInput = Partial<EditableVectorGeometry> & {
  points?: EditableVectorPoint[];
};
