import React from 'react';
import TransparencyBlock from '@/components/molecules/TransparencyBlock';

interface ProductTransparencySectionProps {
  title?: string;
  description?: string;
  inclusions: string[];
  exclusions: string[];
  className?: string;
}

const ProductTransparencySection: React.FC<ProductTransparencySectionProps> = ({
  title,
  description,
  inclusions,
  exclusions,
  className,
}) => {
  return (
    <section className={`py-16 sm:py-20 max-w-5xl mx-auto px-6 sm:px-8 w-full bg-white text-left ${className ?? ''}`}>
      <TransparencyBlock
        title={title}
        description={description}
        inclusions={inclusions}
        exclusions={exclusions}
      />
    </section>
  );
};

export default ProductTransparencySection;