import { Logo } from '@/components/atoms/Logo';

interface TikTokProfileMockupProps {
  user: string;
  darkTheme: boolean;
  darkBackground: boolean;
}

export default function TikTokProfileMockup({ user, darkTheme, darkBackground }: TikTokProfileMockupProps) {
  return (
    <div className="space-y-4 p-6 text-center">
      <div className="flex select-none flex-col items-center">
        <div className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 shadow-md ${darkTheme ? 'border-[#3e4042]' : 'border-slate-100'} ${darkBackground ? 'bg-primary-dark' : 'bg-white'}`}><Logo iconSize={42} showText={false} showTagline={false} variant={darkBackground ? 'colored-on-dark' : 'default'} /></div>
        <h4 className={`mt-3 font-display text-lg font-bold leading-none ${darkTheme ? 'text-white' : 'text-slate-900'}`}>VitaBlue</h4>
        <p className="mt-1 text-xs font-semibold text-slate-400">{user || '@vitablueseguros'}</p>
        <button type="button" className="mt-3.5 rounded bg-[#FE2C55] px-8 py-1.5 text-xs font-bold text-white shadow-sm">Seguir</button>
      </div>
      <div className="flex flex-wrap justify-center gap-6 border-b border-t border-white/5 py-3 text-xs font-bold">
        <div><span className={`mr-1 ${darkTheme ? 'text-white' : 'text-slate-900'}`}>14</span><span className="font-semibold text-slate-400">Siguiendo</span></div>
        <div><span className={`mr-1 ${darkTheme ? 'text-white' : 'text-slate-900'}`}>980</span><span className="font-semibold text-slate-400">Seguidores</span></div>
        <div><span className={`mr-1 ${darkTheme ? 'text-white' : 'text-slate-900'}`}>4.2K</span><span className="font-semibold text-slate-400">Me gusta</span></div>
      </div>
      <p className={`mx-auto max-w-sm text-xs leading-relaxed ${darkTheme ? 'text-slate-300' : 'text-slate-600'}`}>El comparador independiente de seguros de salud, estudios y asistencia en España. Sin spam.</p>
    </div>
  );
}
