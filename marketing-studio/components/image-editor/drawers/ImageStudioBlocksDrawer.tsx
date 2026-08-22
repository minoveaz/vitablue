import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleDollarSign,
  FileText,
  HeartHandshake,
  MessageCircle,
  Plus,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { ImageBlockType } from '../../../types/imageStudio';
import {
  BLOCK_CATALOGS,
  BLOCK_SCOPE_OPTIONS,
  BlockPreviewVariant,
  BlockScope,
} from '../../../data/blockCatalog';

export interface ImageStudioBlocksDrawerProps {
  onAddBlock: (blockType: ImageBlockType) => void;
}

const PreviewBar = ({ className = '' }: { className?: string }) => (
  <span className={`block h-1.5 rounded-full bg-white/20 ${className}`} />
);

const BlockPreview: React.FC<{
  variant: BlockPreviewVariant;
  label: string;
}> = ({ variant, label }) => {
  switch (variant) {
    case 'hero':
      return (
        <div className="relative flex min-h-28 flex-col justify-between overflow-hidden rounded-xl border border-brand-cyan/20 bg-gradient-to-br from-primary via-primary-dark to-slate-950 p-3">
          <div className="absolute -right-8 -top-10 size-28 rounded-full bg-brand-cyan/20 blur-2xl" />
          <div className="relative space-y-2">
            <span className="inline-flex rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-brand-cyan">
              {label}
            </span>
            <PreviewBar className="w-3/4 bg-white/90" />
            <PreviewBar className="w-1/2 bg-white/40" />
          </div>
          <span className="relative flex w-fit items-center gap-1 rounded-md bg-accent px-2 py-1 text-[8px] font-black text-primary-dark">
            Empezar <ArrowRight className="size-2.5" />
          </span>
        </div>
      );
    case 'grid':
      return (
        <div className="min-h-28 rounded-xl border border-slate-700/80 bg-slate-950 p-3">
          <div className="mb-3 flex items-center justify-between">
            <PreviewBar className="w-2/5 bg-white/80" />
            <Sparkles className="size-3 text-brand-cyan" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-2 rounded-lg border border-primary/50 bg-primary/20 p-2">
                <span className="block size-4 rounded-md bg-brand-cyan/70" />
                <PreviewBar className="w-full" />
                <PreviewBar className="w-3/4 bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      );
    case 'steps':
      return (
        <div className="min-h-28 rounded-xl border border-slate-700/80 bg-slate-950 p-3">
          <div className="mb-3 flex items-center gap-2">
            <PreviewBar className="w-2/5 bg-white/80" />
            <span className="rounded bg-brand-cyan/20 px-1.5 py-0.5 text-[8px] text-brand-cyan">{label}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {['01', '02', '03'].map((step, index) => (
              <div key={step} className="relative space-y-2 rounded-lg bg-slate-900 p-2">
                <span className={`flex size-5 items-center justify-center rounded-full text-[8px] font-black ${index === 1 ? 'bg-accent text-primary-dark' : 'bg-primary text-brand-cyan'}`}>
                  {step}
                </span>
                <PreviewBar className="w-full" />
                <PreviewBar className="w-2/3 bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      );
    case 'testimonial':
      return (
        <div className="min-h-28 rounded-xl border border-brand-cyan/20 bg-gradient-to-br from-slate-900 to-primary-dark p-3">
          <div className="flex items-start justify-between">
            <Quote className="size-5 text-accent" />
            <span className="text-[10px] tracking-widest text-accent">★★★★★</span>
          </div>
          <div className="mt-3 space-y-2">
            <PreviewBar className="w-full bg-white/70" />
            <PreviewBar className="w-4/5 bg-white/30" />
            <span className="flex items-center gap-1.5 pt-1 text-[8px] font-semibold text-brand-cyan">
              <span className="size-3 rounded-full bg-brand-cyan/60" /> {label}
            </span>
          </div>
        </div>
      );
    case 'comparison':
      return (
        <div className="min-h-28 rounded-xl border border-slate-700/80 bg-slate-950 p-3">
          <div className="mb-3 flex items-center justify-between">
            <PreviewBar className="w-2/5 bg-white/80" />
            <span className="text-[8px] text-slate-500">{label}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2 rounded-lg border border-slate-700 bg-slate-900 p-2">
              <PreviewBar className="w-3/5" />
              <PreviewBar className="w-full bg-white/10" />
              <PreviewBar className="w-4/5 bg-white/10" />
            </div>
            <div className="space-y-2 rounded-lg border border-brand-cyan/50 bg-primary/20 p-2">
              <PreviewBar className="w-3/5 bg-brand-cyan/80" />
              <span className="flex size-4 items-center justify-center rounded-full bg-brand-cyan text-primary-dark">
                <Check className="size-2.5" />
              </span>
              <PreviewBar className="w-4/5 bg-brand-cyan/30" />
            </div>
          </div>
        </div>
      );
    case 'legal':
      return (
        <div className="min-h-28 rounded-xl border border-slate-700/80 bg-slate-950 p-3">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="size-4 text-brand-cyan" />
            <PreviewBar className="w-2/5 bg-white/80" />
          </div>
          <div className="space-y-2 rounded-lg bg-slate-900 p-2.5">
            <PreviewBar className="w-full bg-white/50" />
            <PreviewBar className="w-full bg-white/15" />
            <PreviewBar className="w-3/4 bg-white/15" />
          </div>
          <span className="mt-2 block text-[8px] text-slate-500">{label}</span>
        </div>
      );
    case 'metric':
      return (
        <div className="relative min-h-28 overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-br from-accent/20 via-slate-900 to-slate-950 p-3">
          <CircleDollarSign className="absolute -right-1 -top-2 size-16 text-accent/15" />
          <span className="relative text-[8px] font-bold uppercase tracking-wider text-accent">{label}</span>
          <strong className="relative mt-3 block text-2xl font-black text-white">-30%</strong>
          <PreviewBar className="relative mt-1 w-2/3 bg-white/30" />
          <span className="relative mt-3 inline-flex rounded-md bg-accent px-2 py-1 text-[8px] font-black text-primary-dark">Calcular ahorro</span>
        </div>
      );
    case 'trust':
      return (
        <div className="flex min-h-28 items-center gap-3 rounded-xl border border-brand-cyan/30 bg-primary/20 p-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-brand-cyan/40 bg-brand-cyan/10">
            <ShieldCheck className="size-6 text-brand-cyan" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <PreviewBar className="w-3/4 bg-white/80" />
            <PreviewBar className="w-full bg-white/20" />
            <span className="block text-[8px] font-semibold text-brand-cyan">{label}</span>
          </div>
        </div>
      );
    case 'advisor':
      return (
        <div className="flex min-h-28 items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-950 p-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-brand-cyan/50 bg-primary">
            <Users className="size-5 text-brand-cyan" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <span className="flex items-center gap-1 text-[8px] font-bold text-brand-cyan">
              <MessageCircle className="size-2.5" /> {label}
            </span>
            <PreviewBar className="w-full bg-white/60" />
            <span className="inline-flex rounded-md bg-accent px-2 py-1 text-[8px] font-black text-primary-dark">Contactar</span>
          </div>
        </div>
      );
    case 'providers':
      return (
        <div className="min-h-28 rounded-xl border border-slate-700/80 bg-slate-950 p-3">
          <div className="mb-3 flex items-center gap-2">
            <BadgeCheck className="size-4 text-brand-cyan" />
            <PreviewBar className="w-2/5 bg-white/80" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['SALUD', 'NEXO', 'PLUS', 'VIDA'].map((provider) => (
              <span key={provider} className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[8px] font-bold text-slate-300">
                {provider}
              </span>
            ))}
          </div>
          <span className="mt-3 block text-[8px] text-slate-500">{label}</span>
        </div>
      );
    default:
      return null;
  }
};

export const ImageStudioBlocksDrawer: React.FC<ImageStudioBlocksDrawerProps> = ({
  onAddBlock,
}) => {
  const [scope, setScope] = useState<BlockScope>('system');
  const [category, setCategory] = useState('all');

  const catalog = scope === 'user' ? [] : BLOCK_CATALOGS[scope];
  const categories = useMemo(
    () => ['all', ...new Set(catalog.map((block) => block.category))],
    [catalog],
  );
  const visibleBlocks = useMemo(
    () => catalog.filter((block) => category === 'all' || block.category === category),
    [catalog, category],
  );

  const handleScopeChange = (nextScope: BlockScope) => {
    setScope(nextScope);
    setCategory('all');
  };

  return (
    <div className="flex h-full flex-col text-white select-none">
      <div className="shrink-0 space-y-3 border-b border-slate-800/80 bg-slate-950 p-3.5">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="size-4 text-brand-cyan" />
            <h2 className="text-sm font-bold text-slate-100">Bloques visuales</h2>
          </div>
          <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
            Inserta una composición y personalízala en el lienzo.
          </p>
        </div>
        <nav aria-label="Bibliotecas de bloques" className="grid grid-cols-3 gap-1.5">
          {BLOCK_SCOPE_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={scope === id}
              onClick={() => handleScopeChange(id)}
              className={`min-h-9 rounded-lg border px-2 text-[11px] font-semibold transition-colors ${
                scope === id
                  ? 'border-brand-cyan/60 bg-primary/50 text-brand-cyan'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        {scope !== 'user' && (
          <div className="flex flex-wrap gap-1.5">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`rounded-md border px-2 py-1 text-[9px] transition-colors ${
                  category === item
                    ? 'border-brand-cyan/50 bg-brand-cyan/10 text-brand-cyan'
                    : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {item === 'all' ? 'Todos' : item}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-950/40 p-3.5 custom-scrollbar">
        {scope === 'user' ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl border border-brand-cyan/25 bg-brand-cyan/10">
              <HeartHandshake className="size-6 text-brand-cyan" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">Aún no tienes bloques guardados</h3>
            <p className="mt-1.5 max-w-xs text-[11px] leading-relaxed text-slate-400">
              Guarda una composición del lienzo para reutilizarla desde Míos.
            </p>
          </div>
        ) : (
          visibleBlocks.map((block) => (
            <button
              key={block.id}
              type="button"
              onClick={() => onAddBlock(block.type)}
              className="group w-full rounded-2xl border border-slate-800/90 bg-slate-900/70 p-3.5 text-left transition-all hover:border-brand-cyan/60 hover:bg-slate-900 hover:shadow-lg"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="block truncate text-xs font-bold text-slate-200 transition-colors group-hover:text-brand-cyan">
                    {block.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-500">{block.description}</span>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-2 py-1 text-[9px] font-black text-brand-cyan">
                  <Plus className="size-3" /> Insertar
                </span>
              </div>
              <BlockPreview variant={block.preview} label={block.previewLabel} />
            </button>
          ))
        )}
      </div>
    </div>
  );
};
