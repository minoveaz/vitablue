/* The component is compile-time gated to local development; hooks are never conditionally rendered at runtime. */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef, useEffect } from 'react';
import { PlayerRef } from '@remotion/player';
import { FolderOpen } from 'lucide-react';
import BackofficeShell from '@/components/layouts/BackofficeShell';
import { useVideoProjectEditor } from './hooks/useVideoProjectEditor';
import { CreativeEditorToolbar } from './components/creative-editor/CreativeEditorToolbar';
import { VideoStage, VideoAspectRatio, ZoomLevel } from './components/creative-editor/VideoStage';
import { TransportControls } from './components/creative-editor/TransportControls';
import { VideoTimeline } from './components/VideoTimeline';
import { CreativeEditorAssetSidebar } from './components/creative-editor/CreativeEditorAssetSidebar';
import { CreativeEditorInspector } from './components/creative-editor/CreativeEditorInspector';
import { VideoContextMenu, ContextMenuPosition, ContextMenuTarget } from './components/creative-editor/VideoContextMenu';
import { createRenderHttpClient } from '../packages/video-studio/src/engine/renderHttpClient';
import type { RenderJob } from '../packages/video-studio/src/engine/renderJobs';

export const SocialGenerator: React.FC = () => {
  // Safe-guard to prevent this page from rendering/working in production
  if (!import.meta.env.DEV) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
        <p className="text-text-secondary text-sm">Este módulo de automatización de marketing solo está disponible en el entorno de desarrollo local.</p>
      </div>
    );
  }

  const [playerInstance, setPlayerInstance] = useState<PlayerRef | null>(null);
  const playerRef = useRef<PlayerRef | null>(null);

  const handlePlayerRef = (instance: PlayerRef | null) => {
    playerRef.current = instance;
    if (instance !== playerInstance) {
      setPlayerInstance(instance);
    }
  };

  // Editor State Hook
  const {
    scenes,
    updateScene,
    updateSceneContent,
    addScene,
    duplicateScene,
    removeScene,
    splitScene,
    moveScene,
    addLayer,
    addTextLayer,
    addSubtitleLayer,
    addComponentLayer,
    duplicateLayer,
    removeLayer,
    updateLayer,
    updateLayerPosition,
    reorderLayer,
    getSceneWarnings,
    loadPreset,
  } = useVideoProjectEditor();

  const [activeSlideId, setActiveSlideId] = useState('slide_1');
  const [selectedLayerId, setSelectedLayerId] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('vertical');
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('fit');
  const [isContextSidebarOpen, setIsContextSidebarOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Context Menu State
  const [contextMenuPos, setContextMenuPos] = useState<ContextMenuPosition | null>(null);
  const [contextMenuTarget, setContextMenuTarget] = useState<ContextMenuTarget | null>(null);

  // Render & Export State
  const [renderJob, setRenderJob] = useState<RenderJob | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const renderClient = useRef(createRenderHttpClient()).current;

  const totalFrames = scenes.reduce((total, slide) => total + slide.durationInFrames, 0);
  const activeScene = scenes.find((s) => s.id === activeSlideId) ?? scenes[0];
  const editorWarnings = activeScene ? getSceneWarnings(activeScene.id) : [];

  // Player Sync Effect
  useEffect(() => {
    const player = playerInstance || playerRef.current;
    if (!player) return;

    const onFrameChange = (e: { detail: { frame: number } }) => {
      const frame = e.detail.frame;
      setCurrentFrame(frame);

      let startFrame = 0;
      const current = scenes.find((scene) => {
        const isActive = frame >= startFrame && frame < startFrame + scene.durationInFrames;
        startFrame += scene.durationInFrames;
        return isActive;
      });

      if (current && current.id !== activeSlideId) {
        setActiveSlideId(current.id);
      }
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    player.addEventListener('frameupdate', onFrameChange);
    player.addEventListener('play', onPlay);
    player.addEventListener('pause', onPause);

    setIsPlaying(player.isPlaying());

    return () => {
      player.removeEventListener('frameupdate', onFrameChange);
      player.removeEventListener('play', onPlay);
      player.removeEventListener('pause', onPause);
    };
  }, [playerInstance, scenes, activeSlideId]);

  // Keyboard Shortcuts (CapCut-style)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSeek(Math.min(totalFrames - 1, currentFrame + (e.shiftKey ? 30 : 1)));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSeek(Math.max(0, currentFrame - (e.shiftKey ? 30 : 1)));
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleSplitAtPlayhead();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedLayerId && activeScene) {
          e.preventDefault();
          removeLayer(activeScene.id, selectedLayerId);
          setSelectedLayerId(undefined);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentFrame, totalFrames, selectedLayerId, activeScene]);

  const handlePlayPause = () => {
    const player = playerInstance || playerRef.current;
    if (!player) return;
    if (player.isPlaying()) {
      player.pause();
      setIsPlaying(false);
    } else {
      if (currentFrame >= totalFrames - 1) {
        player.seekTo(0);
        setCurrentFrame(0);
      }
      player.play();
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    const player = playerInstance || playerRef.current;
    if (!player) return;
    player.seekTo(0);
    setCurrentFrame(0);
  };

  const handleSeek = (frame: number) => {
    const player = playerInstance || playerRef.current;
    if (!player) return;
    player.seekTo(frame);
    setCurrentFrame(frame);
  };

  const handleSelectScene = (sceneId: string, startFrame: number) => {
    setActiveSlideId(sceneId);
    handleSeek(startFrame);
  };

  const handleSplitAtPlayhead = () => {
    let accumulated = 0;
    const targetScene = scenes.find((s) => {
      const match = currentFrame >= accumulated && currentFrame < accumulated + s.durationInFrames;
      if (!match) accumulated += s.durationInFrames;
      return match;
    });

    if (targetScene) {
      const localFrame = currentFrame - accumulated;
      splitScene(targetScene.id, localFrame);
    }
  };

  const handleExportMp4 = async () => {
    setIsExporting(true);
    try {
      const job = await renderClient.create({
        schemaVersion: 'video-schema-v1',
        id: 'reel-visa-rejection',
        name: 'Reel Rechazo de Visado',
        fps: 30,
        format: aspectRatio,
        width: aspectRatio === 'landscape' ? 1920 : 1080,
        height: aspectRatio === 'vertical' ? 1920 : 1080,
        scenes,
      }, aspectRatio);
      setRenderJob(job);
    } catch (error) {
      console.error('Error starting render job:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <BackofficeShell
      title="Reel Visa Rejection"
      eyebrow="Creative Studio"
      breadcrumbs={['Marketing Studio', 'Video Studio', 'Reel Visa Rejection']}
      mode="full-bleed"
      hideModuleHeader={true}
      toolbar={
        <CreativeEditorToolbar
          projectTitle="Reel Visa Rejection"
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          showSafeZones={showSafeZones}
          onToggleSafeZones={() => setShowSafeZones((prev) => !prev)}
          zoomLevel={zoomLevel}
          onZoomLevelChange={setZoomLevel}
          isInspectorOpen={isInspectorOpen}
          onToggleInspector={() => setIsInspectorOpen((prev) => !prev)}
          onLoadPreset={() => loadPreset(scenes)}
          onExportMp4={handleExportMp4}
          isExporting={isExporting}
          renderStatus={renderJob?.status === 'rendering' ? 'rendering' : 'saved'}
        />
      }
      contextAside={
        isContextSidebarOpen ? (
          <CreativeEditorAssetSidebar
            scenes={scenes}
            activeSlideId={activeSlideId}
            onSelectSlide={(id) => {
              const idx = scenes.findIndex((s) => s.id === id);
              const start = scenes.slice(0, idx).reduce((acc, s) => acc + s.durationInFrames, 0);
              handleSelectScene(id, start);
            }}
            onAddScene={(templateId) => {
              const newId = addScene(templateId);
              setActiveSlideId(newId);
            }}
            onDuplicateScene={duplicateScene}
            onRemoveScene={removeScene}
            onMoveScene={moveScene}
            onAddLayer={(type) => addLayer(activeScene.id, type)}
            onAddTextLayer={(text) => addTextLayer(activeScene.id, text)}
            onAddSubtitleLayer={(text) => addSubtitleLayer(activeScene.id, text)}
            onAddComponentLayer={(comp) => addComponentLayer(activeScene.id, comp)}
            onLoadPreset={loadPreset}
            onCollapse={() => setIsContextSidebarOpen(false)}
          />
        ) : undefined
      }
      aside={
        isInspectorOpen ? (
          <CreativeEditorInspector
            activeScene={activeScene}
            selectedLayerId={selectedLayerId}
            onUpdateScene={updateScene}
            onUpdateSceneContent={updateSceneContent}
            onUpdateLayer={updateLayer}
            onRemoveLayer={removeLayer}
            warnings={editorWarnings}
            onClose={() => setIsInspectorOpen(false)}
          />
        ) : undefined
      }
      contextualSidebarAction={(isRail) =>
        !isContextSidebarOpen ? (
          <button
            type="button"
            onClick={() => setIsContextSidebarOpen(true)}
            className="flex w-full items-center gap-2.5 rounded-lg border border-primary/40 bg-primary/10 p-2 text-left text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-xs"
            title="Abrir biblioteca creativa"
          >
            <FolderOpen className="size-4 shrink-0" />
            {!isRail && <span>Biblioteca</span>}
          </button>
        ) : null
      }
    >
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
        {/* ZONA 3: VIDEO STAGE (CANVAS & PLAYER) */}
        <VideoStage
          slides={scenes}
          playerRef={handlePlayerRef}
          aspectRatio={aspectRatio}
          activeScene={activeScene}
          showSafeZones={showSafeZones}
          zoomLevel={zoomLevel}
          onZoomLevelChange={setZoomLevel}
          selectedLayerId={selectedLayerId}
          onSelectLayer={(id) => {
            setSelectedLayerId(id);
            if (id) setIsInspectorOpen(true);
          }}
          onUpdateLayer={updateLayer}
          onUpdateLayerPosition={updateLayerPosition}
          onDuplicateLayer={duplicateLayer}
          onDeleteLayer={removeLayer}
          onReorderLayer={reorderLayer}
          onContextMenu={(e) => {
            e.preventDefault();
            const rect = e.currentTarget.getBoundingClientRect();
            const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
            const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
            setContextMenuPos({ x: e.clientX, y: e.clientY });
            setContextMenuTarget({ type: 'canvas', coords: { x, y } });
          }}
        />

        {/* ZONA 4: TRANSPORT CONTROLS */}
        <TransportControls
          isPlaying={isPlaying}
          currentFrame={currentFrame}
          totalFrames={totalFrames}
          fps={30}
          onPlayPause={handlePlayPause}
          onRestart={handleRestart}
          onSplitAtPlayhead={handleSplitAtPlayhead}
          renderJob={renderJob}
        />

        {/* ZONA 5: VIDEO TIMELINE */}
        <VideoTimeline
          scenes={scenes}
          currentFrame={currentFrame}
          fps={30}
          onSeek={handleSeek}
          onSelectScene={handleSelectScene}
          onResizeScene={(sceneId, dur) => updateScene(sceneId, { durationInFrames: dur })}
          onUpdateSceneTransition={(sceneId, transition) => updateScene(sceneId, { transition })}
          selectedLayerId={selectedLayerId}
          onSelectLayer={(id) => {
            setSelectedLayerId(id);
            if (id) setIsInspectorOpen(true);
          }}
          onToggleLayer={(layerId, prop) => {
            const layer = activeScene.layers.find((l) => l.id === layerId);
            if (layer) {
              updateLayer(activeScene.id, layerId, { [prop]: !layer[prop] });
            }
          }}
          onRemoveLayer={(layerId) => removeLayer(activeScene.id, layerId)}
          onContextMenu={(e, target) => {
            setContextMenuPos({ x: e.clientX, y: e.clientY });
            setContextMenuTarget(target);
          }}
        />

        {/* MENÚ CONTEXTUAL (CLIC DERECHO) */}
        <VideoContextMenu
          position={contextMenuPos}
          target={contextMenuTarget}
          onClose={() => {
            setContextMenuPos(null);
            setContextMenuTarget(null);
          }}
          onDuplicateScene={duplicateScene}
          onSplitScene={() => handleSplitAtPlayhead()}
          onDeleteScene={removeScene}
          onSetSceneDuration={(id, secs) => updateScene(id, { durationInFrames: secs * 30 })}
          onDuplicateLayer={(sceneId, layerId) => duplicateLayer(sceneId, layerId)}
          onToggleLayerVisibility={(sceneId, layerId) => {
            const l = scenes.find((s) => s.id === sceneId)?.layers.find((ly) => ly.id === layerId);
            if (l) updateLayer(sceneId, layerId, { visible: l.visible === false ? true : false });
          }}
          onToggleLayerLock={(sceneId, layerId) => {
            const l = scenes.find((s) => s.id === sceneId)?.layers.find((ly) => ly.id === layerId);
            if (l) updateLayer(sceneId, layerId, { locked: !l.locked });
          }}
          onDeleteLayer={(sceneId, layerId) => removeLayer(sceneId, layerId)}
          onAddText={() => addTextLayer(activeScene.id, 'Nuevo texto')}
          onAddSubtitle={() => addSubtitleLayer(activeScene.id, 'Subtítulo del vídeo')}
          onAddComponent={(comp) => addComponentLayer(activeScene.id, comp)}
        />
      </div>
    </BackofficeShell>
  );
};

export default SocialGenerator;
