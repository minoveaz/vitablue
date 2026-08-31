import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  Layers,
  X,
  Circle,
  Square,
  Hexagon,
  Trash2,
} from 'lucide-react';
import { CURATED_STOCK_PHOTOS, STOCK_CATEGORIES } from '../../../../marketing-studio/data/stockPhotos';
import { ResourceBlockShell } from '../../shared/ResourceBlockShell';
import type { MediaResourceAdapter, MediaResourceAsset, MediaResourceProps, MediaClipShape } from './MediaResource.contract';

const getMediaAdapter = (context: MediaResourceProps['context']): MediaResourceAdapter =>
  (context.extensions?.media as MediaResourceAdapter | undefined) ?? {};

const defaultFileValidation = (file: File): string | undefined =>
  file.type.startsWith('image/')
    ? undefined
    : 'Por favor selecciona un archivo de imagen válido (PNG, JPG, WebP o SVG).';

export const MediaResource: React.FC<MediaResourceProps> = ({ context, items = [], onInsert, slots }) => {
  const media = getMediaAdapter(context);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScope, setSelectedScope] = useState<'system' | 'organization' | 'user'>('organization');
  const [selectedClipShape, setSelectedClipShape] = useState<MediaClipShape>('rounded-2xl');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [userMedia, setUserMedia] = useState<MediaResourceAsset[]>(() =>
    items
      .filter((item) => Boolean(item.src))
      .map((item) => ({ id: item.id, name: item.label, signedUrl: item.src ?? '' })),
  );
  const [isHydrating, setIsHydrating] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listMedia = media.list;

  useEffect(() => {
    let active = true;
    const refreshMedia = async () => {
      if (!listMedia) {
        setIsHydrating(false);
        return;
      }
      try {
        const assets = await listMedia();
        if (active) {
          setUserMedia(assets);
          setIsHydrating(false);
        }
      } catch {
        if (active) setIsHydrating(false);
      }
    };
    void refreshMedia();
    return () => {
      active = false;
    };
  }, [listMedia]);

  const categoryCounts = STOCK_CATEGORIES.reduce((counts, category) => {
    counts.set(
      category.id,
      category.id === 'all'
        ? CURATED_STOCK_PHOTOS.length
        : CURATED_STOCK_PHOTOS.filter((photo) => photo.category === category.id).length,
    );
    return counts;
  }, new Map<string, number>());

  const filteredPhotos = CURATED_STOCK_PHOTOS.filter((photo) => {
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;
    return matchesCategory && (
      photo.title.toLowerCase().includes(query) ||
      photo.categoryLabel.toLowerCase().includes(query) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const filteredUserMedia = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return userMedia;
    return userMedia.filter((asset) =>
      [asset.name, asset.storagePath ?? ''].some((value) => value.toLowerCase().includes(query)),
    );
  }, [searchQuery, userMedia]);

  const insert = (source: string, title?: string, kind?: MediaResourceAsset['kind']) => {
    if (media.insert) {
      media.insert(source, { title, clipShape: selectedClipShape, kind });
    } else if (onInsert) {
      onInsert({ id: `media-${Date.now()}`, label: title ?? source, src: source, kind });
    } else {
      context.actions.insert?.({ kind: 'media', value: source } as never);
    }
  };

  const insertUploadedImage = async (file: File) => {
    if (!media.upload) throw new Error('Storage remoto no disponible.');
    const result = await media.upload(file);
    setUploadError(null);
    setUserMedia((current) => [result, ...current.filter((item) => item.id !== result.id)]);
    insert(result.signedUrl, result.name, result.kind);
  };

  const readUploadedImage = (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const dataUrl = typeof event.target?.result === 'string' ? event.target.result : '';
        if (dataUrl) await insertUploadedImage(file);
        else setUploadError('No se pudo leer la imagen.');
      } catch {
        setUploadError('No se pudo guardar la imagen.');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      setUploadError('Error al leer la imagen seleccionada.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const validationError = media.validateFile?.(file) ?? defaultFileValidation(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }
    readUploadedImage(file);
  };

  const mediaCount = selectedScope === 'user' ? filteredUserMedia.length : filteredPhotos.length;

  return (
    <ResourceBlockShell
      context={context}
      slots={slots}
      resourceId="media"
      title="Medios"
      description="Imágenes, fotos y recursos visuales"
      icon={ImageIcon}
      showHeader={false}
    >
      <div className="flex h-full flex-col overflow-hidden bg-[#001219] font-sans text-slate-100 select-none" data-core-resource-content="media">
        <div data-resource-header className="shrink-0 space-y-3 border-b border-slate-800/80 bg-[#070e17] p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-teal-500/20 text-brand-cyan">
                <ImageIcon className="size-4" />
              </div>
              <div>
                <h3 className="font-display text-xs font-bold tracking-wide text-white">Medios</h3>
                <p className="text-[10px] text-slate-400">Imágenes, fotos y recursos visuales</p>
              </div>
            </div>
            <span className="rounded-md border border-brand-cyan/20 bg-brand-cyan/10 px-2 py-0.5 font-mono text-[10px] text-brand-cyan">
              {mediaCount} {selectedScope === 'user' ? 'recursos' : 'fotos'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-white shadow-md shadow-primary/25 transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan active:scale-[0.98]"
          >
            <UploadCloud className="size-4" />
            <span>Subir una imagen</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={(event) => handleFile(event.target.files?.[0])}
            accept={media.accept ?? 'image/png,image/jpeg,image/webp,image/svg+xml'}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              handleFile(event.dataTransfer.files?.[0]);
            }}
            className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/70 p-4 text-center transition-all hover:border-brand-cyan/60 hover:bg-slate-900/80"
          >
            <div className="mb-1.5 flex size-9 items-center justify-center rounded-xl bg-teal-500/10 text-brand-cyan transition-transform group-hover:scale-110">
              <UploadCloud className="size-5" />
            </div>
            <strong className="text-xs font-bold text-slate-200 transition-colors group-hover:text-brand-cyan">
              {isUploading ? 'Procesando imagen...' : 'Subir tu propia foto o logo'}
            </strong>
            <p className="mt-0.5 text-[10px] text-slate-400">Arrastra aquí o haz clic (PNG, JPG, WebP, SVG)</p>
            {uploadError && <p role="alert" className="mt-2 text-[10px] font-semibold text-rose-300">{uploadError}</p>}
          </div>

          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar estudiantes, médicos, visados, familias..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/90 py-2 pl-8.5 pr-8 text-xs text-white placeholder-slate-500 outline-none transition-all focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/30"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        <nav aria-label="Bibliotecas de medios" className="grid shrink-0 grid-cols-3 gap-1.5 border-b border-slate-800/80 bg-[#070e17] p-3">
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
                setSelectedCategory('all');
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

        <div className="flex shrink-0 flex-col gap-2 border-b border-slate-800/60 bg-[#070e17]/60 px-3.5 py-2.5 text-[11px]">
          <span className="flex items-center gap-1 font-semibold text-slate-400">
            <Layers className="size-3 text-brand-cyan" />
            <span>Forma al insertar:</span>
          </span>
          <div className="grid w-full grid-cols-2 gap-1.5 sm:grid-cols-4">
            {[
              { id: 'rounded-2xl', label: 'Suave', icon: <Square className="size-3 rounded-xs" /> },
              { id: 'circle', label: 'Círculo', icon: <Circle className="size-3" /> },
              { id: 'hexagon', label: 'Hexágono', icon: <Hexagon className="size-3" /> },
              { id: 'none', label: 'Recto', icon: <Square className="size-3" /> },
            ].map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => setSelectedClipShape(shape.id as MediaClipShape)}
                className={`flex min-h-8 items-center justify-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold transition-all ${
                  selectedClipShape === shape.id
                    ? 'bg-brand-cyan text-slate-950 shadow-xs'
                    : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {shape.icon}
                <span>{shape.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-3.5 custom-scrollbar">
          {selectedScope === 'organization' && (
            <nav aria-label="Categorías de medios" className="grid grid-cols-2 gap-2">
              {STOCK_CATEGORIES.map((category) => (
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
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[10px] font-semibold">{category.name}</span>
                    <span className="text-[9px] text-slate-500">{categoryCounts.get(category.id) ?? 0}</span>
                  </span>
                </button>
              ))}
            </nav>
          )}

          {selectedScope === 'user' ? (
            isHydrating ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-[10px] text-slate-500">Cargando tus medios…</div>
            ) : filteredUserMedia.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">
                <ImageIcon className="mx-auto mb-2 size-8 text-slate-600" />
                <h4 className="text-xs font-bold text-slate-300">Aún no tienes medios guardados</h4>
                <p className="mt-1 text-[10px] text-slate-500">Sube una imagen para verla aquí y reutilizarla.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {filteredUserMedia.map((asset) => (
                  <div key={asset.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1624] transition-all hover:border-brand-cyan/60 hover:shadow-lg">
                    <div className="relative h-32 w-full overflow-hidden bg-slate-950">
                      {asset.kind === 'video'
                        ? <video src={asset.signedUrl} aria-label={asset.name} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" muted />
                        : <img src={asset.signedUrl} alt={asset.name} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />}
                      <div className="absolute inset-0 flex flex-col justify-end gap-1.5 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button type="button" onClick={() => insert(asset.signedUrl, asset.name, asset.kind)} className="flex w-full items-center justify-center gap-1 rounded-lg bg-primary py-1.5 text-[11px] font-black text-white shadow-md transition-colors hover:bg-teal-600">
                          <Sparkles className="size-3 text-brand-cyan" />
                          <span>+ Añadir Capa</span>
                        </button>
                        {media.setBackground && <button type="button" onClick={() => media.setBackground?.(asset.signedUrl)} className="w-full rounded-lg border border-slate-700/80 bg-slate-900/90 py-1 text-[10px] font-bold text-slate-300 transition-colors hover:bg-slate-800">🖼️ Poner de fondo</button>}
                        {media.delete && (
                          <button type="button" onClick={() => void media.delete?.(asset).then(() => setUserMedia((current) => current.filter((item) => item.id !== asset.id))).catch((error) => setUploadError(error instanceof Error ? error.message : 'No se pudo eliminar el medio.'))} className="flex w-full items-center justify-center gap-1 rounded-lg border border-rose-900/70 bg-slate-900/90 py-1 text-[10px] font-bold text-rose-300 transition-colors hover:bg-rose-950/70">
                            <Trash2 className="size-3" />
                            <span>Eliminar de Míos</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-slate-800/80 bg-[#080e18] p-2">
                      <strong className="block truncate text-[11px] font-bold text-slate-200" title={asset.name}>{asset.name}</strong>
                      <span className="mt-0.5 block truncate text-[9px] text-slate-400">{asset.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : selectedScope === 'system' || filteredPhotos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">
              <ImageIcon className="mx-auto mb-2 size-8 text-slate-600" />
              <h4 className="text-xs font-bold text-slate-300">{selectedScope === 'system' ? 'No hay medios universales todavía' : 'No se encontraron fotos'}</h4>
              <p className="mt-1 text-[10px] text-slate-500">Prueba buscando con otros términos o cambia de categoría.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1624] transition-all hover:border-brand-cyan/60 hover:shadow-lg">
                  <div className="relative h-32 w-full overflow-hidden bg-slate-950">
                    <img src={photo.thumbnailUrl} alt={photo.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 flex flex-col justify-end gap-1.5 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button type="button" onClick={() => insert(photo.url, photo.title)} className="flex w-full items-center justify-center gap-1 rounded-lg bg-primary py-1.5 text-[11px] font-black text-white shadow-md transition-colors hover:bg-teal-600">
                        <Sparkles className="size-3 text-brand-cyan" />
                        <span>+ Añadir Capa</span>
                      </button>
                      {media.setBackground && <button type="button" onClick={() => media.setBackground?.(photo.url)} className="w-full rounded-lg border border-slate-700/80 bg-slate-900/90 py-1 text-[10px] font-bold text-slate-300 transition-colors hover:bg-slate-800">🖼️ Poner de fondo</button>}
                    </div>
                  </div>
                  <div className="border-t border-slate-800/80 bg-[#080e18] p-2">
                    <strong className="block truncate text-[11px] font-bold text-slate-200" title={photo.title}>{photo.title}</strong>
                    <div className="mt-0.5 flex items-center justify-between text-[9px] text-slate-400">
                      <span className="truncate">{photo.author}</span>
                      <span className="font-mono text-brand-cyan/80">HD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ResourceBlockShell>
  );
};
