import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { BlogSection } from '@/utils/blogData';
import Button from '@/components/atoms/Button';

const headingId = (text = '') => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

const BlogSectionRenderer: React.FC<{ sections: BlogSection[] }> = ({ sections }) => (
  <div className="space-y-6 text-text-secondary text-body-lg">
    {sections.map((section, index) => {
      const id = section.type === 'heading-2' ? headingId(section.text) : '';
      switch (section.type) {
        case 'paragraph':
          return (
            <p
              key={index}
              className="leading-relaxed text-body-lg text-text-secondary/95"
              dangerouslySetInnerHTML={{ __html: section.text || '' }}
            />
          );
        case 'heading-2':
          return (
            <h2
              key={index}
              id={id}
              className="text-h2 font-display font-black text-text-main pt-6 mt-10 mb-4 leading-snug border-t border-slate-50 first:border-0"
            >
              {section.text}
            </h2>
          );
        case 'heading-3':
          return (
            <h3 key={index} className="text-h3 font-display font-black text-text-main mt-6 mb-3 leading-snug">
              {section.text}
            </h3>
          );
        case 'list':
          return (
            <ul key={index} className="space-y-3 pl-1 py-2">
              {section.items?.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3">
                  <span className="size-5 rounded-full bg-primary/5 border border-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px]">
                    ✓
                  </span>
                  <span
                    className="text-body-reg text-text-secondary leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                </li>
              ))}
            </ul>
          );
        case 'callout':
          return (
            <div
              key={index}
              className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 text-amber-900 text-body-reg leading-relaxed flex gap-3.5"
            >
              <span className="text-base shrink-0 mt-0.5">ℹ️</span>
              <span dangerouslySetInnerHTML={{ __html: section.text || '' }} />
            </div>
          );
        case 'cta-wizard':
          return (
            <div
              key={index}
              className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-brand-cyan/5 to-white border border-primary/15 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-caption font-black text-primary uppercase tracking-wider shadow-xs border border-primary/10">
                  <Sparkles className="w-3.5 h-3.5 text-accent fill-accent" />
                  {section.ctaBadge || 'Cotización Instantánea'}
                </span>
                <span className="text-caption font-bold text-text-secondary flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-brand-cyan fill-brand-cyan/20" /> 100% Gratuito
                </span>
              </div>
              <h3 className="text-h3 font-display font-black text-text-main leading-snug">
                {section.ctaTitle || 'Calcula el precio exacto de tu seguro en 30 segundos'}
              </h3>
              <p className="text-body-reg text-text-secondary leading-relaxed max-w-2xl">
                {section.ctaDescription ||
                  'Compara precios de pólizas homologadas para visados y residencia en España sin spam telefónico.'}
              </p>
              <div className="pt-2">
                <Link to={section.ctaLink || '/wizard'} className="inline-block">
                  <Button
                    variant="accent"
                    size="lg"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="shadow-md shadow-accent/20 font-bold"
                  >
                    {section.ctaButtonText || 'Cotizar seguro online'}
                  </Button>
                </Link>
              </div>
            </div>
          );
        case 'table':
          return (
            <div
              key={index}
              role="region"
              aria-label="Tabla del artículo"
              tabIndex={0}
              className="overflow-x-auto border border-slate-200/80 rounded-2xl shadow-sm my-8"
            >
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {section.tableHeader?.map((header) => (
                      <th
                        key={header}
                        className="p-4 font-bold text-text-main tracking-wider uppercase text-[10px]"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-text-secondary">
                  {section.tableRows?.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-slate-50/30 transition-colors">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-4 font-semibold">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        default:
          return null;
      }
    })}
  </div>
);

export default BlogSectionRenderer;

