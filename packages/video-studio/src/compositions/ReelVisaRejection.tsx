import { Audio, Img, interpolate, OffthreadVideo, Sequence, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import type { VideoBrandAdapter } from '../engine/brandAdapter';
import type { VideoProject } from '../domain/videoProject';
import { defaultVisaRejectionProject } from '../domain/defaultProject';
import { resolveVideoTemplate } from '../engine/templateRegistry';
import { SceneRenderer } from './SceneRenderer';

export type SlideData = VideoProject['scenes'][number];

export interface VisaRejectionProps {
  slides: SlideData[];
  brandAdapter: VideoBrandAdapter;
}

type VisaRejectionStoryboardProps = Pick<VisaRejectionProps, 'slides'>;

const TimedTextLayers: React.FC<{ layers: SlideData['layers'] }> = ({ layers }) => (
  <>
    {layers.filter((layer): layer is Extract<SlideData['layers'][number], { type: 'text' }> => layer.type === 'text' && layer.visible !== false).map((layer) => {
      const startFrame = layer.timing?.startFrame ?? 0;
      const durationInFrames = layer.timing?.durationInFrames ?? 1;
      return (
        <Sequence key={layer.id} from={startFrame} durationInFrames={durationInFrames}>
          <div style={{ position: 'absolute', left: 60, right: 60, bottom: 260, zIndex: 20, fontSize: 34, fontWeight: 700, color: '#ffffff' }}>
            {layer.text}
          </div>
        </Sequence>
      );
    })}
  </>
);

const TimedMediaLayers: React.FC<{ layers: SlideData['layers'] }> = ({ layers }) => (
  <>
    {layers.filter((layer) => layer.visible !== false && layer.type !== 'text' && layer.type !== 'shape' && layer.type !== 'component').map((layer) => {
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
            <Img src={src} style={{ position: 'absolute', inset: 60, width: 'calc(100% - 120px)', height: '55%', objectFit: 'cover', zIndex: 5, borderRadius: 24 }} />
          )}
          {layer.type === 'video' && (
            <OffthreadVideo src={src} muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2, opacity: 0.7 }} />
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
        padding: '80px 60px',
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
        <h2 style={{ margin: 0, fontSize: '48px', fontWeight: 900, color: '#94D2BD', letterSpacing: '-0.02em' }}>VitaBlue</h2>
        <span style={{ fontSize: '24px', fontWeight: 700, border: '2px solid rgba(148, 210, 189, 0.4)', padding: '10px 24px', borderRadius: '9999px', letterSpacing: '0.1em' }}>
          {activeSlide?.templateId === 'text_hook' && typeof activeSlide.content.badge === 'string' ? activeSlide.content.badge : 'VISA READY'}
        </span>
      </div>

      {/* Dynamic Slide Layouts */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10, gap: '40px', opacity: slideSpring * (transitionType === 'fade' ? transitionProgress : 1), transform: contentTransform }}>
        {activeSlide && <SceneRenderer scene={activeSlide} brandAdapter={brandAdapter} />}
      </div>

      {activeSlide && <TimedTextLayers layers={activeSlide.layers} />}
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
          paddingTop: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '20px', color: '#94D2BD', fontWeight: 700, letterSpacing: '0.1em' }}>ASESORÍA GRATUITA</span>
          <span style={{ fontSize: '32px', fontWeight: 700 }}>www.vitablue.es</span>
        </div>
        
        <div
          style={{
            backgroundColor: '#25D366',
            color: '#ffffff',
            padding: '20px 36px',
            borderRadius: '24px',
            fontSize: '28px',
            fontWeight: 700,
          }}
        >
          {activeSlide?.templateId === 'advisor_cta' && typeof activeSlide.content.cta === 'string' ? activeSlide.content.cta : 'Pregúntanos'}
        </div>
      </div>
    </div>
  );
};
