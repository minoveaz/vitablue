import { describe, expect, it } from 'vitest';
import { TEMPLATE_CATALOG } from './templateCatalog';
import { MARKETING_TEMPLATE_PROJECT_BY_ID } from '../utils/imageTemplates';

describe('template catalog integrity', () => {
  it('resolves every catalog project to an editable image project', () => {
    TEMPLATE_CATALOG.forEach((item) => {
      expect(MARKETING_TEMPLATE_PROJECT_BY_ID.has(item.projectId)).toBe(true);
    });
  });

  it('keeps catalog identifiers and project identifiers unique', () => {
    expect(new Set(TEMPLATE_CATALOG.map((item) => item.id)).size).toBe(TEMPLATE_CATALOG.length);
    expect(new Set(TEMPLATE_CATALOG.map((item) => item.projectId)).size).toBe(TEMPLATE_CATALOG.length);
  });
});
