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

  const updateLayerWidth = useCallback((layerId: string, width?: number) => {
    setProject((prev) => {
      const nextLayers = prev.layers.map((l) =>
        l.id === layerId ? { ...l, width: width ? Math.max(160, Math.min(520, width)) : undefined } : l
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

      let subLayers: ImageLayer[] = [];
      const props = layer.props as Record<string, unknown>;

      if (layer.blockType === 'MotionAdvisorCard') {
        subLayers = [
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
            position: { x: layer.position.x, y: Math.max(10, layer.position.y - 28) },
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
            position: { x: layer.position.x, y: Math.max(15, layer.position.y - 6) },
            zIndex: 3,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-quote-${Date.now() + 3}`,
            type: 'block',
            blockType: 'AdvisorQuoteBox',
            title: 'Caja de Mensaje',
            props: { message: props.message ?? 'Te ayudo a verificar que tu póliza cumple el 100% de los requisitos del consulado sin copagos.' },
            position: { x: layer.position.x, y: Math.min(90, layer.position.y + 18) },
            zIndex: 4,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-cta-${Date.now() + 4}`,
            type: 'block',
            blockType: 'WhatsAppCtaButton',
            title: 'Botón WhatsApp',
            props: { whatsAppText: props.whatsAppText ?? 'Pregúntanos por WhatsApp' },
            position: { x: layer.position.x, y: Math.min(95, layer.position.y + 34) },
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
            props: {
              width: 440,
              height: 380,
              bg: 'rgba(0, 18, 25, 0.95)',
              borderColor: 'rgba(20, 184, 166, 0.4)',
            },
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
            position: { x: layer.position.x, y: Math.max(10, layer.position.y - 24) },
            zIndex: 2,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-grid-sanitas-${Date.now() + 2}`,
            type: 'block',
            blockType: 'ProviderBadge',
            title: 'Tarjeta Sanitas',
            props: { name: 'SANITAS', badge: 'Sin Copagos', color: '#EE9B00' },
            position: { x: Math.max(15, layer.position.x - 18), y: Math.max(15, layer.position.y + 2) },
            zIndex: 3,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-grid-adeslas-${Date.now() + 3}`,
            type: 'block',
            blockType: 'ProviderBadge',
            title: 'Tarjeta Adeslas',
            props: { name: 'ADESLAS', badge: 'Visa Ready', color: '#94D2BD' },
            position: { x: Math.min(85, layer.position.x + 18), y: Math.max(15, layer.position.y + 2) },
            zIndex: 4,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-grid-asisa-${Date.now() + 4}`,
            type: 'block',
            blockType: 'ProviderBadge',
            title: 'Tarjeta Asisa',
            props: { name: 'ASISA', badge: '100% Válido', color: '#94D2BD' },
            position: { x: Math.max(15, layer.position.x - 18), y: Math.min(90, layer.position.y + 26) },
            zIndex: 5,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-grid-dkv-${Date.now() + 5}`,
            type: 'block',
            blockType: 'ProviderBadge',
            title: 'Tarjeta DKV',
            props: { name: 'DKV', badge: 'Repatriación', color: '#94D2BD' },
            position: { x: Math.min(85, layer.position.x + 18), y: Math.min(90, layer.position.y + 26) },
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
            props: {
              width: 420,
              height: 340,
              bg: 'rgba(0, 18, 25, 0.95)',
              borderColor: 'rgba(238, 155, 0, 0.4)',
            },
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
            position: { x: layer.position.x, y: Math.max(10, layer.position.y - 24) },
            zIndex: 2,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-trust-badge-${Date.now() + 2}`,
            type: 'badge',
            blockType: 'HookAlertBadge',
            title: 'Badge Garantía',
            props: { badge: props.highlight ?? 'GARANTÍA CONSULAR' },
            position: { x: layer.position.x, y: Math.max(15, layer.position.y - 2) },
            zIndex: 3,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-trust-title-${Date.now() + 3}`,
            type: 'block',
            blockType: 'TrustBadgeTitle',
            title: 'Título de Garantía',
            props: { title: props.title ?? 'PÓLIZA 100% VÁLIDA PARA VISADO' },
            position: { x: layer.position.x, y: Math.min(90, layer.position.y + 16) },
            zIndex: 4,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-trust-sub-${Date.now() + 4}`,
            type: 'block',
            blockType: 'TrustBadgeSubtitle',
            title: 'Subtítulo de Garantía',
            props: { subtitle: props.subtitle ?? 'Sin Copagos · Cobertura Completa · Repatriación Incluida' },
            position: { x: layer.position.x, y: Math.min(95, layer.position.y + 32) },
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
            props: {
              width: 460,
              height: 460,
              bg: 'rgba(0, 18, 25, 0.95)',
              borderColor: 'rgba(20, 184, 166, 0.4)',
            },
            position: { x: layer.position.x, y: layer.position.y },
            zIndex: 1,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-comp-header-${Date.now() + 1}`,
            type: 'block',
            blockType: 'ComparisonHeader',
            title: 'Título Comparativo',
            props: { title: props.title ?? 'Comparativa de Cobertura' },
            position: { x: layer.position.x, y: Math.max(10, layer.position.y - 30) },
            zIndex: 2,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-comp-wrong-${Date.now() + 2}`,
            type: 'block',
            blockType: 'ComparisonWrongBox',
            title: 'Opción Rechazada',
            props: {
              wrongOptionTitle: props.wrongOptionTitle ?? 'Seguro de Viaje Estándar',
              wrongOptionDesc: props.wrongOptionDesc ?? 'No válido para trámites de extranjería ni visados sin copagos.',
            },
            position: { x: layer.position.x, y: Math.max(15, layer.position.y - 4) },
            zIndex: 3,
            scale: layer.scale ?? 1,
          },
          {
            id: `layer-comp-correct-${Date.now() + 3}`,
            type: 'block',
            blockType: 'ComparisonCorrectBox',
            title: 'Opción Aprobada',
            props: {
              correctOptionTitle: props.correctOptionTitle ?? 'Seguro Sin Copagos VitaBlue',
              correctOptionDesc: props.correctOptionDesc ?? '100% Aprobado para consulados y visados en España.',
            },
            position: { x: layer.position.x, y: Math.min(95, layer.position.y + 26) },
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
    updateLayerWidth,
    commitPositionChange,
    fitLayerToCanvas,
    ungroupLayer,
    duplicateLayer,
    removeLayer,
    toggleLayerLock,
    toggleLayerVisibility,
    renameLayer,
    moveLayerZIndex,
    addBlockLayer,
    updateBackground,
    exportImage,
  };
}
