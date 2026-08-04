import { Logo } from '@/components/atoms/Logo';

interface InstagramProfileMockupProps {
  url: string;
  darkTheme: boolean;
  darkBackground: boolean;
}

export default function InstagramProfileMockup({ url, darkTheme, darkBackground }: InstagramProfileMockupProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center gap-6">
        <div className={`flex h-20 w-20 shrink-0 select-none items-center justify-center rounded-full border-[3px] p-0.5 shadow-md ${darkTheme ? 'border-[#3e4042]' : 'border-slate-100'} ${darkBackground ? 'bg-primary-dark' : 'bg-white'}`}>
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
            <Logo iconSize={40} showText={false} showTagline={false} variant={darkBackground ? 'colored-on-dark' : 'default'} />
          </div>
        </div>

        <div className="min-w-0 flex-grow space-y-3 text-left">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <h4 className={`font-display text-lg font-bold ${darkTheme ? 'text-white' : 'text-slate-900'}`}>vitablue_seguros</h4>
            <div className="flex flex-wrap gap-1.5">
              <button type="button" className="rounded bg-[#0095F6] px-3.5 py-1 text-[11px] font-bold text-white">Seguir</button>
              <button type="button" className={`rounded border px-3 py-1 text-[11px] font-bold ${darkTheme ? 'border-white/10 bg-white/5 text-white' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>Mensaje</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-5 text-xs select-none"><div><span className="font-bold">24</span> publicaciones</div><div><span className="font-bold">1.5K</span> seguidores</div><div><span className="font-bold">110</span> seguidos</div></div>
        </div>
      </div>
      <div className="space-y-1 text-left text-xs">
        <p className={`font-bold ${darkTheme ? 'text-white' : 'text-slate-800'}`}>VitaBlue</p>
        <p className="font-semibold text-slate-400">Correduría de seguros</p>
        <p className={darkTheme ? 'text-slate-300' : 'text-slate-600'}>Comparador independiente de seguros en España. Sin spam y 100% gratuito. Hablamos en idioma humano. 💬 Asistencia en vivo 👇</p>
        <p className="cursor-pointer font-semibold text-sky-600 hover:underline">{url || 'linktr.ee/vitablue'}</p>
      </div>
    </div>
  );
}
