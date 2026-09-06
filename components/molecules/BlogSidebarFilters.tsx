import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Filter, 
  X, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon';
import Button from '@/components/atoms/Button';
import { buildContextualWhatsAppUrl } from '@/utils/whatsappLinks';

export interface ProfileFilterOption {
  id: string;
  label: string;
  count: number;
  icon: React.ReactNode;
}

export interface QuickTopicOption {
  id: string;
  label: string;
}

interface BlogSidebarFiltersProps {
  isEnglish: boolean;
  selectedProfile: string;
  selectedTopic: string;
  profileOptions: ProfileFilterOption[];
  quickTopics: QuickTopicOption[];
  onSelectProfile: (id: string) => void;
  onSelectTopic: (id: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const BlogSidebarFilters: React.FC<BlogSidebarFiltersProps> = ({
  isEnglish,
  selectedProfile,
  selectedTopic,
  profileOptions,
  quickTopics,
  onSelectProfile,
  onSelectTopic,
  onClearFilters,
  hasActiveFilters,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const whatsappUrl = buildContextualWhatsAppUrl({
    pathname: isEnglish ? '/en/blog/' : '/blog/',
    locale: isEnglish ? 'en' : 'es',
  });

  const content = (
    <div className="space-y-6 text-left">
      {/* 1. Selector por Perfil de Asegurado */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-caption font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>{isEnglish ? 'Your Profile in Spain' : 'Tu Perfil en España'}</span>
          </h3>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors cursor-pointer"
            >
              {isEnglish ? 'Reset' : 'Limpiar'}
            </button>
          )}
        </div>

        <div className="space-y-1.5" role="radiogroup" aria-label={isEnglish ? 'Filter by profile' : 'Filtrar por perfil'}>
          {profileOptions.map((opt) => {
            const isSelected = selectedProfile === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectProfile(opt.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer text-left border ${
                  isSelected
                    ? 'bg-primary/5 border-primary/30 text-primary font-bold shadow-xs'
                    : 'bg-transparent border-transparent hover:bg-slate-50 text-text-main font-semibold'
                }`}
                role="radio"
                aria-checked={isSelected}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`shrink-0 ${isSelected ? 'text-primary' : 'text-slate-400'}`}>
                    {opt.icon}
                  </span>
                  <span className="text-xs truncate">{opt.label}</span>
                </div>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-text-secondary'
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Píldoras de Temas Críticos Consulares */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-caption font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>{isEnglish ? 'Critical Consular Topics' : 'Temas Clave de Visado'}</span>
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {quickTopics.map((topic) => {
            const isSelected = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onSelectTopic(isSelected ? 'all' : topic.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-caption font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-slate-50 text-text-secondary hover:bg-slate-100 border-slate-200/60'
                }`}
              >
                <span>{topic.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sticky Lead Magnet Widget: Validador Consular */}
      <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-dark text-white rounded-3xl p-6 shadow-md border border-primary/30 space-y-4 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-accent text-[9px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 fill-accent" />
            <span>{isEnglish ? 'Free Consular Audit' : 'Herramienta Gratuita'}</span>
          </div>
          <h4 className="text-sm font-display font-black text-white leading-snug">
            {isEnglish
              ? 'Are you unsure if your insurance meets Extranjería criteria?'
              : '¿Dudas si tu seguro cumple los requisitos consulares?'}
          </h4>
          <p className="text-caption text-slate-200 leading-relaxed">
            {isEnglish
              ? 'Audit your policy in 30 seconds to prevent rejection at BLS or Spanish consulates.'
              : 'Audita tu certificado en 30 segundos y confirma el 100% de cumplimiento para tu visado.'}
          </p>
          <Link to="/validador-visado/" className="block pt-1">
            <Button
              variant="accent"
              size="sm"
              className="w-full font-black text-xs shadow-sm shadow-accent/20"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {isEnglish ? 'Audit my policy now' : 'Validar seguro gratis'}
            </Button>
          </Link>
        </div>
      </div>

      {/* 4. Atención Humana WhatsApp */}
      <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-3xl p-5 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-emerald-950">
            {isEnglish ? 'Personalized Advice' : '¿Prefieres hablar con un asesor?'}
          </p>
          <span className="text-[11px] text-emerald-800 font-medium block">
            {isEnglish ? 'Instant response on WhatsApp' : 'Respuesta inmediata sin compromiso'}
          </span>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2.5 bg-whatsapp-dark hover:bg-whatsapp text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
          aria-label={isEnglish ? 'Consult via WhatsApp' : 'Consultar por WhatsApp'}
        >
          <WhatsAppIcon size={16} />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Trigger Button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-xs font-bold text-text-main cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <span>{isEnglish ? 'Filter Guides by Profile & Topics' : 'Filtrar guías por perfil y temas'}</span>
          </div>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-black">
              {isEnglish ? 'Active' : 'Activo'}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Modal Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-6 z-10 border-t border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-display font-black text-text-main flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <span>{isEnglish ? 'Filters & Knowledge Hub' : 'Filtros y Hub de Guías'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-text-main hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {content}

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold"
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                {isEnglish ? 'Apply Filters' : 'Ver resultados filtrados'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block space-y-6 sticky top-28">
        {content}
      </aside>
    </>
  );
};

export default BlogSidebarFilters;
