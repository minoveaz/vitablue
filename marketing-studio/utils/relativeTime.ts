const MINUTE_IN_MS = 60 * 1000;

/**
 * Formats the last successful save for the editor status indicator.
 * Invalid or future timestamps are treated as a save that happened just now.
 */
export const formatRelativeSavedTime = (
  savedAt: string | undefined,
  now = Date.now(),
): string => {
  if (!savedAt) return 'Guardado';
  const timestamp = Date.parse(savedAt);
  if (Number.isNaN(timestamp)) return 'Guardado';
  const minutes = Math.max(0, Math.floor((now - timestamp) / MINUTE_IN_MS));
  return `Guardado hace ${minutes} min`;
};
