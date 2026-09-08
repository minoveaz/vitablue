/**
 * Schema Structured Data Guard — Vitest
 *
 * Prevents regression of Google Search Console critical error:
 * "La reseña tiene varias puntuaciones agregadas" (8 sept 2026, PR #186)
 *
 * Rules enforced:
 *   1. `aggregateRating` must NEVER appear in page source without a
 *      corresponding `"review"` array in the same schema block.
 *   2. If a future dev adds real reviews, both must be present together.
 *
 * Scans: all .tsx files under pages/public/
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.resolve(__dirname, '../../pages/public');

/** Recursively collect all .tsx files under a directory */
function collectTsxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return collectTsxFiles(full);
    if (e.isFile() && e.name.endsWith('.tsx')) return [full];
    return [];
  });
}

function hasAggregateRating(source: string): boolean {
  return source.includes('"aggregateRating"') || source.includes("'aggregateRating'");
}

function hasReviewArray(source: string): boolean {
  return (
    (source.includes('"review"') || source.includes("'review'")) &&
    /['"]review['"]\s*:\s*\[/.test(source)
  );
}

describe('Schema Structured Data Guard', () => {
  const files = collectTsxFiles(PAGES_DIR);

  it('should find page files to scan', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  files.forEach((filePath) => {
    const relativePath = path.relative(process.cwd(), filePath);

    it(`[${relativePath}] must NOT contain aggregateRating without a review[] array`, () => {
      const source = fs.readFileSync(filePath, 'utf-8');

      const hasRating = hasAggregateRating(source);
      const hasReviews = hasReviewArray(source);

      if (hasRating && !hasReviews) {
        throw new Error(
          `\n❌ GSC Schema Error detected in: ${relativePath}\n\n` +
          `   Found "aggregateRating" but NO "review": [...] array.\n\n` +
          `   Google requires that every aggregateRating is backed by\n` +
          `   individual Review items. Without them, GSC reports:\n` +
          `   "La reseña tiene varias puntuaciones agregadas"\n` +
          `   and BLOCKS rich snippets for this page.\n\n` +
          `   Fix options:\n` +
          `     A) Remove aggregateRating (if no real reviews exist yet)\n` +
          `     B) Add a "review": [{ "@type": "Review", ... }] array\n` +
          `        alongside aggregateRating (only with real reviews)\n\n` +
          `   See: https://developers.google.com/search/docs/appearance/structured-data/review-snippet\n`
        );
      }

      expect(true).toBe(true);
    });
  });
});
