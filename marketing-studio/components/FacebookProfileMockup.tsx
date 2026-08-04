import React from 'react';
import Logo from '@/components/atoms/Logo';

interface FacebookProfileMockupProps {
  user: string;
  darkTheme: boolean;
  darkBackground: boolean;
}

const FacebookProfileMockup: React.FC<FacebookProfileMockupProps> = ({ user, darkTheme, darkBackground }) => (
  <div className="relative">
    <div className="relative aspect-[2.63/1] w-full overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary-dark">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-cyan/20 blur-xl" />
      <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-brand-cyan/10 blur-xl" />
      <div className="relative z-10 flex h-full select-none flex-col items-center justify-center p-3 text-center">
        <Logo iconSize={40} showText={false} showTagline={false} variant="colored-on-dark" />
        <p className="mt-2.5 font-display text-lg font-black leading-none text-white">VitaBlue</p>
        <p className="mt-1.5 max-w-[220px] text-[10px] font-semibold leading-tight text-brand-cyan">Protección que se adapta a tu vida</p>
      </div>
    </div>

    <div className="relative px-6 pb-6 pt-16">
      <div className={`absolute left-6 top-[-36px] flex h-20 w-20 select-none items-center justify-center overflow-hidden rounded-full border-[4px] shadow-md ${darkTheme ? 'border-[#18191A]' : 'border-white'} ${darkBackground ? 'bg-primary-dark' : 'bg-white'}`}>
        <Logo iconSize={40} showText={false} showTagline={false} variant={darkBackground ? 'colored-on-dark' : 'default'} />
      </div>

      <div className="space-y-1 text-left">
        <h4 className={`font-display text-xl font-bold ${darkTheme ? 'text-white' : 'text-slate-900'}`}>VitaBlue</h4>
        <p className="text-xs font-medium text-slate-400">{user || 'Página · Correduría de seguros'}</p>
        <div className="flex gap-2 pt-3">
          <button type="button" className="rounded-lg bg-[#1877F2] px-4 py-1.5 text-xs font-bold text-white shadow-sm">Te gusta</button>
          <button type="button" className={`rounded-lg border px-4 py-1.5 text-xs font-bold ${darkTheme ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Enviar mensaje</button>
        </div>
      </div>
    </div>
  </div>
);

export default FacebookProfileMockup;
