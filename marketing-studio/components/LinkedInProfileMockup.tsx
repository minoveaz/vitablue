import { Logo } from '@/components/atoms/Logo';

interface LinkedInProfileMockupProps {
  user: string;
  darkTheme: boolean;
  darkBackground: boolean;
}

export default function LinkedInProfileMockup({ user, darkTheme, darkBackground }: LinkedInProfileMockupProps) {
  return (
    <div className="relative">
      <div className="relative w-full aspect-[4/1] overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary-dark">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-cyan/20 blur-xl" />
        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-brand-cyan/10 blur-xl" />
        <div className="relative z-10 flex h-full select-none flex-col items-center justify-center p-3 text-center">
          <Logo iconSize={36} showText={false} showTagline={false} variant="colored-on-dark" />
          <p className="mt-1 font-display text-base font-black leading-none text-white">VitaBlue</p>
          <p className="mt-0.5 max-w-[200px] text-[9px] font-semibold leading-tight text-brand-cyan">
            Protección que se adapta a tu vida
          </p>
        </div>
      </div>

      <div className="relative px-6 pb-6 pt-16">
        <div className={`absolute left-6 top-[-44px] flex h-22 w-22 select-none items-center justify-center overflow-hidden rounded-full border-[4px] shadow-md ${darkTheme ? 'border-[#18191A]' : 'border-white'} ${darkBackground ? 'bg-primary-dark' : 'bg-white'}`}>
          <Logo iconSize={44} showText={false} showTagline={false} variant={darkBackground ? 'colored-on-dark' : 'default'} />
        </div>

        <div className="space-y-1">
          <h4 className={`font-display text-xl font-bold ${darkTheme ? 'text-white' : 'text-slate-900'}`}>VitaBlue</h4>
          <p className={`text-xs font-semibold ${darkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
            Asesoría de Seguros Independiente y Gratuita en España
          </p>
          <p className="text-[10px] font-semibold text-slate-400">
            Servicios financieros · Madrid, Comunidad de Madrid · 1,240 seguidores
          </p>
          <div className="flex flex-wrap gap-2 pt-4">
            <button type="button" className="rounded-full bg-[#0A66C2] px-4 py-1.5 text-xs font-bold text-white shadow-sm">+ Seguir</button>
            <button type="button" className={`rounded-full border px-4 py-1.5 text-xs font-bold ${darkTheme ? 'border-white/20 text-[#0A66C2] hover:bg-white/5' : 'border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2]/5'}`}>Visitar sitio web</button>
          </div>
          {user && <span className="sr-only">Perfil conectado: {user}</span>}
        </div>
      </div>
    </div>
  );
}
