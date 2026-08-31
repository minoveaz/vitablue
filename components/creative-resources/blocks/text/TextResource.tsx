import React, { useEffect, useState } from 'react';
import {
  BadgePercent,
  CheckSquare,
  Flame,
  FolderHeart,
  Layers,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Type,
  X,
} from 'lucide-react';
import { ResourceBlockShell } from '../../shared/ResourceBlockShell';
import type { CoreResourceData } from '../../shared/resourceData';
import { getCoreResourceData } from '../../shared/resourceData';
import type {
  TextResourceAdapter,
  TextResourceCategory,
  TextResourceItem,
  TextResourceProps,
} from './TextResource.contract';
import {
  TEXT_PRESETS,
  TEXT_PRESET_CATEGORIES,
  type TextPresetItem,
} from './textPresets';

const DEFAULT_CATEGORIES: readonly TextResourceCategory[] = TEXT_PRESET_CATEGORIES.map((category) => ({
  id: category.id,
  name: category.name,
  icon: category.icon,
}));

const getTextAdapter = (context: TextResourceProps['context']): TextResourceAdapter =>
  (context.extensions?.text as TextResourceAdapter | undefined) ?? {};

const normalizePreset = (item: TextResourceItem, index: number): TextPresetItem => {
  const title = item.title ?? item.label ?? `Texto ${index + 1}`;
  const previewText = item.previewText ?? item.preview ?? item.defaultText ?? title;
  return {
    id: item.id,
    category: (item.category as TextPresetItem['category'] | undefined) ?? 'basics',
    title,
    previewText,
    subText: item.subText ?? item.description,
    defaultText: item.defaultText ?? previewText,
    tag: item.tag ?? 'h2',
    fontSize: item.fontSize ?? 24,
    fontWeight: item.fontWeight ?? '600',
    fontFamily: item.fontFamily ?? 'Poppins, sans-serif',
    fill: item.fill ?? '#FFFFFF',
    align: item.align ?? 'center',
    letterSpacing: item.letterSpacing,
    lineHeight: item.lineHeight,
    textTransform: item.textTransform,
    textEffect: item.textEffect,
    boxColor: item.boxColor,
    scope: item.scope,
    customProps: item.customProps,
    payload: item.payload,
    disabled: item.disabled,
    locked: item.locked,
    disabledReason: item.disabledReason,
  };
};

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Type':
      return <Type aria-hidden="true" className="size-3.5 shrink-0" />;
    case 'Layers':
      return <Layers aria-hidden="true" className="size-3.5 shrink-0" />;
    case 'CheckSquare':
      return <CheckSquare aria-hidden="true" className="size-3.5 shrink-0" />;
    case 'Flame':
      return <Flame aria-hidden="true" className="size-3.5 shrink-0" />;
    case 'BadgePercent':
      return <BadgePercent aria-hidden="true" className="size-3.5 shrink-0" />;
    case 'MessageSquare':
      return <MessageSquare aria-hidden="true" className="size-3.5 shrink-0" />;
    case 'ShieldCheck':
      return <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0" />;
    case 'FolderHeart':
      return <FolderHeart aria-hidden="true" className="size-3.5 shrink-0" />;
    default:
      return <Sparkles aria-hidden="true" className="size-3.5 shrink-0" />;
  }
};

