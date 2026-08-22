import React from 'react';
import {
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  Grid3X3,
  Lock,
  Palette,
  ScanText,
  ShieldCheck,
  Unlock,
} from 'lucide-react';
import {
  CanvasGuideSettings,
  ImageLayer,
  ImagePlatformGuideId,
  ImageProject,
  ImageStyleVariantId,
} from '../../../types/imageStudio';
import { getPlatformGuideProfile } from '../../../utils/imageDesignSystem';

interface ImageStudioLayoutDrawerProps {
  project: ImageProject;
  selectedLayers: ImageLayer[];
  onUpdateGuideSettings: (patch: Partial<CanvasGuideSettings>) => void;
  onAutoLayout: (direction: 'vertical' | 'horizontal' | 'grid') => void;
  onFitText: () => void;
  onApplyVariant: (variant: ImageStyleVariantId) => void;
  onToggleLock: (id: string) => void;
}

const Toggle: React.FC<{
  label: string;
  description: string;
  pressed: boolean;
  onClick: () => void;
}> = ({ label, description, pressed, onClick }) => (
  <button
    type="button"
    aria-pressed={pressed}
    onClick={onClick}
    className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-left transition-colors hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
  >
    <span>
      <strong className="block text-xs text-slate-200">{label}</strong>
      <span className="block text-[10px] leading-4 text-slate-400">{description}</span>
    </span>
    <span
      aria-hidden="true"
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        pressed ? 'bg-primary' : 'bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${
          pressed ? 'translate-x-[18px]' : 'translate-x-0.5'
        }`}
      />
    </span>
  </button>
);

export const ImageStudioLayoutDrawer: React.FC<ImageStudioLayoutDrawerProps> = ({
  project,
  selectedLayers,
  onUpdateGuideSettings,
  onAutoLayout,
  onFitText,
  onApplyVariant,
  onToggleLock,
}) => {
  const [guideAxis, setGuideAxis] = React.useState<'vertical' | 'horizontal'>('vertical');
  const [guidePercent, setGuidePercent] = React.useState(50);
  const [activeSection, setActiveSection] = React.useState<'design' | 'organize' | 'content' | 'style'>('design');
  const settings = project.guideSettings!;
  const profile = getPlatformGuideProfile(project.preset, settings.profileId);
  const selectedText = selectedLayers.some(
    (layer) => layer.type === 'text' || layer.blockType === 'CustomText'
  );
  const allLocked = selectedLayers.length > 0 && selectedLayers.every((layer) => layer.locked);

  return (
    <div className="-m-4 flex h-[calc(100vh-140px)] flex-col bg-[#050B14]">
      <header className="border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-brand-cyan" />
          <h2 className="text-sm font-bold text-slate-100">Diseño del lienzo</h2>
        </div>
        <p className="mt-1 text-[11px] leading-4 text-slate-400">
          {profile.label} · {profile.description}
        </p>
      </header>

      <nav aria-label="Secciones de diseño" className="grid grid-cols-4 gap-1 border-b border-slate-800 p-3">
        {([
          ['design', 'Diseño'],
          ['organize', 'Organizar'],
          ['content', 'Contenido'],
          ['style', 'Estilo'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={activeSection === id}
            onClick={() => setActiveSection(id)}
            className={`min-h-9 rounded-lg border px-1 text-[10px] font-semibold transition-colors ${
              activeSection === id
                ? 'border-brand-cyan/60 bg-primary/40 text-brand-cyan'
                : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {activeSection === 'design' && (
        <section aria-labelledby="layout-guides-heading" className="space-y-2">
          <h3 id="layout-guides-heading" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Guías del lienzo
          </h3>
          <label className="block rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Perfil de plataforma
            <select
              value={settings.profileId ?? 'auto'}
              onChange={(event) => {
                const profileId = event.target.value as ImagePlatformGuideId | 'auto';
                const nextProfile = getPlatformGuideProfile(project.preset, profileId);
                onUpdateGuideSettings({
                  profileId,
                  columns: nextProfile.columns,
                  columnGap: nextProfile.columnGap,
                });
              }}
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-semibold normal-case tracking-normal text-white focus:border-brand-cyan focus:outline-none"
            >
              <option value="auto">Automático ({getPlatformGuideProfile(project.preset).label})</option>
              <option value="meta-feed">Meta Feed</option>
              <option value="meta-story">Meta Stories / Reels</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="x">X / Twitter</option>
              <option value="facebook-cover">Portada Facebook</option>
              <option value="youtube">YouTube</option>
              <option value="email">Email marketing</option>
              <option value="document">Documento</option>
              <option value="web">Web / Display</option>
            </select>
          </label>
          <Toggle
            label="Reglas"
            description="Escala en píxeles para medir el lienzo."
            pressed={settings.showRulers}
            onClick={() => onUpdateGuideSettings({ showRulers: !settings.showRulers })}
          />
          <Toggle
            label="Cuadrícula"
            description="Malla base para microalineación."
            pressed={settings.showGrid}
            onClick={() => onUpdateGuideSettings({ showGrid: !settings.showGrid })}
          />
          <Toggle
            label="Columnas"
            description={`${settings.columns} columnas · medianil ${settings.columnGap}px`}
            pressed={settings.showColumns}
            onClick={() => onUpdateGuideSettings({ showColumns: !settings.showColumns })}
          />
          <Toggle
            label="Márgenes"
            description="Área editorial recomendada."
            pressed={settings.showMargins}
            onClick={() => onUpdateGuideSettings({ showMargins: !settings.showMargins })}
          />
          <Toggle
            label="Safe zone de plataforma"
            description="Protege mensajes y llamadas a la acción."
            pressed={settings.showSafeZone}
            onClick={() => onUpdateGuideSettings({ showSafeZone: !settings.showSafeZone })}
          />
          <Toggle
            label="Ajuste magnético"
            description="Alinea con columnas, márgenes y safe zones."
            pressed={settings.snapToGuides}
            onClick={() => onUpdateGuideSettings({ snapToGuides: !settings.snapToGuides })}
          />
          <label className="block rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Número de columnas
            <input
              type="range"
              min={2}
              max={12}
              step={1}
              value={settings.columns}
              onChange={(event) => onUpdateGuideSettings({ columns: Number(event.target.value) })}
              className="mt-2 w-full accent-primary"
            />
            <span className="mt-1 block text-right font-mono text-brand-cyan">{settings.columns}</span>
          </label>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Guía personalizada</span>
            <div className="mt-2 grid grid-cols-[1fr_64px_auto] gap-1.5">
              <select
                value={guideAxis}
                onChange={(event) => setGuideAxis(event.target.value as 'vertical' | 'horizontal')}
                className="min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-[10px] text-white focus:border-brand-cyan focus:outline-none"
              >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
              </select>
              <input
                type="number"
                aria-label="Posición de la guía en porcentaje"
                min={0}
                max={100}
                value={guidePercent}
                onChange={(event) => setGuidePercent(Math.max(0, Math.min(100, Number(event.target.value))))}
                className="min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-center font-mono text-[10px] text-white focus:border-brand-cyan focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const key =
                    guideAxis === 'vertical' ? 'customVerticalGuides' : 'customHorizontalGuides';
                  onUpdateGuideSettings({
                    [key]: [...new Set([...settings[key], guidePercent])].sort((a, b) => a - b),
                  });
                }}
                className="rounded-lg bg-primary px-2 py-1.5 text-[10px] font-bold text-white hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
              >
                Añadir
              </button>
            </div>
            {(settings.customVerticalGuides.length > 0 || settings.customHorizontalGuides.length > 0) && (
              <div className="mt-2 flex flex-wrap gap-1">
                {[
                  ...settings.customVerticalGuides.map((value) => ({ axis: 'V', value })),
                  ...settings.customHorizontalGuides.map((value) => ({ axis: 'H', value })),
                ].map(({ axis, value }) => (
                  <button
                    key={`${axis}-${value}`}
                    type="button"
                    onClick={() =>
                      onUpdateGuideSettings(
                        axis === 'V'
                          ? { customVerticalGuides: settings.customVerticalGuides.filter((item) => item !== value) }
                          : { customHorizontalGuides: settings.customHorizontalGuides.filter((item) => item !== value) }
                      )
                    }
                    className="rounded-md border border-fuchsia-400/30 bg-fuchsia-400/10 px-1.5 py-0.5 font-mono text-[9px] text-fuchsia-200 hover:bg-fuchsia-400/20"
                    title="Eliminar guía"
                  >
                    {axis} {value}% ×
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
        )}

        {activeSection === 'organize' && (
        <section aria-labelledby="auto-layout-heading" className="space-y-2">
          <h3 id="auto-layout-heading" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Organizar
          </h3>
          <p className="text-[10px] leading-4 text-slate-500">
            Organiza la selección dentro del área segura. Las capas bloqueadas no se mueven.
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'vertical' as const, label: 'Vertical', icon: AlignVerticalDistributeCenter },
              { id: 'horizontal' as const, label: 'Horizontal', icon: AlignHorizontalDistributeCenter },
              { id: 'grid' as const, label: 'Cuadrícula', icon: Grid3X3 },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                disabled={selectedLayers.length === 0 || allLocked}
                onClick={() => onAutoLayout(id)}
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border border-slate-800 bg-slate-950 text-[10px] font-bold text-slate-300 transition-colors hover:border-brand-cyan hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </section>
        )}

        {activeSection === 'content' && (
        <section aria-labelledby="smart-content-heading" className="space-y-2">
          <h3 id="smart-content-heading" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Contenido inteligente
          </h3>
          <button
            type="button"
            disabled={!selectedText || allLocked}
            onClick={onFitText}
            className="flex w-full items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-left text-xs font-bold text-slate-200 transition-colors hover:border-brand-cyan hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ScanText className="size-4" />
            Ajustar texto sin desbordar
          </button>
        </section>
        )}

        {activeSection === 'style' && (
        <section aria-labelledby="variants-heading" className="space-y-2">
          <h3 id="variants-heading" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <Palette className="size-3.5" />
            Estilo
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {([
              ['ocean', 'Ocean', 'bg-primary'],
              ['gold', 'Trust Gold', 'bg-accent'],
              ['mint', 'Mint', 'bg-brand-cyan'],
              ['midnight', 'Midnight', 'bg-primary-dark'],
            ] as const).map(([id, label, color]) => (
              <button
                key={id}
                type="button"
                disabled={selectedLayers.length === 0 || allLocked}
                onClick={() => onApplyVariant(id)}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-[10px] font-bold text-slate-300 transition-colors hover:border-slate-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className={`size-3 rounded-full ${color}`} />
                {label}
              </button>
            ))}
          </div>
        </section>
        )}

        <section aria-labelledby="component-lock-heading" className="space-y-2">
          <h3 id="component-lock-heading" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Protección de componentes
          </h3>
          <button
            type="button"
            disabled={selectedLayers.length === 0}
            onClick={() => selectedLayers.forEach((layer) => onToggleLock(layer.id))}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 transition-colors hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {allLocked ? <Unlock className="size-4" /> : <Lock className="size-4" />}
            {allLocked ? 'Desbloquear selección' : 'Bloquear selección'}
          </button>
        </section>
      </div>
    </div>
  );
};
