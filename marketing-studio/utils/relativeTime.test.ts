import { describe, expect, it } from 'vitest';
import { formatRelativeSavedTime } from './relativeTime';

describe('relative saved time', () => {
  const savedAt = '2026-08-28T12:00:00.000Z';
  const savedAtMs = Date.parse(savedAt);

  it('formats elapsed minutes in Spanish', () => {
    expect(formatRelativeSavedTime(savedAt, savedAtMs)).toBe('Guardado hace 0 min');
    expect(formatRelativeSavedTime(savedAt, savedAtMs + 60_000)).toBe('Guardado hace 1 min');
    expect(formatRelativeSavedTime(savedAt, savedAtMs + 17 * 60_000 + 59_000)).toBe('Guardado hace 17 min');
  });

  it('keeps the saved label stable for invalid or future timestamps', () => {
    expect(formatRelativeSavedTime(undefined, savedAtMs)).toBe('Guardado');
    expect(formatRelativeSavedTime('not-a-date', savedAtMs)).toBe('Guardado');
    expect(formatRelativeSavedTime(savedAt, savedAtMs - 60_000)).toBe('Guardado hace 0 min');
  });
});
