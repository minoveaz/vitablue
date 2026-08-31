export const getResizedSceneDuration = (
  startDuration: number,
  deltaPixels: number,
  framesPerPixel: number,
  minimumDuration: number,
): number => Math.max(
  minimumDuration,
  Math.round(startDuration + deltaPixels * framesPerPixel),
);
