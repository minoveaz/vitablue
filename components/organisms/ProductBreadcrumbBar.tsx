import React from 'react';
import Breadcrumbs, { BreadcrumbItem } from '../molecules/Breadcrumbs';

export interface ProductBreadcrumbBarProps {
  items: BreadcrumbItem[];
  className?: string;
}

const ProductBreadcrumbBar: React.FC<ProductBreadcrumbBarProps> = ({ items, className = '' }) => (
  <div className={`bg-slate-50/50 border-b border-slate-100 py-3 px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="max-w-6xl mx-auto">
      <Breadcrumbs items={items} />
    </div>
  </div>
);

export default ProductBreadcrumbBar;