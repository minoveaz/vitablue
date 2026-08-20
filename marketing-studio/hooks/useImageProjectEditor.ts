import { useState, useCallback, useEffect, useRef } from 'react';
import { toPng, toJpeg, toSvg, toBlob } from 'html-to-image';
import {
  ImageProject,
  ImageLayer,
  ImageFormatPreset,
  ImageBlockType,
  CanvasBackground,
} from '../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from '../utils/imageTemplates';
import { saveStoredImageProject } from '../utils/imageProjectStorage';
import { saveCustomElement } from '../utils/savedElementsStorage';
import { TextPresetItem } from '../data/textPresets';

export function useImageProjectEditor(initialProject?: ImageProject) {
  const [project, setProject] = useState<ImageProject>(
    initialProject ?? INITIAL_IMAGE_TEMPLATES[0]
  );
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>(
    project.layers[0]?.id ? [project.layers[0].id] : []
  );
  const selectedLayerId = selectedLayerIds[0] ?? null;
  const setSelectedLayerId = useCallback((id: string | null) => {
    setSelectedLayerIds(id ? [id] : []);
  }, []);

  const [zoom, setZoom] = useState<number>(0.55);
  const [showSafeZones, setShowSafeZones] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<string>(new Date().toISOString());

  // Re-sync if initialProject changes (e.g. routing between assets)
  useEffect(() => {
    if (initialProject && initialProject.id !== project.id) {
      setProject(initialProject);
      setSelectedLayerIds(initialProject.layers[0]?.id ? [initialProject.layers[0].id] : []);
      const cloned = JSON.parse(JSON.stringify(initialProject));
      historyRef.current = [cloned];
      historyIndexRef.current = 0;
      setHistoryLength(1);
      setHistoryIndex(0);
    }
  }, [initialProject?.id]);

  // History stack for Undo / Redo con deep-clone y ref síncrono
  const historyRef = useRef<ImageProject[]>([JSON.parse(JSON.stringify(project))]);
  const historyIndexRef = useRef<number>(0);
  const [historyLength, setHistoryLength] = useState<number>(1);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Clipboard refs para Copiar/Pegar capas y Copiar/Pegar estilos (Canva-style)
  const clipboardLayersRef = useRef<ImageLayer[]>([]);
  const clipboardStyleRef = useRef<Partial<ImageLayer>>({});

  const pushHistory = useCallback((nextProject: ImageProject) => {
    const clone: ImageProject = JSON.parse(JSON.stringify(nextProject));
    const currentIdx = historyIndexRef.current;
    const currentList = historyRef.current.slice(0, currentIdx + 1);

    // Evitar estados idénticos consecutivos en la pila
    const lastItem = currentList[currentList.length - 1];
    if (
      lastItem &&
      JSON.stringify(lastItem.layers) === JSON.stringify(clone.layers) &&
      lastItem.preset.id === clone.preset.id &&
      JSON.stringify(lastItem.background) === JSON.stringify(clone.background) &&
      lastItem.title === clone.title
    ) {
      return;
    }

    const updatedList = [...currentList, clone];
    const cappedList = updatedList.length > 50 ? updatedList.slice(updatedList.length - 50) : updatedList;
    const newIndex = cappedList.length - 1;

    historyRef.current = cappedList;
    historyIndexRef.current = newIndex;
    setHistoryLength(cappedList.length);
    setHistoryIndex(newIndex);

    saveStoredImageProject(clone);
    setLastSavedAt(new Date().toISOString());
  }, []);

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

  const setPreset = useCallback((preset: ImageFormatPreset) => {
    setProject((prev) => {
      const next = { ...prev, preset, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const loadTemplate = useCallback((template: ImageProject) => {
    setProject(template);
    setSelectedLayerIds(template.layers[0]?.id ? [template.layers[0].id] : []);
    pushHistory(template);
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
      const nextLayers = prev.layers.filter((l) => !selectedLayerIds.includes(l.id));
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
        if (!selectedLayerIds.includes(l.id)) return l;
        return {
          ...l,
          position: {
            x: Math.max(5, Math.min(95, Math.round((l.position.x + deltaPercent.x) * 10) / 10)),
            y: Math.max(5, Math.min(95, Math.round((l.position.y + deltaPercent.y) * 10) / 10)),
          },
        };
      });
      return { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
    });
  }, [selectedLayerIds]);

  const groupSelectedLayers = useCallback(() => {
    if (selectedLayerIds.length < 2) return;
    const layersToGroup = project.layers.filter((l) => selectedLayerIds.includes(l.id));
    if (layersToGroup.length < 2) return;

    // Calcular baricentro medio
    const avgX = layersToGroup.reduce((acc, l) => acc + l.position.x, 0) / layersToGroup.length;
    const avgY = layersToGroup.reduce((acc, l) => acc + l.position.y, 0) / layersToGroup.length;
    const groupCenter = { x: Math.round(avgX * 10) / 10, y: Math.round(avgY * 10) / 10 };

    // Guardar los hijos con sus posiciones relativas fijas respecto al centro inicial del grupo
    const storedChildren = layersToGroup.map((l) => ({
      ...l,
      relX: Math.round((l.position.x - groupCenter.x) * 100) / 100,
      relY: Math.round((l.position.y - groupCenter.y) * 100) / 100,
    }));

    const groupLayerId = `layer-group-${Date.now()}`;
    const newGroupLayer: ImageLayer = {
      id: groupLayerId,
      type: 'block',
      blockType: 'CustomGroup',
      title: `Grupo (${layersToGroup.length} elementos)`,
      props: {
        childrenLayers: storedChildren,
        initialCentroid: groupCenter,
      },
      position: groupCenter,
      zIndex: Math.max(...layersToGroup.map((l) => l.zIndex)),
      scale: 1,
    };

    setProject((prev) => {
      const remainingLayers = prev.layers.filter((l) => !selectedLayerIds.includes(l.id));
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
      const layersToAlign = prev.layers.filter((l) => selectedLayerIds.includes(l.id));
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
          nextLayers = prev.layers.map((l) => (selectedLayerIds.includes(l.id) ? { ...l, position: { ...l.position, x: minX } } : l));
        } else if (alignment === 'center') {
          const avgX = Math.round((layersToAlign.reduce((sum, l) => sum + l.position.x, 0) / layersToAlign.length) * 10) / 10;
          nextLayers = prev.layers.map((l) => (selectedLayerIds.includes(l.id) ? { ...l, position: { ...l.position, x: avgX } } : l));
        } else if (alignment === 'right') {
          const maxX = Math.max(...layersToAlign.map((l) => l.position.x));
          nextLayers = prev.layers.map((l) => (selectedLayerIds.includes(l.id) ? { ...l, position: { ...l.position, x: maxX } } : l));
        } else if (alignment === 'top') {
          const minY = Math.min(...layersToAlign.map((l) => l.position.y));
          nextLayers = prev.layers.map((l) => (selectedLayerIds.includes(l.id) ? { ...l, position: { ...l.position, y: minY } } : l));
        } else if (alignment === 'middle') {
          const avgY = Math.round((layersToAlign.reduce((sum, l) => sum + l.position.y, 0) / layersToAlign.length) * 10) / 10;
          nextLayers = prev.layers.map((l) => (selectedLayerIds.includes(l.id) ? { ...l, position: { ...l.position, y: avgY } } : l));
        } else {
          const maxY = Math.max(...layersToAlign.map((l) => l.position.y));
          nextLayers = prev.layers.map((l) => (selectedLayerIds.includes(l.id) ? { ...l, position: { ...l.position, y: maxY } } : l));
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
      const layersToDistribute = prev.layers.filter((l) => selectedLayerIds.includes(l.id));
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
      const blob = await toBlob(node, { pixelRatio: 2 });
      if (!blob) return false;
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      return true;
    } catch (err) {
      console.warn('Clipboard write failed, fallback to dataURL:', err);
      try {
        const dataUrl = await toPng(node, { pixelRatio: 2 });
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
  }, []);

  const updateLayerFilter = useCallback((layerId: string, filter: ImageLayer['filter']) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, filter } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const updateLayerAdjustments = useCallback((layerId: string, adjustments: { brightness?: number; contrast?: number; blur?: number }) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, ...adjustments } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const updateLayerClipShape = useCallback((layerId: string, clipShape: ImageLayer['clipShape']) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, clipShape } : l
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
        if (l.id !== layerId) return l;

        const updated: ImageLayer = {
          ...l,
          props: { ...l.props, ...patch },
        };

        // Sincronizar propiedades estándar de capa si vienen en el patch
        if ('fill' in patch) updated.fill = patch.fill as string;
        if ('color' in patch) updated.fill = patch.color as string;
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

  const updateLayerPosition = useCallback((layerId: string, position: { x: number; y: number }) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, position } : l
      );
      return { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
    });
  }, []);

  const updateLayerScale = useCallback((layerId: string, scale: number) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, scale: Math.max(0.3, Math.min(2.5, scale)) } : l
      );
      return { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
    });
  }, []);

  const updateLayerWidth = useCallback((layerId: string, width?: number) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, width: width ? Math.max(80, Math.min(1200, width)) : undefined } : l
      );
      return { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
    });
  }, []);

  const updateLayerHeight = useCallback((layerId: string, height?: number) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, height: height ? Math.max(40, Math.min(1400, height)) : undefined } : l
      );
      return { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
    });
  }, []);

  const updateLayerRotation = useCallback((layerId: string, rotation: number) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, rotation: Math.round(rotation) } : l
      );
      return { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
    });
  }, []);

  const duplicateLayer = useCallback((layerId: string) => {
    setProject((prev) => {
      const layer = prev.layers.find((l) => l.id === layerId);
      if (!layer) return prev;
      const newLayer: ImageLayer = {
        ...layer,
        id: `layer-${Date.now()}`,
        position: {
          x: Math.min(85, layer.position.x + 4),
          y: Math.min(85, layer.position.y + 4),
        },
        zIndex: prev.layers.length + 1,
      };
      const next = { ...prev, layers: [...prev.layers, newLayer], updatedAt: new Date().toISOString() };
      setSelectedLayerId(newLayer.id);
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const duplicateSelectedLayers = useCallback(() => {
    if (selectedLayerIds.length === 0) return;
    setProject((prev) => {
      const layersToDuplicate = prev.layers.filter((l) => selectedLayerIds.includes(l.id));
      if (layersToDuplicate.length === 0) return prev;

      const newLayers: ImageLayer[] = layersToDuplicate.map((layer, i) => ({
        ...layer,
        id: `layer-${Date.now()}-${i}`,
        position: {
          x: Math.min(92, layer.position.x + 3),
          y: Math.min(92, layer.position.y + 3),
        },
        zIndex: prev.layers.length + 1 + i,
      }));

      const next = {
        ...prev,
        layers: [...prev.layers, ...newLayers],
        updatedAt: new Date().toISOString(),
      };
      setSelectedLayerIds(newLayers.map((l) => l.id));
      pushHistory(next);
      return next;
    });
  }, [selectedLayerIds, pushHistory]);

  const removeLayer = useCallback((layerId: string) => {
    setProject((prev) => {
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
        l.id === layerId ? { ...l, title } : l
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
      const newLayers: ImageLayer[] = clipboardLayersRef.current.map((layer, i) => ({
        ...JSON.parse(JSON.stringify(layer)),
        id: `layer-${Date.now()}-${i}`,
        position: {
          x: Math.min(92, layer.position.x + 3),
          y: Math.min(92, layer.position.y + 3),
        },
        zIndex: prev.layers.length + 1 + i,
      }));

      const next = {
        ...prev,
        layers: [...prev.layers, ...newLayers],
        updatedAt: new Date().toISOString(),
      };
      setSelectedLayerIds(newLayers.map((l) => l.id));
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
      const nextLayers = prev.layers.map((l) => (idsToApply.includes(l.id) ? { ...l, ...styleToApply } : l));
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [selectedLayerIds, pushHistory]);

  const toggleFlipHorizontal = useCallback((layerId: string) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, flipHorizontal: !l.flipHorizontal } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const toggleFlipVertical = useCallback((layerId: string) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, flipVertical: !l.flipVertical } : l
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
        if (!selectedLayerIds.includes(l.id)) return l;
        return {
          ...l,
          position: {
            x: Math.round(Math.max(0, Math.min(100, l.position.x + dx)) * 10) / 10,
            y: Math.round(Math.max(0, Math.min(100, l.position.y + dy)) * 10) / 10,
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
        l.id === layerId ? { ...l, opacity: Math.max(0, Math.min(1, opacity)) } : l
      );
      return { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
    });
  }, []);

  const updateLayerShadowPreset = useCallback((layerId: string, shadowPreset: ImageLayer['shadowPreset']) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, shadowPreset } : l
      );
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const updateLayerBorder = useCallback((layerId: string, border: { borderWidth?: number; borderColor?: string; borderRadius?: number }) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, ...border } : l
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
    }

    const newLayer: ImageLayer = {
      id: `layer-${Date.now()}`,
      type: 'block',
      blockType,
      title: initialTitle,
      props: initialProps,
      position: { x: 50, y: 50 },
      zIndex: project.layers.length + 10,
      scale: 1,
    };

    setProject((prev) => {
      const next = { ...prev, layers: [...prev.layers, newLayer], updatedAt: new Date().toISOString() };
      setSelectedLayerId(newLayer.id);
      pushHistory(next);
      return next;
    });
  }, [project.layers.length, pushHistory]);

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
      zIndex: project.layers.length + 10,
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
      const next = { ...prev, layers: [...prev.layers, newLayer], updatedAt: new Date().toISOString() };
      setSelectedLayerId(newLayer.id);
      setSelectedLayerIds([newLayer.id]);
      pushHistory(next);
      return next;
    });
  }, [project.preset.width, project.layers.length, pushHistory]);

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
      zIndex: project.layers.length + 10,
    };

    setProject((prev) => {
      const next = { ...prev, layers: [...prev.layers, newLayer], updatedAt: new Date().toISOString() };
      setSelectedLayerId(newLayer.id);
      setSelectedLayerIds([newLayer.id]);
      pushHistory(next);
      return next;
    });
  }, [project.layers.length, pushHistory]);

  const clearCanvas = useCallback(() => {
    setProject((prev) => {
      const next = { ...prev, layers: [], updatedAt: new Date().toISOString() };
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
      if (format === 'jpeg') {
        dataUrl = await toJpeg(node, { quality: 0.95, pixelRatio });
      } else if (format === 'svg') {
        dataUrl = await toSvg(node);
      } else {
        dataUrl = await toPng(node, { pixelRatio });
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
    if (!stage || typeof (stage as { toDataURL?: Function }).toDataURL !== 'function') return;
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
      if (!layer) return prev;
      const isPortrait = prev.preset.height > prev.preset.width;
      const idealScale = isPortrait ? 1.15 : 0.95;

      const nextLayers = prev.layers.map((l) =>
        l.id === layerId
          ? {
              ...l,
              position: { x: 50, y: 50 },
              scale: idealScale,
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
      if (!layer) return prev;

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
        // 5. DESAGRUPADO DE GRUPOS PERSONALIZADOS (CUSTOMGROUP)
        const children = props.childrenLayers as (ImageLayer & { relX?: number; relY?: number })[];
        const initialCentroid = (props.initialCentroid as { x: number; y: number } | undefined) ?? { x: layer.position.x, y: layer.position.y };

        subLayers = children.map((child) => {
          const offsetX = child.relX !== undefined ? child.relX : (child.position.x - initialCentroid.x);
          const offsetY = child.relY !== undefined ? child.relY : (child.position.y - initialCentroid.y);

          // Si el grupo rotó, rotar el vector relativo
          let finalOffsetX = offsetX * groupScale;
          let finalOffsetY = offsetY * groupScale;
          if (groupRotation !== 0) {
            const rad = (groupRotation * Math.PI) / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            const rotX = offsetX * cos - offsetY * sin;
            const rotY = offsetX * sin + offsetY * cos;
            finalOffsetX = rotX * groupScale;
            finalOffsetY = rotY * groupScale;
          }

          return {
            ...child,
            position: {
              x: Math.round((layer.position.x + finalOffsetX) * 10) / 10,
              y: Math.round((layer.position.y + finalOffsetY) * 10) / 10,
            },
            scale: Math.round(((child.scale ?? 1) * groupScale) * 100) / 100,
            rotation: Math.round(((child.rotation ?? 0) + groupRotation) % 360),
            zIndex: layer.zIndex + (child.zIndex ? child.zIndex / 100 : 0),
          };
        });
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
    setProject((prev) => {
      pushHistory(prev);
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
    saveLayerToMyDesigns,
    insertSavedLayer,
    clearCanvas,
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
