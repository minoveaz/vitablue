import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ChevronRight, ShieldCheck, Search, X } from 'lucide-react';
import { blogPosts, BlogPostData } from '@/utils/blogData';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon';

export const BlogList: React.FC = () => {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value) {
      setSearchParams({ search: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const categories = isEnglish ? [
    { value: 'all', label: 'All Articles' },
    { value: 'visados', label: 'Visas & NIE' }
  ] : [
    { value: 'all', label: 'Todos los artículos' },
    { value: 'visados', label: 'Visados y NIE' },
    { value: 'tramites', label: 'Trámites en España' }
  ];

  const filteredPostsByLang = blogPosts.filter(post => {
    const postLang = post.lang || 'es';
    return isEnglish ? postLang === 'en' : postLang === 'es';
  });

  const filteredPostsBySearch = filteredPostsByLang.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.categoryLabel.toLowerCase().includes(query)
    );
  });

  const filteredPosts = selectedCategory === 'all'
    ? filteredPostsBySearch
    : filteredPostsBySearch.filter(post => post.category === selectedCategory);

  return (
    <div className="w-full flex flex-col bg-background-light">
      <Helmet>
        <title>{isEnglish ? 'Guides and Advice on Health Insurance and Immigration | VitaBlue Blog' : 'Guías y Consejos sobre Seguros de Salud y Extranjería | Blog VitaBlue'}</title>
        <meta 
          name="description" 
          content={isEnglish ? 'Learn about health insurance requirements for student visas, non-lucrative residency, and immigration procedures in Spain. Guides written by experts.' : 'Infórmate sobre los requisitos de seguros médicos para visado de estudiante, residencia no lucrativa y trámites de extranjería en España. Guías redactadas por expertos.'} 
        />
        <link rel="canonical" href={isEnglish ? 'https://www.vitablue.es/en/blog' : 'https://www.vitablue.es/blog'} />
          <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/blog" />
          <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/blog" />
          <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/blog" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={isEnglish ? 'Guides and Advice on Health Insurance and Immigration | VitaBlue Blog' : 'Guías y Consejos sobre Seguros de Salud y Extranjería | Blog VitaBlue'} />
        <meta property="og:description" content={isEnglish ? 'Learn about health insurance requirements for student visas, non-lucrative residency, and immigration procedures in Spain. Guides written by experts.' : 'Infórmate sobre los requisitos de seguros médicos para visado de estudiante, residencia no lucrativa y trámites de extranjería en España. Guías redactadas por expertos.'} />
        <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <meta property="og:url" content={isEnglish ? 'https://www.vitablue.es/en/blog' : 'https://www.vitablue.es/blog'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={isEnglish ? 'Guides and Advice on Health Insurance and Immigration | VitaBlue Blog' : 'Guías y Consejos sobre Seguros de Salud y Extranjería | Blog VitaBlue'} />
        <meta name="twitter:description" content={isEnglish ? 'Learn about health insurance requirements for student visas, non-lucrative residency, and immigration procedures in Spain. Guides written by experts.' : 'Infórmate sobre los requisitos de seguros médicos para visado de estudiante, residencia no lucrativa y trámites de extranjería en España. Guías redactadas por expertos.'} />
        <meta name="twitter:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
      </Helmet>

      {/* Header section with soft gradient background */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12 sm:pb-16 bg-gradient-to-b from-primary/5 via-background-light to-brand-cyan/10 border-b border-slate-100">
        <div className="mx-auto w-full max-w-6xl text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/10 bg-white/80 backdrop-blur px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-primary shadow-sm select-none">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>{isEnglish ? 'VitaBlue Guides Hub' : 'Centro de Guías VitaBlue'}</span>
          </div>
          
          <h1 className="text-h1 font-display font-black text-text-main max-w-3xl mx-auto leading-tight">
            {isEnglish ? 'Solve your doubts about health insurance and immigration' : 'Resuelve tus dudas sobre seguros de salud y extranjería'}
          </h1>
          
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {isEnglish ? 'Explaining and updated articles so your NIE, TIE or Visa in Spain gets approved on the first try.' : 'Artículos explicativos y actualizados para que aprueben tu NIE, TIE o Visado en España a la primera.'}
          </p>
        </div>
      </section>

      {/* Filter and Grid section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          {/* Search bar */}
          <div className="max-w-md mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text"
              placeholder={isEnglish ? 'Search guides (e.g. visa, copay)...' : 'Buscar guías (ej: visado, copago)...'}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-12 pl-12 pr-10 rounded-2xl bg-white border border-slate-200/80 shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 text-sm font-semibold text-text-main placeholder-slate-400/80 outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => handleSearchChange('')}
                className="absolute inset-y-0 right-3 flex items-center px-1.5 text-slate-400 hover:text-text-main transition-colors cursor-pointer bg-transparent border-0"
                title={isEnglish ? 'Clear search' : 'Limpiar búsqueda'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-150 pb-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-primary text-white shadow-md shadow-primary/10'
                    : 'bg-white hover:bg-slate-50 text-text-secondary border border-slate-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post: BlogPostData) => (
                <article 
                  key={post.slug}
                  className="group flex flex-col bg-white rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden"
                >
                  {/* Featured Image */}
                  <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-primary select-none shadow-sm">
                      {post.categoryLabel}
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="flex-1 flex flex-col p-6 sm:p-8 space-y-4">
                    {/* Meta info row */}
                    <div className="flex items-center gap-4 text-[11px] font-bold text-text-secondary/70">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary/60" /> {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary/60" /> {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-h3 font-display font-black text-text-main group-hover:text-primary transition-colors duration-150 leading-tight">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-body-reg text-text-secondary/90 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Footer Row (Author & Arrow link) */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      {/* Author card with tiny verified stamp */}
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div className="text-left">
                          <p className="text-[10px] font-bold text-text-main flex items-center gap-0.5 leading-none">
                            {post.author.name}
                            {post.author.verified && <ShieldCheck className="w-3 h-3 text-sky-500 fill-sky-50" />}
                          </p>
                          <span className="text-[8px] text-text-secondary/70 font-semibold block mt-0.5">Asesor experto</span>
                        </div>
                      </div>

                      {/* Go to post link */}
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-xs font-bold text-primary group-hover:text-primary-dark flex items-center gap-1 transition-colors"
                      >
                        Leer más <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <p className="text-lg font-bold text-text-secondary">
                {isEnglish 
                  ? 'No articles match your search criteria.' 
                  : 'No se han encontrado artículos que coincidan con tu búsqueda.'}
              </p>
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  handleSearchChange('');
                }} 
                className="text-sm font-bold text-primary hover:underline cursor-pointer bg-transparent border-0"
              >
                {isEnglish ? 'Clear filters and search' : 'Limpiar filtros y búsqueda'}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* CTA Box to advisor */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mx-auto w-full max-w-4xl bg-gradient-to-br from-primary to-primary-dark rounded-[40px] p-8 sm:p-12 text-center text-white space-y-6 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(148,210,189,0.15),transparent_60%)] pointer-events-none" />
          <h2 className="text-h2 font-display font-black leading-tight">
            ¿Tienes dudas sobre los requisitos de tu seguro?
          </h2>
          <p className="text-body-lg text-slate-100 max-w-xl mx-auto leading-relaxed">
            Nuestros asesores expertos en visados y extranjería revisarán tu caso sin coste alguno y te recomendarán la póliza homologada exacta que necesitas.
          </p>
          <div className="pt-2 flex justify-center">
            <a 
              href="https://wa.me/34694583452?text=Hola!%20Vengo%20del%20blog%20de%20VitaBlue.%20Necesito%20asesoramiento%20sobre%20seguros%20m%C3%A9dicos%20para%20tr%C3%A1mites%20legales."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold rounded-xl text-sm px-6 py-3.5 shadow-md shadow-whatsapp/20 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-whatsapp/20"
            >
              <WhatsAppIcon size={18} className="fill-white" />
              <span>Hablar con un Asesor por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogList;
