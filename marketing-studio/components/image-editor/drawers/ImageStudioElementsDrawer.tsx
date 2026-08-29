import React, { useMemo, useState } from 'react';
import {
  Badge,
  CheckCircle2,
  Clock3,
  Component,
  Frame,
  FolderHeart,
  Layers,
  LockKeyhole,
  MousePointerClick,
  Palette,
  Plus,
  Search,
  Shapes,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  ELEMENT_CATALOG_CATEGORIES,
  ELEMENT_CATALOG_RESOURCES,
  filterElementCatalog,
  StaticElementCatalogPayload,
} from '../../../data/elementCatalog';
import {
  ElementCatalogCategoryId,
  ElementCatalogResource,
  ElementResourceScope,
  ElementStudioFormat,
} from '../../../types/elementCatalog';
import { ImageBlockType, ImageLayer } from '../../../types/imageStudio';
import {
  getSavedCustomElements,
  SavedCustomElement,
} from '../../../utils/savedElementsStorage';
import { ElementResourcePreview } from '../blocks/ElementResourcePreview';

export interface ImageStudioElementsDrawerProps {
  onAddBlock: (blockType: ImageBlockType, defaultProps?: Record<string, unknown>) => void;
  onAddImageLayer?: (imageUrl: string, options?: { title?: string }) => void;
  onInsertSavedLayer?: (layer: ImageLayer) => void;
}

type DrawerPayload =
  | StaticElementCatalogPayload
  | { source: 'saved'; saved: SavedCustomElement };

type DrawerResource = ElementCatalogResource<DrawerPayload>;
type CatalogSelection = ElementCatalogCategoryId | 'all';
type FormatFilter = ElementStudioFormat | 'all';
type StateFilter = 'all' | 'approved' | 'locked';

const CATEGORY_ICONS: Record<ElementCatalogCategoryId, React.ComponentType<{ className?: string }>> = {
  forms_lines: Shapes,
  icons_symbols: Sparkles,
  frames_masks: Frame,
  illustrations: Palette,
  backgrounds_surfaces: Layers,
  badges_labels: Badge,
  buttons_ctas: MousePointerClick,
  reusable_components: Component,
  saved_elements: FolderHeart,
};

const SCOPE_LABELS: Record<ElementResourceScope, string> = {
  system: 'Sistema',
  organization: 'Organización',
  workspace: 'Workspace',
  user: 'Usuario',
};

function normalizeSavedElement(saved: SavedCustomElement): DrawerResource {
  const metadata = saved.catalogMetadata;
  return {
    id: saved.id,
    title: saved.title,
    description: 'Elemento guardado en tu biblioteca personal',
    resourceType: saved.category === 'group' ? 'Grupo' : saved.category === 'card' ? 'Componente' : 'Elemento',
    kind: metadata?.kind ?? 'saved_element',
    category: metadata?.category ?? 'saved_elements',
    scope: metadata?.scope ?? 'user',
    organizationId: metadata?.organizationId,
    brandId: metadata?.brandId,
    tags: metadata?.tags ?? [saved.category, 'guardado'],
    license: metadata?.license ?? {
      id: 'user-created',
      label: 'Creado por ti',
      allowsCommercialUse: true,
      requiresAttribution: false,
    },
    editableFields: metadata?.editableFields ?? ['*'],
    lockedFields: metadata?.lockedFields ?? [],
    supportedFormats: metadata?.supportedFormats ?? ['image', 'video'],
    version: metadata?.version ?? 1,
    approvalStatus: metadata?.approvalStatus ?? 'not_required',
    locked: metadata?.locked ?? false,
    recommended: metadata?.recommended,
    sourcePackage: metadata?.sourcePackage ?? 'user',
    preview: { renderer: 'saved' },
    payload: { source: 'saved', saved },
  };
}

