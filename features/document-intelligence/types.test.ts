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

    expect(Object.keys(fields)).toHaveLength(15);
    expect(Object.values(fields).every((value) => value === null)).toBe(true);
  });

  it('includes normalized 2D bounding boxes in the sample fixture', () => {
    expect(passportExtractionFixture.boundingBoxes).toBeDefined();
    expect(passportExtractionFixture.boundingBoxes?.documentNumber).toEqual([600, 320, 650, 480]);
    expect(passportExtractionFixture.boundingBoxes?.givenNames).toEqual([340, 320, 380, 520]);
    expect(passportExtractionFixture.boundingBoxes?.mrz).toEqual([780, 60, 910, 940]);
  });
});