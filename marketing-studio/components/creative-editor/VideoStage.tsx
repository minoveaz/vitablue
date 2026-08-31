import React, { useEffect, useRef, useState } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { ReelVisaRejection, SlideData } from '../../../packages/video-studio/src/compositions/ReelVisaRejection';
import { vitablueBrandAdapter } from '../../../packages/video-studio/src/adapters/vitablue';
import type { Scene, Layer } from '../../../packages/video-studio/src/domain/videoProject';
import { SafeZonesOverlay } from './SafeZonesOverlay';
import { OnCanvasEditorOverlay } from './OnCanvasEditorOverlay';
import {
  StudioStageToolbar,
  StudioStageToolbarControls,
} from '../../../components/backoffice-shell/primitives';

export type VideoAspectRatio = 'vertical' | 'square' | 'landscape';
export type ZoomLevel = 'fit' | number;

export interface VideoStageProps {
  slides: SlideData[];
  playerRef: React.Ref<PlayerRef>;
  aspectRatio: VideoAspectRatio;
  activeScene?: Scene;
  showSafeZones?: boolean;
  zoomLevel?: ZoomLevel;
  onZoomLevelChange?: (zoom: ZoomLevel) => void;
  selectedLayerId?: string;
  onSelectLayer?: (layerId: string | undefined) => void;
  onUpdateLayer?: (sceneId: string, layerId: string, changes: Partial<Layer>) => void;
  onUpdateLayerPosition?: (sceneId: string, layerId: string, pos: { x: number; y: number }) => void;
  onDuplicateLayer?: (sceneId: string, layerId: string) => void;
  onDeleteLayer?: (sceneId: string, layerId: string) => void;
  onReorderLayer?: (sceneId: string, layerId: string, direction: 'up' | 'down') => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export const VideoStage: React.FC<VideoStageProps> = ({
  slides,
  playerRef,
  aspectRatio,
  activeScene,
  showSafeZones = false,
  zoomLevel = 'fit',
  onZoomLevelChange,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onUpdateLayerPosition,
  onDuplicateLayer,
  onDeleteLayer,
  onReorderLayer,
  onContextMenu,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isHandToolActive, setIsHandToolActive] = useState(false);
  const isHandToolActiveRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const totalFrames = slides.reduce((total, slide) => total + slide.durationInFrames, 0);

  // Dynamic Resolution Specs
  const resolutionMap: Record<VideoAspectRatio, { width: number; height: number; label: string; aspectClass: string }> = {
    vertical: { width: 1080, height: 1920, label: '9:16 (Stories/Reels)', aspectClass: 'aspect-[9/16]' },
    square: { width: 1080, height: 1080, label: '1:1 (Feed/Post)', aspectClass: 'aspect-square' },
    landscape: { width: 1920, height: 1080, label: '16:9 (YouTube)', aspectClass: 'aspect-video' },
  };

  const currentRes = resolutionMap[aspectRatio];
  const numericZoom = typeof zoomLevel === 'number' ? zoomLevel : 100;
  const isFit = zoomLevel === 'fit';

  // 1. GESTOS DE TRACKPAD (PINCH TO ZOOM & TWO-FINGER PAN)
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const handleWheel = (e: WheelEvent) => {
      // Gesto de pellizco (Pinch-to-zoom en Trackpad de macOS/Windows genera e.ctrlKey o e.metaKey)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const currentZoom = typeof zoomLevel === 'number' ? zoomLevel : 100;
        const factor = Math.exp(-e.deltaY * 0.006);
        const nextZoom = Math.max(25, Math.min(300, Math.round(currentZoom * factor)));
        onZoomLevelChange?.(nextZoom);
      } else if (zoomLevel !== 'fit' || isHandToolActiveRef.current) {
        // Desplazamiento con dos dedos cuando se está haciendo zoom
        e.preventDefault();
        setPanOffset((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    };

    stageEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      stageEl.removeEventListener('wheel', handleWheel);
    };
  }, [zoomLevel, onZoomLevelChange]);

  useEffect(() => {
    if (zoomLevel === 'fit') {
      setPanOffset((current) => current.x === 0 && current.y === 0 ? current : { x: 0, y: 0 });
    }
  }, [zoomLevel]);

