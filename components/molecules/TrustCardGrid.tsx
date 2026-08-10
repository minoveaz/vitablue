import React from 'react';
import Card from './Card';

export interface TrustCardItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface TrustCardGridProps {
  items: TrustCardItem[];
}

const TrustCardGrid: React.FC<TrustCardGridProps> = ({ items }) => (
  <div className="grid gap-4 md:grid-cols-3">
    {items.map((item) => (
      <Card key={item.title} padding="md" className="border-primary/10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cyan/15 text-primary">{item.icon}</div>
        <h3 className="mt-5 text-h3 font-display font-black text-text-main">{item.title}</h3>
        <p className="mt-2 text-body-reg leading-relaxed text-text-secondary">{item.description}</p>
      </Card>
    ))}
  </div>
);

export default TrustCardGrid;
