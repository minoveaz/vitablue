import React, { useMemo, useState } from 'react';
import { HeartHandshake, Plus } from 'lucide-react';
import { ImageLayer, ImageBlockType } from '../../../types/imageStudio';
import {
  BLOCK_CATALOGS,
  BLOCK_SCOPE_OPTIONS,
  BlockCatalogItem,
  BlockScope,
} from '../../../data/blockCatalog';
import { ImageLayerBlockRenderer } from '../blocks';
import { defaultMotionBrandTokens } from '../../../../packages/video-studio/src/motion-kit';

export interface ImageStudioBlocksDrawerProps {
  onAddBlock: (blockType: ImageBlockType, defaultProps?: Record<string, unknown>) => void;
}

const BlockPreview: React.FC<{ block: BlockCatalogItem }> = ({ block }) => {
  const layer: ImageLayer = {
    id: `catalog-preview-${block.id}`,
    type: 'block',
    blockType: block.type,
    title: block.name,
    props: block.defaultProps,
    position: { x: 50, y: 50 },
    zIndex: 0,
    scale: 1,
  };

  return (
    <div
      className="relative h-28 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950"
      role="img"
      aria-label={`Vista previa de ${block.name}`}
    >
      <div
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
        style={{ width: '290%', height: '290%', transform: 'scale(0.345)' }}
      >
        <ImageLayerBlockRenderer layer={layer} brandTokens={defaultMotionBrandTokens} />
      </div>
    </div>
  );
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
              onClick={() => onAddBlock(block.type, block.defaultProps)}
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
              <BlockPreview block={block} />
            </button>
          ))
        )}
      </div>
    </div>
  );
};
