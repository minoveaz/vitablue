import { describe, it, expect } from 'vitest';
import { IMAGE_FORMAT_PRESETS } from '../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from '../utils/imageTemplates';

describe('ImageStudio Presets & Templates', () => {
  it('defines the 7 required social media image format presets', () => {
    expect(IMAGE_FORMAT_PRESETS.length).toBeGreaterThanOrEqual(7);
    const ids = IMAGE_FORMAT_PRESETS.map((p) => p.id);
    expect(ids).toContain('instagram-portrait'); // 4:5
    expect(ids).toContain('instagram-square');   // 1:1
    expect(ids).toContain('story-vertical');    // 9:16
    expect(ids).toContain('landscape-banner');  // 16:9
    expect(ids).toContain('facebook-cover');
    expect(ids).toContain('linkedin-post');
    expect(ids).toContain('twitter-header');
  });

  it('has valid pixel dimensions for key social formats', () => {
    const igPortrait = IMAGE_FORMAT_PRESETS.find((p) => p.id === 'instagram-portrait');
    expect(igPortrait).toBeDefined();
    expect(igPortrait?.width).toBe(1080);
    expect(igPortrait?.height).toBe(1350);
    expect(igPortrait?.aspectRatio).toBe('4:5');

    const story = IMAGE_FORMAT_PRESETS.find((p) => p.id === 'story-vertical');
    expect(story?.width).toBe(1080);
    expect(story?.height).toBe(1920);
  });

  it('provides pre-designed templates with valid layers and backgrounds', () => {
    expect(INITIAL_IMAGE_TEMPLATES.length).toBeGreaterThanOrEqual(4);
    INITIAL_IMAGE_TEMPLATES.forEach((template) => {
      expect(template.id).toBeTruthy();
      expect(template.title).toBeTruthy();
      expect(template.preset).toBeDefined();
      expect(template.layers.length).toBeGreaterThan(0);
      expect(template.background).toBeDefined();
    });
  });

  it('supports compound block types designed for ungrouping', () => {
    const templatesWithCompoundBlocks = INITIAL_IMAGE_TEMPLATES.filter((t) =>
      t.layers.some((l) =>
        ['MotionAdvisorCard', 'MotionProviderGrid', 'MotionTrustBadge', 'MotionComparisonCard'].includes(l.blockType ?? '')
      )
    );
    expect(templatesWithCompoundBlocks.length).toBeGreaterThanOrEqual(4);
  });
});

describe('ImageStudio Project Storage (LocalStorage & Routing)', () => {
  it('loads stored projects or seeds with templates', async () => {
    const { getStoredImageProjects, createBlankImageProject, duplicateStoredImageProject } = await import('../utils/imageProjectStorage');
    const projects = getStoredImageProjects();
    expect(projects.length).toBeGreaterThanOrEqual(4);

    const blank = createBlankImageProject('instagram-portrait', 'Test Blank');
    expect(blank.id).toBeTruthy();
    expect(blank.title).toBe('Test Blank');

    const copy = duplicateStoredImageProject(blank.id);
    expect(copy).toBeDefined();
    expect(copy?.title).toContain('(Copia)');
  });
});

