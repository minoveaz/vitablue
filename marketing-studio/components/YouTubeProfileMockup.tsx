import { Logo } from '@/components/atoms/Logo';

interface YouTubeProfileMockupProps {
  user: string;
  darkTheme: boolean;
  darkBackground: boolean;
}

export default function YouTubeProfileMockup({ user, darkTheme, darkBackground }: YouTubeProfileMockupProps) {
  return (
    <div>
      <div className="relative w-full aspect-[5.68/1] overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary-dark">
        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-brand-cyan/25 blur-2xl" />
        <div className="absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-brand-cyan/10 blur-2xl" />
        <div className="relative z-10 flex h-full select-none flex-col items-center justify-center p-3 text-center">
          <Logo iconSize={32} showText={false} showTagline={false} variant="colored-on-dark" />
          <p className="mt-1 font-display text-[11px] font-black leading-none text-white">VitaBlue</p>
          <p className="mt-0.5 max-w-[150px] text-[6px] font-semibold leading-tight text-brand-cyan">
            Protección que se adapta a tu vida
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <div className={`flex h-16 w-16 shrink-0 select-none items-center justify-center overflow-hidden rounded-full border shadow-md ${darkTheme ? 'border-[#3e4042]' : 'border-slate-100'} ${darkBackground ? 'bg-primary-dark' : 'bg-white'}`}>
          <Logo iconSize={36} showText={false} showTagline={false} variant={darkBackground ? 'colored-on-dark' : 'default'} />
        </div>

        <div className="space-y-1 text-left">
          <h4 className={`font-display text-lg font-bold leading-tight ${darkTheme ? 'text-white' : 'text-slate-900'}`}>VitaBlue Seguros</h4>
          <p className="text-xs font-semibold text-slate-400">
            {user || '@VitaBlue-seguros'} · 4.8K suscriptores · 12 vídeos
          </p>
          <p className={`max-w-sm text-xs ${darkTheme ? 'text-slate-300' : 'text-slate-600'}`}>
            El comparador independiente de seguros de salud gratuito.
          </p>
          <div className="pt-2">
            <button type="button" className="rounded-full bg-slate-900 px-5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">Suscribirse</button>
          </div>
        </div>
      </div>
    </div>
  );
}