const ResourceCard: React.FC<{
  resource: DrawerResource;
  onInsert: (resource: DrawerResource) => void;
}> = ({ resource, onInsert }) => {
  const approvedLabel = resource.approvalStatus === 'approved'
    ? 'Aprobado'
    : resource.approvalStatus === 'not_required'
      ? 'Sin revisión'
      : resource.approvalStatus === 'pending'
        ? 'Pendiente'
        : 'Rechazado';

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900">
      <div className="flex h-28 items-center justify-center overflow-hidden bg-primary-dark p-3">
        <ElementResourcePreview resource={resource} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-w-0">
          <h3 className="truncate text-xs font-semibold text-slate-100" title={resource.title}>{resource.title}</h3>
          <p className="mt-0.5 truncate text-[10px] text-slate-400">{resource.resourceType}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[9px] font-medium text-slate-300">
            {SCOPE_LABELS[resource.scope]}
          </span>
          {resource.supportedFormats.map((format) => (
            <span key={format} className="rounded-md bg-primary/30 px-1.5 py-0.5 text-[9px] font-medium text-brand-cyan">
              {format === 'image' ? 'Image' : 'Video'}
            </span>
          ))}
        </div>
        <div className="space-y-1 text-[9px] text-slate-400">
          <div className="flex items-center gap-1 truncate" title={resource.license.label}>
            <ShieldCheck className="size-3 shrink-0" />
            <span className="truncate">{resource.license.label}</span>
          </div>
          <div className="flex items-center gap-1">
            {resource.locked ? <LockKeyhole className="size-3 text-amber-300" /> : <CheckCircle2 className="size-3 text-emerald-400" />}
            <span>{resource.locked ? 'Bloqueado' : approvedLabel}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onInsert(resource)}
          disabled={resource.locked}
          className="mt-auto flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resource.locked ? <LockKeyhole className="size-3.5" /> : <Plus className="size-3.5" />}
          {resource.locked ? 'Bloqueado' : 'Insertar'}
        </button>
      </div>
    </article>
  );
};

