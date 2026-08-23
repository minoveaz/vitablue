import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Heart,
  Loader2,
  RefreshCw,
  Sparkles,
  Trash2,
  WandSparkles,
} from 'lucide-react';
import { TextPresetItem } from '../../../data/textPresets';
import { ImageLayer } from '../../../types/imageStudio';
import {
  AiCopyProposal,
  AiCopyRequest,
} from '../../../types/aiCopy';
import { mockAiCopyProvider } from '../../../utils/aiCopyProvider';

type AiCopyTab = 'generate' | 'adapt' | 'variants' | 'mine';
type MineView = 'saved' | 'favorites' | 'recents';

interface AiCopyLibraryState {
  saved: AiCopyProposal[];
  favorites: string[];
  recents: AiCopyProposal[];
}

export interface ImageStudioAiCopyDrawerProps {
  selectedLayer?: ImageLayer | null;
  onAddTextLayer?: (preset: TextPresetItem) => void;
  onReplaceLayerContent?: (id: string, replacement: { text?: string }) => void;
}

const STORAGE_KEY = 'vitablue:marketing-studio:ai-copy';
const EMPTY_LIBRARY: AiCopyLibraryState = { saved: [], favorites: [], recents: [] };

const readLibrary = (): AiCopyLibraryState => {
  if (typeof window === 'undefined') return EMPTY_LIBRARY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_LIBRARY;
    const parsed = JSON.parse(raw) as Partial<AiCopyLibraryState>;
    return {
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      recents: Array.isArray(parsed.recents) ? parsed.recents : [],
    };
  } catch {
    return EMPTY_LIBRARY;
  }
};

const persistLibrary = (library: AiCopyLibraryState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  } catch {
    // Local storage is an optional convenience, never a blocker for editing.
  }
};

const selectOptions = {
  objective: [
    ['conversion', 'Convertir'],
    ['awareness', 'Dar a conocer'],
    ['education', 'Educar'],
    ['trust', 'Generar confianza'],
    ['retention', 'Fidelizar'],
  ],
  type: [
    ['hook', 'Gancho'],
    ['headline', 'Titular'],
    ['cta', 'CTA'],
    ['body', 'Texto'],
    ['script', 'Guion'],
  ],
  tone: [
    ['professional', 'Profesional'],
    ['warm', 'Cercano'],
    ['direct', 'Directo'],
    ['inspiring', 'Inspirador'],
    ['urgent', 'Urgente'],
  ],
  audience: [
    ['students', 'Estudiantes'],
    ['families', 'Familias'],
    ['digital-nomads', 'Nómadas digitales'],
    ['companies', 'Empresas'],
    ['expats', 'Personas extranjeras'],
  ],
  format: [
    ['short', 'Breve'],
    ['social', 'Red social'],
    ['story', 'Story / Reel'],
    ['carousel', 'Carrusel'],
    ['email', 'Email'],
  ],
} as const;

const defaultRequest: AiCopyRequest = {
  objective: 'conversion',
  type: 'hook',
  tone: 'warm',
  audience: 'expats',
  format: 'social',
  quantity: 3,
};

const proposalToPreset = (proposal: AiCopyProposal): TextPresetItem => ({
  id: `ai-copy-${proposal.id}`,
  category: proposal.request.type === 'cta' ? 'ctas' : proposal.request.type === 'hook' ? 'hooks' : 'basics',
  title: proposal.title,
  previewText: proposal.text,
  defaultText: proposal.text,
  tag: proposal.request.type === 'headline' || proposal.request.type === 'hook' ? 'h2' : 'p',
  fontSize: proposal.request.type === 'headline' || proposal.request.type === 'hook' ? 42 : 24,
  fontWeight: proposal.request.type === 'cta' ? '700' : '600',
  fontFamily: proposal.request.type === 'headline' || proposal.request.type === 'hook'
    ? 'Poppins, sans-serif'
    : 'Inter, sans-serif',
  fill: proposal.request.type === 'cta' ? '#EE9B00' : '#FFFFFF',
  align: 'center',
  customProps: { aiCopyProposalId: proposal.id, aiCopyProvider: proposal.isMock ? 'mock' : 'unknown' },
});

