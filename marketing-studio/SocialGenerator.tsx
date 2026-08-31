/* The component is compile-time gated to local development; hooks are never conditionally rendered at runtime. */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef, useEffect } from 'react';
import { PlayerRef } from '@remotion/player';
import { FolderOpen, Layers, Music } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackofficeShell, { vitablueBackofficeSchema } from '@/components/layouts/BackofficeShell';
import {
  CreativeStudioShellAdapter,
  ShortcutManager,
  StudioToolRail,
  StudioResourcePanel,
  type StudioToolRailItem,
  useCreativeStudioOnlineStatus,
} from '@/components/backoffice-shell';
import { createCreativeResourceToolRail } from '@/components/creative-resources';
import type { ShortcutBinding } from '@/components/backoffice-shell';
import type {
  CreativeStudioVideoStudioExtension,
} from '@/components/backoffice-shell/contracts';
import { useVideoProjectEditor } from './hooks/useVideoProjectEditor';
import { CreativeEditorToolbar } from './components/creative-editor/CreativeEditorToolbar';
import { VideoStage, VideoAspectRatio, ZoomLevel } from './components/creative-editor/VideoStage';
import { TransportControls } from './components/creative-editor/TransportControls';
import { VideoTimeline } from './components/VideoTimeline';
import { CreativeEditorAssetSidebar, type CreativeEditorResourceTab } from './components/creative-editor/CreativeEditorAssetSidebar';
import { CreativeEditorInspector } from './components/creative-editor/CreativeEditorInspector';
import { VideoContextMenu, ContextMenuPosition, ContextMenuTarget } from './components/creative-editor/VideoContextMenu';
import { createRenderHttpClient } from '../packages/video-studio/src/engine/renderHttpClient';
import type { RenderJob } from '../packages/video-studio/src/engine/renderJobs';
import { getVideoStudioEditorState, getVideoStudioStatusMessage } from './utils/videoStudioState';
import { getVideoProject, saveVideoProject } from './utils/creativeStudioRemote';
import { VideoStudioHub } from './components/creative-editor/VideoStudioHub';
import { defaultVisaRejectionProject } from '../packages/video-studio/src/domain/defaultProject';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const videoProjectId = searchParams.get('projectId');
  const [remoteProject, setRemoteProject] = useState<Awaited<ReturnType<typeof getVideoProject>>>(null);
  const [persistenceReady, setPersistenceReady] = useState(!videoProjectId);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);

  const handlePlayerRef = React.useCallback((instance: PlayerRef | null) => {
    playerRef.current = instance;
    setPlayerInstance((current) => current === instance ? current : instance);
  }, []);

  // Editor State Hook
  useEffect(() => {
    if (!videoProjectId) {
      setRemoteProject(null);
      setPersistenceReady(true);
      return;
    }
    let active = true;
    setPersistenceReady(false);
    setPersistenceError(null);
    void getVideoProject(videoProjectId)
      .then((project) => {
        if (!active) return;
        if (!project) {
          setPersistenceError('No se encontró este vídeo en LoopDev.');
        } else {
          setRemoteProject(project);
          setPersistenceReady(true);
        }
      })
      .catch(() => {
        if (active) setPersistenceError('No se pudo cargar el vídeo.');
      });
    return () => {
      active = false;
    };
  }, [videoProjectId]);

  const persistVideoProject = React.useCallback(
    (project: import('../packages/video-studio/src/domain/videoProject').VideoProject, expectedUpdatedAt?: string) =>
      saveVideoProject(project, { expectedUpdatedAt }),
    [],
  );
  const editor = useVideoProjectEditor(remoteProject ?? defaultVisaRejectionProject, {
    persistenceReady,
    persistProject: persistVideoProject,
  });
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
  } = editor;

  const [activeSlideId, setActiveSlideId] = useState('slide_1');
  const [selectedLayerId, setSelectedLayerId] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('vertical');
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('fit');
  const [isContextSidebarOpen, setIsContextSidebarOpen] = useState(true);
  const [activeToolId, setActiveToolId] = useState<string | null>('scenes');
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const navigate = useNavigate();

  // Context Menu State
  const [contextMenuPos, setContextMenuPos] = useState<ContextMenuPosition | null>(null);
  const [contextMenuTarget, setContextMenuTarget] = useState<ContextMenuTarget | null>(null);

  // Render & Export State
  const [renderJob, setRenderJob] = useState<RenderJob | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const isOffline = !useCreativeStudioOnlineStatus();
  const renderClient = useRef(createRenderHttpClient()).current;
  const scenesRef = useRef(scenes);
  const activeSlideIdRef = useRef(activeSlideId);
  useEffect(() => {
    scenesRef.current = scenes;
    activeSlideIdRef.current = activeSlideId;
  }, [scenes, activeSlideId]);

  const totalFrames = scenes.reduce((total, slide) => total + slide.durationInFrames, 0);
  const activeScene = scenes.find((s) => s.id === activeSlideId) ?? scenes[0];
  const editorWarnings = activeScene ? getSceneWarnings(activeScene.id) : [];
  const renderStatus = editor.saveState !== 'saved'
    ? editor.saveState
    : getVideoStudioEditorState(isOffline, renderError, renderJob?.status);
  const renderStatusMessage = getVideoStudioStatusMessage(renderError, renderJob?.error, renderJob?.status);
  const canRetryRender = !isOffline && renderStatus === 'error';

  // Player Sync Effect
  useEffect(() => {
    const player = playerInstance || playerRef.current;
    if (!player) return;

    const onFrameChange = (e: { detail: { frame: number } }) => {
      const frame = e.detail.frame;
      setCurrentFrame(frame);

      let startFrame = 0;
      const current = scenesRef.current.find((scene) => {
        const isActive = frame >= startFrame && frame < startFrame + scene.durationInFrames;
        startFrame += scene.durationInFrames;
        return isActive;
      });

      if (current && current.id !== activeSlideIdRef.current) {
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
  }, [playerInstance]);

  function handlePlayPause() {
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
  }

  const handleRestart = () => {
    const player = playerInstance || playerRef.current;
    if (!player) return;
    player.seekTo(0);
    setCurrentFrame(0);
  };

  function handleSeek(frame: number) {
    const player = playerInstance || playerRef.current;
    if (!player) return;
    player.seekTo(frame);
    setCurrentFrame(frame);
  }

  const handleSelectScene = (sceneId: string, startFrame: number) => {
    setActiveSlideId(sceneId);
    handleSeek(startFrame);
  };

  function handleSplitAtPlayhead() {
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
  }

  const handleExportMp4 = async () => {
    if (isOffline) {
      setRenderError('No hay conexión. Vuelve a intentarlo cuando recuperes la conexión.');
      return;
    }
    setIsExporting(true);
    setRenderError(null);
    try {
      const job = await renderClient.create({
        schemaVersion: 'video-schema-v1',
        id: editor.project.id,
        name: editor.project.name,
        fps: 30,
        format: aspectRatio,
        width: aspectRatio === 'landscape' ? 1920 : 1080,
        height: aspectRatio === 'vertical' ? 1920 : 1080,
        scenes,
      }, aspectRatio);
      setRenderJob(job);
    } catch (error) {
      console.error('Error starting render job:', error);
      setRenderError(error instanceof Error ? error.message : 'No se pudo iniciar el render.');
    } finally {
      setIsExporting(false);
    }
  };

  const shortcutBindings: ShortcutBinding[] = [
    { shortcut: 'Space', onTrigger: () => handlePlayPause() },
    { shortcut: 'ArrowRight', onTrigger: (event) => handleSeek(Math.min(totalFrames - 1, currentFrame + (event.shiftKey ? 30 : 1))) },
    { shortcut: 'ArrowLeft', onTrigger: (event) => handleSeek(Math.max(0, currentFrame - (event.shiftKey ? 30 : 1))) },
    { shortcut: 'mod+b', onTrigger: () => handleSplitAtPlayhead() },
    { shortcut: 'Delete', preventDefault: false, onTrigger: (event) => {
      if (selectedLayerId && activeScene) {
        event.preventDefault();
        removeLayer(activeScene.id, selectedLayerId);
        setSelectedLayerId(undefined);
      }
    } },
    { shortcut: 'Backspace', preventDefault: false, onTrigger: (event) => {
      if (selectedLayerId && activeScene) {
        event.preventDefault();
        removeLayer(activeScene.id, selectedLayerId);
        setSelectedLayerId(undefined);
      }
    } },
  ];

  if (!videoProjectId) {
    return (
      <BackofficeShell
        title="Video Studio"
        eyebrow="3. Creative Studio"
        breadcrumbs={['Marketing Studio', '3. Creative Studio', 'Video Studio']}
        mode="overview"
      >
        <VideoStudioHub onOpenProject={(id) => setSearchParams({ projectId: id })} />
      </BackofficeShell>
    );
  }

  if (persistenceError) {
    return (
      <BackofficeShell title="Video Studio" eyebrow="3. Creative Studio" breadcrumbs={['Marketing Studio', 'Video Studio']} mode="overview">
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-body-reg text-rose-700">
          <p>{persistenceError}</p>
          <button type="button" onClick={() => setSearchParams({})} className="min-h-11 rounded-xl bg-primary px-4 py-2 text-xs font-black text-white">Volver a mis vídeos</button>
        </div>
      </BackofficeShell>
    );
  }

  if (!persistenceReady || (videoProjectId && !remoteProject)) {
    return (
      <BackofficeShell title="Video Studio" eyebrow="3. Creative Studio" breadcrumbs={['Marketing Studio', 'Video Studio']} mode="overview">
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-body-reg font-semibold text-slate-500">Cargando tu vídeo…</div>
      </BackofficeShell>
    );
  }

  const videoStage = (
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
  );

  const studioTools: StudioToolRailItem[] = [
    ...createCreativeResourceToolRail({ domain: 'video', layerCount: scenes.find((scene) => scene.id === activeSlideId)?.layers.length })
      .map((item) => ({ ...item })),
    {
      id: 'scenes',
      label: 'Escenas',
      icon: <Layers className="size-4" />,
      badge: scenes.length,
      section: 'extensions' as const,
      sectionLabel: 'Extensiones de Video Studio',
    },
    {
      id: 'audio',
      label: 'Audio',
      icon: <Music className="size-4" />,
      section: 'extensions' as const,
    },
  ];
  const activeSidebarTab: CreativeEditorResourceTab =
    activeToolId === 'scenes' ? 'storyboard' : activeToolId as CreativeEditorResourceTab;
  const handleToolSelect = (toolId: string) => {
    const nextToolId = activeToolId === toolId ? null : toolId;
    setActiveToolId(nextToolId);
    setIsContextSidebarOpen(nextToolId !== null);
  };
  const videoScenesPanel = (
    <CreativeEditorAssetSidebar
      scenes={scenes}
      documentId={editor.project.id}
      activeSlideId={activeSlideId}
      activeTab={activeSidebarTab}
      onActiveTabChange={(tab) => {
        setActiveToolId(tab === 'storyboard' ? 'scenes' : tab);
        setIsContextSidebarOpen(true);
      }}
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
      onAddLayer={(type, assetSrc) => activeScene && addLayer(activeScene.id, type, assetSrc)}
      onAddTextLayer={(text) => activeScene && addTextLayer(activeScene.id, text)}
      onAddSubtitleLayer={(text) => activeScene && addSubtitleLayer(activeScene.id, text)}
      onAddComponentLayer={(comp) => activeScene && addComponentLayer(activeScene.id, comp)}
      onLoadPreset={loadPreset}
      selectedLayerId={selectedLayerId}
      onSelectLayer={(id) => {
        setSelectedLayerId(id);
        if (id) setIsInspectorOpen(true);
      }}
      onUpdateLayerPosition={(layerId, position) => activeScene && updateLayerPosition(activeScene.id, layerId, position)}
    />
  );

  const videoExtension: CreativeStudioVideoStudioExtension = {
    domain: 'video',
    capabilities: ['scenes', 'timeline', 'transport', 'audio', 'remotion'],
    slots: {
      scenes: isContextSidebarOpen ? videoScenesPanel : undefined,
      transport: (
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
      ),
      timeline: (
        <VideoTimeline
          scenes={scenes}
          currentFrame={currentFrame}
          fps={30}
          onSeek={handleSeek}
          onSelectScene={handleSelectScene}
          onResizeScene={(sceneId, durationInFrames) => updateScene(sceneId, { durationInFrames })}
          onUpdateSceneTransition={(sceneId, transition) => updateScene(sceneId, { transition })}
          selectedLayerId={selectedLayerId}
          onSelectLayer={(id) => {
            setSelectedLayerId(id);
            if (id) setIsInspectorOpen(true);
          }}
          onToggleLayer={(layerId, prop) => {
            if (!activeScene) return;
            const layer = activeScene.layers.find((l) => l.id === layerId);
            if (layer) updateLayer(activeScene.id, layerId, { [prop]: !layer[prop] });
          }}
          onRemoveLayer={(layerId) => activeScene && removeLayer(activeScene.id, layerId)}
          onContextMenu={(e, target) => {
            setContextMenuPos({ x: e.clientX, y: e.clientY });
            setContextMenuTarget(target);
          }}
        />
      ),
      remotion: videoStage,
    },
  };

  return (
    <ShortcutManager scope="consumer" bindings={shortcutBindings}>
      <CreativeStudioShellAdapter
        domain="video"
        state={{
          status: renderStatus,
          message: renderStatusMessage,
        }}
        navMode="hidden"
        extensions={videoExtension}
        capabilities={['platform-header', 'suite-navigation', 'toolbar', 'stage', 'inspector', 'bottom-workspace', 'overlays']}
        mobileSafeMode
        mobileSafeModeTitle="Video Studio disponible en tablet y escritorio"
        mobileSafeModeDescription="La edición completa de escenas y timeline requiere una pantalla de al menos 768 px de ancho."
        schema={vitablueBackofficeSchema}
        onNavigate={(route) => navigate(route.routeId)}
        activeModuleId="content"
        suiteTitle="VitaBlue Backoffice"
        canvasMode="full-bleed"
        contextualSidebarAction={(isRail) =>
          !isContextSidebarOpen ? (
            <button
              type="button"
              onClick={() => {
                setActiveToolId('scenes');
                setIsContextSidebarOpen(true);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg border border-primary/40 bg-primary/10 p-2 text-left text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-xs"
              title="Abrir biblioteca creativa"
            >
              <FolderOpen className="size-4 shrink-0" />
              {!isRail && <span>Biblioteca</span>}
            </button>
          ) : null
        }
        slots={{
          toolRail: (
            <StudioToolRail
              items={studioTools}
              activeToolId={activeToolId}
              onSelect={handleToolSelect}
            />
          ),
          resourcePanel: isContextSidebarOpen && activeToolId ? (
            <StudioResourcePanel
              title={studioTools.find((tool) => tool.id === activeToolId)?.label ?? 'Recursos'}
              onClose={() => {
                setActiveToolId(null);
                setIsContextSidebarOpen(false);
              }}
              variant="dark"
              className="w-[min(24rem,32vw)] border-r border-slate-800 bg-slate-900/98 text-white shadow-2xl"
            >
              {videoScenesPanel}
            </StudioResourcePanel>
          ) : null,
          toolbar: (
        <CreativeEditorToolbar
          projectTitle={editor.project.name}
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
            onCopyProject={() => navigator.clipboard?.writeText(JSON.stringify(editor.project))}
            onUpdateTitle={editor.updateProjectName}
            onBackToHub={() => setSearchParams({})}
          isExporting={isExporting}
          renderStatus={renderStatus}
          renderStatusMessage={editor.saveState === 'error' ? 'No se pudo guardar el vídeo.' : renderStatusMessage}
          lastSavedAt={editor.lastSavedAt}
          onRetryRender={canRetryRender ? handleExportMp4 : undefined}
        />
         ),
         inspector: isInspectorOpen ? (
         <CreativeEditorInspector
            activeScene={activeScene}
            selectedLayerId={selectedLayerId}
            onUpdateScene={updateScene}
            onUpdateSceneContent={updateSceneContent}
            onUpdateLayer={updateLayer}
            onRemoveLayer={removeLayer}
            warnings={editorWarnings}
            error={renderStatus === 'error' ? renderStatusMessage : undefined}
            onRetryRender={canRetryRender ? handleExportMp4 : undefined}
            onClose={() => setIsInspectorOpen(false)}
          />
        ) : undefined,
        stage: videoExtension.slots?.remotion ?? videoStage,
        overlays: (
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
        ),
        }}
      />
    </ShortcutManager>
  );
};

export default SocialGenerator;
