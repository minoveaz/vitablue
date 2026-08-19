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

    const groupLayerId = `layer-group-${Date.now()}`;
    const newGroupLayer: ImageLayer = {
      id: groupLayerId,
      type: 'block',
      blockType: 'CustomGroup',
      title: `Grupo (${layersToGroup.length} elementos)`,
      props: {
        childrenLayers: layersToGroup,
      },
      position: { x: Math.round(avgX * 10) / 10, y: Math.round(avgY * 10) / 10 },
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
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, props: { ...l.props, ...patch } } : l
      );
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

  const moveLayerZIndex = useCallback((layerId: string, direction: 'up' | 'down') => {
    setProject((prev) => {
      const sortedLayers = [...prev.layers].sort((a, b) => a.zIndex - b.zIndex);
      const currentIndex = sortedLayers.findIndex((l) => l.id === layerId);
      if (currentIndex === -1) return prev;

      const targetIndex = direction === 'up' ? currentIndex + 1 : currentIndex - 1;
      if (targetIndex < 0 || targetIndex >= sortedLayers.length) return prev;

      const temp = sortedLayers[currentIndex];
      sortedLayers[currentIndex] = sortedLayers[targetIndex];
      sortedLayers[targetIndex] = temp;

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

      if (layer.blockType === 'MotionAdvisorCard') {
        subLayers = [
          {
            id: `layer-card-frame-${Date.now()}`,
            type: 'block',
            blockType: 'GlassCardSurface',
            title: 'Fondo de Tarjeta Asesora',
            props: { width: 380, height: 490 },
            position: { x: layer.position.x, y: layer.position.y },
            zIndex: 1,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-badge-${Date.now() + 1}`,
            type: 'badge',
            blockType: 'HookAlertBadge',
            title: 'Badge de Estado',
            props: { badge: props.badge ?? 'ASESORA ASIGNADA · EN DIRECTO' },
            position: { x: layer.position.x, y: layer.position.y - 18 },
            zIndex: 2,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-avatar-${Date.now() + 2}`,
            type: 'block',
            blockType: 'AdvisorAvatarBadge',
            title: 'Avatar con Verificación',
            props: {
              avatarUrl: props.avatarUrl ?? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
              name: props.name ?? 'Sofía',
              role: props.role ?? 'Asesora Especialista en Visados',
            },
            position: { x: layer.position.x, y: layer.position.y - 6 },
            zIndex: 3,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-quote-${Date.now() + 3}`,
            type: 'block',
            blockType: 'AdvisorQuoteBox',
            title: 'Caja de Mensaje',
            props: { message: props.message ?? 'Te ayudo a verificar que tu póliza cumple el 100% de los requisitos del consulado sin copagos.' },
            position: { x: layer.position.x, y: layer.position.y + 7.5 },
            zIndex: 4,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-cta-${Date.now() + 4}`,
            type: 'block',
            blockType: 'WhatsAppCtaButton',
            title: 'Botón WhatsApp',
            props: { whatsAppText: props.whatsAppText ?? 'Pregúntanos por WhatsApp' },
            position: { x: layer.position.x, y: layer.position.y + 17.5 },
            zIndex: 5,
            scale: layer.scale ?? 1,
          },
        ];
      } else if (layer.blockType === 'MotionProviderGrid') {
        subLayers = [
          {
            id: `layer-grid-frame-${Date.now()}`,
            type: 'block',
            blockType: 'GlassCardSurface',
            title: 'Fondo de Parrilla',
            props: { width: 440, height: 380 },
            position: { x: layer.position.x, y: layer.position.y },
            zIndex: 1,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-grid-header-${Date.now() + 1}`,
            type: 'block',
            blockType: 'ProviderGridHeader',
            title: 'Título de Aseguradoras',
            props: {
              title: props.title ?? 'COMPAÑÍAS LÍDERES AUTORIZADAS',
              subtitle: props.subtitle ?? 'Aceptadas oficialmente por Extranjería y Consulados',
            },
            position: { x: layer.position.x, y: layer.position.y - 10.5 },
            zIndex: 2,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-grid-sanitas-${Date.now() + 2}`,
            type: 'block',
            blockType: 'ProviderBadge',
            title: 'Tarjeta Sanitas',
            props: { name: 'SANITAS', badge: 'Sin Copagos', color: '#EE9B00', highlight: true },
            position: { x: layer.position.x - 9.5, y: layer.position.y + 2 },
            zIndex: 3,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-grid-adeslas-${Date.now() + 3}`,
            type: 'block',
            blockType: 'ProviderBadge',
            title: 'Tarjeta Adeslas',
            props: { name: 'ADESLAS', badge: 'Visa Ready', color: '#94D2BD' },
            position: { x: layer.position.x + 9.5, y: layer.position.y + 2 },
            zIndex: 4,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-grid-asisa-${Date.now() + 4}`,
            type: 'block',
            blockType: 'ProviderBadge',
            title: 'Tarjeta Asisa',
            props: { name: 'ASISA', badge: '100% Válido', color: '#94D2BD' },
            position: { x: layer.position.x - 9.5, y: layer.position.y + 11 },
            zIndex: 5,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-grid-dkv-${Date.now() + 5}`,
            type: 'block',
            blockType: 'ProviderBadge',
            title: 'Tarjeta DKV',
            props: { name: 'DKV', badge: 'Repatriación', color: '#94D2BD' },
            position: { x: layer.position.x + 9.5, y: layer.position.y + 11 },
            zIndex: 6,
            scale: layer.scale ?? 1,
          },
        ];
      } else if (layer.blockType === 'MotionTrustBadge') {
        subLayers = [
          {
            id: `layer-trust-frame-${Date.now()}`,
            type: 'block',
            blockType: 'GlassCardSurface',
            title: 'Fondo de Sello',
            props: { width: 420, height: 320 },
            position: { x: layer.position.x, y: layer.position.y },
            zIndex: 1,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-trust-icon-${Date.now() + 1}`,
            type: 'block',
            blockType: 'TrustShieldIcon',
            title: 'Escudo de Garantía',
            props: {},
            position: { x: layer.position.x, y: layer.position.y - 8 },
            zIndex: 2,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-trust-title-${Date.now() + 2}`,
            type: 'block',
            blockType: 'TrustBadgeTitle',
            title: 'Título de Garantía',
            props: { title: props.title ?? 'PÓLIZA 100% VÁLIDA PARA VISADO' },
            position: { x: layer.position.x, y: layer.position.y + 0.5 },
            zIndex: 3,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-trust-sub-${Date.now() + 3}`,
            type: 'block',
            blockType: 'TrustBadgeSubtitle',
            title: 'Subtítulo de Garantía',
            props: { subtitle: props.subtitle ?? 'Sin Copagos · Cobertura Completa · Repatriación Incluida' },
            position: { x: layer.position.x, y: layer.position.y + 6.5 },
            zIndex: 4,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-trust-badge-${Date.now() + 4}`,
            type: 'badge',
            blockType: 'HookAlertBadge',
            title: 'Badge Garantía',
            props: { badge: props.verifiedLabel ?? 'VERIFICADO PARA EXTRANJERÍA' },
            position: { x: layer.position.x, y: layer.position.y + 11.5 },
            zIndex: 5,
            scale: layer.scale ?? 1,
          },
        ];
      } else if (layer.blockType === 'MotionComparisonCard') {
        subLayers = [
          {
            id: `layer-comp-frame-${Date.now()}`,
            type: 'block',
            blockType: 'GlassCardSurface',
            title: 'Fondo de Comparativa',
            props: { width: 440, height: 360 },
            position: { x: layer.position.x, y: layer.position.y },
            zIndex: 1,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-comp-header-${Date.now() + 1}`,
            type: 'block',
            blockType: 'ComparisonHeader',
            title: 'Título Comparativo',
            props: { title: props.title ?? '¿SEGURO DE VIAJE O SEGURO DE VISADO?' },
            position: { x: layer.position.x, y: layer.position.y - 11 },
            zIndex: 2,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-comp-wrong-${Date.now() + 2}`,
            type: 'block',
            blockType: 'ComparisonWrongBox',
            title: 'Opción Rechazada',
            props: {
              wrongOptionTitle: props.wrongOptionTitle ?? 'Seguro de Viaje Común',
              wrongOptionDesc: props.wrongOptionDesc ?? 'Denegación de visado: no cumple requisitos consulares ni incluye red médica completa.',
            },
            position: { x: layer.position.x, y: layer.position.y - 2.5 },
            zIndex: 3,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-comp-correct-${Date.now() + 3}`,
            type: 'block',
            blockType: 'ComparisonCorrectBox',
            title: 'Opción Aprobada',
            props: {
              correctOptionTitle: props.correctOptionTitle ?? 'Seguro VitaBlue Extranjería',
              correctOptionDesc: props.correctOptionDesc ?? 'Aprobación garantizada: sin copagos, cobertura total y repatriación incluida.',
            },
            position: { x: layer.position.x, y: layer.position.y + 8 },
            zIndex: 4,
            scale: layer.scale ?? 1,
          },
        ];
      }

      if (subLayers.length > 0) {
        const otherLayers = prev.layers.filter((l) => l.id !== layerId);
        const next = { ...prev, layers: [...otherLayers, ...subLayers], updatedAt: new Date().toISOString() };
        setSelectedLayerId(subLayers[1].id);
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
    removeLayer,
    toggleLayerLock,
    toggleLayerVisibility,
    toggleAllLayersLock,
    toggleAllLayersVisibility,
    renameLayer,
    moveLayerZIndex,
    reorderLayers,
    addBlockLayer,
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
