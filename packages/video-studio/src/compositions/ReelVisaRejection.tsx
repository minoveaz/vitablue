import React from 'react';
import { Audio, Img, interpolate, OffthreadVideo, Sequence, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import type { VideoBrandAdapter } from '../engine/brandAdapter';
import type { VideoProject, TextLayer, SubtitleLayer, ShapeLayer } from '../domain/videoProject';
import { defaultVisaRejectionProject } from '../domain/defaultProject';
import { resolveVideoTemplate } from '../engine/templateRegistry';
import { SceneRenderer } from './SceneRenderer';

export type SlideData = VideoProject['scenes'][number];

export interface VisaRejectionProps {
  slides: SlideData[];
  brandAdapter: VideoBrandAdapter;
  aspectRatio?: 'vertical' | 'square' | 'landscape';
}

type VisaRejectionStoryboardProps = Pick<VisaRejectionProps, 'slides'>;

const TimedTextLayers: React.FC<{ layers: SlideData['layers'] }> = ({ layers }) => (
  <>
    {layers
      .filter((layer): layer is TextLayer => layer.type === 'text' && layer.visible !== false)
      .map((layer) => {
        const startFrame = layer.timing?.startFrame ?? 0;
        const durationInFrames = layer.timing?.durationInFrames ?? 90;
        const fontSize = layer.fontSize ?? 40;
        const color = layer.color ?? '#ffffff';
        const bg = layer.backgroundColor ? { backgroundColor: layer.backgroundColor, padding: '12px 24px', borderRadius: 16 } : {};

        let positionStyle: React.CSSProperties = { left: 60, right: 60, bottom: 240, textAlign: layer.align ?? 'center' };
        if (typeof layer.position === 'object') {
          positionStyle = { left: `${layer.position.x}%`, top: `${layer.position.y}%`, transform: 'translate(-50%, -50%)', textAlign: layer.align ?? 'center' };
        } else if (layer.position === 'top') {
          positionStyle = { left: 60, right: 60, top: 160, textAlign: layer.align ?? 'center' };
        } else if (layer.position === 'center') {
          positionStyle = { left: 60, right: 60, top: '48%', transform: 'translateY(-50%)', textAlign: layer.align ?? 'center' };
        }

        return (
          <Sequence key={layer.id} from={startFrame} durationInFrames={durationInFrames}>
            <div
              style={{
                position: 'absolute',
                zIndex: layer.zIndex ?? 30,
                fontSize,
                fontWeight: 800,
                color,
                lineHeight: 1.25,
                textShadow: '0 4px 12px rgba(0,0,0,0.6)',
                ...positionStyle,
                ...bg,
              }}
            >
              {layer.text}
            </div>
          </Sequence>
        );
      })}
  </>
);

const TimedSubtitleLayers: React.FC<{ layers: SlideData['layers'] }> = ({ layers }) => (
  <>
    {layers
      .filter((layer): layer is SubtitleLayer => layer.type === 'subtitle' && layer.visible !== false)
      .map((layer) => {
        const startFrame = layer.timing?.startFrame ?? 0;
        const durationInFrames = layer.timing?.durationInFrames ?? 90;
        const preset = layer.stylePreset ?? 'viral-yellow';

        let textColor = '#EE9B00';
        let bgStyle: React.CSSProperties = {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          padding: '14px 28px',
          borderRadius: 20,
          border: '2px solid rgba(238, 155, 0, 0.3)',
        };

        if (preset === 'clean-white') {
          textColor = '#ffffff';
          bgStyle = { textShadow: '0 4px 16px rgba(0,0,0,0.8)' };
        } else if (preset === 'classic-box') {
          textColor = '#ffffff';
          bgStyle = { backgroundColor: '#005F73', padding: '12px 24px', borderRadius: 16 };
        }

        return (
          <Sequence key={layer.id} from={startFrame} durationInFrames={durationInFrames}>
            <div
              style={{
                position: 'absolute',
                left: 60,
                right: 60,
                bottom: 220,
                zIndex: 40,
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontSize: layer.fontSize ?? 44,
                  fontWeight: 900,
                  color: textColor,
                  letterSpacing: '-0.01em',
                  ...bgStyle,
                }}
              >
                {layer.text}
              </span>
            </div>
          </Sequence>
        );
      })}
  </>
);

const TimedShapeLayers: React.FC<{ layers: SlideData['layers'] }> = ({ layers }) => (
  <>
    {layers
      .filter((layer): layer is ShapeLayer => layer.type === 'shape' && layer.visible !== false)
      .map((layer) => {
        const startFrame = layer.timing?.startFrame ?? 0;
        const durationInFrames = layer.timing?.durationInFrames ?? 90;
        const color = layer.color ?? 'rgba(0, 95, 115, 0.3)';
        const radius = layer.shape === 'circle' ? '50%' : layer.shape === 'pill' ? 9999 : 24;

        return (
          <Sequence key={layer.id} from={startFrame} durationInFrames={durationInFrames}>
            <div
              style={{
                position: 'absolute',
                left: typeof layer.position === 'object' ? `${layer.position.x}%` : 60,
                top: typeof layer.position === 'object' ? `${layer.position.y}%` : 'auto',
                bottom: typeof layer.position === 'string' && layer.position === 'bottom' ? 200 : 'auto',
                width: layer.width ?? 300,
                height: layer.height ?? 120,
                backgroundColor: color,
                opacity: layer.opacity ?? 0.8,
                borderRadius: radius,
                zIndex: layer.zIndex ?? 15,
              }}
            />
          </Sequence>
        );
      })}
  </>
);

const TimedMediaLayers: React.FC<{ layers: SlideData['layers'] }> = ({ layers }) => (
  <>
    {layers
      .filter((layer) => layer.visible !== false && layer.type !== 'text' && layer.type !== 'subtitle' && layer.type !== 'shape' && layer.type !== 'component')
      .map((layer) => {
        const src = layer.type === 'audio'
          ? layer.src
          : layer.type === 'image' || layer.type === 'video'
            ? layer.asset.src
            : undefined;
        if (!src) return null;

        const startFrame = layer.timing?.startFrame ?? 0;
        const durationInFrames = layer.timing?.durationInFrames ?? 1;
        return (
          <Sequence key={layer.id} from={startFrame} durationInFrames={durationInFrames}>
            {layer.type === 'image' && (
              <Img src={src} style={{ position: 'absolute', inset: 60, width: 'calc(100% - 120px)', height: '55%', objectFit: 'cover', zIndex: layer.zIndex ?? 5, borderRadius: 24 }} />
            )}
            {layer.type === 'video' && (
              <OffthreadVideo src={src} muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: layer.zIndex ?? 2, opacity: 0.7 }} />
            )}
            {layer.type === 'audio' && <Audio src={src} volume={layer.volume ?? 1} />}
          </Sequence>
        );
      })}
  </>
);

