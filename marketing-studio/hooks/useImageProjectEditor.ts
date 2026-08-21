import { useState, useCallback, useEffect, useRef } from 'react';
import { toPng, toJpeg, toSvg, toBlob } from 'html-to-image';
import {
  ImageProject,
  ImageLayer,
  ImageFormatPreset,
  ImageBlockType,
  CanvasBackground,
  CanvasGuideSettings,
  ImageStyleVariantId,
} from '../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from '../utils/imageTemplates';
import { saveStoredImageProject, saveRecoveryImageProject, getRecoveryImageProject } from '../utils/imageProjectStorage';
import { clampLayerPosition, validateImageProject, ImageProjectValidationIssue } from '../utils/imageProjectValidation';
import { saveCustomElement } from '../utils/savedElementsStorage';
import { TextPresetItem } from '../data/textPresets';
import { generateSmartCanvasProject, SmartComposerOptions } from '../utils/smartCanvasComposer';
import { createCustomGroup, expandCustomGroup } from '../utils/imageEditorCore';
import { appendImageProjectHistory } from '../utils/imageEditorHistory';
import {
  applyLayerStyleVariant,
  autoLayoutLayers,
  ContentReplacement,
  createDefaultGuideSettings,
  fitTextLayer,
  getPlatformGuideProfile,
  replaceLayerContent as replaceLayerContentPreservingComposition,
} from '../utils/imageDesignSystem';

const withProfessionalDesignDefaults = (project: ImageProject): ImageProject => ({
  ...project,
  guideSettings: {
    ...createDefaultGuideSettings(project.preset),
    ...(project.guideSettings ?? {}),
  },
});

