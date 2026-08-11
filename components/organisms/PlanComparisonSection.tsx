import React from 'react';
import PlanCard from '../molecules/PlanCard';

export interface PlanComparisonSectionPlan {
  name?: string;
  title?: string;
  subtitle: string;
  desc?: string;
  description?: string;
  profile?: string;
  priceText?: string;
  tag?: string;
  priceDetail?: string;
  isFeatured?: boolean;
  illustration?: React.ComponentType;
}

export interface PlanComparisonSectionProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  plans: PlanComparisonSectionPlan[];
  onPlanAction?: (plan: PlanComparisonSectionPlan) => void;
  actionLabel?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

const gridClasses = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
} as const;

const PlanComparisonSection: React.FC<PlanComparisonSectionProps> = ({
  eyebrow,
  title,
  description,
  plans,
  onPlanAction,
  actionLabel,
  columns = 3,
  className = '',
}) => (
  <section className={`py-16 sm:py-20 w-full max-w-5xl mx-auto px-6 sm:px-8 text-left bg-slate-50/50 border-t border-b border-slate-100 ${className}`}>
    <div className="text-center space-y-4 mb-12">
      {eyebrow && <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">{eyebrow}</span>}
      <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">{title}</h2>
      {description && <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">{description}</p>}
    </div>
    <div className={`grid gap-8 ${gridClasses[columns]}`}>
      {plans.map((plan, index) => (
        <PlanCard
          key={plan.name ?? plan.title ?? index}
          title={plan.title ?? plan.name ?? ''}
          subtitle={plan.subtitle}
          description={plan.description ?? plan.desc ?? ''}
          profile={plan.profile ?? ''}
          priceText={plan.priceText ?? ''}
          illustration={plan.illustration}
          tag={plan.tag}
          priceDetail={plan.priceDetail}
          isFeatured={plan.isFeatured}
          onAction={onPlanAction ? () => onPlanAction(plan) : undefined}
          actionLabel={actionLabel}
        />
      ))}
    </div>
  </section>
);

export default PlanComparisonSection;