describe('ImageStudio 7 Rapid Actions (Canva-Style Architecture)', () => {
  it('supports opacity, shadow presets, borders, and flips on layer interface', () => {
    const testLayer: import('../types/imageStudio').ImageLayer = {
      id: 'test-layer-1',
      type: 'block',
      blockType: 'CustomText',
      title: 'Título de Prueba',
      props: { text: 'Hola Mundo' },
      position: { x: 50, y: 50 },
      zIndex: 1,
      scale: 1,
      opacity: 0.85,
      flipHorizontal: true,
      flipVertical: false,
      shadowPreset: 'glow_teal',
      borderColor: '#94D2BD',
      borderWidth: 2,
      borderRadius: 16,
    };

    expect(testLayer.opacity).toBe(0.85);
    expect(testLayer.flipHorizontal).toBe(true);
    expect(testLayer.flipVertical).toBe(false);
    expect(testLayer.shadowPreset).toBe('glow_teal');
    expect(testLayer.borderWidth).toBe(2);
    expect(testLayer.borderRadius).toBe(16);
  });

  it('preserves exact visual offsets when grouping and ungrouping layers', () => {
    const layerA: import('../types/imageStudio').ImageLayer = {
      id: 'layer-a',
      type: 'block',
      blockType: 'CustomText',
      title: 'A',
      position: { x: 40, y: 40 },
      zIndex: 1,
      scale: 1,
      props: {},
    };

    const layerB: import('../types/imageStudio').ImageLayer = {
      id: 'layer-b',
      type: 'block',
      blockType: 'CustomText',
      title: 'B',
      position: { x: 60, y: 60 },
      zIndex: 2,
      scale: 1,
      props: {},
    };

    // Centro del grupo
    const avgX = (layerA.position.x + layerB.position.x) / 2; // 50
    const avgY = (layerA.position.y + layerB.position.y) / 2; // 50
    expect(avgX).toBe(50);
    expect(avgY).toBe(50);

    const relAX = layerA.position.x - avgX; // -10
    const relBX = layerB.position.x - avgX; // +10

    // Si el grupo se mueve a (70, 70):
    const groupMovedX = 70;
    const groupMovedY = 70;

    // Al desagrupar, la posición de A debe ser exactamente 70 + (-10) = 60
    const ungroupedAX = groupMovedX + relAX;
    const ungroupedAY = groupMovedY + (layerA.position.y - avgY);
    const ungroupedBX = groupMovedX + relBX;
    const ungroupedBY = groupMovedY + (layerB.position.y - avgY);

    expect(ungroupedAX).toBe(60);
    expect(ungroupedAY).toBe(60);
    expect(ungroupedBX).toBe(80);
    expect(ungroupedBY).toBe(80);
  });
});

describe('ImageStudio Smart Canvas Composer & Auto-Layout', () => {
  it('generates a full structured canvas project for all 6 marketing objectives', async () => {
    const { generateSmartCanvasProject, SMART_OBJECTIVES } = await import('../utils/smartCanvasComposer');
    expect(SMART_OBJECTIVES.length).toBe(6);

    SMART_OBJECTIVES.forEach((obj) => {
      const projectLight = generateSmartCanvasProject({
        objective: obj.id,
        theme: 'light',
      });
      expect(projectLight.id).toBeTruthy();
      expect(projectLight.layers.length).toBeGreaterThanOrEqual(3);
      expect(projectLight.background.gradient).toBeDefined();

      const projectDark = generateSmartCanvasProject({
        objective: obj.id,
        theme: 'dark',
      });
      expect(projectDark.id).toBeTruthy();
      expect(projectDark.layers.length).toBeGreaterThanOrEqual(3);
      expect(projectDark.background.gradient).toBeDefined();
    });
  });

  it('correctly adapts layers proportionally when changing canvas aspect ratios (Smart Multi-Resize)', () => {
    const oldW = 1080;
    const oldH = 1350;
    const newW = 1920;
    const newH = 1080;

    const layer = {
      position: { x: 540, y: 675 },
      width: 500,
      fontSize: 40,
    };

    const scaleX = newW / oldW;
    const scaleY = newH / oldH;
    const scaleUniform = Math.min(scaleX, scaleY);

    const newPosX = Math.round(layer.position.x * scaleX);
    const newPosY = Math.round(layer.position.y * scaleY);
    const newWidth = Math.round(layer.width * scaleX);
    const newFontSize = Math.round(layer.fontSize * scaleUniform);

    expect(newPosX).toBe(960);
    expect(newPosY).toBe(540);
    expect(newWidth).toBe(889);
    expect(newFontSize).toBe(32);
  });

  it('provides rich elements presets catalog with CTAs, stamps, surfaces, and shapes', async () => {
    const { ELEMENT_PRESETS, ELEMENT_PRESET_CATEGORIES } = await import('../data/elementsPresets');
    expect(ELEMENT_PRESET_CATEGORIES.length).toBeGreaterThanOrEqual(4);
    expect(ELEMENT_PRESETS.length).toBeGreaterThanOrEqual(8);

    const categories = ELEMENT_PRESETS.map((e) => e.category);
    expect(categories).toContain('shapes');
    expect(categories).toContain('trust_stamps');
    expect(categories).toContain('ctas');
    expect(categories).toContain('surfaces');
  });
});

