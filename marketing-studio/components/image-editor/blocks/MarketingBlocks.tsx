import React from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  HeartHandshake,
  Info,
  ShieldCheck,
  Star,
  XCircle,
} from 'lucide-react';
import { ImageBlockType, ImageLayer } from '../../../types/imageStudio';
import { getBlockCatalogItem } from '../../../data/blockCatalog';
import { InlineEditableText } from '../InlineEditableText';
import { htmlToPlainText, isTiptapHtml } from '../../../utils/tiptapHtml';

type BlockProps = Record<string, unknown>;

const DEFAULT_COVERAGES = [
  { title: 'Hospitalización completa', description: 'Especialistas, pruebas y hospitalización en una red amplia.' },
  { title: 'Asistencia 24 horas', description: 'Atención urgente y soporte humano cuando lo necesitas.' },
  { title: 'Repatriación sanitaria', description: 'Traslado médico incluido para tu situación.' },
];
const DEFAULT_TESTIMONIALS = [
  { author: 'María García', meta: 'Asegurada VitaBlue', comment: 'Un asesoramiento claro, rápido y muy humano.', stars: 5 },
  { author: 'Carlos López', meta: 'Cliente desde 2024', comment: 'Encontré la póliza que necesitaba sin llamadas comerciales.', stars: 5 },
];
const DEFAULT_PLANS = [
  { name: 'Seguro Básico', subtitle: 'Acceso esencial', description: 'Cobertura médica para el día a día.', priceText: 'Consultar' },
  { name: 'Seguro Completo', subtitle: 'Cobertura amplia', description: 'Hospitalización y especialistas incluidos.', priceText: 'Recomendado', isFeatured: true },
  { name: 'Seguro Premium', subtitle: 'Máxima libertad', description: 'Reembolso y elección de centros.', priceText: 'Consultar' },
];
const DEFAULT_TRUST_ITEMS = [
  { title: 'Homologación oficial', description: 'Pólizas autorizadas y revisadas.' },
  { title: 'Gestión en 24 horas', description: 'Recibe tu documentación rápidamente.' },
  { title: 'Soporte continuo', description: 'Te acompañamos durante todo el proceso.' },
];
const DEFAULT_FAQ_ITEMS = [
  { question: '¿El seguro cumple los requisitos de mi visado?', answer: 'Sí. Mostramos las condiciones relevantes de cada póliza.' },
  { question: '¿Puedo recibir ayuda antes de decidir?', answer: 'Sí, un asesor puede resolver tus dudas sin compromiso.' },
];

const text = (props: BlockProps, key: string, fallback = '') => {
  const value = String(props[key] ?? fallback);
  return isTiptapHtml(value) ? htmlToPlainText(value) : value;
};
const richText = (props: BlockProps, key: string, fallback = '') => String(props[key] ?? fallback);

const list = (value: unknown, fallback: string[] = []): string[] => {
  if (Array.isArray(value)) {
    const values = value.map(String).filter(Boolean);
    return values.length > 0 ? values : fallback;
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        const values = parsed.map(String).filter(Boolean);
        return values.length > 0 ? values : fallback;
      }
    } catch {
      // Textarea values are intentionally supported for quick editing.
    }
    const values = value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
    return values.length > 0 ? values : fallback;
  }
  return fallback;
};

const objectList = <T extends Record<string, unknown>>(value: unknown, fallback: T[]): T[] => {
  if (Array.isArray(value)) {
    const values = value.filter((item): item is T => Boolean(item && typeof item === 'object'));
    return values.length > 0 ? values : fallback;
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        const values = parsed.filter((item): item is T => Boolean(item && typeof item === 'object'));
        return values.length > 0 ? values : fallback;
      }
    } catch {
      // Keep the catalog default when JSON is being edited.
    }
  }
  return fallback;
};