export const TextResource: React.FC<TextResourceProps> = ({ context, items = [], onInsert, slots }) => {
  const textAdapter = getTextAdapter(context);
  const data: CoreResourceData = getCoreResourceData(context.data);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScope, setSelectedScope] = useState<'system' | 'organization' | 'user'>('system');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setRefreshTick] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleStorageUpdate = () => setRefreshTick((previous) => previous + 1);
    window.addEventListener('vitablue_saved_elements_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('vitablue_saved_elements_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const presets = ((items.length ? items : textAdapter.getPresets?.() ?? data.items ?? TEXT_PRESETS) as readonly TextResourceItem[])
    .map(normalizePreset);
  const savedPresets = (textAdapter.getSavedPresets?.() ?? []).map(normalizePreset);
  const categories = data.categories?.map((category) => ({
    id: category.id,
    name: category.label,
    icon: category.id === 'all' ? 'Sparkles' : 'Type',
  })) ?? textAdapter.categories ?? DEFAULT_CATEGORIES;

  const scopedPresets = selectedScope === 'user'
    ? savedPresets
    : presets.filter((preset) => (preset.scope ?? 'organization') === selectedScope);
  const categoryCounts = new Map([
    ['all', scopedPresets.length],
    ...categories
      .filter((category) => category.id !== 'all')
      .map((category) => [
        category.id,
        scopedPresets.filter((preset) => preset.category === category.id).length,
      ] as const),
  ]);
  const query = searchQuery.trim().toLowerCase();
  const filteredPresets = scopedPresets.filter((preset) => {
    const matchesCategory = selectedScope === 'user'
      || selectedCategory === 'saved'
      || selectedCategory === 'all'
      || preset.category === selectedCategory;
    const matchesSearch = !query
      || preset.title.toLowerCase().includes(query)
      || preset.previewText.toLowerCase().includes(query)
      || preset.defaultText.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const canInsert = Boolean(onInsert || context.actions.insert);
  const insert = (preset: TextPresetItem) => {
    if (onInsert) {
      onInsert(preset);
      return;
    }
    context.actions.insert?.({
      kind: 'text',
      value: preset.payload ?? preset,
      role: preset.tag,
    } as never);
  };

  const handleAddQuickText = (tag: 'h1' | 'h2' | 'p') => {
    const quickText: Record<typeof tag, TextPresetItem> = {
      h1: {
        id: `custom-text-${Date.now()}`,
        title: 'Título Principal',
        category: 'basics',
        previewText: 'Añadir Título Grande',
        defaultText: 'Añadir Título Grande',
        tag: 'h1',
        fontSize: 56,
        fontWeight: '800',
        fontFamily: 'Arial, sans-serif',
        fill: '#F8FAFC',
        align: 'center',
      },
      h2: {
        id: `custom-text-${Date.now()}`,
        title: 'Subtítulo',
        category: 'basics',
        previewText: 'Añadir un subtítulo',
        defaultText: 'Añadir un subtítulo',
        tag: 'h2',
        fontSize: 42,
        fontWeight: '700',
        fontFamily: 'Arial, sans-serif',
        fill: '#E2E8F0',
        align: 'center',
      },
      p: {
        id: `custom-text-${Date.now()}`,
        title: 'Párrafo',
        category: 'basics',
        previewText: 'Añadir texto de cuerpo',
        defaultText: 'Añadir texto de cuerpo',
        tag: 'p',
        fontSize: 24,
        fontWeight: '400',
        fontFamily: 'Inter, sans-serif',
        fill: '#CBD5E1',
        align: 'center',
      },
    };
    insert(quickText[tag]);
  };

  return (
    <ResourceBlockShell
      context={context}
      slots={slots}
      resourceId="text"
      title="Texto"
      description="Presets de títulos, subtítulos, H3 y hooks"
      icon={Type}
    >
      <div className="flex h-full flex-col text-white select-none" data-core-resource-content="text">
        <div className="shrink-0 space-y-3 border-b border-slate-800/80 bg-slate-950 p-3.5">
          <button
            type="button"
            onClick={() => handleAddQuickText('h2')}
            disabled={!canInsert}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-teal-700 to-primary px-4 py-2.5 text-xs font-black text-white shadow-md shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus aria-hidden="true" className="size-4 stroke-[3]" />
            <span>Añadir un cuadro de texto</span>
          </button>

          <div className="grid grid-cols-3 gap-2">
            {([
              ['h1', 'Título', 'H1 · 56px', 'text-xs font-black text-slate-100'],
              ['h2', 'Subtítulo', 'H2 · 42px', 'text-xs font-bold text-brand-cyan'],
              ['p', 'Cuerpo', 'P · 24px', 'text-xs font-normal text-slate-300'],
            ] as const).map(([tag, label, metadata, labelClass]) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddQuickText(tag)}
                disabled={!canInsert}
                className="group flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 p-2 text-center transition-all hover:border-brand-cyan hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className={`${labelClass} truncate font-display group-hover:text-brand-cyan`}>{label}</span>
                <span className="font-mono text-[10px] text-slate-400">{metadata}</span>
              </button>
            ))}
          </div>

          <label className="relative flex items-center">
            <span className="sr-only">Buscar estilos de texto</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 size-3.5 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={data.searchPlaceholder ?? 'Buscar ganchos, precios, estilos...'}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 pl-8 pr-8 text-xs text-slate-200 placeholder:text-slate-500 transition-colors focus:border-brand-cyan focus:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/40"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 flex min-h-11 min-w-11 items-center justify-center p-0.5 text-slate-400 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
              >
                <X aria-hidden="true" className="size-3" />
              </button>
            )}
          </label>

          <nav aria-label="Bibliotecas de texto" className="grid grid-cols-3 gap-1.5">
            {([
              ['system', 'Universal'],
              ['organization', 'Empresa'],
              ['user', 'Míos'],
            ] as const).map(([scope, label]) => (
              <button
                key={scope}
                type="button"
                aria-pressed={selectedScope === scope}
                onClick={() => {
                  setSelectedScope(scope);
                  setSelectedCategory(scope === 'user' ? 'saved' : 'all');
                }}
                className={`min-h-9 rounded-lg border px-2 text-[11px] font-semibold transition-colors ${
                  selectedScope === scope
                    ? 'border-brand-cyan/60 bg-primary/50 text-brand-cyan'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-[#050B14]/40 p-3.5 custom-scrollbar">
          {selectedScope !== 'user' && (
            <nav aria-label="Categorías de texto" className="grid grid-cols-2 gap-2">
              {categories
                .filter((category) => (categoryCounts.get(category.id) ?? 0) > 0)
                .map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    aria-current={selectedCategory === category.id ? 'page' : undefined}
                    className={`flex min-h-14 flex-col justify-between rounded-lg border p-2.5 text-left ${
                      selectedCategory === category.id
                        ? 'border-brand-cyan/50 bg-primary/40 text-brand-cyan'
                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {getCategoryIcon(category.icon)}
                      <span className="text-[9px] text-slate-500">{categoryCounts.get(category.id) ?? 0}</span>
                    </span>
                    <span className="truncate text-[10px] font-semibold">{category.name}</span>
                  </button>
                ))}
            </nav>
          )}

          {filteredPresets.length === 0 ? (
            <div role="status" className="flex h-48 flex-col items-center justify-center p-4 text-center">
              <Search aria-hidden="true" className="mb-2 size-8 stroke-[1.5] text-slate-600" />
              <p className="text-xs font-semibold text-slate-300">{data.emptyTitle ?? 'No se encontraron estilos de texto'}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">{data.emptyDescription ?? 'Intenta con otra palabra clave o selecciona "Todos"'}</p>
            </div>
          ) : (
            filteredPresets.map((preset) => {
              const itemUnavailable = Boolean(preset.disabled || preset.locked);
              const unavailable = !canInsert || itemUnavailable;
              const onCardInsert = () => {
                if (!unavailable && !preset.disabled) insert(preset);
              };
              return (
                <article
                  key={preset.id}
                  role="button"
                  tabIndex={unavailable || preset.disabled ? -1 : 0}
                  aria-disabled={unavailable || preset.disabled}
                  onClick={onCardInsert}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onCardInsert();
                    }
                  }}
                  className={`group relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/70 p-3.5 transition-all ${
                    unavailable || preset.disabled
                      ? 'cursor-not-allowed opacity-60'
                      : 'cursor-pointer hover:border-brand-cyan/60 hover:bg-slate-900 hover:shadow-lg'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-xs font-bold text-slate-200 transition-colors group-hover:text-brand-cyan">{preset.title}</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] uppercase text-slate-400">{preset.tag}</span>
                    </div>
                    <button
                      type="button"
                      disabled={unavailable || preset.disabled}
                      title={unavailable ? (preset.disabledReason ?? 'No disponible en este estudio') : 'Insertar'}
                      onClick={(event) => {
                        event.stopPropagation();
                        onCardInsert();
                      }}
                      className="flex shrink-0 items-center gap-1 rounded-full border border-brand-cyan/40 bg-brand-cyan/20 px-2.5 py-0.5 text-[10px] font-black text-brand-cyan shadow-xs transition-all hover:bg-brand-cyan hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus aria-hidden="true" className="size-3" />
                      <span>{itemUnavailable ? 'No disponible' : 'Insertar'}</span>
                    </button>
                  </div>

                  <div className="flex min-h-[56px] items-center justify-center overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/80 p-3.5 text-center">
                    <div
                      style={{
                        fontFamily: preset.fontFamily,
                        fontSize: `${Math.min(18, preset.fontSize)}px`,
                        fontWeight: preset.fontWeight,
                        color: preset.fill,
                        textAlign: preset.align,
                        letterSpacing: `${preset.letterSpacing ?? 0}px`,
                        lineHeight: preset.lineHeight ?? 1.25,
                        textTransform: preset.textTransform ?? 'none',
                        backgroundColor: preset.textEffect === 'box' ? (preset.boxColor ?? '#EE9B00') : undefined,
                        padding: preset.textEffect === 'box' ? '4px 10px' : undefined,
                        borderRadius: preset.textEffect === 'box' ? '8px' : undefined,
                        textShadow: preset.textEffect === 'glow' ? '0 0 14px rgba(148, 210, 189, 0.9)' : undefined,
                      }}
                      className="w-full break-words whitespace-pre-line"
                    >
                      {preset.previewText}
                    </div>
                  </div>

                  {preset.subText && (
                    <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-slate-400">
                      <span>{preset.subText}</span>
                      <span className="font-sans text-[10px] text-slate-500">{preset.fontFamily.split(',')[0]}</span>
                    </div>
                  )}
                  {itemUnavailable && preset.disabledReason && (
                    <p className="mt-2 text-[9px] leading-relaxed text-amber-200/80">{preset.disabledReason}</p>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </ResourceBlockShell>
  );
};