export const defaultVisaRejectionProps: VisaRejectionStoryboardProps = {
  slides: defaultVisaRejectionProject.scenes,
};

export const ReelVisaRejection: React.FC<VisaRejectionProps> = ({
  slides = defaultVisaRejectionProps.slides,
  brandAdapter,
  aspectRatio = 'vertical',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find active slide based on accumulated duration
  let accumulatedFrames = 0;
  let activeSlide = slides[0];
  let localFrame = frame;

  if (slides && slides.length > 0) {
    for (const slide of slides) {
      if (frame >= accumulatedFrames && frame < accumulatedFrames + slide.durationInFrames) {
        activeSlide = slide;
        localFrame = frame - accumulatedFrames;
        break;
      }
      accumulatedFrames += slide.durationInFrames;
    }
  }

  // Animation spring for active slide elements
  const slideSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 15 },
  });
  const activeTemplate = activeSlide ? resolveVideoTemplate(activeSlide.templateId) : null;
  const transitionDuration = Math.min(
    activeSlide?.transition?.durationInFrames ?? 0,
    Math.floor((activeSlide?.durationInFrames ?? 0) / 2),
  );
  const transitionProgress = transitionDuration > 0
    ? interpolate(localFrame, [0, transitionDuration], [0, 1], { extrapolateRight: 'clamp' })
    : 1;
  const transitionType = activeSlide?.transition?.type ?? 'none';
  const contentTransform = transitionType === 'slide'
    ? `translateX(${interpolate(transitionProgress, [0, 1], [80, 0])}px)`
    : undefined;

  const isSquare = aspectRatio === 'square';
  const isLandscape = aspectRatio === 'landscape';

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#001219',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isLandscape ? '40px 60px' : isSquare ? '60px 48px' : '80px 60px',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 95, 115, 0.15)',
          filter: 'blur(100px)',
          zIndex: 1,
        }}
      />

      {/* Header */}
      <div style={{ zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: isLandscape ? '36px' : '48px', fontWeight: 900, color: '#94D2BD', letterSpacing: '-0.02em' }}>VitaBlue</h2>
        <span style={{ fontSize: isLandscape ? '18px' : '24px', fontWeight: 700, border: '2px solid rgba(148, 210, 189, 0.4)', padding: '8px 20px', borderRadius: '9999px', letterSpacing: '0.1em' }}>
          {activeSlide?.templateId === 'text_hook' && typeof activeSlide.content.badge === 'string' ? activeSlide.content.badge : 'VISA READY'}
        </span>
      </div>

      {/* Dynamic Slide Layouts */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10, gap: '40px', opacity: slideSpring * (transitionType === 'fade' ? transitionProgress : 1), transform: contentTransform }}>
        {activeSlide && <SceneRenderer scene={activeSlide} brandAdapter={brandAdapter} />}
      </div>

      {/* Timed Overlays & Text Layers */}
      {activeSlide && <TimedTextLayers layers={activeSlide.layers} />}
      {activeSlide && <TimedSubtitleLayers layers={activeSlide.layers} />}
      {activeSlide && <TimedShapeLayers layers={activeSlide.layers} />}
      {activeSlide && <TimedMediaLayers layers={activeSlide.layers} />}

      {!activeTemplate && (
        <div style={{ zIndex: 10, color: '#EE9B00', fontSize: '28px' }}>
          Plantilla de vídeo no registrada.
        </div>
      )}

      {/* Footer / CTA */}
      <div
        style={{
          zIndex: 10,
          borderTop: '2px solid rgba(255, 255, 255, 0.1)',
          paddingTop: isLandscape ? '24px' : '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: isLandscape ? '16px' : '20px', color: '#94D2BD', fontWeight: 700, letterSpacing: '0.1em' }}>ASESORÍA GRATUITA</span>
          <span style={{ fontSize: isLandscape ? '24px' : '32px', fontWeight: 700 }}>www.vitablue.es</span>
        </div>
        
        <div
          style={{
            backgroundColor: '#25D366',
            color: '#ffffff',
            padding: isLandscape ? '14px 28px' : '20px 36px',
            borderRadius: '24px',
            fontSize: isLandscape ? '22px' : '28px',
            fontWeight: 700,
          }}
        >
          {activeSlide?.templateId === 'advisor_cta' && typeof activeSlide.content.cta === 'string' ? activeSlide.content.cta : 'Pregúntanos'}
        </div>
      </div>
    </div>
  );
};
