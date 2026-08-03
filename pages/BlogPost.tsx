import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ChevronLeft, ShieldCheck, HelpCircle, ArrowRight, Star } from 'lucide-react';
import { blogPosts, BlogPostData } from '@/utils/blogData';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon';
import Button from '@/components/atoms/Button';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const post = useMemo(() => {
    return blogPosts.find(p => p.slug === slug);
  }, [slug]);

  const isPostEnglish = useMemo(() => {
    return post?.lang === 'en';
  }, [post]);

  const alternateSlugs: Record<string, string> = {
    'requisitos-seguro-medico-visado-estudiante-espana': 'student-visa-spain-health-insurance-requirements',
    'student-visa-spain-health-insurance-requirements': 'requisitos-seguro-medico-visado-estudiante-espana',
    'seguro-medico-residencia-no-lucrativa-espana': 'health-insurance-spain-non-lucrative-visa-requirements',
    'health-insurance-spain-non-lucrative-visa-requirements': 'seguro-medico-residencia-no-lucrativa-espana'
  };

  const alternateSlug = useMemo(() => {
    return post ? alternateSlugs[post.slug] : undefined;
  }, [post]);

  if (!post) {
    return <Navigate to={isPostEnglish ? "/en/blog" : "/blog"} replace />;
  }

  // Generate Table of Contents items dynamically from headings
  const tocItems = useMemo(() => {
    return post.sections
      .filter(section => section.type === 'heading-2')
      .map(heading => {
        const id = heading.text
          ? heading.text
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
          : '';
        return { text: heading.text || '', id };
      });
  }, [post]);

  return (
    <div className="w-full flex flex-col bg-background-light">
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={isPostEnglish ? `https://www.vitablue.es/en/blog/${post.slug}` : `https://www.vitablue.es/blog/${post.slug}`} />
        
        {alternateSlug && (
          <>
            <link rel="alternate" hreflang="es" href={`https://www.vitablue.es/blog/${isPostEnglish ? alternateSlug : post.slug}`} />
            <link rel="alternate" hreflang="en" href={`https://www.vitablue.es/en/blog/${isPostEnglish ? post.slug : alternateSlug}`} />
            <link rel="alternate" hreflang="x-default" href={`https://www.vitablue.es/blog/${isPostEnglish ? alternateSlug : post.slug}`} />
          </>
        )}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.featuredImage} />
        <meta property="og:url" content={isPostEnglish ? `https://www.vitablue.es/en/blog/${post.slug}` : `https://www.vitablue.es/blog/${post.slug}`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.featuredImage} />
      </Helmet>

      {/* Breadcrumb row & Back button */}
      <div className="bg-white border-b border-slate-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 text-xs font-bold text-text-secondary/70">
          <Link 
            to={isPostEnglish ? "/en/blog" : "/blog"} 
            className="inline-flex items-center gap-1 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> {isPostEnglish ? 'Back to blog' : 'Volver al blog'}
          </Link>
          <div className="flex items-center gap-1.5 select-none">
            <Link to={isPostEnglish ? "/en" : "/"} className="hover:text-primary transition-colors">{isPostEnglish ? 'Home' : 'Inicio'}</Link>
            <span>/</span>
            <Link to={isPostEnglish ? "/en/blog" : "/blog"} className="hover:text-primary transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-text-main/80 truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article Container */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
          
          {/* Main content column */}
          <article className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-6 sm:p-10 lg:p-12 space-y-8 text-left">
            
            {/* Header info */}
            <div className="space-y-4">
              <span className="inline-flex items-center bg-primary/5 border border-primary/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-primary select-none shadow-sm">
                {post.categoryLabel}
              </span>
              <h1 className="text-h1 font-display font-black text-text-main leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 border-b border-slate-100 pb-6 text-xs font-bold text-text-secondary/70">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary/60" /> {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary/60" /> {post.readTime}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5" /> {isPostEnglish ? 'Verified content' : 'Contenido verificado'}
                </span>
              </div>
            </div>

            {/* Author box (EEAT) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-150/60">
              <div className="flex items-center gap-4">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div className="text-left">
                  <span className="text-[9px] text-text-secondary/70 font-black uppercase tracking-wider block">{isPostEnglish ? 'Written by' : 'Redactado por'}</span>
                  <h4 className="text-sm font-bold text-text-main flex items-center gap-1 leading-none mt-0.5">
                    {post.author.name}
                    {post.author.verified && <ShieldCheck className="w-3.5 h-3.5 text-sky-500 fill-sky-50 shrink-0" />}
                  </h4>
                  <p className="text-[10.5px] text-text-secondary leading-tight mt-1">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 select-none self-end sm:self-center">
                <span className="text-[9px] bg-slate-200/50 border border-slate-200 px-2.5 py-1 rounded-full text-text-secondary font-black uppercase tracking-wider">
                  {isPostEnglish ? 'YMYL Qualified' : 'YMYL Calificado'}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Body content loop */}
            <div className="space-y-6 text-text-secondary text-body-lg">
              {post.sections.map((section, idx) => {
                const headingId = section.text && section.type === 'heading-2'
                  ? section.text
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, '')
                      .replace(/\s+/g, '-')
                  : '';

                switch (section.type) {
                  case 'paragraph':
                    return (
                      <p 
                        key={idx} 
                        className="leading-relaxed text-body-lg text-text-secondary/95"
                        dangerouslySetInnerHTML={{ __html: section.text || '' }}
                      />
                    );
                  
                  case 'heading-2':
                    return (
                      <h2 
                        key={idx} 
                        id={headingId} 
                        className="text-h2 font-display font-black text-text-main pt-6 mt-10 mb-4 leading-snug border-t border-slate-50 first:border-0"
                      >
                        {section.text}
                      </h2>
                    );
                  
                  case 'heading-3':
                    return (
                      <h3 
                        key={idx} 
                        className="text-h3 font-display font-black text-text-main mt-6 mb-3 leading-snug"
                      >
                        {section.text}
                      </h3>
                    );

                  case 'list':
                    return (
                      <ul key={idx} className="space-y-3 pl-1 py-2">
                        {section.items?.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="size-5 rounded-full bg-primary/5 border border-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 select-none font-black text-[10px]">
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
                      <div key={idx} className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 text-amber-900 text-body-reg leading-relaxed flex gap-3.5">
                        <span className="text-base select-none shrink-0 mt-0.5">ℹ️</span>
                        <span dangerouslySetInnerHTML={{ __html: section.text || '' }} />
                      </div>
                    );

                  case 'table':
                    return (
                      <div key={idx} className="overflow-x-auto border border-slate-200/80 rounded-2xl shadow-sm my-8">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              {section.tableHeader?.map((header, i) => (
                                <th key={i} className="p-4 font-bold text-text-main tracking-wider uppercase text-[10px]">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-text-secondary">
                            {section.tableRows?.map((row, i) => (
                              <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                {row.map((cell, j) => (
                                  <td key={j} className="p-4 font-semibold">
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

            {/* End of article WhatsApp CTA for all screen sizes (ES/EN) */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-brand-cyan/5 to-white border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 text-left">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-0.5 text-[9px] font-black text-text-secondary select-none shadow-sm uppercase tracking-wider">
                  {isPostEnglish ? 'Immediate Consultation' : 'Consulta Inmediata'}
                </span>
                <h3 className="text-xl font-display font-black text-text-main leading-tight">
                  {isPostEnglish ? 'Do you have questions about the visa health requirements?' : '¿Tienes dudas sobre los requisitos del seguro para tu visado?'}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {isPostEnglish 
                    ? 'Write to us. We will tell you exactly which policy fits your age, nationality, and consular requirements.'
                    : 'Escríbenos. Te aclaramos qué póliza se adapta exactamente a tu edad, nacionalidad y requisitos de Extranjería.'}
                </p>
              </div>
              <a 
                href={isPostEnglish
                  ? `https://wa.me/34694583452?text=Hello!%20I%20come%20from%20the%20guide%20${encodeURIComponent(post.title)}.%20I%20need%20some%20advice.`
                  : `https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20gu%C3%ADa%20de%20${encodeURIComponent(post.title)}.%20Necesito%20asesoramiento%20para%20mi%20seguro.`}
                target="_blank"
                rel="noopener noreferrer"
                data-event="whatsapp"
                onClick={() => {
                  if ((window as any).dataLayer) {
                    (window as any).dataLayer.push({ event: 'click_whatsapp', location: `blog_post_bottom_${post.slug}` });
                  }
                }}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] px-6 py-3.5 text-xs font-black text-white shadow-md shadow-[#25D366]/20 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <WhatsAppIcon size={16} />
                <span>{isPostEnglish ? 'Ask on WhatsApp' : 'Preguntar por WhatsApp'}</span>
              </a>
            </div>

          </article>

          {/* Sidebar column */}
          <aside className="space-y-8 sticky top-28 hidden lg:block">
            
            {/* Table of Contents card */}
            {tocItems.length > 0 && (
              <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-6 text-left">
                <h3 className="text-xs font-black text-text-main uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" /> {isPostEnglish ? 'Article Index' : 'Índice del artículo'}
                </h3>
                <nav className="mt-4">
                  <ul className="space-y-3">
                    {tocItems.map((item, i) => (
                      <li key={i}>
                        <a 
                          href={`#${item.id}`}
                          className="text-xs font-semibold text-text-secondary hover:text-primary flex items-start gap-1.5 leading-snug group transition-colors"
                        >
                          <span className="text-[10px] text-text-secondary/40 font-bold group-hover:text-primary transition-colors shrink-0 mt-0.5">{i + 1}.</span>
                          <span>{item.text}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            {/* Sidebar WhatsApp Consultation CTA */}
            <div className="bg-gradient-to-br from-primary/10 to-brand-cyan/10 rounded-[32px] border border-primary/10 p-6 space-y-5 text-left relative overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-brand-cyan/20 rounded-bl-[80px] pointer-events-none" />
              
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-text-secondary select-none shadow-sm">
                <Star className="w-3 h-3 fill-accent text-accent" /> {isPostEnglish ? 'Free Advice' : 'Te asesoramos gratis'}
              </div>

              <h4 className="text-base font-display font-black text-text-main leading-tight">
                {isPostEnglish ? 'Need health insurance for your visa or residency?' : '¿Necesitas contratar un seguro para tu trámite?'}
              </h4>
              
              <p className="text-xs text-text-secondary leading-relaxed">
                {isPostEnglish 
                  ? 'Our Sanitas policies meet 100% of immigration requirements: zero copays, no waiting periods, and mandatory repatriation.'
                  : 'Nuestras pólizas de Sanitas cumplen el 100% de los requisitos de Extranjería: sin copagos, sin carencias y con repatriación obligatoria.'}
              </p>
              
              <div className="space-y-2 pt-2">
                <a 
                  href={isPostEnglish
                    ? `https://wa.me/34694583452?text=Hello!%20I%20come%20from%20the%20guide%20${encodeURIComponent(post.title)}.%20I%20need%20a%20compliant%20health%20insurance.`
                    : `https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20gu%C3%ADa%20de%20${encodeURIComponent(post.title)}.%20Necesito%20un%20seguro%20m%C3%A9dico%20homologado.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="whatsapp"
                  onClick={() => {
                    if ((window as any).dataLayer) {
                      (window as any).dataLayer.push({ event: 'click_whatsapp', location: `blog_post_sidebar_${post.slug}` });
                    }
                  }}
                  className="w-full flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-md shadow-[#25D366]/10 transition-all duration-200 active:scale-[0.98]"
                >
                  <WhatsAppIcon size={16} className="fill-white" />
                  <span>{isPostEnglish ? 'Consult on WhatsApp' : 'Consultar por WhatsApp'}</span>
                </a>
                
                <Link to="/wizard" className="w-full block">
                  <Button 
                    className="w-full h-11 rounded-xl font-bold px-2 text-xs" 
                    variant="accent"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    {isPostEnglish ? 'Calculate Insurance Online' : 'Calcular Seguro Online'}
                  </Button>
                </Link>
              </div>
            </div>

          </aside>

        </div>
      </section>
    </div>
  );
};

export default BlogPost;
