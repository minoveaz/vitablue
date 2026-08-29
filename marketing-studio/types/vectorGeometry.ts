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

/**
 * Optional parameters used by the built-in reusable SVG shape library.
 * Values are persisted alongside the geometry and normalized before render.
 */
export interface EditableVectorShapeOptions {
  sides?: number;
  points?: number;
  innerRadius?: number;
  borderRadius?: number;
  strokeWidth?: number;
  ringRadius?: number;
  ringThickness?: number;
  arcStartAngle?: number;
  arcEndAngle?: number;
  waveStartY?: number;
  waveEndY?: number;
  waveAmplitude?: number;
  waveCycles?: number;
  waveAnchor?: 'top' | 'bottom';
  wavePath?: string;
}

/** Input accepted by editors before the persistence version is stamped. */
export type EditableVectorGeometryInput = Partial<EditableVectorGeometry> & {
  points?: EditableVectorPoint[];
};
