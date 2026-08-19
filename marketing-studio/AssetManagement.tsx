import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  Palette,
  Music,
  UserCheck,
  ShieldCheck,
  Grid,
  SplitSquareVertical,
  Sliders,
  Copy,
  Check,
  Video,
  Eye,
  Smartphone,
  Square,
  Tv,
} from 'lucide-react';
import MarketingStudioShell from './MarketingStudioShell';
import {
  MOTION_KIT_REGISTRY,
  MotionAdvisorCard,
  MotionTrustBadge,
  MotionProviderGrid,
  MotionComparisonCard,
  defaultMotionBrandTokens,
  MotionBrandTokens,
} from '../packages/video-studio/src/motion-kit';

export const AssetManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'motion-kit' | 'brand-tokens' | 'audio-library'>('motion-kit');
  const [selectedComponentId, setSelectedComponentId] = useState<string>('MotionAdvisorCard');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [tokens, setTokens] = useState<MotionBrandTokens>(defaultMotionBrandTokens);
  const [copied, setCopied] = useState(false);

  // Component Props State (Playground)
  const [advisorProps, setAdvisorProps] = useState({
    name: 'Sofía',
    role: 'Asesora Especialista en Visados',
    badge: 'ASESORA ASIGNADA · EN DIRECTO',
    message: 'Te ayudo a verificar que tu póliza cumple el 100% de los requisitos del consulado sin copagos.',
    whatsAppText: 'Pregúntanos por WhatsApp',
  });

  const [trustProps, setTrustProps] = useState({
    title: 'PÓLIZA 100% VÁLIDA PARA VISADO',
    subtitle: 'Sin Copagos · Cobertura Completa · Repatriación Incluida',
    highlight: 'GARANTÍA CONSULAR',
    verifiedLabel: 'VERIFICADO PARA EXTRANJERÍA',
  });

  const [providerProps, setProviderProps] = useState({
    title: 'COMPAÑÍAS LÍDERES AUTORIZADAS',
    subtitle: 'Aceptadas oficialmente por Extranjería y Consulados',
  });

  const [comparisonProps, setComparisonProps] = useState({
    title: '¿SEGURO DE VIAJE O SEGURO DE VISADO?',
    wrongOptionTitle: 'Seguro de Viaje Común',
    wrongOptionDesc: 'Denegación de visado: no cumple requisitos consulares ni incluye red médica completa.',
    correctOptionTitle: 'Seguro VitaBlue Extranjería',
    correctOptionDesc: 'Aprobación garantizada: sin copagos, cobertura total y repatriación incluida.',
  });

  const handleCopyJson = () => {
    let currentData: Record<string, unknown> = {};
    if (selectedComponentId === 'MotionAdvisorCard') currentData = advisorProps;
    if (selectedComponentId === 'MotionTrustBadge') currentData = trustProps;
    if (selectedComponentId === 'MotionProviderGrid') currentData = providerProps;
    if (selectedComponentId === 'MotionComparisonCard') currentData = comparisonProps;

    navigator.clipboard.writeText(JSON.stringify(currentData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MarketingStudioShell title="Gestión de Assets & Kits de Vídeo" mode="overview">
      <div className="space-y-6 pb-12">
        {/* TOP BANNER & ACTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="size-4" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">Creative Asset Hub</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Catálogo de Componentes & MotionKit
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Biblioteca agnóstica de componentes de vídeo 1080p, tokens de marca white-label y recursos audiovisuales.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/backoffice/marketing-studio/generador-contenido"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark shadow-sm transition-all"
            >
              <Video className="size-4" />
              <span>Abrir en Video Studio</span>
            </Link>
          </div>
        </div>

        {/* TABS SELECTOR (CLEAN LIGHT SEGMENTED CONTROL) */}
        <div className="inline-flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200/80 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('motion-kit')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'motion-kit'
                ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>Kits de Vídeo (MotionKit)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('brand-tokens')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'brand-tokens'
                ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="size-3.5 text-amber-500" />
            <span>Tokens de Marca (White-Label)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audio-library')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'audio-library'
                ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Music className="size-3.5 text-purple-600" />
            <span>Biblioteca de Audio & Media</span>
          </button>
        </div>

        {/* TAB 1: MOTION KIT PLAYGROUND & CATALOG */}
        {activeTab === 'motion-kit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMNA 1: LISTA DE COMPONENTES DISPONIBLES (4 COLUMNAS) */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block px-1">
                Catálogo de Componentes ({MOTION_KIT_REGISTRY.length})
              </span>

              <div className="space-y-2.5">
                {MOTION_KIT_REGISTRY.map((comp) => {
                  const isSelected = comp.id === selectedComponentId;
                  return (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => setSelectedComponentId(comp.id)}
                      className={`flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                      }`}
                    >
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isSelected ? 'bg-primary text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {comp.category === 'advisor' ? (
                          <UserCheck className="size-5" />
                        ) : comp.category === 'trust' ? (
                          <ShieldCheck className="size-5" />
                        ) : comp.category === 'provider' ? (
                          <Grid className="size-5" />
                        ) : (
                          <SplitSquareVertical className="size-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <strong className="block text-sm font-bold text-slate-900">{comp.name}</strong>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{comp.description}</p>
                        <span className="inline-block mt-2 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                          1080p Motion-Ready
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLUMNA 2: PREVIEW DE DISPOSITIVO / CANVAS (5 COLUMNAS) */}
            <div className="lg:col-span-5 flex flex-col items-center space-y-4">
              <div className="flex w-full items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Eye className="size-4 text-primary" />
                  <span>Lienzo de Previsualización</span>
                </span>

                {/* Aspect ratio toggles */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                      aspectRatio === '9:16' ? 'bg-white text-primary shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="size-3.5" />
                    <span>9:16</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('1:1')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                      aspectRatio === '1:1' ? 'bg-white text-primary shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    <Square className="size-3.5" />
                    <span>1:1</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                      aspectRatio === '16:9' ? 'bg-white text-primary shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    <Tv className="size-3.5" />
                    <span>16:9</span>
                  </button>
                </div>
              </div>

              {/* MOCKUP FRAME DISPOSITIVO MÓVIL ESTILO IPHONE CON RING DE SOMBRA */}
              <div className="flex w-full items-center justify-center p-2 sm:p-4 bg-slate-100/60 rounded-3xl border border-slate-200">
                <div
                  className={`w-full overflow-hidden rounded-[44px] border-4 border-slate-800 bg-[#001219] p-5 shadow-2xl flex flex-col items-center justify-center relative ring-8 ring-slate-300/40 transition-all ${
                    aspectRatio === '9:16'
                      ? 'aspect-[9/16] max-w-[340px]'
                      : aspectRatio === '1:1'
                        ? 'aspect-square max-w-[420px] rounded-3xl'
                        : 'aspect-video max-w-[500px] rounded-3xl'
                  }`}
                  style={{
                    backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(0, 95, 115, 0.45) 0%, #001219 75%)',
                  }}
                >
                  {/* Dynamic Island Notch (solo en 9:16) */}
                  {aspectRatio === '9:16' && (
                    <div className="absolute top-3 z-30 h-4 w-20 rounded-full bg-black shadow-inner" />
                  )}

                  {/* Componente Renderizado al tamaño exacto */}
                  <div className="w-full flex items-center justify-center my-auto">
                    {selectedComponentId === 'MotionAdvisorCard' && (
                      <MotionAdvisorCard
                        name={advisorProps.name}
                        role={advisorProps.role}
                        badge={advisorProps.badge}
                        message={advisorProps.message}
                        whatsAppText={advisorProps.whatsAppText}
                        tokens={tokens}
                      />
                    )}

                    {selectedComponentId === 'MotionTrustBadge' && (
                      <MotionTrustBadge
                        title={trustProps.title}
                        subtitle={trustProps.subtitle}
                        highlight={trustProps.highlight}
                        verifiedLabel={trustProps.verifiedLabel}
                        tokens={tokens}
                      />
                    )}

                    {selectedComponentId === 'MotionProviderGrid' && (
                      <MotionProviderGrid
                        title={providerProps.title}
                        subtitle={providerProps.subtitle}
                        tokens={tokens}
                      />
                    )}

                    {selectedComponentId === 'MotionComparisonCard' && (
                      <MotionComparisonCard
                        title={comparisonProps.title}
                        wrongOptionTitle={comparisonProps.wrongOptionTitle}
                        wrongOptionDesc={comparisonProps.wrongOptionDesc}
                        correctOptionTitle={comparisonProps.correctOptionTitle}
                        correctOptionDesc={comparisonProps.correctOptionDesc}
                        tokens={tokens}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA 3: PROPS INSPECTOR / PLAYGROUND (3 COLUMNAS) */}
            <div className="lg:col-span-3 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="size-3.5 text-primary" />
                  <span>Configurar Parámetros</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                  title="Copiar JSON de props"
                >
                  {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                  <span>{copied ? 'Copiado' : 'JSON'}</span>
                </button>
              </div>

              {selectedComponentId === 'MotionAdvisorCard' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={advisorProps.name}
                      onChange={(e) => setAdvisorProps({ ...advisorProps, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Especialidad</label>
                    <input
                      type="text"
                      value={advisorProps.role}
                      onChange={(e) => setAdvisorProps({ ...advisorProps, role: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Badge de Estado</label>
                    <input
                      type="text"
                      value={advisorProps.badge}
                      onChange={(e) => setAdvisorProps({ ...advisorProps, badge: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Mensaje / Cita</label>
                    <textarea
                      value={advisorProps.message}
                      onChange={(e) => setAdvisorProps({ ...advisorProps, message: e.target.value })}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Texto Botón WhatsApp</label>
                    <input
                      type="text"
                      value={advisorProps.whatsAppText}
                      onChange={(e) => setAdvisorProps({ ...advisorProps, whatsAppText: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              {selectedComponentId === 'MotionTrustBadge' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Título</label>
                    <input
                      type="text"
                      value={trustProps.title}
                      onChange={(e) => setTrustProps({ ...trustProps, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Subtítulo / Requisitos</label>
                    <textarea
                      value={trustProps.subtitle}
                      onChange={(e) => setTrustProps({ ...trustProps, subtitle: e.target.value })}
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Insignia / Highlight</label>
                    <input
                      type="text"
                      value={trustProps.highlight}
                      onChange={(e) => setTrustProps({ ...trustProps, highlight: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              {selectedComponentId === 'MotionProviderGrid' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Título Principal</label>
                    <input
                      type="text"
                      value={providerProps.title}
                      onChange={(e) => setProviderProps({ ...providerProps, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Subtítulo</label>
                    <input
                      type="text"
                      value={providerProps.subtitle}
                      onChange={(e) => setProviderProps({ ...providerProps, subtitle: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              {selectedComponentId === 'MotionComparisonCard' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Título</label>
                    <input
                      type="text"
                      value={comparisonProps.title}
                      onChange={(e) => setComparisonProps({ ...comparisonProps, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-600 mb-1">Opción Incorrecta</label>
                    <input
                      type="text"
                      value={comparisonProps.wrongOptionTitle}
                      onChange={(e) => setComparisonProps({ ...comparisonProps, wrongOptionTitle: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Opción Correcta</label>
                    <input
                      type="text"
                      value={comparisonProps.correctOptionTitle}
                      onChange={(e) => setComparisonProps({ ...comparisonProps, correctOptionTitle: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TOKENS DE MARCA (WHITE LABEL) */}
        {activeTab === 'brand-tokens' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Palette className="size-5 text-primary" />
                <span>Personalización de Marca (White-Label)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configura los tokens de color y marca que se inyectan automáticamente en todos los componentes del MotionKit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Primary Color</span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={tokens.primaryColor}
                    onChange={(e) => setTokens({ ...tokens, primaryColor: e.target.value })}
                    className="size-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="font-mono text-xs font-bold text-slate-800 uppercase">{tokens.primaryColor}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Accent Color (CTA)</span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={tokens.accentColor}
                    onChange={(e) => setTokens({ ...tokens, accentColor: e.target.value })}
                    className="size-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="font-mono text-xs font-bold text-slate-800 uppercase">{tokens.accentColor}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Mint Color (Trust)</span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={tokens.mintColor}
                    onChange={(e) => setTokens({ ...tokens, mintColor: e.target.value })}
                    className="size-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="font-mono text-xs font-bold text-slate-800 uppercase">{tokens.mintColor}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Surface BG</span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={tokens.surfaceBg}
                    onChange={(e) => setTokens({ ...tokens, surfaceBg: e.target.value })}
                    className="size-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="font-mono text-xs font-bold text-slate-800 uppercase">{tokens.surfaceBg}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIO & MEDIA LIBRARY */}
        {activeTab === 'audio-library' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Music className="size-5 text-purple-600" />
                <span>Biblioteca de Audio & Recursos SFX</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Pistas de fondo con curva de volumen fade-in/fade-out compatibles con Video Studio.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Upbeat Corporate Lofi', category: 'Fondo', duration: '30s', bpm: '110 BPM' },
                { name: 'Warm Ambient Trust', category: 'Asesoría', duration: '45s', bpm: '90 BPM' },
                { name: 'High Energy Reels Hook', category: 'Viral TikTok', duration: '15s', bpm: '128 BPM' },
              ].map((track, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 hover:border-slate-300 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <Music className="size-4" />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold text-slate-900">{track.name}</strong>
                      <span className="text-[10px] text-slate-500">{track.category} · {track.bpm}</span>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-slate-500">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MarketingStudioShell>
  );
};

export default AssetManagement;
