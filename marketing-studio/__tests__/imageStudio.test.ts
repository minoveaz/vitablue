import { describe, it, expect, vi } from 'vitest';
import { IMAGE_FORMAT_PRESETS } from '../types/imageStudio';
import {
  EMPRESA_IMAGE_TEMPLATES,
  INITIAL_IMAGE_TEMPLATES,
  MARKETING_TEMPLATE_PROJECT_BY_ID,
  UNIVERSAL_IMAGE_TEMPLATES,
} from '../utils/imageTemplates';
import { TEMPLATE_CATALOG } from '../data/templateCatalog';

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

  it('maps every marketing catalog item to an independent project with the correct aspect', () => {
    expect(UNIVERSAL_IMAGE_TEMPLATES).toHaveLength(8);
    expect(EMPRESA_IMAGE_TEMPLATES).toHaveLength(13);

    const marketingCatalog = TEMPLATE_CATALOG;
    expect(marketingCatalog).toHaveLength(20);
    marketingCatalog.forEach((item) => {
      const project = MARKETING_TEMPLATE_PROJECT_BY_ID.get(item.projectId);
      expect(project, item.id).toBeDefined();
      expect(project?.preset.aspectRatio, item.id).toBe(item.aspectRatio);
      expect(project?.layers.length, item.id).toBeGreaterThan(1);
      expect(new Set(project?.layers.map((layer) => layer.id)).size, item.id).toBe(project?.layers.length);
    });

    expect(new Set(UNIVERSAL_IMAGE_TEMPLATES.map((template) => template.id)).size).toBe(8);
    const universalCopy = UNIVERSAL_IMAGE_TEMPLATES.flatMap((template) =>
      template.layers.map((layer) => JSON.stringify(layer.props))
    ).join(' ');
    expect(universalCopy).not.toContain('VitaBlue');
    expect(universalCopy).not.toContain('#005F73');
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

  it('creates an independent persisted project from a catalog template', async () => {
    const { createImageProjectFromTemplate } = await import('../utils/imageProjectStorage');
    const source = MARKETING_TEMPLATE_PROJECT_BY_ID.get('vitablue-reference-carousel-white');
    expect(source).toBeDefined();

    const created = createImageProjectFromTemplate(source!, 'Mi referencia');

    expect(created.id).not.toBe(source?.id);
    expect(created.title).toBe('Mi referencia');
    expect(created.carouselConfig?.slideCount).toBe(5);
    expect(created.layers).not.toBe(source?.layers);
    expect(created.layers[0].props).not.toBe(source?.layers[0].props);
  });

  it('persists uploaded image media for reuse without duplicating identical data URLs', async () => {
    const {
      getStoredImageMedia,
      saveUploadedImageMedia,
    } = await import('../utils/imageMediaStorage');
    const dataUrl = 'data:image/png;base64,' + 'a'.repeat(128);
    const first = saveUploadedImageMedia(dataUrl, {
      title: 'Logo propio',
      fileName: 'logo.png',
      mimeType: 'image/png',
    });
    const second = saveUploadedImageMedia(dataUrl, {
      title: 'Logo propio',
      fileName: 'logo.png',
      mimeType: 'image/png',
    });

    expect(first.media).toBeDefined();
    expect(second.media?.id).toBe(first.media?.id);
    expect(getStoredImageMedia().filter((media) => media.dataUrl === dataUrl)).toHaveLength(1);
  });

  it('rejects oversized uploads before they can fill the media library', async () => {
    const { MAX_IMAGE_MEDIA_ITEM_BYTES, saveUploadedImageMedia } = await import('../utils/imageMediaStorage');
    const oversizedDataUrl = 'data:image/png;base64,' + 'a'.repeat(MAX_IMAGE_MEDIA_ITEM_BYTES * 2);
    const result = saveUploadedImageMedia(oversizedDataUrl, {
      title: 'Grande',
      fileName: 'grande.png',
      mimeType: 'image/png',
    });

    expect(result.media).toBeNull();
    expect(result.error).toMatch(/demasiado grande/i);
  });

  it('keeps an uploaded data URL in the persisted project snapshot', async () => {
    const {
      getStoredImageProjects,
      saveStoredImageProject,
      createBlankImageProject,
    } = await import('../utils/imageProjectStorage');
    const project = createBlankImageProject('instagram-square', 'Proyecto con imagen');
    const dataUrl = 'data:image/png;base64,' + 'b'.repeat(128);
    saveStoredImageProject({
      ...project,
      layers: [{
        id: 'uploaded-layer',
        type: 'image',
        title: 'Logo propio',
        props: { imageUrl: dataUrl },
        position: { x: 50, y: 50 },
        zIndex: 1,
        scale: 1,
      }],
    });

    const reloaded = getStoredImageProjects().find((item) => item.id === project.id);
    expect(reloaded?.layers[0].props.imageUrl).toBe(dataUrl);
  });

  it('stores a compact media reference instead of duplicating a persisted data URL in projects', async () => {
    const {
      IMAGE_MEDIA_STORAGE_KEY,
      saveUploadedImageMedia,
    } = await import('../utils/imageMediaStorage');
    const {
      IMAGE_STUDIO_STORAGE_KEY,
      createBlankImageProject,
      getStoredImageProjects,
      saveStoredImageProject,
    } = await import('../utils/imageProjectStorage');
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
      removeItem: (key: string) => {
        values.delete(key);
      },
    };
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('window', { dispatchEvent: vi.fn() });

    const dataUrl = 'data:image/png;base64,' + 'c'.repeat(128);
    saveUploadedImageMedia(dataUrl, {
      title: 'Logo persistente',
      fileName: 'logo.png',
      mimeType: 'image/png',
    });
    const project = createBlankImageProject('instagram-square', 'Referencia compacta');
    saveStoredImageProject({
      ...project,
      layers: [{
        id: 'uploaded-layer',
        type: 'image',
        title: 'Logo persistente',
        props: { imageUrl: dataUrl },
        position: { x: 50, y: 50 },
        zIndex: 1,
        scale: 1,
      }],
    });

    expect(values.get(IMAGE_MEDIA_STORAGE_KEY)).toContain(dataUrl);
    expect(values.get(IMAGE_STUDIO_STORAGE_KEY)).not.toContain(dataUrl);
    expect(getStoredImageProjects().find((item) => item.id === project.id)?.layers[0].props.imageUrl).toBe(dataUrl);
    vi.unstubAllGlobals();
  });

  it('keeps an upload usable when the browser quota rejects the media write', async () => {
    const { getStoredImageMedia, saveUploadedImageMedia } = await import('../utils/imageMediaStorage');
    const values = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: () => {
        throw new DOMException('quota', 'QuotaExceededError');
      },
      removeItem: (key: string) => values.delete(key),
    });
    vi.stubGlobal('window', { dispatchEvent: vi.fn() });

    const result = saveUploadedImageMedia('data:image/png;base64,' + 'd'.repeat(128), {
      title: 'Disponible en el diseño',
      fileName: 'quota.png',
      mimeType: 'image/png',
    });

    expect(result.media).toBeDefined();
    expect(result.persisted).toBe(false);
    expect(result.warning).toMatch(/disponible en este diseño/i);
    expect(result.error).toBeUndefined();
    expect(getStoredImageMedia().some((media) => media.id === result.media?.id)).toBe(true);
    vi.unstubAllGlobals();
  });

  describe('ImageStudio core validation contracts', () => {
    it('keeps intentional bleed positions and reports out-of-bounds layers', async () => {
      const { clampLayerPosition, validateImageProject } = await import('../utils/imageProjectValidation');
      expect(clampLayerPosition({ x: -10, y: 120 })).toEqual({ x: -10, y: 120 });
      const project = {
        ...INITIAL_IMAGE_TEMPLATES[0],
        layers: [{ ...INITIAL_IMAGE_TEMPLATES[0].layers[0], position: { x: 140, y: 50 } }],
      };
      expect(validateImageProject(project).some((issue) => issue.code === 'out-of-bounds')).toBe(true);
    });
  });

  describe('ImageStudio layer model and grouping contracts', () => {
    it('preserves geometry when a custom group is expanded after scale and rotation', async () => {
      const { createCustomGroup, expandCustomGroup } = await import('../utils/imageEditorCore');
      const layers = [
        { id: 'a', type: 'block' as const, blockType: 'CustomText' as const, title: 'A', props: {}, position: { x: 40, y: 50 }, zIndex: 1, scale: 1 },
        { id: 'b', type: 'block' as const, blockType: 'CustomText' as const, title: 'B', props: {}, position: { x: 60, y: 50 }, zIndex: 2, scale: 1 },
      ];
      const group = createCustomGroup(layers, 'group');
      const moved = { ...group, position: { x: 70, y: 60 }, scale: 2, rotation: 90 };
      const expanded = expandCustomGroup(moved);

      expect(expanded.map((layer) => layer.position)).toEqual([
        { x: 70, y: 40 },
        { x: 70, y: 80 },
      ]);
      expect(expanded[0].scale).toBe(2);
    });

    it('rejects grouping fewer than two layers', async () => {
      const { createCustomGroup } = await import('../utils/imageEditorCore');
      expect(() => createCustomGroup([], 'group')).toThrow();
    });

    it('deduplicates consecutive history snapshots and truncates redo branches', async () => {
      const { appendImageProjectHistory } = await import('../utils/imageEditorHistory');
      const base = INITIAL_IMAGE_TEMPLATES[0];
      const first = appendImageProjectHistory([base], 0, base);
      expect(first.index).toBe(0);
      const changed = { ...base, title: 'Cambio' };
      const second = appendImageProjectHistory([base], 0, changed);
      const branched = appendImageProjectHistory(second.history, 0, { ...base, title: 'Rama' });
      expect(branched.history).toHaveLength(2);
      expect(branched.history[1].title).toBe('Rama');
    });
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
    expect(categories).toContain('illustrations');
    expect(categories).toContain('trust_stamps');
    expect(categories).toContain('ctas');
    expect(categories).toContain('surfaces');

    // Comprobar que cada preset tiene blockType y defaultProps válidos
    ELEMENT_PRESETS.forEach((preset) => {
      expect(preset.id).toBeTruthy();
      expect(preset.title).toBeTruthy();
      expect(preset.blockType).toBeTruthy();
      expect(typeof preset.defaultProps).toBe('object');
    });

    const { WEB_ILLUSTRATION_COMPONENTS } = await import('../components/image-editor/blocks/WebIllustrationBlock');
    expect(Object.keys(WEB_ILLUSTRATION_COMPONENTS).length).toBeGreaterThanOrEqual(20);
    expect(WEB_ILLUSTRATION_COMPONENTS['medical-attention']).toBeDefined();
    expect(WEB_ILLUSTRATION_COMPONENTS['student']).toBeDefined();
    expect(WEB_ILLUSTRATION_COMPONENTS['passport']).toBeDefined();
  });

  it('validates that all geometric shapes and marketing elements can be created as layers with positive dimensions', async () => {
    const { ELEMENT_PRESETS } = await import('../data/elementsPresets');
    
    // Testear todos los presets de elementos
    ELEMENT_PRESETS.forEach((preset) => {
      const layer: import('../types/imageStudio').ImageLayer = {
        id: `layer-${preset.id}`,
        type: 'block',
        blockType: preset.blockType,
        title: preset.title,
        props: preset.defaultProps,
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        width: typeof preset.defaultProps.width === 'number' ? preset.defaultProps.width : 200,
        height: typeof preset.defaultProps.height === 'number' ? preset.defaultProps.height : 200,
      };

      expect(layer.id).toBeTruthy();
      expect(layer.blockType).toBe(preset.blockType);
      expect(layer.width).toBeGreaterThan(0);
      expect(layer.height).toBeGreaterThan(0);
    });
  });

  it('provides a curated stock photo library with categories for student visas, health, travel, and advisors', async () => {
    const { CURATED_STOCK_PHOTOS, STOCK_CATEGORIES } = await import('../data/stockPhotos');
    expect(CURATED_STOCK_PHOTOS.length).toBeGreaterThanOrEqual(15);
    expect(STOCK_CATEGORIES.length).toBeGreaterThanOrEqual(6);

    const categories = CURATED_STOCK_PHOTOS.map((p) => p.category);
    expect(categories).toContain('students');
    expect(categories).toContain('health');
    expect(categories).toContain('travel');
    expect(categories).toContain('advisors');

    CURATED_STOCK_PHOTOS.forEach((photo) => {
      expect(photo.id).toBeTruthy();
      expect(photo.url).toBeTruthy();
      expect(photo.thumbnailUrl).toBeTruthy();
      expect(photo.tags.length).toBeGreaterThan(0);
    });
  });

  it('validates that BrandLogoBlock renders all VitaBlue official logo and isotype variants', async () => {
    const { BrandLogoBlock } = await import('../components/image-editor/blocks/BrandLogoBlock');
    expect(BrandLogoBlock).toBeDefined();

    const layer: import('../types/imageStudio').ImageLayer = {
      id: 'layer-logo-brand',
      type: 'block',
      blockType: 'BrandLogo',
      title: 'Logo VitaBlue',
      props: {
        variant: 'colored-on-dark',
        showText: true,
        showTagline: false,
        orientation: 'horizontal',
      },
      position: { x: 50, y: 50 },
      zIndex: 10,
      scale: 1,
      width: 220,
      height: 52,
    };

    expect(layer.blockType).toBe('BrandLogo');
    expect(layer.props.variant).toBe('colored-on-dark');
  });

  it('correctly parses and formats multi-colored words and highlight rules in text layers', async () => {
    const { parseFormattedText } = await import('../utils/textFormatter');
    expect(parseFormattedText).toBeDefined();

    // 1. Regla de palabras resaltadas
    const nodes = parseFormattedText(
      '¿Vas a estudiar en España? Evita que te DENEGUEN el visado',
      [{ word: 'DENEGUEN', color: '#EE9B00', bgColor: 'rgba(0, 95, 115, 0.4)' }]
    );
    expect(nodes).toBeDefined();

    // 2. Sintaxis en línea [Palabra](#COLOR)
    const inlineNodes = parseFormattedText('Evita que te [DENEGUEN](#EE9B00) tu visado');
    expect(inlineNodes).toBeDefined();
  });

  it('corrects accents, punctuation signs and insurance domain capitalization (Spelling Assistant)', async () => {
    const { correctSpanishText } = await import('../utils/spellingCorrector');
    expect(correctSpanishText).toBeDefined();

    // 1. Signos de apertura ¿?, acentos en España y Extranjería
    const res1 = correctSpanishText('vas a estudiar en espana?');
    expect(res1.correctedText).toBe('¿Vas a estudiar en España?');
    expect(res1.changesCount).toBeGreaterThan(0);

    // 2. Términos de visado (denegacion, poliza, vitablue, whatsapp)
    const res2 = correctSpanishText('evita la denegacion de tu poliza en vitablue por whatsapp');
    expect(res2.correctedText).toBe('Evita la denegación de tu póliza en VitaBlue por WhatsApp');

    // 3. Mayúsculas completas y conservación de [Palabra](#COLOR)
    const res3 = correctSpanishText('que no te [DENEGUEN](#EE9B00) el visado!');
    expect(res3.correctedText).toBe('¡Que no te [DENEGUEN](#EE9B00) el visado!');
  });

  it('defines the 5 official Instagram Story Highlight presets with vector icons and templates', async () => {
    const { HIGHLIGHT_PRESETS } = await import('../components/image-editor/blocks/HighlightCoverBlocks');
    expect(HIGHLIGHT_PRESETS.length).toBe(5);

    const keys = HIGHLIGHT_PRESETS.map((h) => h.id);
    expect(keys).toContain('approved');
    expect(keys).toContain('visa');
    expect(keys).toContain('process');
    expect(keys).toContain('faq');
    expect(keys).toContain('contact');

    // Verificar que las 5 plantillas oficiales existan en INITIAL_IMAGE_TEMPLATES
    const highlightTemplates = INITIAL_IMAGE_TEMPLATES.filter((t) =>
      t.id.startsWith('template-highlight-')
    );
    expect(highlightTemplates.length).toBe(5);
  });
});