export const ImageStudioElementsDrawer: React.FC<ImageStudioElementsDrawerProps> = ({
  onAddBlock,
  onAddImageLayer,
  onInsertSavedLayer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CatalogSelection>('all');
  const [selectedScope, setSelectedScope] = useState<ElementResourceScope>('system');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');
  const [stateFilter, setStateFilter] = useState<StateFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentIds, setRecentIds] = useState<string[]>([
    'system-shape-circle',
    'system-shape-rounded-rect',
    'system-line-solid',
  ]);

  const savedElements = useMemo(
    () => getSavedCustomElements().filter((element) => element.category !== 'text'),
    [],
  );

  const resources = useMemo<DrawerResource[]>(() => [
    ...ELEMENT_CATALOG_RESOURCES,
    ...savedElements.map(normalizeSavedElement),
  ], [savedElements]);

  const secondaryFilteredResources = useMemo(
    () => filterElementCatalog(resources, {
      scope: selectedScope,
      format: formatFilter,
      state: stateFilter,
    }),
    [resources, selectedScope, formatFilter, stateFilter],
  );

  const visibleResources = useMemo(
    () => filterElementCatalog(secondaryFilteredResources, {
      query: searchQuery,
      category: searchQuery.trim() ? 'all' : selectedCategory,
    }),
    [secondaryFilteredResources, searchQuery, selectedCategory],
  );

  const categoryCounts = useMemo(() => new Map(
    ELEMENT_CATALOG_CATEGORIES.map((category) => [
      category.id,
      secondaryFilteredResources.filter((resource) => resource.category === category.id).length,
    ]),
  ), [secondaryFilteredResources]);

  const recentResources = useMemo(
    () => recentIds
      .map((id) => secondaryFilteredResources.find((resource) => resource.id === id))
      .filter((resource): resource is DrawerResource => Boolean(resource)),
    [recentIds, secondaryFilteredResources],
  );

  const recommendedResources = useMemo(
    () => secondaryFilteredResources.filter((resource) => resource.recommended && !resource.locked).slice(0, 4),
    [secondaryFilteredResources],
  );

  const handleInsert = (resource: DrawerResource) => {
    if (resource.locked) return;
    const payload = resource.payload;
    if (payload.source === 'shape') {
      const item = payload.item;
      onAddBlock('GeometricShape', {
        shapeType: item.shapeType,
        fill: item.defaultFill ?? '#005F73',
        stroke: item.defaultStroke ?? 'transparent',
        strokeWidth: item.defaultStrokeWidth ?? 0,
        borderRadius: item.defaultBorderRadius ?? (item.shapeType === 'rounded_rect' ? 24 : 0),
        sides: item.defaultSides,
        points: item.defaultPoints,
        innerRadius: item.defaultInnerRadius,
        ringRadius: item.defaultRingRadius,
        ringThickness: item.defaultRingThickness,
        arcStartAngle: item.defaultArcStartAngle,
        arcEndAngle: item.defaultArcEndAngle,
        waveStartY: item.defaultWaveStartY,
        waveEndY: item.defaultWaveEndY,
        waveAmplitude: item.defaultWaveAmplitude,
        waveCycles: item.defaultWaveCycles,
        waveAnchor: item.defaultWaveAnchor,
        wavePath: item.defaultWavePath,
        vectorGeometry: item.defaultVectorGeometry,
        width: item.defaultWidth,
        height: item.defaultHeight,
      });
    } else if (payload.source === 'icon') {
      onAddBlock('GeometricShape', {
        shapeType: `icon-${payload.item.iconId}`,
        fill: 'transparent',
        stroke: 'currentColor',
        strokeWidth: 2,
        width: 160,
        height: 160,
      });
    } else if (payload.source === 'preset') {
      onAddBlock(payload.preset.blockType, payload.preset.defaultProps);
    } else if (payload.source === 'universal') {
      onAddBlock(payload.blockType, payload.defaultProps);
    } else if (payload.source === 'external') {
      onAddImageLayer?.(payload.imageUrl, { title: resource.title });
    } else {
      onInsertSavedLayer?.(payload.saved.layer);
    }
    setRecentIds((current) => [resource.id, ...current.filter((id) => id !== resource.id)].slice(0, 6));
  };

  const showDiscovery = !searchQuery.trim() && selectedCategory === 'all';

  return (
    <div className="flex h-full flex-col bg-primary-dark text-slate-100">
      <div className="shrink-0 space-y-3 border-b border-slate-800 bg-primary-dark p-3">
        <label className="relative block">
          <span className="sr-only">Buscar elementos</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Buscar en todos los elementos"
            className="min-h-10 w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-9 text-xs text-slate-100 placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
            >
              <X className="size-4" />
            </button>
          )}
        </label>

        <nav aria-label="Bibliotecas de elementos" className="grid grid-cols-3 gap-1.5">
          {([
            ['system', 'Universal'],
            ['organization', 'Empresa'],
            ['user', 'Míos'],
          ] as Array<[ElementResourceScope, string]>).map(([scope, label]) => {
            const active = selectedScope === scope;
            return (
              <button
                key={scope}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setSelectedScope(scope);
                  setSelectedCategory(scope === 'user' ? 'saved_elements' : 'all');
                }}
                className={`min-h-9 rounded-lg border px-2 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
                  active
                    ? 'border-brand-cyan/60 bg-primary/50 text-brand-cyan'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        <div className="flex flex-wrap gap-1.5" aria-label="Filtros secundarios">
          {([
            ['all', 'Todos'],
            ['image', 'Image'],
            ['video', 'Video'],
          ] as Array<[FormatFilter, string]>).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFormatFilter(id)}
              aria-pressed={formatFilter === id}
              className={`min-h-7 rounded-full border px-2.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
                formatFilter === id
                  ? 'border-brand-cyan/60 bg-primary/50 text-brand-cyan'
                  : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
          {([
            ['approved', 'Aprobados'],
            ['locked', 'Bloqueados'],
          ] as Array<[Exclude<StateFilter, 'all'>, string]>).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setStateFilter((current) => current === id ? 'all' : id)}
              aria-pressed={stateFilter === id}
              className={`min-h-7 rounded-full border px-2.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
                stateFilter === id
                  ? 'border-accent/60 bg-accent/15 text-amber-200'
                  : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-3">
        <nav aria-label="Categorías de elementos" className="space-y-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            aria-current={selectedCategory === 'all' ? 'page' : undefined}
            className={`flex min-h-10 w-full items-center justify-between rounded-lg border px-3 text-left text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
              selectedCategory === 'all'
                ? 'border-brand-cyan/50 bg-primary/40 text-brand-cyan'
                : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-600'
            }`}
          >
            <span className="flex items-center gap-2"><Sparkles className="size-4" /> Explorar todo</span>
            <span className="text-[10px] text-slate-400">{secondaryFilteredResources.length}</span>
          </button>
          <div className="grid grid-cols-2 gap-2">
            {ELEMENT_CATALOG_CATEGORIES
              .filter((category) => (categoryCounts.get(category.id) ?? 0) > 0)
              .map((category) => {
                const Icon = CATEGORY_ICONS[category.id];
                const active = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    aria-current={active ? 'page' : undefined}
                    title={category.description}
                    className={`flex min-h-16 min-w-0 flex-col justify-between rounded-lg border p-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
                      active
                        ? 'border-brand-cyan/50 bg-primary/40 text-brand-cyan'
                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex w-full items-center justify-between gap-2">
                      <Icon className="size-4 shrink-0" />
                      <span className="text-[9px] text-slate-500">{categoryCounts.get(category.id) ?? 0}</span>
                    </span>
                    <span className="truncate text-[10px] font-semibold">{category.shortLabel}</span>
                  </button>
                );
              })}
          </div>
        </nav>

        {showDiscovery && recentResources.length > 0 && (
          <section className="space-y-2" aria-labelledby="recent-elements">
            <h2 id="recent-elements" className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Clock3 className="size-3.5 text-slate-400" /> Recientes
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {recentResources.slice(0, 4).map((resource) => (
                <ResourceCard key={`recent-${resource.id}`} resource={resource} onInsert={handleInsert} />
              ))}
            </div>
          </section>
        )}

        {showDiscovery && recommendedResources.length > 0 && (
          <section className="space-y-2" aria-labelledby="recommended-elements">
            <h2 id="recommended-elements" className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Sparkles className="size-3.5 text-accent" /> Recomendados
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {recommendedResources.map((resource) => (
                <ResourceCard key={`recommended-${resource.id}`} resource={resource} onInsert={handleInsert} />
              ))}
            </div>
          </section>
        )}

        {showDiscovery && (
          <section className="space-y-2" aria-labelledby="all-elements">
            <div className="flex items-end justify-between gap-3">
              <h2 id="all-elements" className="text-xs font-semibold text-slate-100">Todos los recursos</h2>
              <span className="text-[10px] text-slate-500">{visibleResources.length} recursos</span>
            </div>
            {visibleResources.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {visibleResources.map((resource) => (
                  <ResourceCard key={`all-${resource.id}`} resource={resource} onInsert={handleInsert} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-700 px-4 py-8 text-center">
                <Search className="mx-auto size-6 text-slate-500" />
                <p className="mt-2 text-xs font-semibold text-slate-300">No hay recursos disponibles</p>
                <p className="mt-1 text-[10px] text-slate-500">Prueba otra biblioteca, compatibilidad o estado.</p>
              </div>
            )}
          </section>
        )}

        {!showDiscovery && (
          <section className="space-y-2" aria-live="polite">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-xs font-semibold text-slate-100">
                  {searchQuery.trim()
                    ? `Resultados para “${searchQuery.trim()}”`
                    : ELEMENT_CATALOG_CATEGORIES.find((category) => category.id === selectedCategory)?.label}
                </h2>
                {!searchQuery.trim() && (
                  <p className="mt-0.5 truncate text-[10px] text-slate-400">
                    {ELEMENT_CATALOG_CATEGORIES.find((category) => category.id === selectedCategory)?.description}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-[10px] text-slate-500">{visibleResources.length} recursos</span>
            </div>
            {visibleResources.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {visibleResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} onInsert={handleInsert} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-700 px-4 py-8 text-center">
                <Search className="mx-auto size-6 text-slate-500" />
                <p className="mt-2 text-xs font-semibold text-slate-300">No hay recursos con estos filtros</p>
                <p className="mt-1 text-[10px] text-slate-500">Cambia la biblioteca, la compatibilidad o la categoría.</p>
              </div>
            )}
          </section>
        )}

        {showDiscovery && (
          <div className="flex items-start gap-2 rounded-lg border border-slate-700 bg-slate-900 p-3 text-[10px] leading-relaxed text-slate-400">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-brand-cyan" />
            <p>Los recursos de Sistema son universales. Los de Organización permanecen aislados en su paquete y conservan sus reglas de marca.</p>
          </div>
        )}
      </div>
    </div>
  );
};