export const ImageStudioAiCopyDrawer: React.FC<ImageStudioAiCopyDrawerProps> = ({
  selectedLayer,
  onAddTextLayer,
  onReplaceLayerContent,
}) => {
  const [activeTab, setActiveTab] = useState<AiCopyTab>('generate');
  const [mineView, setMineView] = useState<MineView>('saved');
  const [request, setRequest] = useState<AiCopyRequest>(defaultRequest);
  const [proposals, setProposals] = useState<AiCopyProposal[]>([]);
  const [library, setLibrary] = useState<AiCopyLibraryState>(readLibrary);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insertedId, setInsertedId] = useState<string | null>(null);

  const selectedText = useMemo(() => {
    const value = selectedLayer?.props?.text;
    return typeof value === 'string' ? value : '';
  }, [selectedLayer]);

  const updateLibrary = (next: AiCopyLibraryState) => {
    setLibrary(next);
    persistLibrary(next);
  };

  const remember = (proposal: AiCopyProposal) => {
    const next = {
      ...library,
      recents: [proposal, ...library.recents.filter((item) => item.id !== proposal.id)].slice(0, 12),
    };
    updateLibrary(next);
  };

  const rememberMany = (nextProposals: AiCopyProposal[]) => {
    const next = {
      ...library,
      recents: [
        ...nextProposals,
        ...library.recents.filter((item) => !nextProposals.some((proposal) => proposal.id === item.id)),
      ].slice(0, 12),
    };
    updateLibrary(next);
  };

  const runGeneration = async (mode: 'generate' | 'adapt') => {
    setError(null);
    setIsLoading(true);
    setInsertedId(null);
    try {
      const next = mode === 'adapt'
        ? await mockAiCopyProvider.adapt(request, selectedText)
        : await mockAiCopyProvider.generate(request);
      setProposals(next);
      rememberMany(next);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo generar el copy.');
    } finally {
      setIsLoading(false);
    }
  };

  const insertProposal = (proposal: AiCopyProposal) => {
    if (!onAddTextLayer) return;
    onAddTextLayer(proposalToPreset(proposal));
    remember(proposal);
    setInsertedId(proposal.id);
  };

  const adaptProposal = (proposal: AiCopyProposal) => {
    if (!selectedLayer || !onReplaceLayerContent) return;
    onReplaceLayerContent(selectedLayer.id, { text: proposal.text });
    remember(proposal);
    setInsertedId(proposal.id);
  };

  const toggleSaved = (proposal: AiCopyProposal) => {
    const isSaved = library.saved.some((item) => item.id === proposal.id);
    updateLibrary({
      ...library,
      saved: isSaved
        ? library.saved.filter((item) => item.id !== proposal.id)
        : [proposal, ...library.saved.filter((item) => item.id !== proposal.id)],
    });
  };

  const toggleFavorite = (proposal: AiCopyProposal) => {
    const isFavorite = library.favorites.includes(proposal.id);
    updateLibrary({
      ...library,
      favorites: isFavorite
        ? library.favorites.filter((id) => id !== proposal.id)
        : [proposal.id, ...library.favorites],
    });
  };

  const clearMockState = () => {
    updateLibrary(EMPTY_LIBRARY);
    setProposals([]);
    setError(null);
  };

  const shownProposals = activeTab === 'mine'
    ? mineView === 'saved'
      ? library.saved
      : mineView === 'favorites'
        ? library.recents.filter((proposal) => library.favorites.includes(proposal.id))
        : library.recents
    : proposals;

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="border-b border-slate-800/80 p-4">
        <div className="mb-3 flex items-start gap-2">
          <div className="rounded-xl bg-amber-500/15 p-2 text-amber-300">
            <WandSparkles className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">Copys con IA</h2>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
              Propuestas mock en español, sin llamadas externas ni API key.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-900 p-1" role="tablist" aria-label="Herramientas de copy">
          {([
            ['generate', 'Generar', Sparkles],
            ['adapt', 'Adaptar', RefreshCw],
            ['variants', 'Variantes', Copy],
            ['mine', 'Míos', Bookmark],
          ] as const).map(([tab, label, Icon]) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-bold transition-colors ${
                activeTab === tab ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab !== 'mine' && (
        <div className="space-y-3 overflow-y-auto p-4">
          {activeTab === 'adapt' && (
            <div className={`rounded-xl border p-3 ${selectedText ? 'border-brand-cyan/30 bg-brand-cyan/10' : 'border-slate-800 bg-slate-900'}`}>
              <div className="mb-1 flex items-center gap-2 text-[11px] font-bold text-slate-300">
                <TypeIcon />
                Texto seleccionado
              </div>
              <p className="line-clamp-3 text-xs text-slate-400">
                {selectedText || 'Selecciona una capa de texto en el lienzo para adaptarla.'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {(['objective', 'type', 'tone', 'audience', 'format'] as const).map((key) => (
              <label key={key} className={key === 'format' ? 'col-span-2' : ''}>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {key === 'objective' ? 'Objetivo' : key === 'type' ? 'Tipo' : key === 'tone' ? 'Tono' : key === 'audience' ? 'Audiencia' : 'Formato'}
                </span>
                <span className="relative block">
                  <select
                    value={request[key]}
                    onChange={(event) => setRequest((current) => ({ ...current, [key]: event.target.value } as AiCopyRequest))}
                    className="w-full appearance-none rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-2 pr-7 text-xs text-slate-200 outline-none focus:border-brand-cyan"
                  >
                    {selectOptions[key].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-2.5 size-3.5 text-slate-500" />
                </span>
              </label>
            ))}
          </div>

          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Propuestas</span>
            <select
              value={request.quantity}
              onChange={(event) => setRequest((current) => ({ ...current, quantity: Number(event.target.value) }))}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-2 text-xs text-slate-200 outline-none focus:border-brand-cyan"
            >
              {[1, 2, 3, 4, 5].map((quantity) => <option key={quantity} value={quantity}>{quantity} propuestas</option>)}
            </select>
          </label>

          <button
            type="button"
            disabled={isLoading || (activeTab === 'adapt' && !selectedText)}
            onClick={() => runGeneration(activeTab === 'adapt' ? 'adapt' : 'generate')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-2.5 text-xs font-black text-primary-dark shadow-md shadow-amber-500/20 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : activeTab === 'adapt' ? <RefreshCw className="size-4" /> : <Sparkles className="size-4" />}
            {isLoading ? 'Creando propuestas…' : activeTab === 'adapt' ? 'Adaptar texto seleccionado' : activeTab === 'variants' ? 'Generar variantes' : 'Generar copy'}
          </button>

          {error && (
            <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
              {error}
            </div>
          )}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto border-t border-slate-800/80 p-4">
        {activeTab === 'mine' && (
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-white">Tus copys guardados</p>
              <p className="text-[10px] text-slate-500">{library.saved.length} guardados · {library.recents.length} recientes</p>
            </div>
            <button type="button" onClick={clearMockState} className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-red-300">
              <Trash2 className="size-3" /> Limpiar mock
            </button>
          </div>
        )}
        {activeTab === 'mine' && (
          <div className="mb-3 flex gap-1 rounded-lg bg-slate-900 p-1">
            {([
              ['saved', 'Guardados'],
              ['favorites', 'Favoritos'],
              ['recents', 'Recientes'],
            ] as const).map(([view, label]) => (
              <button
                key={view}
                type="button"
                onClick={() => setMineView(view)}
                className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-bold ${
                  mineView === view ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {activeTab !== 'mine' && proposals.length === 0 && !isLoading && (
          <div className="rounded-xl border border-dashed border-slate-800 p-5 text-center">
            <Clock3 className="mx-auto mb-2 size-5 text-slate-600" />
            <p className="text-xs font-bold text-slate-400">Tus propuestas aparecerán aquí</p>
            <p className="mt-1 text-[10px] text-slate-600">Ajusta los controles y genera varias opciones.</p>
          </div>
        )}

        {activeTab === 'mine' && shownProposals.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-800 p-5 text-center">
            <Bookmark className="mx-auto mb-2 size-5 text-slate-600" />
            <p className="text-xs font-bold text-slate-400">
              {mineView === 'favorites' ? 'Aún no tienes favoritos' : mineView === 'recents' ? 'Aún no tienes recientes' : 'Aún no tienes copys guardados'}
            </p>
          </div>
        )}

        <div className="space-y-2">
          {shownProposals.map((proposal) => {
            const isSaved = library.saved.some((item) => item.id === proposal.id);
            const isFavorite = library.favorites.includes(proposal.id);
            return (
              <article key={proposal.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wide text-brand-cyan">{proposal.title}</p>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-100">{proposal.text}</p>
                  </div>
                  {proposal.isMock && <span className="shrink-0 rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">MOCK</span>}
                </div>
                <p className="mb-2 text-[10px] leading-relaxed text-slate-500">{proposal.rationale}</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeTab === 'adapt' ? (
                    <button
                      type="button"
                      disabled={!selectedLayer || !onReplaceLayerContent}
                      onClick={() => adaptProposal(proposal)}
                      className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1.5 text-[10px] font-bold text-white disabled:opacity-40"
                    >
                      {insertedId === proposal.id ? <Check className="size-3" /> : <RefreshCw className="size-3" />}
                      {insertedId === proposal.id ? 'Aplicado' : 'Aplicar a capa'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!onAddTextLayer}
                      onClick={() => insertProposal(proposal)}
                      className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1.5 text-[10px] font-bold text-white disabled:opacity-40"
                    >
                      {insertedId === proposal.id ? <Check className="size-3" /> : <Copy className="size-3" />}
                      {insertedId === proposal.id ? 'Insertado' : 'Insertar capa'}
                    </button>
                  )}
                  <button type="button" onClick={() => toggleSaved(proposal)} className={`rounded-lg border px-2 py-1.5 text-[10px] font-bold ${isSaved ? 'border-brand-cyan/50 text-brand-cyan' : 'border-slate-700 text-slate-400 hover:text-white'}`}>
                    <Bookmark className="inline size-3" /> {isSaved ? 'Guardado' : 'Guardar'}
                  </button>
                  <button type="button" aria-label={isFavorite ? 'Quitar favorito' : 'Marcar favorito'} onClick={() => toggleFavorite(proposal)} className={`rounded-lg border px-2 py-1.5 ${isFavorite ? 'border-red-400/50 text-red-300' : 'border-slate-700 text-slate-400 hover:text-red-300'}`}>
                    <Heart className={`size-3 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TypeIcon = () => <Sparkles className="size-3.5 text-brand-cyan" />;
