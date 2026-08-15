import { describe, expect, it } from 'vitest';
import { passportExtractionFixture } from './fixtures';
import { emptyIdentityDocumentFields } from './types';

describe('document intelligence contract', () => {
  it('keeps absent extracted values as null', () => {
    expect(passportExtractionFixture.fields.issueDate).toBeNull();
    expect(passportExtractionFixture.fields.birthplace).toBeNull();
  });

  it('provides a complete nullable field model for a new session', () => {
    const fields = emptyIdentityDocumentFields();

    expect(Object.keys(fields)).toHaveLength(13);
    expect(Object.values(fields).every((value) => value === null)).toBe(true);
  });
});