const Stars: React.FC<{ value?: number }> = ({ value = 5 }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value} de 5 estrellas`}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className={`size-3.5 ${index < value ? 'fill-accent text-accent' : 'text-slate-300'}`} />
    ))}
  </div>
);

const Frame: React.FC<{ children: React.ReactNode; dark?: boolean; className?: string }> = ({
  children,
  dark = false,
  className = '',
}) => (
  <div
    className={`h-full w-full overflow-hidden ${
      dark
        ? 'bg-gradient-to-br from-primary via-primary-dark to-slate-900 text-white'
        : 'bg-white text-text-main'
    } ${className}`}
  >
    {children}
  </div>
);

const MarketingBrandHero: React.FC<{ props: BlockProps }> = ({ props }) => (
  <Frame dark>
    <div className="relative flex h-full flex-col justify-center gap-5 p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-brand-cyan/10 blur-2xl" />
      <span className="relative w-fit rounded-full bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-brand-cyan">
        {text(props, 'eyebrow', 'ASESORAMIENTO CLARO')}
      </span>
      <h2 className="relative max-w-2xl text-h1 font-display font-black leading-tight">
        {text(props, 'title', 'Encuentra una opción que encaje contigo')}
      </h2>
      <p className="relative max-w-xl text-body-lg leading-relaxed text-slate-200">
        {text(props, 'description', 'Información sencilla y acompañamiento humano para decidir con confianza.')}
      </p>
      <div className="relative flex w-fit items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-black text-primary-dark">
        {text(props, 'ctaText', 'Ver opciones')} <ArrowRight className="size-4" />
      </div>
    </div>
  </Frame>
);

const MarketingSectionIntro: React.FC<{ props: BlockProps }> = ({ props }) => {
  const centered = text(props, 'align', 'center') === 'center';
  return (
    <Frame className="flex items-center justify-center p-6 sm:p-8">
      <div className={`max-w-2xl space-y-3 ${centered ? 'text-center' : 'text-left'}`}>
        <p className="text-caption font-black uppercase tracking-[0.2em] text-primary">
          {text(props, 'eyebrow', 'CÓMO TE AYUDAMOS')}
        </p>
        <h2 className="text-h2 font-display font-black leading-tight">{text(props, 'title', 'Una explicación clara antes de decidir')}</h2>
        <p className="text-body-lg leading-relaxed text-text-secondary">
          {text(props, 'description', 'Presenta el contexto con una jerarquía consistente y fácil de leer.')}
        </p>
      </div>
    </Frame>
  );
};

const MarketingTestimonial: React.FC<{ props: BlockProps }> = ({ props }) => (
  <Frame className="rounded-3xl border border-slate-100 p-5 shadow-sm sm:p-6">
    <div className="flex h-full flex-col gap-4">
      <Stars value={Math.max(1, Math.min(5, Number(props.stars ?? 5)))} />
      <p className="text-body-reg font-medium italic leading-relaxed text-text-secondary">
        “{text(props, 'comment', 'El proceso fue sencillo y pude decidir con toda la información.')}”
      </p>
      <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
          {text(props, 'author', 'Cliente').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-black text-text-main">{text(props, 'author', 'Cliente')}</p>
          <p className="truncate text-[10px] font-semibold text-text-secondary">{text(props, 'meta', 'Cliente satisfecho')}</p>
        </div>
      </div>
    </div>
  </Frame>
);

const MarketingFeatureGrid: React.FC<{ props: BlockProps }> = ({ props }) => (
  <Frame className="p-5 sm:p-7">
    <div className="mx-auto flex h-full max-w-5xl flex-col justify-center gap-5">
      <div className="text-center">
        <p className="text-caption font-black uppercase tracking-[0.2em] text-primary">{text(props, 'eyebrow', 'PUNTOS CLAVE')}</p>
        <h2 className="mt-2 text-h2 font-display font-black">{text(props, 'title', 'Lo importante, en un vistazo')}</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {list(props.items, ['Información transparente', 'Opciones comparables', 'Acompañamiento humano']).map((item) => (
          <div key={item} className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
            <CheckCircle2 className="mb-3 size-5 text-primary" />
            <p className="text-sm font-bold leading-snug text-text-main">{item}</p>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

const MarketingPromoCard: React.FC<{ props: BlockProps }> = ({ props }) => (
  <Frame dark className="rounded-[2rem] p-5 sm:p-7">
    <div className="flex h-full flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-h3 font-display font-black">{text(props, 'provider', 'VitaBlue')}</p>
          <p className="text-caption font-semibold text-brand-cyan">{text(props, 'productName', 'Una opción más clara')}</p>
        </div>
        <span className="rounded-full bg-white px-2 py-1 text-[8px] font-black tracking-wider text-primary">{text(props, 'badgeText', 'SIN COMPROMISO')}</span>
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-brand-cyan">{text(props, 'visaLabel', 'ACOMPAÑAMIENTO HUMANO')}</p>
        <div className="mt-1 space-y-1 text-xs font-bold text-white/90">
          {list(props.features, ['Compara alternativas', 'Decide con calma']).map((feature) => <p key={feature}>{feature}</p>)}
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div className="flex size-9 items-center justify-center rounded-full bg-white text-primary"><Check className="size-4 stroke-[3]" /></div>
      </div>
    </div>
  </Frame>
);

const InsuranceProductHero: React.FC<{ props: BlockProps }> = ({ props }) => (
  <Frame dark>
    <div className="flex h-full flex-col justify-center gap-4 p-5 sm:p-7">
      <div className="flex flex-wrap gap-2">
        {list(props.badges, ['Seguro médico para estudiantes', 'Visado garantizado']).map((badge, index) => (
          <span key={badge} className={`rounded-full px-2.5 py-1 text-[9px] font-black ${index ? 'bg-accent/20 text-accent' : 'bg-white/10 text-brand-cyan'}`}>{badge}</span>
        ))}
      </div>
      <h2 className="text-h1 font-display font-black leading-tight">{text(props, 'title', 'Encuentra una cobertura que cumple con tu visado')}</h2>
      <p className="max-w-xl text-body-reg font-medium leading-relaxed text-slate-200">{text(props, 'description', 'Comparamos alternativas para ayudarte a decidir.')}</p>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-xl bg-accent px-3 py-2 text-xs font-black text-primary-dark">{text(props, 'primaryAction', 'Calcular mi seguro')} <ArrowRight className="ml-1 inline size-3.5" /></span>
        <span className="rounded-xl border border-white/20 px-3 py-2 text-xs font-bold text-white">{text(props, 'secondaryAction', 'Hablar con un asesor')}</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-3 text-[10px] font-semibold text-slate-300">
        {list(props.highlights, ['Certificado en 24 horas', 'Repatriación incluida']).map((item) => <span key={item}><Check className="mr-1 inline size-3.5 text-brand-cyan" />{item}</span>)}
      </div>
    </div>
  </Frame>
);

const InsuranceCoverageGrid: React.FC<{ props: BlockProps }> = ({ props }) => {
  const items = objectList<{ title?: string; description?: string }>(props.items, DEFAULT_COVERAGES);
  return (
    <Frame className="p-5 sm:p-7">
      <div className="flex h-full flex-col justify-center gap-4">
        <div className="text-center">
          <p className="text-caption font-black uppercase tracking-[0.2em] text-primary">{text(props, 'eyebrow', 'COBERTURAS PRINCIPALES')}</p>
          <h2 className="mt-2 text-h2 font-display font-black">{text(props, 'title', 'Todo lo que incluye tu póliza')}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {items.map((item, index) => (
            <div key={`${item.title}-${index}`} className="rounded-2xl border border-slate-100 p-4 shadow-sm">
              <ShieldCheck className="mb-3 size-6 text-primary" />
              <h3 className="text-sm font-black leading-tight">{text(item, 'title', 'Cobertura incluida')}</h3>
              <p className="mt-2 text-[11px] font-semibold leading-relaxed text-text-secondary">{text(item, 'description', 'Protección para tu día a día.')}</p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
};

const InsuranceTestimonialGrid: React.FC<{ props: BlockProps }> = ({ props }) => {
  const items = objectList<{ author?: string; meta?: string; comment?: string; stars?: number }>(props.items, DEFAULT_TESTIMONIALS);
  return (
    <Frame className="bg-slate-50/70 p-5 sm:p-7">
      <div className="flex h-full flex-col justify-center gap-4">
        <div className="text-center">
          <p className="text-caption font-black uppercase tracking-[0.2em] text-primary">{text(props, 'eyebrow', 'OPINIONES REALES')}</p>
          <h2 className="mt-2 text-h2 font-display font-black">{text(props, 'title', 'La experiencia de quienes ya confían en nosotros')}</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item, index) => <MarketingTestimonial key={`${item.author}-${index}`} props={item} />)}
        </div>
      </div>
    </Frame>
  );
};

const InsurancePlanComparison: React.FC<{ props: BlockProps }> = ({ props }) => {
  const plans = objectList<{ name?: string; subtitle?: string; description?: string; priceText?: string; isFeatured?: boolean }>(props.plans, DEFAULT_PLANS);
  return (
    <Frame className="bg-slate-50/70 p-5 sm:p-7">
      <div className="flex h-full flex-col justify-center gap-4">
        <div className="text-center">
          <p className="text-caption font-black uppercase tracking-[0.2em] text-primary">{text(props, 'eyebrow', 'MODALIDADES')}</p>
          <h2 className="mt-2 text-h2 font-display font-black">{text(props, 'title', 'Compara tu protección')}</h2>
          <p className="mt-2 text-xs font-semibold text-text-secondary">{text(props, 'description', 'Tres alternativas para elegir con claridad.')}</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div key={`${plan.name}-${index}`} className={`rounded-2xl border p-4 ${plan.isFeatured ? 'border-primary bg-primary text-white shadow-lg' : 'border-slate-100 bg-white'}`}>
              <h3 className="text-sm font-black">{text(plan, 'name', 'Plan')}</h3>
              <p className={`mt-1 text-[10px] font-bold uppercase tracking-wider ${plan.isFeatured ? 'text-brand-cyan' : 'text-text-secondary'}`}>{text(plan, 'subtitle', 'Cobertura')}</p>
              <p className={`mt-3 text-[11px] font-semibold leading-relaxed ${plan.isFeatured ? 'text-slate-200' : 'text-text-secondary'}`}>{text(plan, 'description', 'Protección para tus necesidades.')}</p>
              <p className={`mt-4 text-xs font-black ${plan.isFeatured ? 'text-accent' : 'text-primary'}`}>{text(plan, 'priceText', 'Consultar')}</p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
};

const InsuranceProductCard: React.FC<{ props: BlockProps }> = ({ props }) => (
  <Frame className="relative rounded-3xl border border-slate-100 p-5 shadow-sm sm:p-6">
    {Boolean(props.badge) && <span className="absolute right-0 top-0 rounded-bl-xl bg-primary/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-primary-dark">{text(props, 'badge')}</span>}
    <div className="flex h-full flex-col justify-between gap-4">
      <div>
        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/5 text-primary"><ShieldCheck className="size-5" /></div>
        <h3 className="text-h3 font-display font-black leading-tight">{text(props, 'title', 'Seguro médico')}</h3>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-text-secondary">{text(props, 'tagline', 'Cobertura completa')}</p>
        <p className="mt-3 text-xs font-semibold leading-relaxed text-text-secondary">{text(props, 'description', 'Protección para tu día a día.')}</p>
        <ul className="mt-3 space-y-1.5 border-t border-slate-50 pt-3">
          {list(props.features, ['Hospitalización incluida', 'Asesoramiento humano']).map((feature) => <li key={feature} className="flex gap-1.5 text-[11px] font-semibold text-text-secondary"><CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />{feature}</li>)}
        </ul>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div><p className="text-[9px] font-black uppercase text-text-secondary">Tarifa</p><p className="text-sm font-black">{text(props, 'price', 'Consultar')}</p></div>
        <span className="rounded-lg bg-primary px-3 py-2 text-[10px] font-bold text-white">Ver detalles <ArrowRight className="ml-1 inline size-3" /></span>
      </div>
    </div>
  </Frame>
);

const InsuranceTrustBar: React.FC<{ props: BlockProps }> = ({ props }) => {
  const items = objectList<{ title?: string; description?: string }>(props.items, DEFAULT_TRUST_ITEMS);
  return (
    <Frame className="bg-slate-50 p-5 sm:p-7">
      <div className="grid h-full items-center gap-4 sm:grid-cols-3">
        {items.map((item, index) => (
          <div key={`${item.title}-${index}`} className="flex items-center gap-3">
            <ShieldCheck className="size-7 shrink-0 text-primary" />
            <div><h3 className="text-xs font-black">{text(item, 'title', 'Protección verificada')}</h3><p className="text-[10px] font-semibold text-text-secondary">{text(item, 'description', 'Información revisada.')}</p></div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

const InsuranceProviderBar: React.FC<{ props: BlockProps }> = ({ props }) => (
  <Frame className="p-5 sm:p-7">
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <p className="text-caption text-center font-black uppercase tracking-[0.2em] text-text-secondary">{text(props, 'eyebrow', 'ASEGURADORAS OFICIALES HOMOLOGADAS')}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {list(props.providers, ['Sanitas', 'Adeslas']).map((provider) => <span key={provider} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-display font-black text-primary opacity-70">{provider}</span>)}
      </div>
    </div>
  </Frame>
);

const InsuranceTransparency: React.FC<{ props: BlockProps }> = ({ props }) => (
  <Frame className="p-5 sm:p-7">
    <div className="flex h-full flex-col justify-center gap-3">
      <div><h2 className="text-h3 font-display font-black">{text(props, 'title', 'Transparencia de cobertura')}</h2><p className="mt-1 text-xs font-semibold text-text-secondary">{text(props, 'description', 'Comprueba lo que cubre cada póliza.')}</p></div>
      <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-100 bg-slate-200 sm:grid-cols-2">
        <div className="bg-white p-4"><h3 className="flex items-center gap-2 text-sm font-black"><CheckCircle2 className="size-4 text-brand-cyan" />Lo que SÍ incluye</h3><ul className="mt-3 space-y-2">{list(props.inclusions, ['Sin copagos', 'Repatriación incluida']).map((item) => <li key={item} className="text-[11px] font-semibold text-text-secondary">• {item}</li>)}</ul></div>
        <div className="bg-slate-50 p-4"><h3 className="flex items-center gap-2 text-sm font-black"><XCircle className="size-4 text-rose-500" />Lo que NO cubre</h3><ul className="mt-3 space-y-2">{list(props.exclusions, ['Tratamientos estéticos']).map((item) => <li key={item} className="text-[11px] font-semibold text-text-secondary">• {item}</li>)}</ul></div>
      </div>
      <p className="flex gap-2 rounded-xl bg-primary/5 p-3 text-[10px] font-semibold leading-relaxed text-text-secondary"><Info className="size-4 shrink-0 text-primary" />Mostramos las exclusiones con la misma jerarquía visual para ayudarte a decidir.</p>
    </div>
  </Frame>
);

const InsuranceFaq: React.FC<{ props: BlockProps }> = ({ props }) => {
  const items = objectList<{ question?: string; answer?: string }>(props.items, DEFAULT_FAQ_ITEMS);
  return (
    <Frame className="bg-slate-50/70 p-5 sm:p-7">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center gap-4">
        <div className="text-center"><p className="text-caption font-black uppercase tracking-[0.2em] text-primary">{text(props, 'eyebrow', 'PREGUNTAS FRECUENTES')}</p><h2 className="mt-2 text-h2 font-display font-black">{text(props, 'title', 'Resolvemos tus dudas antes de contratar')}</h2></div>
        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white px-4">{items.map((item, index) => <div key={`${item.question}-${index}`} className="py-3"><p className="flex items-center gap-2 text-xs font-black"><CircleHelp className="size-4 text-primary" />{text(item, 'question', '¿Tienes alguna duda?')}</p><p className="mt-1 pl-6 text-[11px] font-semibold leading-relaxed text-text-secondary">{text(item, 'answer', 'Un asesor puede ayudarte sin compromiso.')}</p></div>)}</div>
      </div>
    </Frame>
  );
};

const InsuranceAdvisorCta: React.FC<{ props: BlockProps }> = ({ props }) => (
  <Frame dark className="p-6 sm:p-8">
    <div className="flex h-full flex-col items-start justify-center gap-3">
      <HeartHandshake className="size-7 text-brand-cyan" />
      <h2 className="text-h2 font-display font-black">{text(props, 'title', '¿Necesitas ayuda para elegir tu seguro?')}</h2>
      <p className="max-w-xl text-body-reg font-medium leading-relaxed text-slate-200">{text(props, 'description', 'Nuestros asesores te orientan de forma gratuita y sin compromiso.')}</p>
      <span className="rounded-xl bg-accent px-4 py-2.5 text-xs font-black text-primary-dark">{text(props, 'ctaText', 'Hablar con un asesor')} <ArrowRight className="ml-1 inline size-3.5" /></span>
    </div>
  </Frame>
);

/**
 * The catalog canvas representation is a CustomGroup made from these small
 * parts. Keeping the parts in this module means the drawer and the canvas
 * still use the same visual language while every editable child has its own
 * layer bounds.
 */
const MarketingBlockPart: React.FC<{
  props: BlockProps;
  layer?: ImageLayer;
  onUpdateLayerProps?: (layerId: string, patch: Record<string, unknown>) => void;
}> = ({ props, layer, onUpdateLayerProps }) => {
  const parentType = String(props.parentBlockType ?? '');
  const part = String(props.part ?? '');
  const value = richText(props, 'text');
  const editableValue = (
    <InlineEditableText
      layerId={layer?.id}
      text={value}
      onSave={(nextValue) => layer && onUpdateLayerProps?.(layer.id, { text: nextValue })}
      as="span"
    />
  );
  const isDark = ['MarketingBrandHero', 'MarketingPromoCard', 'InsuranceProductHero', 'InsuranceAdvisorCta'].includes(parentType);
  const backgroundClass = isDark
    ? 'bg-gradient-to-br from-primary via-primary-dark to-slate-900 text-white'
    : 'bg-white text-text-main';

  if (part === 'background') {
    return <div className={`h-full w-full ${backgroundClass} ${parentType === 'MarketingTestimonial' || parentType === 'MarketingPromoCard' || parentType === 'InsuranceProductCard' ? 'rounded-3xl' : ''}`} />;
  }

  const common = 'h-full w-full overflow-hidden';
  if (part === 'eyebrow' || part === 'label' || part === 'tagline' || part === 'meta') {
    return <p className={`${common} text-caption flex items-center font-black uppercase tracking-[0.14em] ${isDark ? 'text-brand-cyan' : 'text-primary'}`}>{editableValue}</p>;
  }
  if (part === 'title') {
    return <h2 className={`${common} text-h2 flex items-center font-display font-black leading-tight ${isDark ? 'text-white' : 'text-text-main'}`}>{editableValue}</h2>;
  }
  if (part === 'description') {
    return <p className={`${common} flex items-center text-body-reg font-medium leading-relaxed ${isDark ? 'text-slate-200' : 'text-text-secondary'}`}>{editableValue}</p>;
  }
  if (part === 'cta' || part === 'primaryAction') {
    return <div className="flex h-full w-full items-center justify-center rounded-xl bg-accent px-3 text-center text-xs font-black text-primary-dark">{editableValue}<ArrowRight className="ml-1 size-3.5" /></div>;
  }
  if (part === 'secondaryAction') {
    return <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/20 px-3 text-center text-xs font-bold text-white">{editableValue}</div>;
  }
  if (part === 'stars') return <Stars value={Math.max(1, Math.min(5, Number(value) || 5))} />;
  if (part === 'icon') {
    return <div className="flex h-full w-full items-center justify-center rounded-xl bg-primary/10 text-lg font-black text-primary">{value}</div>;
  }
  if (part === 'badge') {
    return <div className={`flex h-full w-full items-center justify-center rounded-full px-2 text-center text-[9px] font-black uppercase ${isDark ? 'bg-white/10 text-brand-cyan' : 'bg-primary/10 text-primary-dark'}`}>{editableValue}</div>;
  }
  if (part === 'feature' || part === 'features' || part === 'highlights' || part === 'providers') {
    return <div className={`${common} flex flex-wrap content-center items-center gap-2 rounded-xl border border-primary/10 bg-primary/5 p-2 text-xs font-bold leading-relaxed ${isDark ? 'border-white/10 bg-white/5 text-slate-200' : 'text-text-secondary'}`}>{editableValue}</div>;
  }
  if (part === 'item' || part === 'plan') {
    return <div className={`${common} rounded-2xl border border-primary/10 bg-primary/5 p-3 text-xs font-bold leading-relaxed ${isDark ? 'border-white/10 bg-white/5 text-slate-200' : 'text-text-main'}`}><CheckCircle2 className="mb-2 size-4 text-primary" />{editableValue}</div>;
  }
  if (part === 'inclusions' || part === 'exclusions') {
    return <div className={`${common} rounded-2xl border border-slate-100 ${part === 'inclusions' ? 'bg-white' : 'bg-slate-50'} p-3 text-xs font-semibold leading-relaxed text-text-secondary`}><strong className="mb-2 block text-sm font-black text-text-main">{part === 'inclusions' ? 'Lo que SÍ incluye' : 'Lo que NO cubre'}</strong>{editableValue}</div>;
  }
  if (part === 'faq') {
    return <div className={`${common} rounded-xl border border-slate-100 bg-white p-3 text-xs font-black text-text-main`}><CircleHelp className="mr-1 inline size-4 text-primary" />{editableValue}</div>;
  }
  if (part === 'price') {
    return <div className="flex h-full w-full items-center justify-center rounded-xl bg-primary/10 text-xs font-black text-primary">{editableValue}</div>;
  }
  return <div className={`${common} flex items-center text-body-reg font-medium text-text-secondary`}>{value}</div>;
};

export const MarketingBlockRenderer: React.FC<{
  blockType?: ImageBlockType;
  props: BlockProps;
  layer?: ImageLayer;
  onUpdateLayerProps?: (layerId: string, patch: Record<string, unknown>) => void;
}> = ({
  blockType,
  props,
  layer,
  onUpdateLayerProps,
}) => {
  // Catalog defaults are the single source of truth for both the drawer and
  // canvas. They also make legacy layers with missing props render usefully.
  const resolvedProps = {
    ...(blockType ? getBlockCatalogItem(blockType)?.defaultProps : {}),
    ...props,
  };

  switch (blockType) {
    case 'MarketingBlockPart': return <MarketingBlockPart props={resolvedProps} layer={layer} onUpdateLayerProps={onUpdateLayerProps} />;
    case 'MarketingBrandHero': return <MarketingBrandHero props={resolvedProps} />;
    case 'MarketingSectionIntro': return <MarketingSectionIntro props={resolvedProps} />;
    case 'MarketingTestimonial': return <MarketingTestimonial props={resolvedProps} />;
    case 'MarketingFeatureGrid': return <MarketingFeatureGrid props={resolvedProps} />;
    case 'MarketingPromoCard': return <MarketingPromoCard props={resolvedProps} />;
    case 'InsuranceProductHero': return <InsuranceProductHero props={resolvedProps} />;
    case 'InsuranceCoverageGrid': return <InsuranceCoverageGrid props={resolvedProps} />;
    case 'InsuranceTestimonialGrid': return <InsuranceTestimonialGrid props={resolvedProps} />;
    case 'InsurancePlanComparison': return <InsurancePlanComparison props={resolvedProps} />;
    case 'InsuranceProductCard': return <InsuranceProductCard props={resolvedProps} />;
    case 'InsuranceTrustBar': return <InsuranceTrustBar props={resolvedProps} />;
    case 'InsuranceProviderBar': return <InsuranceProviderBar props={resolvedProps} />;
    case 'InsuranceTransparency': return <InsuranceTransparency props={resolvedProps} />;
    case 'InsuranceFaq': return <InsuranceFaq props={resolvedProps} />;
    case 'InsuranceAdvisorCta': return <InsuranceAdvisorCta props={resolvedProps} />;
    default: return null;
  }
};
