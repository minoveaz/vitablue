import React from 'react';

export interface ProductTrustBarItem {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
}

export interface ProductTrustBarProps {
  items: ProductTrustBarItem[];
}

const ProductTrustBar: React.FC<ProductTrustBarProps> = ({ items }) => (
  <section className="py-8 bg-slate-50 border-b border-slate-100">
    <div className="max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-3.5">
          <div className="w-8 h-8 text-primary shrink-0">{item.icon}</div>
          <div>
            <h4 className="text-sm font-bold text-text-main">{item.title}</h4>
            <p className="text-xs text-text-secondary font-semibold">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ProductTrustBar;