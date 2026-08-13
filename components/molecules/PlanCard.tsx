import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

export interface PlanCardProps {
  title: string;
  subtitle: string;
  description: string;
  profile: string;
  priceText: string;
  illustration?: React.ComponentType;
  tag?: string;
  priceDetail?: string;
  isFeatured?: boolean;
  onAction?: () => void;
  actionLabel?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  subtitle,
  description,
  profile,
  priceText,
  illustration: Illustration,
  tag,
  priceDetail,
  isFeatured = false,
  onAction,
  actionLabel = 'Ver modalidad',
}) => (
  <article className={`flex flex-col justify-between rounded-3xl border bg-white p-6 text-left shadow-sm transition-all duration-300 hover:shadow-md sm:p-8 ${isFeatured ? 'border-primary ring-2 ring-primary/5' : 'border-slate-150'}`}>
    <div className="space-y-4">
      {Illustration && <div className="mb-4 flex h-16 w-auto aspect-[4/3] items-center justify-start text-primary"><Illustration /></div>}
      {tag && <span className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-primary">{tag}</span>}
      <div>
        <h3 className="text-lg font-display font-black leading-tight text-text-main">{title}</h3>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">{subtitle}</span>
      </div>
      <p className="text-xs font-medium leading-relaxed text-text-secondary">{description}</p>
    </div>
    <div className="mt-6 border-t border-slate-50 pt-4">
      {priceDetail ? (
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-full border border-slate-150 bg-slate-50 text-primary"><Check className="h-3.5 w-3.5" /></div>
          <span className="text-xs font-bold text-text-main">{priceDetail}</span>
        </div>
      ) : (
        <>
          <span className="block text-[10px] font-bold text-text-secondary">Perfil recomendado:</span>
          <p className="mt-1 text-xs font-bold leading-snug text-text-main">{profile}</p>
          <span className="mt-3 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-secondary">{priceText}</span>
        </>
      )}
      {onAction && <Button variant={isFeatured ? 'primary' : 'outline'} className="mt-4 w-full font-bold" onClick={onAction}>{actionLabel}</Button>}
    </div>
  </article>
);

export default PlanCard;
