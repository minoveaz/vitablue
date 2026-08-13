import React from 'react';

export interface CoverageCardProps {
  title: string;
  description: string;
  illustration: React.ComponentType;
}

const CoverageCard: React.FC<CoverageCardProps> = ({ title, description, illustration: Illustration }) => (
  <div className="flex flex-col justify-between rounded-3xl border border-slate-150 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8">
    <div className="space-y-4">
      <div className="mb-4 flex h-16 w-auto aspect-[4/3] items-center justify-start text-primary">
        <Illustration />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-display font-black leading-tight text-text-main">{title}</h3>
        <p className="text-xs font-semibold leading-relaxed text-text-secondary">{description}</p>
      </div>
    </div>
  </div>
);

export default CoverageCard;