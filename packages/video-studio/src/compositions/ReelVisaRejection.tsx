import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { AdvisorCard } from '@/components/molecules/AdvisorCard';

export interface SlideData {
  id: string;
  durationFrames: number;
  type: string;
  content: Record<string, any>;
}

export interface VisaRejectionProps {
  slides: SlideData[];
}

export const defaultVisaRejectionProps: VisaRejectionProps = {
  slides: [
    {
      id: 'slide_1',
      durationFrames: 150,
      type: 'text_hook',
      content: {
        text: 'Si vas a pedir tu visado para España, no cometas el error de contratar un seguro de viaje común.',
        badge: 'VISA READY'
      }
    },
    {
      id: 'slide_2',
      durationFrames: 300,
      type: 'provider_logos',
      content: {
        text: 'Las oficinas de Extranjería exigen pólizas emitidas por compañías autorizadas en España.'
      }
    },
    {
      id: 'slide_3',
      durationFrames: 450,
      type: 'requirements_list',
      content: {
        title: 'Requisitos Obligatorios:',
        items: ['Cobertura Completa (100%)', 'Sin Copagos (0 €)', 'Repatriación Incluida']
      }
    },
    {
      id: 'slide_4',
      durationFrames: 450,
      type: 'advisor_cta',
      content: {
        advisorName: 'Sofía',
        role: 'Asesora experta',
        cta: 'Escríbenos por WhatsApp si necesitas verificar tu póliza'
      }
    }
  ]
};

export const ReelVisaRejection: React.FC<VisaRejectionProps> = ({ slides = defaultVisaRejectionProps.slides }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find active slide based on accumulated duration
  let accumulatedFrames = 0;
  let activeSlide = slides[0];
  let localFrame = frame;

  if (slides && slides.length > 0) {
    for (const slide of slides) {
      if (frame >= accumulatedFrames && frame < accumulatedFrames + slide.durationFrames) {
        activeSlide = slide;
        localFrame = frame - accumulatedFrames;
        break;
      }
      accumulatedFrames += slide.durationFrames;
    }
  }

  // Animation spring for active slide elements
  const slideSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 15 },
  });

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
          {activeSlide?.type === 'text_hook' ? (activeSlide.content.badge || 'INFO') : 'VISA READY'}
        </span>
      </div>

      {/* Dynamic Slide Layouts */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10, gap: '40px', opacity: slideSpring }}>
        {activeSlide?.type === 'text_hook' && (
          <div>
            <h1 style={{ fontSize: '72px', lineHeight: 1.25, fontWeight: 800, margin: 0 }}>
              {activeSlide.content.text}
            </h1>
          </div>
        )}

        {activeSlide?.type === 'provider_logos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <h1 style={{ fontSize: '60px', lineHeight: 1.3, fontWeight: 800, margin: 0 }}>
              {activeSlide.content.text}
            </h1>
            <div style={{ display: 'flex', gap: '20px', fontSize: '24px', opacity: 0.6, fontWeight: 'bold', marginTop: '20px' }}>
              <span>SANITAS</span> · <span>ADESLAS</span> · <span>ASISA</span>
            </div>
          </div>
        )}

        {activeSlide?.type === 'requirements_list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <h2 style={{ fontSize: '48px', color: '#94D2BD', fontWeight: 800 }}>{activeSlide.content.title || 'Requisitos'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(activeSlide.content.items || []).map((req: string) => (
                <div
                  key={req}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    fontSize: '42px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    padding: '24px 32px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span style={{ color: '#EE9B00', fontSize: '48px' }}>✓</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSlide?.type === 'advisor_cta' && (
          <div style={{ transform: 'scale(1.6)', transformOrigin: 'center' }}>
            <AdvisorCard
              name={activeSlide.content.advisorName}
              role={activeSlide.content.role}
              whatsAppText={activeSlide.content.cta}
            />
          </div>
        )}
      </div>

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
          {activeSlide?.type === 'advisor_cta' && activeSlide.content.cta ? activeSlide.content.cta : 'Pregúntanos'}
        </div>
      </div>
    </div>
  );
};
