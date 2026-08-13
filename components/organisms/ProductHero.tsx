import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

export interface ProductHeroBadge {
  label: string;
  icon?: React.ReactNode;
  tone?: 'brand' | 'accent';
}

export interface ProductHeroAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'accent' | 'outline';
}

export interface ProductHeroProps {
  badges: ProductHeroBadge[];
  title: string;
  description: string;
  primaryAction: ProductHeroAction;
  secondaryAction?: ProductHeroAction;
  highlights?: string[];
  children?: React.ReactNode;
}

const ProductHero: React.FC<ProductHeroProps> = ({
  badges,
  title,
  description,
  primaryAction,
  secondaryAction,
  highlights = [],
  children,
}) => {
  const renderAction = (action: ProductHeroAction, isPrimary: boolean) => {
    const button = (
      <Button
        size="lg"
        variant={action.variant ?? (isPrimary ? 'accent' : 'outline')}
        onClick={action.onClick}
        rightIcon={isPrimary ? <ArrowRight size={18} /> : undefined}
        className={`whitespace-nowrap ${!isPrimary ? 'border-white/20 text-white hover:bg-white/10' : ''}`}
      >
        {action.label}
      </Button>
    );

    return action.href ? (
      <a href={action.href} className="inline-flex items-center justify-center">
        {button}
      </a>
    ) : (
      button
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-slate-900 py-16 text-left text-white lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(148,210,189,0.12),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-12">
        <div className={children ? 'lg:col-span-7' : 'lg:col-span-9'}>
          <div className="flex flex-wrap gap-2.5">
            {badges.map((badge) => (
              <Badge
                key={badge.label}
                variant={badge.tone === 'accent' ? 'accent' : 'success'}
                size="md"
                className={`gap-1.5 px-3.5 py-1.5 ${
                  badge.tone === 'accent'
                    ? '!border !border-accent/30 !bg-accent/20 !text-accent-dark'
                    : '!bg-white/10 !text-brand-cyan'
                }`}
              >
                {badge.icon}
                {badge.label}
              </Badge>
            ))}
          </div>

          <h1 className="mt-6 text-h1 font-display font-black leading-tight tracking-tight">{title}</h1>
          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-slate-200">{description}</p>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            {renderAction(primaryAction, true)}
            {secondaryAction && renderAction(secondaryAction, false)}
          </div>

          {highlights.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-xs font-semibold text-slate-300">
              {highlights.map((highlight) => (
                <span key={highlight} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-cyan" />
                  {highlight}
                </span>
              ))}
            </div>
          )}
        </div>

        {children && <div className="w-full lg:col-span-5">{children}</div>}
      </div>
    </section>
  );
};

export default ProductHero;
