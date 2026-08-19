import { useState, useCallback } from 'react';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import {
  ImageProject,
  ImageLayer,
  ImageFormatPreset,
  ImageBlockType,
  CanvasBackground,
} from '../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from '../utils/imageTemplates';

export function useImageProjectEditor(initialProject?: ImageProject) {
  const [project, setProject] = useState<ImageProject>(
    initialProject ?? INITIAL_IMAGE_TEMPLATES[0]
  );
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    project.layers[0]?.id ?? null
  );
  const [zoom, setZoom] = useState<number>(0.55);
  const [showSafeZones, setShowSafeZones] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<ImageProject[]>([project]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const pushHistory = useCallback((nextProject: ImageProject) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, nextProject];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevProject = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setProject(prevProject);
      if (prevProject.layers.length > 0 && !prevProject.layers.some((l) => l.id === selectedLayerId)) {
        setSelectedLayerId(prevProject.layers[0].id);
      }
    }
  }, [history, historyIndex, selectedLayerId]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextProject = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setProject(nextProject);
    }
  }, [history, historyIndex]);

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
    setSelectedLayerId(template.layers[0]?.id ?? null);
    pushHistory(template);
  }, [pushHistory]);

  const selectLayer = useCallback((id: string | null) => {
    setSelectedLayerId(id);
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
      const next = { ...prev, layers: nextLayers, updatedAt: new Date().toISOString() };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

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

      if (layer.blockType === 'MotionAdvisorCard') {
        const props = layer.props as Record<string, unknown>;
        const subLayers: ImageLayer[] = [
          {
            id: `layer-frame-${Date.now()}`,
            type: 'block',
            blockType: 'GlassCardSurface',
            title: 'Fondo de Tarjeta',
            props: {
              width: 380,
              height: 520,
              bg: 'rgba(0, 18, 25, 0.95)',
              borderColor: 'rgba(20, 184, 166, 0.4)',
            },
            position: { x: 50, y: 50 },
            zIndex: 1,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-badge-${Date.now()}`,
            type: 'badge',
            blockType: 'HookAlertBadge',
            title: 'Badge de Estado',
            props: { badge: props.badge ?? 'ASESORA ASIGNADA · EN DIRECTO' },
            position: { x: 50, y: 22 },
            zIndex: 2,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-avatar-${Date.now()}`,
            type: 'block',
            blockType: 'AdvisorAvatarBadge',
            title: 'Avatar con Verificación',
            props: {
              avatarUrl: props.avatarUrl ?? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
              name: props.name ?? 'Sofía',
              role: props.role ?? 'Asesora Especialista en Visados',
            },
            position: { x: 50, y: 44 },
            zIndex: 3,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-quote-${Date.now()}`,
            type: 'block',
            blockType: 'AdvisorQuoteBox',
            title: 'Caja de Mensaje',
            props: { message: props.message ?? 'Te ayudo a verificar que tu póliza cumple el 100% de los requisitos del consulado sin copagos.' },
            position: { x: 50, y: 68 },
            zIndex: 4,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-cta-${Date.now()}`,
            type: 'block',
            blockType: 'WhatsAppCtaButton',
            title: 'Botón WhatsApp',
            props: { whatsAppText: props.whatsAppText ?? 'Pregúntanos por WhatsApp' },
            position: { x: 50, y: 84 },
            zIndex: 5,
            scale: layer.scale ?? 1,
          },
        ];

        const otherLayers = prev.layers.filter((l) => l.id !== layerId);
        const next = { ...prev, layers: [...otherLayers, ...subLayers], updatedAt: new Date().toISOString() };
        setSelectedLayerId(subLayers[4].id);
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
    zoom,
    setZoom,
    showSafeZones,
    setShowSafeZones,
    isExporting,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    undo,
    redo,
    updateTitle,
    setPreset,
    loadTemplate,
    selectLayer,
    updateLayerProps,
    updateLayerPosition,
    updateLayerScale,
    commitPositionChange,
    fitLayerToCanvas,
    ungroupLayer,
    duplicateLayer,
    removeLayer,
    addBlockLayer,
    updateBackground,
    exportImage,
  };
}
