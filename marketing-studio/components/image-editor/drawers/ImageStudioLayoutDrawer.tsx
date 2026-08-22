import React from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignStartVertical,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  ArrowDownToLine,
  ArrowUpToLine,
  Group,
  Grid3X3,
  Lock,
  Palette,
  Minus,
  Plus,
  ScanText,
  ShieldCheck,
  Ungroup,
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
  onAlignSelectedLayers?: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistributeSelectedLayers?: (direction: 'horizontal' | 'vertical') => void;
  onMoveZIndex?: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  onGroupSelectedLayers?: () => void;
  onUngroupLayer?: (id: string) => void;
  onUpdateLayerProps?: (id: string, patch: Record<string, unknown>) => void;
  onReplaceLayerContent?: (id: string, replacement: { text?: string; imageUrl?: string }) => void;
  onUpdateLayerPosition?: (id: string, position: { x: number; y: number }) => void;
  onUpdateLayerOpacity?: (id: string, opacity: number) => void;
  onUpdateLayerShadowPreset?: (id: string, preset: ImageLayer['shadowPreset']) => void;
  onUpdateLayerBorder?: (
    id: string,
    border: { borderWidth?: number; borderColor?: string; borderRadius?: number }
  ) => void;
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

const ColorField: React.FC<{
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}> = ({ label, value, disabled, onChange }) => {
  const colorValue = /^#[0-9a-f]{6}$/i.test(value) ? value : '#005F73';
  return (
    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {label}
      <span className="mt-1 flex gap-1.5">
        <input
          type="color"
          value={colorValue}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-9 rounded border border-slate-700 bg-slate-900 p-0.5 disabled:opacity-40"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-normal normal-case tracking-normal text-white focus:border-brand-cyan focus:outline-none disabled:opacity-40"
        />
      </span>
    </label>
  );
};

