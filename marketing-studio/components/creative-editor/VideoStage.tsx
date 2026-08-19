import React from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { ReelVisaRejection, SlideData } from '../../../packages/video-studio/src/compositions/ReelVisaRejection';
import { vitablueBrandAdapter } from '../../../packages/video-studio/src/adapters/vitablue';
import { SafeZonesOverlay } from './SafeZonesOverlay';

export type VideoAspectRatio = 'vertical' | 'square' | 'landscape';

export interface VideoStageProps {
  slides: SlideData[];
  playerRef: React.RefObject<PlayerRef | null>;
  aspectRatio: VideoAspectRatio;
  showSafeZones?: boolean;
  zoomLevel?: 'fit' | '50' | '75' | '100';
  selectedLayerId?: string;
  onSelectLayer?: (layerId: string | undefined) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export const VideoStage: React.FC<VideoStageProps> = ({
  slides,
  playerRef,
  aspectRatio,
  showSafeZones = false,
  zoomLevel = 'fit',
  selectedLayerId: _selectedLayerId,
  onSelectLayer,
  onContextMenu,
}) => {
  const totalFrames = slides.reduce((total, slide) => total + slide.durationInFrames, 0);

  // Dynamic Resolution Specs
  const resolutionMap: Record<VideoAspectRatio, { width: number; height: number; label: string; aspectClass: string }> = {
    vertical: { width: 1080, height: 1920, label: '9:16 (Stories/Reels)', aspectClass: 'aspect-[9/16]' },
    square: { width: 1080, height: 1080, label: '1:1 (Feed/Post)', aspectClass: 'aspect-square' },
    landscape: { width: 1920, height: 1080, label: '16:9 (YouTube)', aspectClass: 'aspect-video' },
  };

  const currentRes = resolutionMap[aspectRatio];

  return (
    <div
      className="relative flex h-full min-h-0 flex-1 items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-950 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"
      onContextMenu={onContextMenu}
      onClick={() => onSelectLayer?.(undefined)}
    >
      <div
        className={`relative max-h-full max-w-full overflow-hidden rounded-2xl border-2 border-slate-800 bg-black shadow-2xl transition-all duration-200 ${currentRes.aspectClass}`}
        style={{
          height: zoomLevel === 'fit' ? '100%' : zoomLevel === '50' ? '50%' : zoomLevel === '75' ? '75%' : '100%',
        }}
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
      </div>
    </div>
  );
};