export function useImageProjectEditor(initialProject?: ImageProject) {
  const [project, setProject] = useState<ImageProject>(
    withProfessionalDesignDefaults(initialProject ?? INITIAL_IMAGE_TEMPLATES[0])
  );
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>(
    project.layers[0]?.id ? [project.layers[0].id] : []
  );
  const selectedLayerId = selectedLayerIds[0] ?? null;
  const setSelectedLayerId = useCallback((id: string | null) => {
    setSelectedLayerIds(id ? [id] : []);
  }, []);

  const [zoom, setZoom] = useState<number>(0.55);
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<string>(new Date().toISOString());
  const [validationIssues, setValidationIssues] = useState<ImageProjectValidationIssue[]>([]);
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'recovery'>('saved');

  const lastLoadedProjectRef = useRef<string>('');
  const historyRef = useRef<ImageProject[]>([JSON.parse(JSON.stringify(project))]);
  const historyIndexRef = useRef<number>(0);
  const [historyLength, setHistoryLength] = useState<number>(1);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  useEffect(() => {
    if (!initialProject) return;
    const recovery = getRecoveryImageProject();
    if (recovery && recovery.project.id === initialProject.id && recovery.savedAt > initialProject.updatedAt) {
      setProject(withProfessionalDesignDefaults(recovery.project));
      setSaveState('recovery');
      setValidationIssues(validateImageProject(recovery.project));
    }
  }, [initialProject]);

  useEffect(() => {
    setValidationIssues(validateImageProject(project));
    setSaveState('saving');
    const timer = window.setTimeout(() => {
      saveRecoveryImageProject(project);
      setSaveState('saved');
    }, 500);
    return () => window.clearTimeout(timer);
  }, [project]);

  // Re-sync whenever initialProject is supplied (e.g. mounting, routing from Hub, or URL param change)
  useEffect(() => {
    if (initialProject) {
      const projectFingerprint = `${initialProject.id}_${initialProject.updatedAt || ''}_${initialProject.layers.length}_${initialProject.title}`;
      if (projectFingerprint !== lastLoadedProjectRef.current) {
        lastLoadedProjectRef.current = projectFingerprint;
        const normalizedProject = withProfessionalDesignDefaults(initialProject);
        setProject(normalizedProject);
        setSelectedLayerIds(initialProject.layers[0]?.id ? [initialProject.layers[0].id] : []);
        const cloned = JSON.parse(JSON.stringify(normalizedProject));
        historyRef.current = [cloned];
        historyIndexRef.current = 0;
        setHistoryLength(1);
        setHistoryIndex(0);
        setLastSavedAt(initialProject.updatedAt || new Date().toISOString());
      }
    }
  }, [initialProject]);

  // Clipboard refs para Copiar/Pegar capas y Copiar/Pegar estilos (Canva-style)
  const clipboardLayersRef = useRef<ImageLayer[]>([]);
  const clipboardStyleRef = useRef<Partial<ImageLayer>>({});
  const transientProjectRef = useRef<ImageProject | null>(null);
  const transientCommitTimerRef = useRef<number | null>(null);

  const pushHistory = useCallback((nextProject: ImageProject) => {
    const currentIdx = historyIndexRef.current;
    const result = appendImageProjectHistory(historyRef.current, currentIdx, nextProject);
    if (result.history === historyRef.current) {
      return;
    }
    historyRef.current = result.history;
    historyIndexRef.current = result.index;
    setHistoryLength(result.history.length);
    setHistoryIndex(result.index);
    saveStoredImageProject(result.history[result.index]);
    setLastSavedAt(new Date().toISOString());
  }, []);

  const scheduleTransientCommit = useCallback((nextProject: ImageProject) => {
    transientProjectRef.current = nextProject;
    if (transientCommitTimerRef.current !== null) {
      window.clearTimeout(transientCommitTimerRef.current);
    }
    transientCommitTimerRef.current = window.setTimeout(() => {
      if (transientProjectRef.current) pushHistory(transientProjectRef.current);
      transientProjectRef.current = null;
      transientCommitTimerRef.current = null;
    }, 250);
  }, [pushHistory]);

  const undo = useCallback(() => {
    const currentIdx = historyIndexRef.current;
    if (currentIdx > 0) {
      const nextIdx = currentIdx - 1;
      const targetProject: ImageProject = JSON.parse(JSON.stringify(historyRef.current[nextIdx]));
      historyIndexRef.current = nextIdx;
      setHistoryIndex(nextIdx);
      setProject(targetProject);
      saveStoredImageProject(targetProject);
      setLastSavedAt(new Date().toISOString());
    }
  }, []);

  const redo = useCallback(() => {
    const currentIdx = historyIndexRef.current;
    if (currentIdx < historyRef.current.length - 1) {
      const nextIdx = currentIdx + 1;
      const targetProject: ImageProject = JSON.parse(JSON.stringify(historyRef.current[nextIdx]));
      historyIndexRef.current = nextIdx;
      setHistoryIndex(nextIdx);
      setProject(targetProject);
      saveStoredImageProject(targetProject);
      setLastSavedAt(new Date().toISOString());
    }
  }, []);

  const updateTitle = useCallback((title: string) => {
    setProject((prev) => {
      const next = { ...prev, title, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const setPreset = useCallback((preset: ImageFormatPreset, options?: { smartResize?: boolean }) => {
    const shouldSmartResize = options?.smartResize ?? true;
    setProject((prev) => {
      const oldW = prev.preset.width;
      const oldH = prev.preset.height;
      const newW = preset.width;
      const newH = preset.height;

      if (!shouldSmartResize || prev.layers.length === 0 || (oldW === newW && oldH === newH)) {
        const defaults = createDefaultGuideSettings(preset);
        const profile = getPlatformGuideProfile(preset, prev.guideSettings?.profileId);
        const next = {
          ...prev,
          preset,
          guideSettings: {
            ...defaults,
            ...(prev.guideSettings ?? {}),
            columns: profile.columns,
            columnGap: profile.columnGap,
          },
          updatedAt: new Date().toISOString(),
        };
        pushHistory(next);
        return next;
      }

      const scaleUniform = Math.min(newW / oldW, newH / oldH);

      const nextLayers = prev.layers.map((layer) => {
        if (layer.locked) return layer;
        const width = layer.width ? Math.round(layer.width * scaleUniform) : undefined;
        const height = layer.height ? Math.round(layer.height * scaleUniform) : undefined;
        const fontSize = layer.fontSize ? Math.round(layer.fontSize * scaleUniform) : undefined;

        return {
          ...layer,
          ...(width !== undefined ? { width } : {}),
          ...(height !== undefined ? { height } : {}),
          ...(fontSize !== undefined ? { fontSize } : {}),
        };
      });

      const next: ImageProject = {
        ...prev,
        preset,
        layers: nextLayers,
        guideSettings: {
          ...createDefaultGuideSettings(preset),
          ...(prev.guideSettings ?? {}),
          columns: getPlatformGuideProfile(preset, prev.guideSettings?.profileId).columns,
          columnGap: getPlatformGuideProfile(preset, prev.guideSettings?.profileId).columnGap,
        },
        updatedAt: new Date().toISOString(),
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const composeSmartCanvas = useCallback((options: SmartComposerOptions) => {
    const smartProject = withProfessionalDesignDefaults(generateSmartCanvasProject(options));
    setProject(smartProject);
    setSelectedLayerIds(smartProject.layers[0]?.id ? [smartProject.layers[0].id] : []);
    pushHistory(smartProject);
  }, [pushHistory]);

  const loadTemplate = useCallback((template: ImageProject) => {
    const normalizedTemplate = withProfessionalDesignDefaults(template);
    setProject(normalizedTemplate);
    setSelectedLayerIds(normalizedTemplate.layers[0]?.id ? [normalizedTemplate.layers[0].id] : []);
    pushHistory(normalizedTemplate);
  }, [pushHistory]);

  const selectLayer = useCallback((id: string | null, isShift = false) => {
    if (!id) {
      setSelectedLayerIds([]);
      return;
    }
    if (isShift) {
      setSelectedLayerIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setSelectedLayerIds([id]);
    }
  }, []);

  const selectMultipleLayers = useCallback((ids: string[]) => {
    setSelectedLayerIds(ids);
  }, []);

  const toggleLayerSelection = useCallback((id: string) => {
    setSelectedLayerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const deleteSelectedLayers = useCallback(() => {
    if (selectedLayerIds.length === 0) return;
    setProject((prev) => {
      const nextLayers = prev.layers.filter((l) => !selectedLayerIds.includes(l.id) || l.locked);
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      setSelectedLayerIds([]);
      pushHistory(next);
      return next;
    });
  }, [selectedLayerIds, pushHistory]);

  const updateMultipleLayersPosition = useCallback((deltaPercent: { x: number; y: number }) => {
    if (selectedLayerIds.length === 0) return;
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) => {
        if (!selectedLayerIds.includes(l.id) || l.locked) return l;
        return {
          ...l,
          position: {
            x: Math.max(5, Math.min(95, Math.round((l.position.x + deltaPercent.x) * 10) / 10)),
            y: Math.max(5, Math.min(95, Math.round((l.position.y + deltaPercent.y) * 10) / 10)),
          },
        };
      });
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [selectedLayerIds, pushHistory]);

  const groupSelectedLayers = useCallback(() => {
    if (selectedLayerIds.length < 2) return;
    const layersToGroup = project.layers.filter((l) => selectedLayerIds.includes(l.id) && !l.locked);
    if (layersToGroup.length < 2) return;

    const groupLayerId = `layer-group-${Date.now()}`;
    const newGroupLayer = createCustomGroup(layersToGroup, groupLayerId);

    setProject((prev) => {
      const groupedIds = new Set(layersToGroup.map((layer) => layer.id));
      const remainingLayers = prev.layers.filter((l) => !groupedIds.has(l.id));
      const next = {
        ...prev,
        layers: [...remainingLayers, newGroupLayer],
        updatedAt: new Date().toISOString(),
      };
      setSelectedLayerIds([groupLayerId]);
      pushHistory(next);
      return next;
    });
  }, [selectedLayerIds, project.layers, pushHistory]);

  const alignSelectedLayers = useCallback((alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedLayerIds.length === 0) return;

    setProject((prev) => {
      const layersToAlign = prev.layers.filter((l) => selectedLayerIds.includes(l.id) && !l.locked);
      if (layersToAlign.length === 0) return prev;

      let nextLayers: ImageLayer[];

      if (layersToAlign.length === 1) {
        // Alinear capa única respecto al lienzo (Artboard)
        const target = layersToAlign[0];
        let newX = target.position.x;
        let newY = target.position.y;

        if (alignment === 'left') newX = 20;
        else if (alignment === 'center') newX = 50;
        else if (alignment === 'right') newX = 80;
        else if (alignment === 'top') newY = 20;
        else if (alignment === 'middle') newY = 50;
        else if (alignment === 'bottom') newY = 80;

        nextLayers = prev.layers.map((l) => (l.id === target.id ? { ...l, position: { x: newX, y: newY } } : l));
      } else {
        // Alinear múltiples capas entre sí
        if (alignment === 'left') {
          const minX = Math.min(...layersToAlign.map((l) => l.position.x));
          nextLayers = prev.layers.map((l) => (selectedLayerIds.includes(l.id) && !l.locked ? { ...l, position: { ...l.position, x: minX } } : l));
        } else if (alignment === 'center') {
          const avgX = Math.round((layersToAlign.reduce((sum, l) => sum + l.position.x, 0) / layersToAlign.length) * 10) / 10;
          nextLayers = prev.layers.map((l) => (selectedLayerIds.includes(l.id) && !l.locked ? { ...l, position: { ...l.position, x: avgX } } : l));
        } else if (alignment === 'right') {
          const maxX = Math.max(...layersToAlign.map((l) => l.position.x));
          nextLayers = prev.layers.map((l) => (selectedLayerIds.includes(l.id) && !l.locked ? { ...l, position: { ...l.position, x: maxX } } : l));
        } else if (alignment === 'top') {
          const minY = Math.min(...layersToAlign.map((l) => l.position.y));
          nextLayers = prev.layers.map((l) => (selectedLayerIds.includes(l.id) && !l.locked ? { ...l, position: { ...l.position, y: minY } } : l));
        } else if (alignment === 'middle') {
          const avgY = Math.round((layersToAlign.reduce((sum, l) => sum + l.position.y, 0) / layersToAlign.length) * 10) / 10;
          nextLayers = prev.layers.map((l) => (selectedLayerIds.includes(l.id) && !l.locked ? { ...l, position: { ...l.position, y: avgY } } : l));
        } else {
          const maxY = Math.max(...layersToAlign.map((l) => l.position.y));
          nextLayers = prev.layers.map((l) => (selectedLayerIds.includes(l.id) && !l.locked ? { ...l, position: { ...l.position, y: maxY } } : l));
        }
      }

      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [selectedLayerIds, pushHistory]);

  const distributeSelectedLayers = useCallback((direction: 'horizontal' | 'vertical') => {
    if (selectedLayerIds.length < 3) return;

    setProject((prev) => {
      const layersToDistribute = prev.layers.filter((l) => selectedLayerIds.includes(l.id) && !l.locked);
      if (layersToDistribute.length < 3) return prev;

      let nextLayers: ImageLayer[];

      if (direction === 'horizontal') {
        const sorted = [...layersToDistribute].sort((a, b) => a.position.x - b.position.x);
        const minX = sorted[0].position.x;
        const maxX = sorted[sorted.length - 1].position.x;
        const step = (maxX - minX) / (sorted.length - 1);

        const newPosMap = new Map<string, number>();
        sorted.forEach((l, idx) => {
          newPosMap.set(l.id, Math.round((minX + idx * step) * 10) / 10);
        });

        nextLayers = prev.layers.map((l) => {
          if (newPosMap.has(l.id)) {
            return { ...l, position: { ...l.position, x: newPosMap.get(l.id)! } };
          }
          return l;
        });
      } else {
        const sorted = [...layersToDistribute].sort((a, b) => a.position.y - b.position.y);
        const minY = sorted[0].position.y;
        const maxY = sorted[sorted.length - 1].position.y;
        const step = (maxY - minY) / (sorted.length - 1);

        const newPosMap = new Map<string, number>();
        sorted.forEach((l, idx) => {
          newPosMap.set(l.id, Math.round((minY + idx * step) * 10) / 10);
        });

        nextLayers = prev.layers.map((l) => {
          if (newPosMap.has(l.id)) {
            return { ...l, position: { ...l.position, y: newPosMap.get(l.id)! } };
          }
          return l;
        });
      }

      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [selectedLayerIds, pushHistory]);

  const copyToClipboard = useCallback(async (node: HTMLElement | null): Promise<boolean> => {
    if (!node) return false;
    try {
      const exportOptions = {
        pixelRatio: 2,
        width: project.preset.width,
        height: project.preset.height,
        style: { overflow: 'hidden' },
        filter: (target: HTMLElement) => target.dataset?.editorOverlay !== 'true',
      };
      const blob = await toBlob(node, exportOptions);
      if (!blob) return false;
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      return true;
    } catch (err) {
      console.warn('Clipboard write failed, fallback to dataURL:', err);
      try {
        const exportOptions = {
          pixelRatio: 2,
          width: project.preset.width,
          height: project.preset.height,
          style: { overflow: 'hidden' },
          filter: (target: HTMLElement) => target.dataset?.editorOverlay !== 'true',
        };
        const dataUrl = await toPng(node, exportOptions);
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        return true;
      } catch (fallbackErr) {
        console.error('Failed to copy to clipboard:', fallbackErr);
        return false;
      }
    }
  }, [project.preset.width, project.preset.height]);

  const updateLayerFilter = useCallback((layerId: string, filter: ImageLayer['filter']) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, filter } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const updateLayerAdjustments = useCallback((layerId: string, adjustments: { brightness?: number; contrast?: number; blur?: number }) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, ...adjustments } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const updateLayerClipShape = useCallback((layerId: string, clipShape: ImageLayer['clipShape']) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, clipShape } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const setCarouselPages = useCallback((carouselPages: number) => {
    setProject((prev) => {
      const next = { ...prev, carouselPages, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const setCurrentSlide = useCallback((currentSlide: number) => {
    setProject((prev) => ({ ...prev, currentSlide }));
  }, []);

  const updateLayerProps = useCallback((layerId: string, patch: Record<string, unknown>) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) => {
        if (l.id !== layerId || l.locked) return l;

        const updated: ImageLayer = {
          ...l,
          props: { ...l.props, ...patch },
        };

        // Sincronizar propiedades estándar de capa si vienen en el patch
        if ('fill' in patch) updated.fill = patch.fill as string;
        if ('color' in patch) updated.fill = patch.color as string;
        if ('borderColor' in patch) updated.borderColor = patch.borderColor as string;
        if ('stroke' in patch) updated.borderColor = patch.stroke as string;
        if ('borderWidth' in patch) updated.borderWidth = patch.borderWidth as number;
        if ('strokeWidth' in patch) updated.borderWidth = patch.strokeWidth as number;
        if ('borderRadius' in patch) updated.borderRadius = patch.borderRadius as number;
        if ('fontSize' in patch) updated.fontSize = patch.fontSize as number;
        if ('fontWeight' in patch) updated.fontWeight = patch.fontWeight as string;
        if ('fontFamily' in patch) updated.fontFamily = patch.fontFamily as string;
        if ('align' in patch) updated.align = patch.align as 'left' | 'center' | 'right';
        if ('textAlign' in patch) updated.align = patch.textAlign as 'left' | 'center' | 'right';
        if ('letterSpacing' in patch) updated.letterSpacing = patch.letterSpacing as number;
        if ('lineHeight' in patch) updated.lineHeight = patch.lineHeight as number;
        if ('textEffect' in patch) updated.textEffect = patch.textEffect as 'none' | 'box' | 'stroke' | 'glow';
        if ('boxColor' in patch) updated.boxColor = patch.boxColor as string;
        if ('shadowPreset' in patch) updated.shadowPreset = patch.shadowPreset as ImageLayer['shadowPreset'];

        return updated;
      });
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const updateGuideSettings = useCallback((patch: Partial<CanvasGuideSettings>) => {
    setProject((prev) => {
      const next = {
        ...prev,
        guideSettings: {
          ...createDefaultGuideSettings(prev.preset),
          ...(prev.guideSettings ?? {}),
          ...patch,
        },
        updatedAt: new Date().toISOString(),
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const applyAutoLayout = useCallback((direction: 'vertical' | 'horizontal' | 'grid') => {
    if (selectedLayerIds.length === 0) return;
    setProject((prev) => {
      const nextLayers = autoLayoutLayers(prev.layers, selectedLayerIds, prev.preset, {
        direction,
        columns: direction === 'grid' ? Math.min(3, Math.ceil(Math.sqrt(selectedLayerIds.length))) : undefined,
        profileId: prev.guideSettings?.profileId,
      });
      if (nextLayers === prev.layers) return prev;
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [selectedLayerIds, pushHistory]);

  const fitSelectedText = useCallback(() => {
    if (selectedLayerIds.length === 0) return;
    setProject((prev) => {
      const nextLayers = prev.layers.map((layer) =>
        selectedLayerIds.includes(layer.id) ? fitTextLayer(layer, { mode: 'auto' }) : layer
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [selectedLayerIds, pushHistory]);

  const replaceLayerContent = useCallback((layerId: string, replacement: ContentReplacement) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((layer) =>
        layer.id === layerId
          ? fitTextLayer(replaceLayerContentPreservingComposition(layer, replacement))
          : layer
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const applyStyleVariant = useCallback((variantId: ImageStyleVariantId) => {
    if (selectedLayerIds.length === 0) return;
    setProject((prev) => {
      const nextLayers = prev.layers.map((layer) =>
        selectedLayerIds.includes(layer.id) ? applyLayerStyleVariant(layer, variantId) : layer
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [selectedLayerIds, pushHistory]);

  const updateLayerPosition = useCallback((layerId: string, position: { x: number; y: number }) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, position: clampLayerPosition(position) } : l
      );
      return { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
    });
  }, []);

  const updateLayerScale = useCallback((layerId: string, scale: number) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, scale: Math.max(0.3, Math.min(2.5, scale)) } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      scheduleTransientCommit(next);
      return next;
    });
  }, [scheduleTransientCommit]);

  const updateLayerWidth = useCallback((layerId: string, width?: number) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, width: width ? Math.max(40, Math.min(2400, width)) : undefined } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      scheduleTransientCommit(next);
      return next;
    });
  }, [scheduleTransientCommit]);

  const updateLayerHeight = useCallback((layerId: string, height?: number) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, height: height ? Math.max(20, Math.min(2400, height)) : undefined } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      scheduleTransientCommit(next);
      return next;
    });
  }, [scheduleTransientCommit]);

  const updateLayerRotation = useCallback((layerId: string, rotation: number) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, rotation: Math.round(rotation) } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      scheduleTransientCommit(next);
      return next;
    });
  }, [scheduleTransientCommit]);

  const duplicateLayer = useCallback((layerId: string) => {
    setProject((prev) => {
      const layer = prev.layers.find((l) => l.id === layerId);
      if (!layer) return prev;
      const maxZ = prev.layers.reduce((max, l) => Math.max(max, l.zIndex ?? 0), 0);
      const newLayer: ImageLayer = {
        ...layer,
        id: `layer-${Date.now()}`,
        position: {
          x: Math.min(85, layer.position.x + 4),
          y: Math.min(85, layer.position.y + 4),
        },
        zIndex: maxZ + 1,
      };
      const next = { ...prev, layers: [...prev.layers, newLayer], updatedAt: new Date().toISOString() };
      setSelectedLayerId(newLayer.id);
      setSelectedLayerIds([newLayer.id]);
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const duplicateSelectedLayers = useCallback(() => {
    if (selectedLayerIds.length === 0) return;
    setProject((prev) => {
      const layersToDuplicate = prev.layers.filter((l) => selectedLayerIds.includes(l.id));
      if (layersToDuplicate.length === 0) return prev;

      const maxZ = prev.layers.reduce((max, l) => Math.max(max, l.zIndex ?? 0), 0);
      const newLayers: ImageLayer[] = layersToDuplicate.map((layer, i) => ({
        ...layer,
        id: `layer-${Date.now()}-${i}`,
        position: {
          x: Math.min(92, layer.position.x + 3),
          y: Math.min(92, layer.position.y + 3),
        },
        zIndex: maxZ + 1 + i,
      }));

      const next = {
        ...prev,
        layers: [...prev.layers, ...newLayers],
        updatedAt: new Date().toISOString(),
      };
      setSelectedLayerIds(newLayers.map((l) => l.id));
      setSelectedLayerId(newLayers[0]?.id ?? null);
      pushHistory(next);
      return next;
    });
  }, [selectedLayerIds, pushHistory]);

  const removeLayer = useCallback((layerId: string) => {
    setProject((prev) => {
      const target = prev.layers.find((layer) => layer.id === layerId);
      if (target?.locked) return prev;
      const nextLayers = prev.layers.filter((l) => l.id !== layerId);
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      setSelectedLayerId(nextLayers[0]?.id ?? null);
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const toggleLayerLock = useCallback((layerId: string) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, locked: !l.locked } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, visible: l.visible === false ? true : false } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const renameLayer = useCallback((layerId: string, title: string) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, title } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const copySelectedLayers = useCallback(() => {
    const layersToCopy = project.layers.filter((l) => selectedLayerIds.includes(l.id));
    if (layersToCopy.length > 0) {
      clipboardLayersRef.current = JSON.parse(JSON.stringify(layersToCopy));
    }
  }, [project.layers, selectedLayerIds]);

  const pasteLayers = useCallback(() => {
    if (!clipboardLayersRef.current || clipboardLayersRef.current.length === 0) return;
    setProject((prev) => {
      const maxZ = prev.layers.reduce((max, l) => Math.max(max, l.zIndex ?? 0), 0);
      const newLayers: ImageLayer[] = clipboardLayersRef.current.map((layer, i) => ({
        ...JSON.parse(JSON.stringify(layer)),
        id: `layer-${Date.now()}-${i}`,
        position: {
          x: Math.min(92, layer.position.x + 3),
          y: Math.min(92, layer.position.y + 3),
        },
        zIndex: maxZ + 1 + i,
      }));

      const next = {
        ...prev,
        layers: [...prev.layers, ...newLayers],
        updatedAt: new Date().toISOString(),
      };
      setSelectedLayerIds(newLayers.map((l) => l.id));
      setSelectedLayerId(newLayers[0]?.id ?? null);
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const copyLayerStyle = useCallback((layerId?: string) => {
    const targetId = layerId ?? selectedLayerIds[0];
    const layer = project.layers.find((l) => l.id === targetId);
    if (!layer) return;
    clipboardStyleRef.current = {
      opacity: layer.opacity,
      fill: layer.fill,
      stroke: layer.stroke,
      strokeWidth: layer.strokeWidth,
      cornerRadius: layer.cornerRadius,
      fontFamily: layer.fontFamily,
      fontSize: layer.fontSize,
      fontWeight: layer.fontWeight,
      align: layer.align,
      letterSpacing: layer.letterSpacing,
      lineHeight: layer.lineHeight,
      filter: layer.filter,
      brightness: layer.brightness,
      contrast: layer.contrast,
      blur: layer.blur,
      clipShape: layer.clipShape,
      shadowPreset: layer.shadowPreset,
      shadowColor: layer.shadowColor,
      shadowBlur: layer.shadowBlur,
      borderColor: layer.borderColor,
      borderWidth: layer.borderWidth,
      borderRadius: layer.borderRadius,
      flipHorizontal: layer.flipHorizontal,
      flipVertical: layer.flipVertical,
    };
  }, [project.layers, selectedLayerIds]);

  const pasteLayerStyle = useCallback((targetLayerId?: string) => {
    if (!clipboardStyleRef.current || Object.keys(clipboardStyleRef.current).length === 0) return;
    const styleToApply = clipboardStyleRef.current;
    const idsToApply = targetLayerId ? [targetLayerId] : selectedLayerIds;
    if (idsToApply.length === 0) return;

    setProject((prev) => {
      const nextLayers = prev.layers.map((l) => (idsToApply.includes(l.id) && !l.locked ? { ...l, ...styleToApply } : l));
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [selectedLayerIds, pushHistory]);

  const toggleFlipHorizontal = useCallback((layerId: string) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, flipHorizontal: !l.flipHorizontal } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const toggleFlipVertical = useCallback((layerId: string) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, flipVertical: !l.flipVertical } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const nudgeSelectedLayers = useCallback((dx: number, dy: number) => {
    if (selectedLayerIds.length === 0) return;
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) => {
        if (!selectedLayerIds.includes(l.id) || l.locked) return l;
        return {
          ...l,
          position: {
            x: Math.round((l.position.x + dx) * 10) / 10,
            y: Math.round((l.position.y + dy) * 10) / 10,
          },
        };
      });
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [selectedLayerIds, pushHistory]);

  const updateLayerOpacity = useCallback((layerId: string, opacity: number) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, opacity: Math.max(0, Math.min(1, opacity)) } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const updateLayerShadowPreset = useCallback((layerId: string, shadowPreset: ImageLayer['shadowPreset']) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, shadowPreset } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const updateLayerBorder = useCallback((layerId: string, border: { borderWidth?: number; borderColor?: string; borderRadius?: number }) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId && !l.locked ? { ...l, ...border } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const moveLayerZIndex = useCallback((layerId: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    setProject((prev) => {
      const sortedLayers = [...prev.layers].sort((a, b) => a.zIndex - b.zIndex);
      const currentIndex = sortedLayers.findIndex((l) => l.id === layerId);
      if (currentIndex === -1) return prev;
      if (sortedLayers[currentIndex].locked) return prev;

      let targetIndex: number;
      if (direction === 'top') {
        targetIndex = sortedLayers.length - 1;
      } else if (direction === 'bottom') {
        targetIndex = 0;
      } else if (direction === 'up') {
        targetIndex = currentIndex + 1;
      } else {
        targetIndex = currentIndex - 1;
      }

      if (targetIndex < 0 || targetIndex >= sortedLayers.length || targetIndex === currentIndex) return prev;

      const [removed] = sortedLayers.splice(currentIndex, 1);
      sortedLayers.splice(targetIndex, 0, removed);

      const updatedLayers = sortedLayers.map((layer, idx) => ({
        ...layer,
        zIndex: idx + 1,
      }));

      const next = { ...prev, layers: updatedLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const reorderLayers = useCallback((reorderedLayerIds: string[]) => {
    setProject((prev) => {
      const total = reorderedLayerIds.length;
      const nextLayers = prev.layers.map((layer) => {
        if (layer.locked) return layer;
        const indexInList = reorderedLayerIds.indexOf(layer.id);
        if (indexInList === -1) return layer;
        return {
          ...layer,
          zIndex: total - indexInList,
        };
      });
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const toggleAllLayersLock = useCallback((locked: boolean) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) => ({ ...l, locked }));
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const toggleAllLayersVisibility = useCallback((visible: boolean) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) => ({ ...l, visible }));
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const addBlockLayer = useCallback((blockType: ImageBlockType, defaultProps?: Record<string, unknown>) => {
    let initialProps: Record<string, unknown> = defaultProps ?? {};
    let initialTitle = 'Bloque Visual';

    if (blockType === 'MotionAdvisorCard') {
      initialTitle = 'Tarjeta de Asesora';
      initialProps = {
        name: 'Sofía',
        role: 'Asesora Especialista en Visados',
        badge: 'ASESORA ASIGNADA · EN DIRECTO',
        message: 'Te ayudo a verificar que tu póliza cumple el 100% de los requisitos del consulado sin copagos.',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
        whatsAppText: 'Pregúntanos por WhatsApp',
        ...defaultProps,
      };
    } else if (blockType === 'MotionTrustBadge') {
      initialTitle = 'Sello de Garantía';
      initialProps = {
        title: 'PÓLIZA 100% VÁLIDA PARA VISADO',
        subtitle: 'Sin Copagos · Cobertura Completa · Repatriación Incluida',
        highlight: 'GARANTÍA CONSULAR',
        verifiedLabel: 'VERIFICADO PARA EXTRANJERÍA',
        ...defaultProps,
      };
    } else if (blockType === 'MotionProviderGrid') {
      initialTitle = 'Grid de Aseguradoras';
      initialProps = {
        title: 'COMPAÑÍAS LÍDERES AUTORIZADAS',
        subtitle: 'Aceptadas oficialmente por Extranjería y Consulados',
        ...defaultProps,
      };
    } else if (blockType === 'MotionComparisonCard') {
      initialTitle = 'Comparativa Visual';
      initialProps = {
        title: '¿SEGURO DE VIAJE O SEGURO DE VISADO?',
        wrongOptionTitle: 'Seguro de Viaje Común',
        wrongOptionDesc: 'Denegación de visado: no cumple requisitos consulares ni incluye red médica completa.',
        correctOptionTitle: 'Seguro VitaBlue Extranjería',
        correctOptionDesc: 'Aprobación garantizada: sin copagos, cobertura total y repatriación incluida.',
        ...defaultProps,
      };
    } else if (blockType === 'GeometricShape') {
      const type = String(defaultProps?.shapeType ?? 'Forma');
      const shapeNames: Record<string, string> = {
        heart: 'Corazón',
        star: 'Estrella',
        'star-4': 'Estrella (4 puntas)',
        'star-5': 'Estrella (5 puntas)',
        'star-6': 'Estrella (6 puntas)',
        'star-8': 'Estrella (8 puntas)',
        'burst-12': 'Sello / Burst',
        circle: 'Círculo',
        square: 'Cuadrado',
        rectangle: 'Rectángulo',
        rounded_rect: 'Rectángulo Redondeado',
        triangle: 'Triángulo',
        'triangle-up': 'Triángulo Arriba',
        'triangle-down': 'Triángulo Abajo',
        diamond: 'Rombo',
        pentagon: 'Pentágono',
        hexagon: 'Hexágono',
        octagon: 'Octágono',
        line: 'Línea Sólida',
        'line-dashed': 'Línea Discontinua',
        'line-dotted': 'Línea Punteada',
        'line-arrow-right': 'Línea con Flecha',
        'line-arrow-both': 'Línea con Flecha Doble',
        arrow: 'Flecha',
        'arrow-right': 'Flecha Derecha',
        'arrow-left': 'Flecha Izquierda',
        'arrow-up': 'Flecha Arriba',
        'arrow-down': 'Flecha Abajo',
        'arrow-both': 'Flecha Bidireccional',
        speech_bubble: 'Bocadillo de Diálogo',
        shield: 'Escudo Protector',
      };
      initialTitle = shapeNames[type] ? `Forma: ${shapeNames[type]}` : `Forma: ${type}`;
    }

    let width = typeof defaultProps?.width === 'number' ? defaultProps.width : undefined;
    let height = typeof defaultProps?.height === 'number' ? defaultProps.height : undefined;

    if (blockType === 'GeometricShape') {
      width = width ?? 200;
      const isLineShape = defaultProps?.shapeType === 'line' || defaultProps?.shapeType === 'line-dashed' || defaultProps?.shapeType === 'line-dotted';
      const isArrowLineShape = defaultProps?.shapeType === 'line-arrow-right' || defaultProps?.shapeType === 'line-arrow-both';
      height = height ?? (isLineShape ? 12 : isArrowLineShape ? 24 : 200);
    } else if (blockType === 'GlassCardSurface') {
      width = width ?? 420;
      height = height ?? 240;
      initialTitle = defaultProps?.variant === 'amber' ? 'Tarjeta Glass Oro' : 'Tarjeta Glass Teal';
    } else if (blockType === 'WhatsAppCtaButton') {
      width = width ?? 340;
      height = height ?? 56;
      initialTitle = typeof defaultProps?.ctaText === 'string' ? String(defaultProps.ctaText).replace(/^[^\w\s]+/, '').trim() : 'Botón CTA';
    } else if (blockType === 'TrustVerifiedPill') {
      width = width ?? 280;
      height = height ?? 44;
      initialTitle = 'Sello: Verificado Extranjería';
    } else if (blockType === 'TrustHighlightPill') {
      width = width ?? 240;
      height = height ?? 40;
      initialTitle = 'Sello: Garantía Consular';
    } else if (blockType === 'HookAlertBadge') {
      width = width ?? 320;
      height = height ?? 40;
      initialTitle = 'Badge: Asesora en Directo';
    } else if (blockType === 'WebIllustration') {
      width = width ?? 280;
      height = height ?? 210;
      initialTitle = typeof defaultProps?.title === 'string' ? String(defaultProps.title) : 'Ilustración Web';
    }

    const fill = (defaultProps?.fill as string) || (blockType === 'GeometricShape' ? '#005F73' : undefined);
    const borderColor = (defaultProps?.stroke as string) || (defaultProps?.borderColor as string);
    const borderWidth = typeof defaultProps?.strokeWidth === 'number' ? defaultProps.strokeWidth : (typeof defaultProps?.borderWidth === 'number' ? defaultProps.borderWidth : undefined);
    const borderRadius = typeof defaultProps?.borderRadius === 'number' ? defaultProps.borderRadius : undefined;

    const newLayer: ImageLayer = {
      id: `layer-${Date.now()}`,
      type: 'block',
      blockType,
      title: initialTitle,
      props: initialProps,
      position: { x: 50, y: 50 },
      zIndex: 999,
      scale: 1,
      width,
      height,
      fill,
      borderColor,
      borderWidth,
      borderRadius,
    };

    setProject((prev) => {
      const maxZ = prev.layers.reduce((max, l) => Math.max(max, l.zIndex ?? 0), 0);
      const layerWithTopZ = { ...newLayer, zIndex: maxZ + 1 };
      const next = { ...prev, layers: [...prev.layers, layerWithTopZ], updatedAt: new Date().toISOString() };
      setSelectedLayerId(layerWithTopZ.id);
      setSelectedLayerIds([layerWithTopZ.id]);
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const addTextLayer = useCallback((preset?: Partial<TextPresetItem>) => {
    const canvasWidth = project.preset.width || 1080;
    const scaleFactor = Math.max(0.8, canvasWidth / 1080);

    // Calcular tamaño de fuente legible para el tamaño real del lienzo
    const calculateFontSize = () => {
      if (preset?.fontSize) {
        // Escalar armónicamente para lienzos de alta resolución (1080px)
        if (preset.fontSize < 30) {
          if (preset?.tag === 'p') return Math.round(24 * scaleFactor);
          if (preset?.tag === 'badge') return Math.round(18 * scaleFactor);
          return Math.round(preset.fontSize * 1.5 * scaleFactor);
        }
        return Math.round(preset.fontSize * scaleFactor);
      }
      switch (preset?.tag) {
        case 'h1': return Math.round(56 * scaleFactor);
        case 'h2': return Math.round(42 * scaleFactor);
        case 'h3': return Math.round(32 * scaleFactor);
        case 'badge': return Math.round(18 * scaleFactor);
        case 'p':
        default:
          return Math.round(24 * scaleFactor);
      }
    };

    // Calcular ancho óptimo de la caja de texto (65% a 80% del lienzo)
    const calculateWidth = () => {
      if (preset?.tag === 'badge') return Math.round(400 * scaleFactor);
      if (preset?.tag === 'h1') return Math.round(860 * scaleFactor);
      if (preset?.tag === 'h2') return Math.round(780 * scaleFactor);
      if (preset?.tag === 'h3') return Math.round(680 * scaleFactor);
      return Math.round(720 * scaleFactor);
    };

    const newLayer: ImageLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      blockType: 'CustomText',
      title: preset?.title ?? preset?.defaultText ?? 'Capa de Texto',
      props: {
        text: preset?.defaultText ?? 'Escribe tu texto aquí',
        tag: preset?.tag ?? 'h2',
        ...preset?.customProps,
      },
      position: { x: 50, y: 50 },
      zIndex: 999,
      scale: 1,
      fontSize: calculateFontSize(),
      fontWeight: preset?.fontWeight ?? '700',
      fontFamily: preset?.fontFamily ?? 'Poppins, sans-serif',
      fill: preset?.fill ?? '#FFFFFF',
      align: preset?.align ?? 'center',
      letterSpacing: preset?.letterSpacing ?? 0,
      lineHeight: preset?.lineHeight ?? 1.2,
      textEffect: preset?.textEffect,
      boxColor: preset?.boxColor,
      shadowPreset: preset?.textEffect === 'glow' ? 'glow_teal' : undefined,
      width: calculateWidth(),
    };

    setProject((prev) => {
      const maxZ = prev.layers.reduce((max, l) => Math.max(max, l.zIndex ?? 0), 0);
      const layerWithTopZ = { ...newLayer, zIndex: maxZ + 1 };
      const next = { ...prev, layers: [...prev.layers, layerWithTopZ], updatedAt: new Date().toISOString() };
      setSelectedLayerId(layerWithTopZ.id);
      setSelectedLayerIds([layerWithTopZ.id]);
      pushHistory(next);
      return next;
    });
  }, [project.preset.width, pushHistory]);

  const addImageLayer = useCallback((imageUrl: string, options?: { title?: string; width?: number; height?: number; clipShape?: 'none' | 'circle' | 'squircle' | 'rounded-2xl' | 'hexagon' }) => {
    const canvasWidth = project.preset.width || 1080;
    const defaultW = options?.width ?? Math.round(canvasWidth * 0.45);
    const defaultH = options?.height ?? Math.round(defaultW * 0.75);

    const newLayer: ImageLayer = {
      id: `image-${Date.now()}`,
      type: 'image',
      title: options?.title ?? 'Imagen de Stock',
      props: {
        imageUrl,
        alt: options?.title ?? 'Stock Photo',
        objectFit: 'cover',
      },
      position: { x: 50, y: 50 },
      zIndex: 999,
      scale: 1,
      width: defaultW,
      height: defaultH,
      clipShape: options?.clipShape ?? 'rounded-2xl',
      opacity: 1,
    };

    setProject((prev) => {
      const maxZ = prev.layers.reduce((max, l) => Math.max(max, l.zIndex ?? 0), 0);
      const layerWithTopZ = { ...newLayer, zIndex: maxZ + 1 };
      const next = { ...prev, layers: [...prev.layers, layerWithTopZ], updatedAt: new Date().toISOString() };
      setSelectedLayerId(layerWithTopZ.id);
      setSelectedLayerIds([layerWithTopZ.id]);
      pushHistory(next);
      return next;
    });
  }, [project.preset.width, pushHistory]);

  const saveLayerToMyDesigns = useCallback((layerId: string, customTitle?: string) => {
    const target = project.layers.find((l) => l.id === layerId);
    if (!target) return;
    saveCustomElement(target, customTitle);
  }, [project.layers]);

  const insertSavedLayer = useCallback((savedLayer: ImageLayer) => {
    const newLayer: ImageLayer = {
      ...JSON.parse(JSON.stringify(savedLayer)),
      id: `layer-${Date.now()}`,
      position: { x: 50, y: 50 },
      zIndex: 999,
    };

    setProject((prev) => {
      const maxZ = prev.layers.reduce((max, l) => Math.max(max, l.zIndex ?? 0), 0);
      const layerWithTopZ = { ...newLayer, zIndex: maxZ + 1 };
      const next = { ...prev, layers: [...prev.layers, layerWithTopZ], updatedAt: new Date().toISOString() };
      setSelectedLayerId(layerWithTopZ.id);
      setSelectedLayerIds([layerWithTopZ.id]);
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const clearCanvas = useCallback(() => {
    setProject((prev) => {
      const nextLayers = prev.layers.filter((layer) => layer.locked);
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      setSelectedLayerId(null);
      setSelectedLayerIds([]);
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const updateBackground = useCallback((patch: Partial<CanvasBackground>) => {
    setProject((prev) => {
      const next = {
        ...prev,
        background: { ...prev.background, ...patch },
        updatedAt: new Date().toISOString(),
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const exportImage = useCallback(async (
    node: HTMLElement | null,
    format: 'png' | 'jpeg' | 'svg' = 'png'
  ): Promise<void> => {
    if (!node) return;
    setIsExporting(true);
    try {
      let dataUrl: string;
      const pixelRatio = 2; // High-res 2x export
      const exportOptions = {
        pixelRatio,
        width: project.preset.width,
        height: project.preset.height,
        style: {
          overflow: 'hidden',
        },
        filter: (target: HTMLElement) => target.dataset?.editorOverlay !== 'true',
      };

      if (format === 'jpeg') {
        dataUrl = await toJpeg(node, { ...exportOptions, quality: 0.95 });
      } else if (format === 'svg') {
        dataUrl = await toSvg(node, exportOptions);
      } else {
        dataUrl = await toPng(node, exportOptions);
      }

      const link = document.createElement('a');
      link.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}-${project.preset.aspectRatio.replace(':', 'x')}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al exportar imagen:', err);
    } finally {
      setIsExporting(false);
    }
  }, [project.title, project.preset.aspectRatio]);

  const exportCanvasStage = useCallback(async (
    stage: unknown,
    format: 'png' | 'jpeg' | 'webp' = 'png',
    pixelRatio: number = 2
  ): Promise<void> => {
    if (!stage || typeof (stage as { toDataURL?: (options: Record<string, unknown>) => string }).toDataURL !== 'function') return;
    setIsExporting(true);
    try {
      const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const dataUrl = (stage as { toDataURL: (options: Record<string, unknown>) => string }).toDataURL({
        pixelRatio,
        mimeType,
        quality: 0.95,
      });

      const link = document.createElement('a');
      link.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}-${project.preset.aspectRatio.replace(':', 'x')}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al exportar stage de Konva:', err);
    } finally {
      setIsExporting(false);
    }
  }, [project.title, project.preset.aspectRatio]);

  const fitLayerToCanvas = useCallback((layerId: string) => {
    setProject((prev) => {
      const layer = prev.layers.find((l) => l.id === layerId);
      if (!layer || layer.locked) return prev;

      const canvasWidth = prev.preset.width || 1080;
      const canvasHeight = prev.preset.height || 1080;

      let updatedWidth = layer.width;
      let updatedHeight = layer.height;
      let updatedScale = 1;
      const updatedPosition = { x: 50, y: 50 };
      const updatedRotation = 0;

      // 1. Capas de imagen (Fotos de stock / subidas locales) -> Cubrir o encajar el lienzo completo
      if (layer.type === 'image' || layer.props?.imageUrl) {
        updatedWidth = canvasWidth;
        updatedHeight = canvasHeight;
        updatedScale = 1;
      }
      // 2. Superficies Glass -> Expandir al 90% del ancho y 70% de altura
      else if (layer.blockType === 'GlassCardSurface') {
        updatedWidth = Math.round(canvasWidth * 0.90);
        updatedHeight = Math.round(canvasHeight * 0.70);
        updatedScale = 1;
      }
      // 3. Formas Geométricas -> Expandir al 85% de la dimensión mínima
      else if (layer.blockType === 'GeometricShape') {
        const minDim = Math.min(canvasWidth, canvasHeight);
        updatedWidth = Math.round(minDim * 0.85);
        updatedHeight = Math.round(minDim * 0.85);
        updatedScale = 1;
      }
      // 4. Ilustraciones Web Vectoriales -> Ocupar el 65% del ancho de forma armónica
      else if (layer.blockType === 'WebIllustration') {
        const targetW = Math.round(canvasWidth * 0.65);
        const targetH = Math.round(targetW * 0.75);
        updatedWidth = targetW;
        updatedHeight = targetH;
        updatedScale = 1;
      }
      // 5. Bloques Compuestos (AdvisorCard, TrustBadge, ComparisonCard, ProviderGrid)
      else if (
        ['MotionAdvisorCard', 'MotionTrustBadge', 'MotionComparisonCard', 'MotionProviderGrid'].includes(
          layer.blockType ?? ''
        )
      ) {
        const isPortrait = canvasHeight > canvasWidth;
        updatedWidth = Math.round(canvasWidth * 0.88);
        updatedScale = isPortrait ? 1.1 : 0.95;
      }
      // 6. Capas de Texto -> Ajustar caja de texto al 85% del ancho del lienzo
      else if (layer.type === 'text' || layer.blockType === 'CustomText') {
        updatedWidth = Math.round(canvasWidth * 0.85);
        updatedScale = 1;
      }
      // 7. Botones CTA y Sellos
      else if (['WhatsAppCtaButton', 'TrustVerifiedPill', 'HookAlertBadge'].includes(layer.blockType ?? '')) {
        updatedWidth = Math.min(Math.round(canvasWidth * 0.85), 520);
        updatedScale = 1;
      }
      // 8. Cualquier otra capa con dimensiones definidas
      else if (layer.width && layer.height) {
        const scaleW = (canvasWidth * 0.9) / layer.width;
        const scaleH = (canvasHeight * 0.9) / layer.height;
        const fitScale = Math.min(scaleW, scaleH);
        updatedWidth = Math.round(layer.width * fitScale);
        updatedHeight = Math.round(layer.height * fitScale);
        updatedScale = 1;
      } else {
        updatedScale = 1;
      }

      const nextLayers = prev.layers.map((l) =>
        l.id === layerId
          ? {
              ...l,
              position: updatedPosition,
              rotation: updatedRotation,
              scale: updatedScale,
              width: updatedWidth,
              height: updatedHeight,
            }
          : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const ungroupLayer = useCallback((layerId: string) => {
    setProject((prev) => {
      const layer = prev.layers.find((l) => l.id === layerId);
      if (!layer || layer.locked) return prev;

      let subLayers: ImageLayer[] = [];
      const props = layer.props as Record<string, unknown>;
      const canvasHeight = prev.preset.height || 1080;
      const groupScale = layer.scale ?? 1;
      const groupRotation = layer.rotation ?? 0;

      // 1. DESAGRUPADO DE SELLO DE GARANTÍA (MOTIONTRUSTBADGE)
      if (layer.blockType === 'MotionTrustBadge') {
        const cardHeight = 260;
        subLayers = [
          {
            id: `layer-trust-frame-${Date.now()}`,
            type: 'block',
            blockType: 'GlassCardSurface',
            title: 'Fondo de Sello de Garantía',
            width: 420,
            height: cardHeight,
            props: { variant: 'amber', ...props },
            position: { x: layer.position.x, y: layer.position.y },
            zIndex: layer.zIndex,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-trust-icon-${Date.now() + 1}`,
            type: 'block',
            blockType: 'TrustShieldIcon',
            title: 'Escudo de Garantía',
            width: 56,
            height: 56,
            props: {},
            position: { x: layer.position.x, y: Math.round((layer.position.y + (-78 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 1,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-trust-highlight-${Date.now() + 2}`,
            type: 'block',
            blockType: 'TrustHighlightPill',
            title: 'Etiqueta Garantía',
            props: { highlight: props.highlight ?? 'GARANTÍA CONSULAR' },
            position: { x: layer.position.x, y: Math.round((layer.position.y + (-24 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 2,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-trust-title-${Date.now() + 3}`,
            type: 'block',
            blockType: 'TrustBadgeTitle',
            title: 'Título de Garantía',
            width: 370,
            props: { title: props.title ?? 'PÓLIZA 100% VÁLIDA PARA VISADO' },
            position: { x: layer.position.x, y: Math.round((layer.position.y + (12 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 3,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-trust-sub-${Date.now() + 4}`,
            type: 'block',
            blockType: 'TrustBadgeSubtitle',
            title: 'Subtítulo de Garantía',
            width: 370,
            props: { subtitle: props.subtitle ?? 'Sin Copagos · Cobertura Completa · Repatriación Incluida' },
            position: { x: layer.position.x, y: Math.round((layer.position.y + (43 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 4,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-trust-verified-${Date.now() + 5}`,
            type: 'block',
            blockType: 'TrustVerifiedPill',
            title: 'Badge Verificado',
            props: { verifiedLabel: props.verifiedLabel ?? 'VERIFICADO PARA EXTRANJERÍA' },
            position: { x: layer.position.x, y: Math.round((layer.position.y + (93 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 5,
            scale: groupScale,
            rotation: groupRotation,
          },
        ];
      } else if (layer.blockType === 'MotionAdvisorCard') {
        // 2. DESAGRUPADO DE TARJETA DE ASESORA (MOTIONADVISORCARD)
        const cardHeight = 390;
        subLayers = [
          {
            id: `layer-card-frame-${Date.now()}`,
            type: 'block',
            blockType: 'GlassCardSurface',
            title: 'Fondo de Tarjeta Asesora',
            width: 380,
            height: cardHeight,
            props: { variant: 'teal', ...props },
            position: { x: layer.position.x, y: layer.position.y },
            zIndex: layer.zIndex,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-badge-${Date.now() + 1}`,
            type: 'badge',
            blockType: 'HookAlertBadge',
            title: 'Badge de Estado',
            props: { badge: props.badge ?? 'ASESORA ASIGNADA · EN DIRECTO' },
            position: { x: layer.position.x, y: Math.round((layer.position.y + (-159 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 1,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-avatar-${Date.now() + 2}`,
            type: 'block',
            blockType: 'AdvisorAvatarBadge',
            title: 'Avatar con Verificación',
            width: 340,
            props: {
              avatarUrl: props.avatarUrl ?? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
              name: props.name ?? 'Sofía',
              role: props.role ?? 'Asesora Especialista en Visados',
            },
            position: { x: layer.position.x, y: Math.round((layer.position.y + (-55 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 2,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-quote-${Date.now() + 3}`,
            type: 'block',
            blockType: 'AdvisorQuoteBox',
            title: 'Caja de Mensaje',
            width: 340,
            props: { message: props.message ?? 'Te ayudo a verificar que tu póliza cumple el 100% de los requisitos del consulado sin copagos.' },
            position: { x: layer.position.x, y: Math.round((layer.position.y + (35 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 3,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-cta-${Date.now() + 4}`,
            type: 'block',
            blockType: 'WhatsAppCtaButton',
            title: 'Botón WhatsApp',
            width: 340,
            height: 48,
            props: { whatsAppText: props.whatsAppText ?? 'Pregúntanos por WhatsApp' },
            position: { x: layer.position.x, y: Math.round((layer.position.y + (135 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 4,
            scale: groupScale,
            rotation: groupRotation,
          },
        ];
      } else if (layer.blockType === 'MotionComparisonCard') {
        // 3. DESAGRUPADO DE COMPARATIVA (MOTIONCOMPARISONCARD)
        const cardHeight = 280;
        subLayers = [
          {
            id: `layer-comp-frame-${Date.now()}`,
            type: 'block',
            blockType: 'GlassCardSurface',
            title: 'Fondo de Comparativa',
            width: 420,
            height: cardHeight,
            props: { variant: 'teal', ...props },
            position: { x: layer.position.x, y: layer.position.y },
            zIndex: layer.zIndex,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-comp-header-${Date.now() + 1}`,
            type: 'block',
            blockType: 'ComparisonHeader',
            title: 'Título Comparativo',
            width: 380,
            props: { title: props.title ?? '¿SEGURO DE VIAJE O SEGURO DE VISADO?' },
            position: { x: layer.position.x, y: Math.round((layer.position.y + (-100 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 1,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-comp-wrong-${Date.now() + 2}`,
            type: 'block',
            blockType: 'ComparisonWrongBox',
            title: 'Opción Rechazada',
            width: 380,
            height: 80,
            props: {
              wrongOptionTitle: props.wrongOptionTitle ?? 'Seguro de Viaje Común',
              wrongOptionDesc: props.wrongOptionDesc ?? 'Denegación de visado: no cumple requisitos consulares ni incluye red médica completa.',
            },
            position: { x: layer.position.x, y: Math.round((layer.position.y + (-25 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 2,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-comp-correct-${Date.now() + 3}`,
            type: 'block',
            blockType: 'ComparisonCorrectBox',
            title: 'Opción Aprobada',
            width: 380,
            height: 80,
            props: {
              correctOptionTitle: props.correctOptionTitle ?? 'Seguro VitaBlue Extranjería',
              correctOptionDesc: props.correctOptionDesc ?? 'Aprobación garantizada: sin copagos, cobertura total y repatriación incluida.',
            },
            position: { x: layer.position.x, y: Math.round((layer.position.y + (65 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 3,
            scale: groupScale,
            rotation: groupRotation,
          },
        ];
      } else if (layer.blockType === 'MotionProviderGrid') {
        // 4. DESAGRUPADO DE PARRILLA DE ASEGURADORAS (MOTIONPROVIDERGRID)
        const cardHeight = 310;
        subLayers = [
          {
            id: `layer-grid-frame-${Date.now()}`,
            type: 'block',
            blockType: 'GlassCardSurface',
            title: 'Fondo de Parrilla',
            width: 420,
            height: cardHeight,
            props: { variant: 'teal', ...props },
            position: { x: layer.position.x, y: layer.position.y },
            zIndex: layer.zIndex,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-grid-header-${Date.now() + 1}`,
            type: 'block',
            blockType: 'ProviderGridHeader',
            title: 'Título de Aseguradoras',
            width: 380,
            props: {
              title: props.title ?? 'COMPAÑÍAS LÍDERES AUTORIZADAS',
              subtitle: props.subtitle ?? 'Aceptadas oficialmente por Extranjería y Consulados',
            },
            position: { x: layer.position.x, y: Math.round((layer.position.y + (-85 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 1,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-grid-sanitas-${Date.now() + 2}`,
            type: 'block',
            blockType: 'ProviderBadge',
            title: 'Tarjeta Sanitas',
            width: 180,
            height: 64,
            props: { name: 'SANITAS', badge: 'Sin Copagos', color: '#EE9B00', highlight: true },
            position: { x: layer.position.x - 9.5, y: Math.round((layer.position.y + (5 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 2,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-grid-adeslas-${Date.now() + 3}`,
            type: 'block',
            blockType: 'ProviderBadge',
            title: 'Tarjeta Adeslas',
            width: 180,
            height: 64,
            props: { name: 'ADESLAS', badge: 'Visa Ready', color: '#94D2BD' },
            position: { x: layer.position.x + 9.5, y: Math.round((layer.position.y + (5 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 3,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-grid-asisa-${Date.now() + 4}`,
            type: 'block',
            blockType: 'ProviderBadge',
            title: 'Tarjeta Asisa',
            width: 180,
            height: 64,
            props: { name: 'ASISA', badge: '100% Válido', color: '#94D2BD' },
            position: { x: layer.position.x - 9.5, y: Math.round((layer.position.y + (85 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 4,
            scale: groupScale,
            rotation: groupRotation,
          },
          {
            id: `layer-grid-dkv-${Date.now() + 5}`,
            type: 'block',
            blockType: 'ProviderBadge',
            title: 'Tarjeta DKV',
            width: 180,
            height: 64,
            props: { name: 'DKV', badge: 'Repatriación', color: '#94D2BD' },
            position: { x: layer.position.x + 9.5, y: Math.round((layer.position.y + (85 / canvasHeight) * 100) * 10) / 10 },
            zIndex: layer.zIndex + 5,
            scale: groupScale,
            rotation: groupRotation,
          },
        ];
      } else if (layer.blockType === 'CustomGroup' && Array.isArray(props.childrenLayers)) {
        subLayers = expandCustomGroup(layer);
      }

      if (subLayers.length > 0) {
        const otherLayers = prev.layers.filter((l) => l.id !== layerId);
        const next = { ...prev, layers: [...otherLayers, ...subLayers], updatedAt: new Date().toISOString() };
        setSelectedLayerIds(subLayers.map((l) => l.id));
        pushHistory(next);
        return next;
      }

      return prev;
    });
  }, [pushHistory]);

  const commitPositionChange = useCallback(() => {
    if (transientCommitTimerRef.current !== null) {
      window.clearTimeout(transientCommitTimerRef.current);
      transientCommitTimerRef.current = null;
    }
    setProject((prev) => {
      pushHistory(transientProjectRef.current ?? prev);
      transientProjectRef.current = null;
      return prev;
    });
  }, [pushHistory]);

  const selectedLayer = project.layers.find((l) => l.id === selectedLayerId) ?? null;

  return {
    project,
    selectedLayer,
    selectedLayerId,
    selectedLayerIds,
    zoom,
    setZoom,
    showSafeZones,
    setShowSafeZones,
    isExporting,
    lastSavedAt,
    saveState,
    validationIssues,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < historyLength - 1,
    undo,
    redo,
    updateTitle,
    setPreset,
    loadTemplate,
    selectLayer,
    selectMultipleLayers,
    toggleLayerSelection,
    deleteSelectedLayers,
    groupSelectedLayers,
    updateMultipleLayersPosition,
    updateLayerProps,
    updateGuideSettings,
    applyAutoLayout,
    fitSelectedText,
    replaceLayerContent,
    applyStyleVariant,
    updateLayerPosition,
    updateLayerScale,
    updateLayerWidth,
    updateLayerHeight,
    updateLayerRotation,
    commitPositionChange,
    fitLayerToCanvas,
    ungroupLayer,
    duplicateLayer,
    duplicateSelectedLayers,
    copySelectedLayers,
    pasteLayers,
    copyLayerStyle,
    pasteLayerStyle,
    toggleFlipHorizontal,
    toggleFlipVertical,
    nudgeSelectedLayers,
    updateLayerOpacity,
    updateLayerShadowPreset,
    updateLayerBorder,
    removeLayer,
    toggleLayerLock,
    toggleLayerVisibility,
    toggleAllLayersLock,
    toggleAllLayersVisibility,
    renameLayer,
    moveLayerZIndex,
    reorderLayers,
    addBlockLayer,
    addTextLayer,
    addImageLayer,
    saveLayerToMyDesigns,
    insertSavedLayer,
    clearCanvas,
    composeSmartCanvas,
    updateBackground,
    alignSelectedLayers,
    distributeSelectedLayers,
    updateLayerFilter,
    updateLayerAdjustments,
    updateLayerClipShape,
    setCarouselPages,
    setCurrentSlide,
    copyToClipboard,
    exportImage,
    exportCanvasStage,
  };
}
