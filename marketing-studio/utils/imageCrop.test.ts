import { describe, expect, it } from 'vitest';
import {
  DEFAULT_IMAGE_CROP,
  getImageCropBounds,
  getCropImageStyle,
  isDefaultImageCrop,
  moveImageCrop,
  normalizeImageCrop,
  resizeImageCrop,
} from './imageCrop';
import { normalizeStoredProject, serializeStoredProject } from './imagePersistence';
import { INITIAL_IMAGE_TEMPLATES } from './imageTemplates';

describe('image crop model', () => {
  it('normalizes persisted crop values to safe editor bounds', () => {
    expect(normalizeImageCrop({ x: -20, y: 140, zoom: 9 })).toEqual({
      x: 0,
      y: 100,
      zoom: 3,
    });
    expect(normalizeImageCrop()).toEqual(DEFAULT_IMAGE_CROP);
  });

  it('moves the source window opposite to the pointer drag', () => {
    expect(moveImageCrop({ x: 50, y: 50, zoom: 1 }, { x: 20, y: -10 }, { width: 200, height: 100 })).toEqual({
      x: 40,
      y: 60,
      zoom: 1,
    });
  });

  it('resizes crop edges and corners inside the frame', () => {
    const crop = normalizeImageCrop({
      x: 50,
      y: 50,
      zoom: 1,
      bounds: { left: 20, top: 20, right: 80, bottom: 80 },
    });

    expect(resizeImageCrop(crop, 'nw', { x: 100, y: 100 }, { width: 200, height: 100 })).toMatchObject({
      bounds: { left: 56, top: 32, right: 80, bottom: 80 },
      x: 68,
      y: 56,
    });
    expect(getImageCropBounds(crop)).toEqual(crop.bounds);
  });

  it('keeps a resized crop above the minimum dimensions and clamps movement', () => {
    const crop = normalizeImageCrop({
      x: 50,
      y: 50,
      zoom: 1,
      bounds: { left: 20, top: 20, right: 80, bottom: 80 },
    });

    const resized = resizeImageCrop(crop, 'se', { x: -1000, y: -1000 }, { width: 200, height: 100 });
    expect(resized.bounds).toMatchObject({ left: 20, top: 20, right: 44, bottom: 68 });
    expect(moveImageCrop(crop, { x: 1000, y: 1000 }, { width: 200, height: 100 }).bounds).toEqual({
      left: 40,
      top: 40,
      right: 100,
      bottom: 100,
    });
    expect(
      moveImageCrop({ ...crop, zoom: 2 }, { x: 20, y: 0 }, { width: 200, height: 100 }).zoom,
    ).toBe(2);
  });

  it('renders crop state through object-position and non-destructive zoom', () => {
    expect(getCropImageStyle({ x: 30, y: 70, zoom: 1.5 })).toMatchObject({
      objectFit: 'cover',
      objectPosition: '30% 70%',
      transform: 'scale(1.5)',
      transformOrigin: '30% 70%',
    });
    expect(isDefaultImageCrop(DEFAULT_IMAGE_CROP)).toBe(true);
    expect(isDefaultImageCrop({ x: 30, y: 50, zoom: 1 })).toBe(false);
    expect(
      isDefaultImageCrop({
        x: 50,
        y: 50,
        zoom: 1,
        bounds: { left: 10, top: 10, right: 90, bottom: 90 },
      }),
    ).toBe(false);
  });

  it('derives a render zoom from persisted crop bounds', () => {
    expect(
      getCropImageStyle({
        x: 50,
        y: 50,
        zoom: 1,
        bounds: { left: 25, top: 10, right: 75, bottom: 90 },
      }),
    ).toMatchObject({
      objectPosition: '50% 50%',
      transform: 'scale(2)',
      transformOrigin: '50% 50%',
    });
  });

  it('keeps crop state when projects are normalized and serialized', () => {
    const source = INITIAL_IMAGE_TEMPLATES[0];
    const crop = { x: 24, y: 68, zoom: 1.4 };
    const project = {
      ...source,
      layers: [{ ...source.layers[0], crop }],
    };

    expect(normalizeStoredProject(project).layers[0]?.crop).toEqual(crop);
    expect(serializeStoredProject(project).layers[0]?.crop).toEqual(crop);
  });
});
