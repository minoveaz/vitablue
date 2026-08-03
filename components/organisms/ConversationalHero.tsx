import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, Shield, ChevronDown } from 'lucide-react';
import Button from '@/components/atoms/Button';

interface ConversationalHeroProps {
  onSearch?: (data: { age: number; needType: string }) => void;
  className?: string;
}

export const ConversationalHero: React.FC<ConversationalHeroProps> = ({ 
  onSearch,
  className = '' 
}) => {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');

  const [age, setAge] = useState<string>('25');
  const [needType, setNeedType] = useState<string>('salud');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        age: parseInt(age) || 25,
        needType,
      });
    }
  };

  const inputClasses = "mx-1.5 sm:mx-2 border-b-[3px] border-slate-200 focus:border-primary bg-transparent text-primary font-extrabold focus:outline-none transition-colors text-center cursor-pointer pb-0.5";

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-gradient-to-br from-primary/5 via-white to-brand-cyan/10 p-6 sm:p-8 md:p-12 rounded-[2.2rem] shadow-xl border border-primary/10 relative overflow-hidden text-left ${className}`}
    >
      {/* Decorative ambient bubble in the background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 opacity-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-primary via-brand-cyan to-accent" />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-8 md:gap-10">
        <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-primary/10 p-4 sm:p-5 space-y-3 shadow-sm">
          <p className="text-caption font-black uppercase tracking-[0.25em] text-primary">
            {isEnglish ? 'Start with your profile' : 'Empieza por tu perfil'}
          </p>
          <h2 className="text-h2 font-display font-black text-text-main">
            {isEnglish ? 'Calculate your insurance in 30 seconds' : 'Calcula tu seguro en 30 segundos'}
          </h2>
          <p className="text-body-reg text-text-secondary leading-relaxed max-w-2xl">
            {isEnglish 
              ? 'We only need your age and what type of insurance you seek to show you matching options.' 
              : 'Solo necesitamos tu edad y qué tipo de seguro buscas para mostrarte opciones que encajen contigo.'}
          </p>
        </div>

        <div className="rounded-2xl border border-primary/10 bg-white/80 px-4 py-5 sm:px-5 sm:py-6 text-xl sm:text-2xl md:text-3.5xl font-display font-bold leading-relaxed sm:leading-loose text-text-main shadow-sm">
          {isEnglish ? 'I am ' : 'Tengo '}
          <input 
            type="number" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="25" 
            min="1"
            max="99"
            className={`${inputClasses} w-[58px] sm:w-[72px] hover:border-primary/60 hover:bg-primary/5 focus:ring-0 bg-brand-cyan/5`}
            aria-label="Edad"
          /> 
          {isEnglish ? ' years old and looking for ' : ' años y busco un seguro para '}
          <div className="inline-block relative">
            <select 
              value={needType}
              onChange={(e) => setNeedType(e.target.value)}
              className={`${inputClasses} appearance-none pr-8 hover:border-primary/60 hover:bg-primary/5 focus:ring-0 min-w-[210px] bg-brand-cyan/5`}
              aria-label="Necesidad principal"
            >
              {isEnglish ? (
                <>
                  <option value="salud">general health</option>
                  <option value="viaje">travel / short stay</option>
                  <option value="estudios">studies in Spain</option>
                  <option value="residencia">living in Spain</option>
                  <option value="mascotas">pets</option>
                  <option value="familiar">family</option>
                </>
              ) : (
                <>
                  <option value="salud">salud general</option>
                  <option value="viaje">viaje / estancia corta</option>
                  <option value="estudios">estudios en España</option>
                  <option value="residencia">vivir en España</option>
                  <option value="mascotas">mascotas</option>
                  <option value="familiar">familia</option>
                </>
              )}
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-[60%] text-accent pointer-events-none w-5 h-5 stroke-[3]" />
          </div>
          .
        </div>

        {/* Action Button & Trust elements */}
        <div className="flex flex-col items-start gap-2 pt-1 border-t border-slate-100/60">
          <Button 
            type="submit"
            variant="accent"
            size="lg" 
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="w-full text-sm sm:text-base shadow-lg shadow-accent/15"
          >
            {isEnglish ? 'Calculate insurance' : 'Calcular seguro'}
          </Button>
          <div className="text-text-secondary/70 text-[11px] sm:text-xs font-semibold flex items-center gap-2 select-none">
            <Shield className="w-4 h-4 text-primary" /> {isEnglish ? 'No spam. No registration required to see prices.' : 'Sin spam. No necesitas registrarte para ver precios.'}
          </div>
        </div>

      </div>
    </form>
  );
};

export default ConversationalHero;
