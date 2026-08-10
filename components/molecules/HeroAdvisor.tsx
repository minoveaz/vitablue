import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '../atoms/Button';

interface HeroAdvisorProps {
  title: string;
  subtitle: string;
  image?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  onSecondaryCtaClick?: () => void;
  badge?: string;
}

export const HeroAdvisor: React.FC<HeroAdvisorProps> = ({
  title,
  subtitle,
  image = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=500',
  ctaText,
  ctaHref,
  onCtaClick,
  secondaryCtaText,
  secondaryCtaHref,
  onSecondaryCtaClick,
  badge = 'Asesoría 100% Humana',
}) => {
  return (
    <section className="relative overflow-hidden py-12 lg:py-16 bg-white rounded-3xl border border-slate-100/80 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 flex flex-col gap-5 text-left">
            {badge && (
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-[10px] font-bold text-primary uppercase tracking-widest">
                <Shield className="w-3.5 h-3.5" />
                {badge}
              </div>
            )}
            
            <h1 className="text-h1 font-display font-black leading-tight tracking-tight text-text-main">
              {title}
            </h1>
            
            <p className="text-body-lg text-text-secondary leading-relaxed max-w-xl font-medium">
              {subtitle}
            </p>
            
            {(ctaText || secondaryCtaText) && (
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {ctaText && (
                  ctaHref ? (
                    <Link to={ctaHref}>
                      <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                        {ctaText}
                      </Button>
                    </Link>
                  ) : (
                    <Button size="lg" onClick={onCtaClick} rightIcon={<ArrowRight size={18} />}>
                      {ctaText}
                    </Button>
                  )
                )}
                {secondaryCtaText && (
                  secondaryCtaHref ? (
                    <Link to={secondaryCtaHref}>
                      <Button size="lg" variant="outline">
                        {secondaryCtaText}
                      </Button>
                    </Link>
                  ) : (
                    <Button size="lg" variant="outline" onClick={onSecondaryCtaClick}>
                      {secondaryCtaText}
                    </Button>
                  )
                )}
              </div>
            )}
          </div>
          
          {/* Image Column */}
          <div className="lg:col-span-5 relative w-full aspect-[4/3] lg:aspect-auto lg:h-[360px] rounded-2xl overflow-hidden shadow-md group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent mix-blend-overlay z-10" />
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
            />
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroAdvisor;
