import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import { CURATED_STOCK_PHOTOS, STOCK_CATEGORIES } from '../../../data/stockPhotos';

export interface ImageStudioMediaDrawerProps {
  onInsertImageLayer: (
    imageUrl: string,
    options?: {
      title?: string;
      width?: number;
      height?: number;
      clipShape?: 'none' | 'circle' | 'squircle' | 'rounded-2xl' | 'hexagon';
    }
  ) => void;
  onSetBackgroundImage?: (imageUrl: string) => void;
}

export const ImageStudioMediaDrawer: React.FC<ImageStudioMediaDrawerProps> = ({
  onInsertImageLayer,
  onSetBackgroundImage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScope, setSelectedScope] = useState<'system' | 'organization' | 'user'>('organization');
  const [selectedClipShape, setSelectedClipShape] = useState<'squircle' | 'circle' | 'rounded-2xl' | 'none' | 'hexagon'>('rounded-2xl');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryCounts = STOCK_CATEGORIES.reduce((counts, category) => {
    counts.set(
      category.id,
      category.id === 'all'
        ? CURATED_STOCK_PHOTOS.length
        : CURATED_STOCK_PHOTOS.filter((photo) => photo.category === category.id).length,
    );
    return counts;
  }, new Map<string, number>());

  // Filtrado de fotos
  const filteredPhotos = CURATED_STOCK_PHOTOS.filter((photo) => {
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesQuery =
      photo.title.toLowerCase().includes(q) ||
      photo.categoryLabel.toLowerCase().includes(q) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  });

  // Manejo de subida de archivos locales
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, WebP o SVG).');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onInsertImageLayer(dataUrl, {
          title: file.name.replace(/\.[^/.]+$/, ''),
          clipShape: selectedClipShape,
        });
      }
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      alert('Error al leer la imagen seleccionada.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          onInsertImageLayer(dataUrl, {
            title: file.name.replace(/\.[^/.]+$/, ''),
            clipShape: selectedClipShape,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#001219] text-slate-100 font-sans select-none overflow-hidden">
      {/* 1. HEADER & SEARCH */}
      <div className="p-3.5 border-b border-slate-800/80 bg-[#070e17] shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-teal-500/20 text-brand-cyan">
              <ImageIcon className="size-4" />
            </div>
            <div>
              <h3 className="font-display text-xs font-bold text-white tracking-wide">
                Medios
              </h3>
              <p className="text-[10px] text-slate-400">
                Imágenes, fotos y recursos visuales
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded-md border border-brand-cyan/20">
            {filteredPhotos.length} fotos
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
         onChange={handleFileUpload}
         accept="image/png,image/jpeg,image/webp,image/svg+xml"
         className="hidden"
        />

        <div
         onClick={() => fileInputRef.current?.click()}
         onDragOver={(e) => e.preventDefault()}
         onDrop={handleDrop}
         className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/70 p-4 text-center transition-all hover:border-brand-cyan/60 hover:bg-slate-900/80"
        >
         <div className="mb-1.5 flex size-9 items-center justify-center rounded-xl bg-teal-500/10 text-brand-cyan transition-transform group-hover:scale-110">
           <UploadCloud className="size-5" />
         </div>
         <strong className="text-xs font-bold text-slate-200 transition-colors group-hover:text-brand-cyan">
           {isUploading ? 'Procesando imagen...' : 'Subir tu propia foto o logo'}
         </strong>
         <p className="mt-0.5 text-[10px] text-slate-400">
           Arrastra aquí o haz clic (PNG, JPG, WebP, SVG)
         </p>
        </div>

        {/* BUSCADOR */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar estudiantes, médicos, visados, familias..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/90 pl-8.5 pr-8 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/30 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <nav aria-label="Bibliotecas de medios" className="grid grid-cols-3 gap-1.5 border-b border-slate-800/80 bg-[#070e17] p-3">
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

      {/* 3. FORMA DE RECORTE (CLIP SHAPE SELECTOR) */}
      <div className="px-3.5 py-2 border-b border-slate-800/60 bg-[#070e17]/60 flex items-center justify-between text-[11px] shrink-0">
        <span className="font-semibold text-slate-400 flex items-center gap-1">
          <Layers className="size-3 text-brand-cyan" />
          <span>Forma al insertar:</span>
        </span>
        <div className="flex items-center gap-1">
          {[
            { id: 'rounded-2xl', label: 'Suave', icon: <Square className="size-3 rounded-xs" /> },
            { id: 'circle', label: 'Círculo', icon: <Circle className="size-3" /> },
            { id: 'hexagon', label: 'Hexágono', icon: <Hexagon className="size-3" /> },
            { id: 'none', label: 'Recto', icon: <Square className="size-3" /> },
          ].map((shape) => (
            <button
              key={shape.id}
              type="button"
              onClick={() => setSelectedClipShape(shape.id as any)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                selectedClipShape === shape.id
                  ? 'bg-brand-cyan text-slate-950 shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {shape.icon}
              <span>{shape.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. CONTENIDO PRINCIPAL: DROPZONE Y GRID DE FOTOS */}
      <div className="flex-1 overflow-y-auto p-3.5 custom-scrollbar space-y-4">
        {selectedScope === 'organization' && (
          <nav aria-label="Categorías de medios" className="grid grid-cols-2 gap-2">
            {STOCK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                aria-current={selectedCategory === cat.id ? 'page' : undefined}
                className={`flex min-h-14 flex-col justify-between rounded-lg border p-2.5 text-left ${
                  selectedCategory === cat.id
                    ? 'border-brand-cyan/50 bg-primary/40 text-brand-cyan'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-[10px] font-semibold">{cat.name}</span>
                  <span className="text-[9px] text-slate-500">{categoryCounts.get(cat.id) ?? 0}</span>
                </span>
              </button>
            ))}
          </nav>
        )}
        {/* GRID DE FOTOGRAFÍAS */}
        {selectedScope !== 'organization' || filteredPhotos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center bg-slate-950/40">
            <ImageIcon className="size-8 text-slate-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-300">
              {selectedScope === 'system' ? 'No hay medios universales todavía' : selectedScope === 'user' ? 'Aún no tienes medios guardados' : 'No se encontraron fotos'}
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">
              Prueba buscando con otros términos o cambia de categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0d1624] overflow-hidden hover:border-brand-cyan/60 hover:shadow-lg transition-all"
              >
                {/* CONTENEDOR DE IMAGEN */}
                <div className="relative w-full h-32 overflow-hidden bg-slate-950">
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                    loading="lazy"
                  />

                  {/* OVERLAY DE ACCIONES AL HOVER */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onInsertImageLayer(photo.url, {
                          title: photo.title,
                          clipShape: selectedClipShape,
                        })
                      }
                      className="w-full py-1.5 rounded-lg bg-primary hover:bg-teal-600 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-md transition-colors"
                    >
                      <Sparkles className="size-3 text-brand-cyan" />
                      <span>+ Añadir Capa</span>
                    </button>

                    {onSetBackgroundImage && (
                      <button
                        type="button"
                        onClick={() => onSetBackgroundImage(photo.url)}
                        className="w-full py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700/80 transition-colors"
                      >
                        🖼️ Poner de fondo
                      </button>
                    )}
                  </div>
                </div>

                {/* INFO PIE DE TARJETA */}
                <div className="p-2 border-t border-slate-800/80 bg-[#080e18]">
                  <strong className="block text-[11px] font-bold text-slate-200 truncate" title={photo.title}>
                    {photo.title}
                  </strong>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 mt-0.5">
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
  );
};