export const ImageStudioLayoutDrawer: React.FC<ImageStudioLayoutDrawerProps> = ({
  project,
  selectedLayers,
  onUpdateGuideSettings,
  onAutoLayout,
  onFitText,
  onApplyVariant,
  onToggleLock,
  onAlignSelectedLayers,
  onDistributeSelectedLayers,
  onMoveZIndex,
  onGroupSelectedLayers,
  onUngroupLayer,
  onUpdateLayerProps,
  onReplaceLayerContent,
  onUpdateLayerPosition,
  onUpdateLayerOpacity,
  onUpdateLayerShadowPreset,
  onUpdateLayerBorder,
}) => {
  const [guideAxis, setGuideAxis] = React.useState<'vertical' | 'horizontal'>('vertical');
  const [guidePercent, setGuidePercent] = React.useState(50);
  const [activeSection, setActiveSection] = React.useState<'design' | 'organize' | 'content' | 'style'>('design');
  const [imageUrlDraft, setImageUrlDraft] = React.useState('');
  const settings = project.guideSettings!;
  const profile = getPlatformGuideProfile(project.preset, settings.profileId);
  const selectedText = selectedLayers.some(
    (layer) => layer.type === 'text' || layer.blockType === 'CustomText'
  );
  const allLocked = selectedLayers.length > 0 && selectedLayers.every((layer) => layer.locked);
  const firstSelected = selectedLayers[0];
  const firstProps = firstSelected?.props ?? {};
  const selectedTextLayer = selectedLayers.find(
    (layer) => layer.type === 'text' || layer.blockType === 'CustomText'
  );
  const selectedImageLayer = selectedLayers.find((layer) => layer.type === 'image');
  const selectedGroup = selectedLayers.find((layer) => layer.blockType === 'CustomGroup');
  const textBearingBlockTypes = [
    'CustomText',
    'WhatsAppCtaButton',
    'TrustVerifiedPill',
    'TrustHighlightPill',
    'HookAlertBadge',
    'TrustBadgeTitle',
    'TrustBadgeSubtitle',
    'AdvisorTitleBadge',
    'AdvisorSubline',
    'ComparisonWrongBox',
    'ComparisonCorrectBox',
  ];
  const isTextBearing = (layer?: ImageLayer) =>
    Boolean(layer && (layer.type === 'text' || textBearingBlockTypes.includes(layer.blockType ?? '')));
  const getTextValue = (layer?: ImageLayer) => {
    if (!layer) return '';
    const props = layer.props ?? {};
    return String(
      props.text ??
        props.ctaText ??
        props.whatsAppText ??
        props.verifiedLabel ??
        props.highlight ??
        props.badge ??
        props.title ??
        layer.title ??
        ''
    );
  };
  const updateSelectedProps = (patch: Record<string, unknown>) => {
    if (!onUpdateLayerProps) return;
    selectedLayers.forEach((layer) => onUpdateLayerProps(layer.id, patch));
  };
  const updateSelectedPositions = (axis: 'x' | 'y', value: number) => {
    if (!onUpdateLayerPosition || !Number.isFinite(value)) return;
    selectedLayers.forEach((layer) => {
      if (layer.locked) return;
      onUpdateLayerPosition(layer.id, {
        x: axis === 'x' ? value : layer.position.x,
        y: axis === 'y' ? value : layer.position.y,
      });
    });
  };
  const updateSelectedBorders = (patch: { borderWidth?: number; borderColor?: string; borderRadius?: number }) => {
    if (onUpdateLayerBorder) selectedLayers.forEach((layer) => onUpdateLayerBorder(layer.id, patch));
  };
  const updateSelectedOpacity = (opacity: number) => {
    if (onUpdateLayerOpacity) selectedLayers.forEach((layer) => onUpdateLayerOpacity(layer.id, opacity));
  };
  const updateSelectedShadow = (preset: ImageLayer['shadowPreset']) => {
    if (onUpdateLayerShadowPreset) selectedLayers.forEach((layer) => onUpdateLayerShadowPreset(layer.id, preset));
  };
  React.useEffect(() => {
    setImageUrlDraft(String(selectedImageLayer?.props.imageUrl ?? selectedImageLayer?.src ?? ''));
  }, [selectedImageLayer?.id, selectedImageLayer?.props.imageUrl, selectedImageLayer?.src]);

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
            Alinea, distribuye y ordena la selección. Las capas bloqueadas no se mueven.
          </p>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Alinear selección
            </span>
            <div className="grid grid-cols-3 gap-1">
              {([
                ['left', 'Izquierda', AlignLeft],
                ['center', 'Centro', AlignCenter],
                ['right', 'Derecha', AlignRight],
                ['top', 'Arriba', AlignStartVertical],
                ['middle', 'Medio', AlignVerticalDistributeCenter],
                ['bottom', 'Abajo', AlignEndVertical],
              ] as const).map(([alignment, label, Icon]) => (
                <button
                  key={alignment}
                  type="button"
                  disabled={selectedLayers.length === 0 || allLocked || !onAlignSelectedLayers}
                  onClick={() => onAlignSelectedLayers?.(alignment)}
                  className="flex items-center justify-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-1 py-1.5 text-[10px] font-bold text-slate-300 hover:border-brand-cyan hover:text-brand-cyan disabled:cursor-not-allowed disabled:opacity-40"
                  title={`Alinear ${label.toLowerCase()}`}
                >
                  <Icon className="size-3.5" />
                  <span className="sr-only">{label}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {([
                ['horizontal', 'Distribuir horizontalmente'],
                ['vertical', 'Distribuir verticalmente'],
              ] as const).map(([direction, label]) => (
                <button
                  key={direction}
                  type="button"
                  disabled={selectedLayers.filter((layer) => !layer.locked).length < 3 || !onDistributeSelectedLayers}
                  onClick={() => onDistributeSelectedLayers?.(direction)}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-1.5 py-1.5 text-[10px] font-bold text-slate-300 hover:border-brand-cyan hover:text-brand-cyan disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Posición
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['x', 'y'] as const).map((axis) => {
                const value = firstSelected?.position[axis] ?? 50;
                return (
                  <label key={axis} className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {axis}
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={Math.round(value * 10) / 10}
                      disabled={selectedLayers.length === 0 || allLocked || !onUpdateLayerPosition}
                      onChange={(event) =>
                        updateSelectedPositions(axis, Math.max(0, Math.min(100, Number(event.target.value))))
                      }
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 font-mono text-xs text-white focus:border-brand-cyan focus:outline-none disabled:opacity-40"
                    />
                  </label>
                );
              })}
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1">
              {([
                ['x', -1, 'Mover ←'],
                ['x', 1, 'Mover →'],
                ['y', -1, 'Mover ↑'],
                ['y', 1, 'Mover ↓'],
              ] as const).map(([axis, delta, label]) => (
                <button
                  key={label}
                  type="button"
                  disabled={selectedLayers.length === 0 || allLocked || !onUpdateLayerPosition}
                  onClick={() =>
                    selectedLayers.forEach((layer) => {
                      if (layer.locked) return;
                      onUpdateLayerPosition?.(layer.id, {
                        x: axis === 'x' ? Math.max(0, Math.min(100, layer.position.x + delta)) : layer.position.x,
                        y: axis === 'y' ? Math.max(0, Math.min(100, layer.position.y + delta)) : layer.position.y,
                      });
                    })
                  }
                  className="flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900 py-1.5 text-slate-300 hover:border-brand-cyan hover:text-brand-cyan disabled:cursor-not-allowed disabled:opacity-40"
                  title={label}
                >
                  {axis === 'x' && delta < 0 ? <Minus className="size-3" /> : axis === 'x' ? <Plus className="size-3" /> : axis === 'y' && delta < 0 ? <ArrowUpToLine className="size-3" /> : <ArrowDownToLine className="size-3" />}
                </button>
              ))}
            </div>
          </div>
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
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Orden y grupos</span>
            <div className="grid grid-cols-2 gap-1">
              {([
                ['up', 'Subir'],
                ['down', 'Bajar'],
                ['top', 'Al frente'],
                ['bottom', 'Al fondo'],
              ] as const).map(([direction, label]) => (
                <button
                  key={direction}
                  type="button"
                  disabled={selectedLayers.length === 0 || allLocked || !onMoveZIndex}
                  onClick={() => selectedLayers.forEach((layer) => !layer.locked && onMoveZIndex?.(layer.id, direction))}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-1.5 py-1.5 text-[10px] font-bold text-slate-300 hover:border-brand-cyan hover:text-brand-cyan disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1">
              <button
                type="button"
                disabled={selectedLayers.filter((layer) => !layer.locked).length < 2 || !onGroupSelectedLayers}
                onClick={onGroupSelectedLayers}
                className="flex items-center justify-center gap-1 rounded-lg border border-primary/40 bg-primary/20 px-1.5 py-1.5 text-[10px] font-bold text-brand-cyan disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Group className="size-3.5" /> Agrupar
              </button>
              <button
                type="button"
                disabled={!selectedGroup || selectedGroup.locked || !onUngroupLayer}
                onClick={() => selectedGroup && onUngroupLayer?.(selectedGroup.id)}
                className="flex items-center justify-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-1.5 py-1.5 text-[10px] font-bold text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Ungroup className="size-3.5" /> Desagrupar
              </button>
            </div>
          </div>
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <h3 id="component-lock-heading" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Protección de componentes
            </h3>
            <button
              type="button"
              disabled={selectedLayers.length === 0}
              onClick={() =>
                selectedLayers.forEach((layer) => {
                  if (allLocked ? layer.locked : !layer.locked) onToggleLock(layer.id);
                })
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 transition-colors hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {allLocked ? <Unlock className="size-4" /> : <Lock className="size-4" />}
              {allLocked ? 'Desbloquear selección' : 'Bloquear selección'}
            </button>
          </div>
        </section>
        )}

        {activeSection === 'content' && (
        <section aria-labelledby="smart-content-heading" className="space-y-2">
          <h3 id="smart-content-heading" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Contenido inteligente
          </h3>
          {selectedLayers.length === 0 && (
            <p className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[10px] leading-4 text-slate-500">
              Selecciona una capa para editar su contenido.
            </p>
          )}
          <button
            type="button"
            disabled={!selectedText || allLocked}
            onClick={onFitText}
            className="flex w-full items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-left text-xs font-bold text-slate-200 transition-colors hover:border-brand-cyan hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ScanText className="size-4" />
            Ajustar texto sin desbordar
          </button>
          {selectedTextLayer && (
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-2.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Texto
                <textarea
                  rows={3}
                  value={getTextValue(selectedTextLayer)}
                  disabled={allLocked || (!onUpdateLayerProps && !onReplaceLayerContent)}
                  onChange={(event) =>
                    onReplaceLayerContent
                      ? onReplaceLayerContent(selectedTextLayer.id, { text: event.target.value })
                      : onUpdateLayerProps?.(selectedTextLayer.id, {
                          text: event.target.value,
                          ctaText: event.target.value,
                          whatsAppText: event.target.value,
                          verifiedLabel: event.target.value,
                          highlight: event.target.value,
                          badge: event.target.value,
                          title: event.target.value,
                          buttonText: event.target.value,
                        })
                  }
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs font-normal normal-case tracking-normal text-white focus:border-brand-cyan focus:outline-none disabled:opacity-40"
                />
              </label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  disabled={allLocked || !onUpdateLayerProps}
                  onClick={() => {
                    onUpdateLayerProps?.(selectedTextLayer.id, {
                      textFit: {
                        ...(selectedTextLayer.props.textFit as Record<string, unknown> | undefined),
                        mode: 'auto',
                      },
                    });
                    onFitText();
                  }}
                  className={`rounded-lg border px-2 py-1.5 text-[10px] font-bold ${
                    (firstProps.textFit as { mode?: string } | undefined)?.mode !== 'fixed'
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                      : 'border-slate-800 bg-slate-900 text-slate-300'
                  }`}
                >
                  Ajuste automático
                </button>
                <button
                  type="button"
                  disabled={allLocked || !onUpdateLayerProps}
                  onClick={() =>
                    onUpdateLayerProps?.(selectedTextLayer.id, {
                      textFit: {
                        ...(selectedTextLayer.props.textFit as Record<string, unknown> | undefined),
                        mode: 'fixed',
                      },
                    })
                  }
                  className={`rounded-lg border px-2 py-1.5 text-[10px] font-bold ${
                    (firstProps.textFit as { mode?: string } | undefined)?.mode === 'fixed'
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                      : 'border-slate-800 bg-slate-900 text-slate-300'
                  }`}
                >
                  Tamaño fijo
                </button>
              </div>
            </div>
          )}
          {selectedImageLayer && (
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-2.5">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Imagen</span>
              <div className="grid grid-cols-3 gap-1">
                {(['cover', 'contain', 'fill'] as const).map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    disabled={selectedImageLayer.locked || !onUpdateLayerProps}
                    onClick={() => onUpdateLayerProps?.(selectedImageLayer.id, { objectFit: fit })}
                    className={`rounded-lg border py-1.5 text-[10px] font-bold ${
                      (selectedImageLayer.props.objectFit as string | undefined ?? 'cover') === fit
                        ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                        : 'border-slate-800 bg-slate-900 text-slate-300'
                    } disabled:opacity-40`}
                  >
                    {fit === 'cover' ? 'Rellenar' : fit === 'contain' ? 'Contener' : 'Estirar'}
                  </button>
                ))}
              </div>
              {onReplaceLayerContent && (
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  URL de imagen
                  <input
                    type="url"
                    value={imageUrlDraft}
                    disabled={selectedImageLayer.locked}
                    onChange={(event) => setImageUrlDraft(event.target.value)}
                    onBlur={() => {
                      const value = imageUrlDraft.trim();
                      if (value) onReplaceLayerContent(selectedImageLayer.id, { imageUrl: value });
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-[10px] font-normal normal-case tracking-normal text-white focus:border-brand-cyan focus:outline-none disabled:opacity-40"
                    placeholder="https://…"
                  />
                </label>
              )}
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Punto focal horizontal
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Number((selectedImageLayer.props.focalPoint as { x?: number } | undefined)?.x ?? 50)}
                  disabled={selectedImageLayer.locked || !onUpdateLayerProps}
                  onChange={(event) =>
                    onUpdateLayerProps?.(selectedImageLayer.id, {
                      focalPoint: {
                        x: Number(event.target.value),
                        y: Number((selectedImageLayer.props.focalPoint as { y?: number } | undefined)?.y ?? 50),
                      },
                    })
                  }
                  className="mt-1 w-full accent-brand-cyan disabled:opacity-40"
                />
              </label>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Punto focal vertical
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Number((selectedImageLayer.props.focalPoint as { y?: number } | undefined)?.y ?? 50)}
                  disabled={selectedImageLayer.locked || !onUpdateLayerProps}
                  onChange={(event) =>
                    onUpdateLayerProps?.(selectedImageLayer.id, {
                      focalPoint: {
                        x: Number((selectedImageLayer.props.focalPoint as { x?: number } | undefined)?.x ?? 50),
                        y: Number(event.target.value),
                      },
                    })
                  }
                  className="mt-1 w-full accent-brand-cyan disabled:opacity-40"
                />
              </label>
            </div>
          )}
          {firstSelected?.blockType === 'GeometricShape' && (
            <label className="block rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tipo de forma
              <select
                value={String(firstProps.shapeType ?? 'rectangle')}
                disabled={allLocked || !onUpdateLayerProps}
                onChange={(event) => onUpdateLayerProps?.(firstSelected.id, { shapeType: event.target.value })}
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-semibold normal-case tracking-normal text-white focus:border-brand-cyan focus:outline-none disabled:opacity-40"
              >
                <option value="rectangle">Rectángulo</option>
                <option value="rounded_rect">Rectángulo redondeado</option>
                <option value="circle">Círculo / Elipse</option>
                <option value="star">Estrella</option>
                <option value="triangle">Triángulo</option>
                <option value="diamond">Rombo</option>
                <option value="hexagon">Hexágono</option>
                <option value="line">Línea</option>
                <option value="arrow">Flecha</option>
                <option value="speech_bubble">Bocadillo</option>
                <option value="heart">Corazón</option>
              </select>
            </label>
          )}
          {firstSelected?.blockType === 'WhatsAppCtaButton' && (
            <label className="block rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Icono CTA
              <select
                value={String(firstProps.icon ?? 'arrow')}
                disabled={allLocked || !onUpdateLayerProps}
                onChange={(event) => onUpdateLayerProps?.(firstSelected.id, { icon: event.target.value })}
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-semibold normal-case tracking-normal text-white focus:border-brand-cyan focus:outline-none disabled:opacity-40"
              >
                <option value="arrow">Flecha</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="bolt">Rayo</option>
                <option value="check">Check</option>
                <option value="none">Ninguno</option>
              </select>
            </label>
          )}
          {firstSelected?.blockType === 'WebIllustration' && (
            <label className="block rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Ilustración
              <select
                value={String(firstProps.illustrationId ?? 'medical-attention')}
                disabled={allLocked || !onUpdateLayerProps}
                onChange={(event) => onUpdateLayerProps?.(firstSelected.id, { illustrationId: event.target.value })}
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-semibold normal-case tracking-normal text-white focus:border-brand-cyan focus:outline-none disabled:opacity-40"
              >
                <option value="medical-attention">Atención médica</option>
                <option value="student">Estudiantes y visados</option>
                <option value="passport">Pasaporte y visado</option>
                <option value="assistance">Asistencia en viaje</option>
                <option value="policy">Póliza y contrato</option>
                <option value="family">Familia protegida</option>
                <option value="coverage">Cobertura completa</option>
              </select>
            </label>
          )}
          {firstSelected?.blockType === 'InstagramHighlightBadge' && (
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-2.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Destacado
                <select
                  value={String(firstProps.iconKey ?? 'approved')}
                  disabled={allLocked || !onUpdateLayerProps}
                  onChange={(event) => onUpdateLayerProps?.(firstSelected.id, { iconKey: event.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-semibold normal-case tracking-normal text-white focus:border-brand-cyan focus:outline-none disabled:opacity-40"
                >
                  <option value="approved">Aprobados</option>
                  <option value="visa">Visados</option>
                  <option value="process">Paso a paso</option>
                  <option value="faq">Dudas y FAQ</option>
                  <option value="contact">Contacto</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <input
                  type="checkbox"
                  checked={firstProps.showLabel !== false}
                  disabled={allLocked || !onUpdateLayerProps}
                  onChange={(event) => onUpdateLayerProps?.(firstSelected.id, { showLabel: event.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-brand-cyan focus:ring-0 disabled:opacity-40"
                />
                Mostrar etiqueta
              </label>
            </div>
          )}
        </section>
        )}

        {activeSection === 'style' && (
        <section aria-labelledby="variants-heading" className="space-y-3">
          <h3 id="variants-heading" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <Palette className="size-3.5" />
            Estilo
          </h3>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tokens de marca
            </span>
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
                  className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[10px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-not-allowed disabled:opacity-40 ${
                    selectedLayers.every((layer) => layer.styleVariant === id)
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <span className={`size-3 rounded-full ${color}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>
          {selectedLayers.length > 0 && onUpdateLayerProps && (
            <>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Colores</span>
                <div className="space-y-2">
                  <ColorField
                    label={isTextBearing(firstSelected) ? 'Color de texto' : 'Color principal'}
                    value={String(firstSelected?.fill ?? firstProps.color ?? firstProps.primaryColor ?? '#005F73')}
                    disabled={allLocked}
                    onChange={(value) =>
                      updateSelectedProps({
                        fill: value,
                        color: value,
                        textColor: value,
                        primaryColor: value,
                      })
                    }
                  />
                  <ColorField
                    label="Color de superficie / fondo"
                    value={String(firstProps.surfaceColor ?? firstProps.backgroundColor ?? firstSelected?.boxColor ?? '#001219')}
                    disabled={allLocked}
                    onChange={(value) =>
                      updateSelectedProps({
                        surfaceColor: value,
                        backgroundColor: value,
                        boxColor: value,
                      })
                    }
                  />
                </div>
              </div>
              {isTextBearing(firstSelected) && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Tipografía</span>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Fuente
                      <select
                        value={firstSelected?.fontFamily ?? 'Poppins, sans-serif'}
                        disabled={allLocked}
                        onChange={(event) => updateSelectedProps({ fontFamily: event.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-[10px] font-semibold normal-case tracking-normal text-white focus:border-brand-cyan focus:outline-none disabled:opacity-40"
                      >
                        <option value="Poppins, sans-serif">Poppins</option>
                        <option value="Inter, sans-serif">Inter</option>
                        <option value="Montserrat, sans-serif">Montserrat</option>
                        <option value="Oswald, sans-serif">Oswald</option>
                        <option value="Playfair Display, serif">Playfair</option>
                        <option value="Outfit, sans-serif">Outfit</option>
                      </select>
                    </label>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Grosor
                      <select
                        value={firstSelected?.fontWeight ?? '700'}
                        disabled={allLocked}
                        onChange={(event) => updateSelectedProps({ fontWeight: event.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-[10px] font-semibold normal-case tracking-normal text-white focus:border-brand-cyan focus:outline-none disabled:opacity-40"
                      >
                        <option value="400">Regular</option>
                        <option value="600">Semibold</option>
                        <option value="700">Bold</option>
                        <option value="800">ExtraBold</option>
                        <option value="900">Black</option>
                      </select>
                    </label>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Tamaño ({firstSelected?.fontSize ?? 24}px)
                      <input
                        type="range"
                        min={8}
                        max={160}
                        value={firstSelected?.fontSize ?? 24}
                        disabled={allLocked}
                        onChange={(event) => updateSelectedProps({ fontSize: Number(event.target.value) })}
                        className="mt-1 w-full accent-brand-cyan disabled:opacity-40"
                      />
                    </label>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Alineación
                      <select
                        value={firstSelected?.align ?? String(firstProps.textAlign ?? 'center')}
                        disabled={allLocked}
                        onChange={(event) => updateSelectedProps({ align: event.target.value, textAlign: event.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-[10px] font-semibold normal-case tracking-normal text-white focus:border-brand-cyan focus:outline-none disabled:opacity-40"
                      >
                        <option value="left">Izquierda</option>
                        <option value="center">Centro</option>
                        <option value="right">Derecha</option>
                      </select>
                    </label>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Espaciado ({firstSelected?.letterSpacing ?? 0}px)
                      <input
                        type="range"
                        min={-2}
                        max={8}
                        step={0.5}
                        value={firstSelected?.letterSpacing ?? 0}
                        disabled={allLocked}
                        onChange={(event) => updateSelectedProps({ letterSpacing: Number(event.target.value) })}
                        className="mt-1 w-full accent-brand-cyan disabled:opacity-40"
                      />
                    </label>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Interlineado ({firstSelected?.lineHeight ?? 1.25})
                      <input
                        type="range"
                        min={0.9}
                        max={2}
                        step={0.05}
                        value={firstSelected?.lineHeight ?? 1.25}
                        disabled={allLocked}
                        onChange={(event) => updateSelectedProps({ lineHeight: Number(event.target.value) })}
                        className="mt-1 w-full accent-brand-cyan disabled:opacity-40"
                      />
                    </label>
                  </div>
                </div>
              )}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Bordes</span>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Grosor ({firstSelected?.borderWidth ?? 0}px)
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={firstSelected?.borderWidth ?? 0}
                      disabled={allLocked || !onUpdateLayerBorder}
                      onChange={(event) =>
                        updateSelectedBorders({
                          borderWidth: Number(event.target.value),
                          borderColor: firstSelected?.borderColor ?? '#94D2BD',
                        })
                      }
                      className="mt-1 w-full accent-brand-cyan disabled:opacity-40"
                    />
                  </label>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Radio ({firstSelected?.borderRadius ?? 0}px)
                    <input
                      type="range"
                      min={0}
                      max={80}
                      value={Math.min(80, firstSelected?.borderRadius ?? 0)}
                      disabled={allLocked || !onUpdateLayerBorder}
                      onChange={(event) => updateSelectedBorders({ borderRadius: Number(event.target.value) })}
                      className="mt-1 w-full accent-brand-cyan disabled:opacity-40"
                    />
                  </label>
                </div>
                <div className="mt-2">
                  <ColorField
                    label="Color de borde"
                    value={String(firstSelected?.borderColor ?? '#94D2BD')}
                    disabled={allLocked || !onUpdateLayerBorder}
                    onChange={(value) => updateSelectedBorders({ borderColor: value })}
                  />
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sombra y opacidad</span>
                  <span className="font-mono text-[10px] text-brand-cyan">{Math.round((firstSelected?.opacity ?? 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={firstSelected?.opacity ?? 1}
                  disabled={allLocked || !onUpdateLayerOpacity}
                  onChange={(event) => updateSelectedOpacity(Number(event.target.value))}
                  className="mt-1 w-full accent-brand-cyan disabled:opacity-40"
                />
                <div className="mt-2 grid grid-cols-3 gap-1">
                  {([
                    ['none', 'Ninguna'],
                    ['soft', 'Suave'],
                    ['deep', 'Profunda'],
                    ['glow_teal', 'Glow Teal'],
                    ['glow_gold', 'Glow Gold'],
                    ['neon', 'Neón'],
                  ] as const).map(([preset, label]) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={allLocked || !onUpdateLayerShadowPreset}
                      onClick={() => updateSelectedShadow(preset)}
                      className={`rounded-lg border py-1 text-[9px] font-bold disabled:opacity-40 ${
                        (firstSelected?.shadowPreset ?? 'none') === preset
                          ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                          : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
        )}

      </div>
    </div>
  );
};
