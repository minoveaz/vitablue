import { Logo } from '@/components/atoms/Logo';

interface XProfileMockupProps {
  user: string;
  darkTheme: boolean;
  darkBackground: boolean;
}

export default function XProfileMockup({ user, darkTheme, darkBackground }: XProfileMockupProps) {
  return (
    <div className="relative text-left font-sans">
      <div className="relative aspect-[3/1] w-full overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary-dark">
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-brand-cyan/20 blur-xl" /><div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-brand-cyan/10 blur-xl" />
        <div className="relative z-10 flex h-full select-none flex-col items-center justify-center p-3 text-center"><Logo iconSize={36} showText={false} showTagline={false} variant="colored-on-dark" /><p className="mt-1.5 font-display text-base font-black leading-none text-white">VitaBlue</p><p className="mt-1 max-w-[200px] text-[8px] font-semibold leading-tight text-brand-cyan">Protección que se adapta a tu vida</p></div>
      </div>
      <div className="relative px-6 pb-6 pt-16">
        <div className={`absolute left-6 top-[-40px] flex h-20 w-20 select-none items-center justify-center overflow-hidden rounded-full border-[4px] shadow-md ${darkTheme ? 'border-[#15181C]' : 'border-white'} ${darkBackground ? 'bg-primary-dark' : 'bg-white'}`}><Logo iconSize={40} showText={false} showTagline={false} variant={darkBackground ? 'colored-on-dark' : 'default'} /></div>
        <div className="absolute right-6 top-3"><button type="button" className={`rounded-full px-5 py-1.5 text-xs font-black transition-all ${darkTheme ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>Seguir</button></div>
        <div className="space-y-1"><h4 className={`font-display text-xl font-bold leading-none ${darkTheme ? 'text-white' : 'text-slate-900'}`}>VitaBlue</h4><p className="text-xs font-semibold text-slate-500">{user || '@vitablueseguros'}</p><p className={`pt-1 text-xs leading-relaxed ${darkTheme ? 'text-slate-300' : 'text-slate-700'}`}>El comparador independiente de seguros de salud, estudiantes y nómadas digitales en España. 🩺 Sin spam y 100% gratuito.</p><div className="flex gap-4 pt-3 text-[11px] font-bold text-slate-500"><div><span className={darkTheme ? 'text-white' : 'text-slate-800'}>84</span> Siguiendo</div><div><span className={darkTheme ? 'text-white' : 'text-slate-800'}>1.5K</span> Seguidores</div></div></div>
      </div>
    </div>
  );
}