  // 2. DETECCIÓN DE TECLA ALT / OPTION PARA MODO MANO (PAN)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsHandToolActive(true);
        isHandToolActiveRef.current = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsHandToolActive(false);
        isHandToolActiveRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Si arrastra el fondo o usa botón central (rueda) o tiene tecla Alt pulsada
    if (isHandToolActive || e.button === 1 || (zoomLevel !== 'fit' && e.target === stageRef.current)) {
      e.preventDefault();
      setIsPanning(true);
      dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
      try {
        (stageRef.current as HTMLElement)?.setPointerCapture(e.pointerId);
      } catch {
        // Pointer capture may already have been released by the browser.
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      try {
        (stageRef.current as HTMLElement)?.releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture may already have been released by the browser.
      }
    }
  };

  const handleResetFit = () => {
    onZoomLevelChange?.('fit');
    setPanOffset({ x: 0, y: 0 });
  };

  const scaleTransform = isFit ? 1 : numericZoom / 100;

  return (
    <div
      ref={stageRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={onContextMenu}
      onClick={() => onSelectLayer?.(undefined)}
      role="region"
      aria-label="Lienzo de vídeo"
      tabIndex={0}
      className={`relative flex h-full min-h-0 flex-1 items-center justify-center p-4 sm:p-6 overflow-hidden bg-transparent select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
        isHandToolActive ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
      }`}
    >
      {/* CONTENEDOR TRANSFORMABLE DEL LIENZO CON ZOOM Y PAN */}
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scaleTransform})`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 0.1s ease-out',
        }}
        className="relative flex h-full max-h-full items-center justify-center pointer-events-auto"
      >
        <div
          className={`relative max-h-full max-w-full overflow-hidden rounded-2xl border-2 border-slate-800 bg-black shadow-2xl ${currentRes.aspectClass}`}
          style={{ height: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Player
            ref={playerRef}
            component={ReelVisaRejection}
            inputProps={{
              slides,
              brandAdapter: vitablueBrandAdapter,
              aspectRatio,
            }}
            durationInFrames={Math.max(totalFrames, 1)}
            compositionWidth={currentRes.width}
            compositionHeight={currentRes.height}
            fps={30}
            style={{
              width: '100%',
              height: '100%',
            }}
            controls={false}
            loop
          />

          {/* Safe Zones Overlay */}
          <SafeZonesOverlay visible={showSafeZones && aspectRatio === 'vertical'} />

          {/* On-Canvas Direct Interactive Layer Overlay */}
          <OnCanvasEditorOverlay
            scene={activeScene}
            selectedLayerId={selectedLayerId}
            onSelectLayer={onSelectLayer ?? (() => {})}
            onUpdateLayer={onUpdateLayer ?? (() => {})}
            onUpdateLayerPosition={onUpdateLayerPosition ?? (() => {})}
            onDuplicateLayer={onDuplicateLayer ?? (() => {})}
            onDeleteLayer={onDeleteLayer ?? (() => {})}
            onReorderLayer={onReorderLayer ?? (() => {})}
          />
        </div>
      </div>

      <StudioStageToolbar
        role="toolbar"
        aria-label="Controles del lienzo"
        data-visual-contract="image-studio-stage-toolbar"
        className=""
        onClick={(e) => e.stopPropagation()}
      >
        <StudioStageToolbarControls
          isHandToolActive={isHandToolActive}
          onHandToolChange={(active) => {
            setIsHandToolActive(active);
            isHandToolActiveRef.current = active;
          }}
          zoom={numericZoom}
          minZoom={25}
          maxZoom={200}
          zoomStep={5}
          zoomButtonStep={10}
          onZoomChange={(value) => onZoomLevelChange?.(value)}
          formatZoom={(value) => `${value}%`}
          isFit={isFit}
          onFit={handleResetFit}
          onResetPan={
            panOffset.x !== 0 || panOffset.y !== 0
              ? () => setPanOffset({ x: 0, y: 0 })
              : undefined
          }
        />
      </StudioStageToolbar>
    </div>
  );
};
