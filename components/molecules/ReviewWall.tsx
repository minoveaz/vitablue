import React from 'react';
import { Star } from 'lucide-react';

interface ReviewData {
  text: string;
  author: string;
  meta: string;
  stars?: number;
}

interface ReviewWallProps {
  reviews?: ReviewData[];
  className?: string;
}

const ReviewCard: React.FC<{ r: ReviewData }> = ({ r }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100/80 flex flex-col gap-3 group hover:border-primary/20 hover:shadow-md transition-all duration-200">
    <div className="flex gap-0.5 text-accent">
      {Array.from({ length: r.stars || 5 }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-current stroke-none" />
      ))}
    </div>
    <p className="text-xs sm:text-sm text-text-main font-medium leading-relaxed">
      "{r.text}"
    </p>
    <div className="flex flex-col">
      <span className="text-[10px] text-text-main font-extrabold uppercase tracking-wider">
        {r.author}
      </span>
      <span className="text-[9px] text-text-secondary/70 font-semibold">
        {r.meta}
      </span>
    </div>
  </div>
);

export const ReviewWall: React.FC<ReviewWallProps> = ({
  reviews = [
    { text: "El proceso fue super rápido. Conseguí mi seguro de estudiante para el visado de España en 10 minutos por WhatsApp.", author: "Sarah Jenkins", meta: "Estudiante de EE.UU. en Madrid", stars: 5 },
    { text: "Excelente atención. Me ayudaron a elegir la opción sin copago más barata para mi residencia no lucrativa.", author: "Chen Wei", meta: "Expatriado de China en Barcelona", stars: 5 },
    { text: "Muy profesionales. Me enviaron el certificado en inglés y español al instante para presentarlo en el consulado.", author: "Emily Brown", meta: "Expatriada del Reino Unido", stars: 5 },
    { text: "Me atendieron por chat en domingo y me resolvieron el seguro de mi perra en un momento. Increíble servicio.", author: "Carlos M.", meta: "Usuario de Sanitas Mascotas", stars: 5 },
    { text: "Buscaba asistencia de decesos familiar para mis padres. Comparé precios de 3 aseguradoras y ahorré bastante.", author: "Elena G.", meta: "Contrató Asistencia Familiar", stars: 5 },
    { text: "Cumple 100% con los requisitos del consulado de España en Miami. Visado aprobado sin trabas.", author: "John D.", meta: "Estudiante extranjero", stars: 5 },
  ],
  className = ''
}) => {
  // Multiply the lists to allow infinite scrolling transitions
  const col1 = [...reviews, ...reviews, ...reviews];
  const col2 = [...reviews, ...reviews, ...reviews].reverse();

  return (
    <div className={`h-[480px] overflow-hidden relative bg-slate-50 border border-slate-100 rounded-[2rem] w-full ${className}`}>
      {/* Top and Bottom soft fading gradients */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-slate-50 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none"></div>
      
      {/* Grid columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 h-full overflow-hidden">
        {/* Column 1 - Scrolling UP */}
        <div className="flex flex-col gap-4 animate-marqueeScrollY hover:[animation-play-state:paused] cursor-grab">
          {col1.map((r, i) => (
            <ReviewCard key={`col1-${i}`} r={r} />
          ))}
        </div>

        {/* Column 2 - Scrolling DOWN (hidden on small mobile screens to save space) */}
        <div className="hidden sm:flex flex-col gap-4 animate-marqueeScrollYReverse hover:[animation-play-state:paused] cursor-grab">
          {col2.map((r, i) => (
            <ReviewCard key={`col2-${i}`} r={r} />
          ))}
        </div>
      </div>

      {/* Dynamic Keyframes for vertical scrolls */}
      <style>{`
        @keyframes marqueeScrollY {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.333%); }
        }
        @keyframes marqueeScrollYReverse {
          0% { transform: translateY(-33.333%); }
          100% { transform: translateY(0); }
        }
        .animate-marqueeScrollY {
          animation: marqueeScrollY 35s linear infinite;
        }
        .animate-marqueeScrollYReverse {
          animation: marqueeScrollYReverse 38s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ReviewWall;
