import React from 'react';
import { Activity, ArrowRight, CheckCircle2, Layers, Sparkle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';

export interface InsuranceProductCardProps {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  price: string;
  badge?: string;
  link: string;
  external?: boolean;
  icon?: React.ComponentType;
}

const InsuranceProductCard: React.FC<InsuranceProductCardProps> = ({
  title,
  tagline,
  description,
  features,
  price,
  badge,
  link,
  external = false,
  icon: Icon,
}) => {
  const ProductIcon = Icon || (badge === 'Premium' ? Sparkle : external ? Layers : Activity);
  const content = (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-150 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-250 hover:shadow-md sm:p-8">
      {badge && (
        <span className="absolute right-0 top-0 rounded-bl-2xl border-b border-l border-primary/5 bg-primary/10 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-primary-dark">
          {badge}
        </span>
      )}
      <div className="space-y-4">
        <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary">
          <ProductIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-h3 font-display font-black leading-tight text-text-main">{title}</h3>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">{tagline}</p>
        </div>
        <p className="text-xs font-semibold leading-relaxed text-text-secondary">{description}</p>
        <ul className="space-y-2 border-t border-slate-50 pt-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-xs font-semibold text-text-secondary">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-wider text-text-secondary">Tarifa</span>
          <span className="text-sm font-sans font-black text-text-main">{price}</span>
        </div>
        <Button variant={external ? 'accent' : 'primary'} size="sm" className="shrink-0 font-bold shadow-sm" rightIcon={<ArrowRight size={14} />}>
          {external ? 'Consultar por WhatsApp' : 'Ver detalles y cotizar'}
        </Button>
      </div>
    </div>
  );

  return external ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="relative block h-full">
      {content}
    </a>
  ) : (
    <Link to={link} className="relative block h-full">
      {content}
    </Link>
  );
};

export default InsuranceProductCard;
