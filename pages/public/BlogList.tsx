import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useSearchParams } from 'react-router-dom';
import { 
  GraduationCap, 
  Laptop, 
  Home, 
  Baby, 
  Sparkles, 
  Search, 
  X, 
  ArrowUpDown 
} from 'lucide-react';
import BlogHeader from '@/components/molecules/BlogHeader';
import BlogPostCard from '@/components/molecules/BlogPostCard';
import BlogAdvisorCta from '@/components/molecules/BlogAdvisorCta';
import BlogFeaturedHero from '@/components/molecules/BlogFeaturedHero';
import BlogGridInteractiveCard from '@/components/molecules/BlogGridInteractiveCard';
import BlogSidebarFilters, { 
  ProfileFilterOption, 
  QuickTopicOption 
} from '@/components/molecules/BlogSidebarFilters';
import BlogPagination from '@/components/molecules/BlogPagination';
import { blogPosts, BlogPostData } from '@/utils/blogData';

// Month dictionary for strict chronological sorting
const monthsMap: Record<string, string> = {
  enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
  julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
  january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
  july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
};

const parseDateToTimestamp = (dateStr: string): number => {
  const parts = dateStr.trim().toLowerCase().split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0');
    const month = monthsMap[parts[1]] || '01';
    const year = parts[2];
    return new Date(`${year}-${month}-${day}T00:00:00Z`).getTime();
  }
  return 0;
};

const parseReadTimeMinutes = (readTimeStr: string): number => {
  const match = readTimeStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 5;
};

const ITEMS_PER_PAGE = 6;

export const BlogList: React.FC = () => {
  const isEnglish = useLocation().pathname.startsWith('/en');
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedProfile = searchParams.get('perfil') || 'all';
  const selectedTopic = searchParams.get('tema') || 'all';
  const sortOrder = searchParams.get('orden') || 'recent';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Update query params helper
  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || (key === 'page' && val === '1') || (key === 'perfil' && val === 'all') || (key === 'tema' && val === 'all') || (key === 'orden' && val === 'recent')) {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });
    setSearchParams(newParams, { replace: true });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateParams({ search: value ? value : null, page: '1' });
  };

  const handleSelectProfile = (id: string) => {
    updateParams({ perfil: id, page: '1' });
  };

  const handleSelectTopic = (id: string) => {
    updateParams({ tema: id, page: '1' });
  };

  const handleSortChange = (value: string) => {
    updateParams({ orden: value, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage.toString() });
    const contentTop = document.getElementById('blog-main-content');
    if (contentTop) {
      contentTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    const newParams = new URLSearchParams();
    setSearchParams(newParams, { replace: true });
  };

  // Base list filtered by current locale
  const languagePosts = useMemo(
    () => blogPosts.filter((post) => (post.lang || 'es') === (isEnglish ? 'en' : 'es')),
    [isEnglish]
  );

  // Profile options with counts based on metadata & slugs
  const profileOptions: ProfileFilterOption[] = useMemo(() => {
    const countProfile = (matcher: (p: BlogPostData) => boolean) =>
      languagePosts.filter(matcher).length;

    const studentCount = countProfile((p) => 
      p.slug.includes('estudiante') || p.slug.includes('student') || p.slug.includes('consulado') || p.slug.includes('consular')
    );
    const nomadCount = countProfile((p) => 
      p.slug.includes('nomada') || p.slug.includes('nomad')
    );
    const nonLucrativeCount = countProfile((p) => 
      p.slug.includes('no-lucrativa') || p.slug.includes('non-lucrative') || p.slug.includes('pareja-de-hecho') || p.slug.includes('65-anos') || p.slug.includes('over-65')
    );
    const maternityCount = countProfile((p) => 
      p.slug.includes('embarazo') || p.slug.includes('pregnancy') || p.slug.includes('maternity') || p.slug.includes('carencia') || p.slug.includes('waiting-periods')
    );

    if (isEnglish) {
      return [
        { id: 'all', label: 'All Profiles', count: languagePosts.length, icon: <Sparkles className="w-4 h-4" /> },
        { id: 'estudiantes', label: 'International Students', count: studentCount, icon: <GraduationCap className="w-4 h-4" /> },
        { id: 'nomadas', label: 'Digital Nomads & Remote', count: nomadCount, icon: <Laptop className="w-4 h-4" /> },
        { id: 'residencia', label: 'Non-Lucrative & Residency', count: nonLucrativeCount, icon: <Home className="w-4 h-4" /> },
        { id: 'maternidad', label: 'Maternity & Family Care', count: maternityCount, icon: <Baby className="w-4 h-4" /> },
      ];
    }

    return [
      { id: 'all', label: 'Todos los perfiles', count: languagePosts.length, icon: <Sparkles className="w-4 h-4" /> },
      { id: 'estudiantes', label: 'Estudiantes Extranjeros', count: studentCount, icon: <GraduationCap className="w-4 h-4" /> },
      { id: 'nomadas', label: 'Nómadas Digitales y Remoto', count: nomadCount, icon: <Laptop className="w-4 h-4" /> },
      { id: 'residencia', label: 'Residencia No Lucrativa y Expat', count: nonLucrativeCount, icon: <Home className="w-4 h-4" /> },
      { id: 'maternidad', label: 'Maternidad y Familia', count: maternityCount, icon: <Baby className="w-4 h-4" /> },
    ];
  }, [languagePosts, isEnglish]);

  // Quick consular topic pills
  const quickTopics: QuickTopicOption[] = useMemo(() => {
    if (isEnglish) {
      return [
        { id: 'copagos', label: '0€ Copay Policies' },
        { id: 'carencias', label: 'Waiting Periods Waivers' },
        { id: 'devolucion', label: 'Visa Rejection Refund' },
        { id: 'precios', label: '2026 Price Comparison' },
      ];
    }
    return [
      { id: 'copagos', label: 'Pólizas sin Copago' },
      { id: 'carencias', label: 'Eliminación de Carencias' },
      { id: 'devolucion', label: 'Garantía de Devolución' },
      { id: 'precios', label: 'Tabla de Precios 2026' },
    ];
  }, [isEnglish]);

  // Featured hero post
  const featuredPost = useMemo(() => {
    const preferredSlug = isEnglish
      ? 'asisa-student-insurance-spain-visa-validity'
      : 'asisa-sanitas-adeslas-comparativa-visado-estudiante-espana';

    return languagePosts.find((p) => p.slug === preferredSlug) || languagePosts[0];
  }, [languagePosts, isEnglish]);

  const hasActiveFilters = selectedProfile !== 'all' || selectedTopic !== 'all' || Boolean(searchQuery.trim());
  const isDefaultView = !hasActiveFilters && currentPage === 1;

  // Filtered and sorted posts
  const filteredAndSortedPosts = useMemo(() => {
    let list = [...languagePosts];

    // Filter by Profile
    if (selectedProfile !== 'all') {
      if (selectedProfile === 'estudiantes') {
        list = list.filter((p) => p.slug.includes('estudiante') || p.slug.includes('student') || p.slug.includes('consulado') || p.slug.includes('consular'));
      } else if (selectedProfile === 'nomadas') {
        list = list.filter((p) => p.slug.includes('nomada') || p.slug.includes('nomad'));
      } else if (selectedProfile === 'residencia') {
        list = list.filter((p) => p.slug.includes('no-lucrativa') || p.slug.includes('non-lucrative') || p.slug.includes('pareja-de-hecho') || p.slug.includes('65-anos') || p.slug.includes('over-65'));
      } else if (selectedProfile === 'maternidad') {
        list = list.filter((p) => p.slug.includes('embarazo') || p.slug.includes('pregnancy') || p.slug.includes('maternity') || p.slug.includes('carencia') || p.slug.includes('waiting-periods'));
      }
    }

    // Filter by Topic
    if (selectedTopic !== 'all') {
      if (selectedTopic === 'copagos') {
        list = list.filter((p) => p.slug.includes('copag') || p.slug.includes('copay'));
      } else if (selectedTopic === 'carencias') {
        list = list.filter((p) => p.slug.includes('carencia') || p.slug.includes('waiting-periods'));
      } else if (selectedTopic === 'devolucion') {
        list = list.filter((p) => p.slug.includes('rechazo') || p.slug.includes('rejection') || p.slug.includes('devolucion') || p.slug.includes('refund'));
      } else if (selectedTopic === 'precios') {
        list = list.filter((p) => p.slug.includes('precio') || p.slug.includes('price') || p.slug.includes('comparativa'));
      }
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortOrder === 'recent') {
      list.sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));
    } else if (sortOrder === 'popular') {
      // Prioritize primary cornerstone visa articles
      list.sort((a, b) => {
        const aIsCornerstone = a.slug.includes('comparativa') || a.slug.includes('requirements') || a.slug.includes('requisitos') ? 1 : 0;
        const bIsCornerstone = b.slug.includes('comparativa') || b.slug.includes('requirements') || b.slug.includes('requisitos') ? 1 : 0;
        return bIsCornerstone - aIsCornerstone;
      });
    } else if (sortOrder === 'readTime') {
      list.sort((a, b) => parseReadTimeMinutes(a.readTime) - parseReadTimeMinutes(b.readTime));
    }

    return list;
  }, [languagePosts, selectedProfile, selectedTopic, searchQuery, sortOrder]);

  // List of posts to render in current page
  const paginatedPosts = useMemo(() => {
    let postsToPaginate = filteredAndSortedPosts;
    
    // In default first page, remove hero post from grid to avoid duplicate visual
    if (isDefaultView && featuredPost) {
      postsToPaginate = postsToPaginate.filter((p) => p.slug !== featuredPost.slug);
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return postsToPaginate.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedPosts, isDefaultView, featuredPost, currentPage]);

  const totalGridItems = useMemo(() => {
    let total = filteredAndSortedPosts.length;
    if (isDefaultView && featuredPost && total > 0) total -= 1;
    return Math.max(0, total);
  }, [filteredAndSortedPosts.length, isDefaultView, featuredPost]);

  const totalPages = Math.ceil(totalGridItems / ITEMS_PER_PAGE) || 1;

  // SEO tags
  useEffect(() => {
    const title = isEnglish ? 'Guides & Consular Hub | VitaBlue Blog' : 'Hub de Guías y Visados | Blog VitaBlue';
    const description = isEnglish
      ? 'Expert guides on health insurance, visa requirements and immigration compliance in Spain.'
      : 'Guías de expertos sobre seguros de salud, requisitos consulares y extranjería en España.';

    [['og:title', title], ['og:description', description], ['og:image', 'https://www.vitablue.es/og-image.jpg']].forEach(
      ([property, content]) => {
        let tag = document.head.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      }
    );
  }, [isEnglish]);

  // Active filter label badge
  const activeProfileLabel = profileOptions.find((p) => p.id === selectedProfile)?.label;

  return (
    <div className="w-full flex flex-col bg-background-light">
      <Helmet>
        <title>{isEnglish ? 'Guides & Consular Hub | VitaBlue Blog' : 'Hub de Guías y Visados | Blog VitaBlue'}</title>
        <meta
          name="description"
          content={
            isEnglish
              ? 'Expert guides on health insurance, visa requirements and immigration compliance in Spain.'
              : 'Guías de expertos sobre seguros de salud, requisitos consulares y extranjería en España.'
          }
        />
        <link rel="canonical" href={`https://www.vitablue.es${isEnglish ? '/en/blog/' : '/blog/'}`} />
        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/blog/" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/blog/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/blog/" />
      </Helmet>

      <BlogHeader isEnglish={isEnglish} />

      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12" id="blog-main-content">
        <div className="mx-auto w-full max-w-7xl">
          
          {/* Main Knowledge Hub Layout: Compact 280px sidebar on desktop, fluid rest */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
            
            {/* LEFT COLUMN: Compact Sidebar Filters */}
            <div className="w-full">
              <BlogSidebarFilters
                isEnglish={isEnglish}
                selectedProfile={selectedProfile}
                selectedTopic={selectedTopic}
                profileOptions={profileOptions}
                quickTopics={quickTopics}
                onSelectProfile={handleSelectProfile}
                onSelectTopic={handleSelectTopic}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {/* RIGHT COLUMN: Search Header, Content & Grid */}
            <main className="w-full min-w-0 space-y-6 sm:space-y-8">
              
              {/* Controls Bar: Search & Sort Dropdown */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-left">
                <div className="relative flex-1 group">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-primary transition-colors pointer-events-none" />
                  <input
                    type="text"
                    placeholder={
                      isEnglish 
                        ? 'Search guides (e.g. Asisa, copay, visa)...' 
                        : 'Buscar guías (ej: Asisa, copagos, visado)...'
                    }
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full h-10 pl-10 pr-9 rounded-2xl bg-slate-50 border border-slate-200/60 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 text-xs font-semibold text-text-main outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-text-main cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-caption font-bold text-text-secondary bg-slate-50 px-3 h-10 rounded-2xl border border-slate-200/60">
                    <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
                    <select
                      value={sortOrder}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="bg-transparent text-caption font-black text-text-main focus:outline-none cursor-pointer pr-1"
                      aria-label={isEnglish ? 'Sort guides' : 'Ordenar guías'}
                    >
                      <option value="recent">{isEnglish ? 'Most Recent' : 'Más recientes'}</option>
                      <option value="popular">{isEnglish ? 'Most Popular' : 'Más populares'}</option>
                      <option value="readTime">{isEnglish ? 'Reading Time' : 'Tiempo lectura'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filter Pill indicator if any filter is on */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-2xl px-5 py-3 text-xs shadow-xs text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-text-secondary font-medium">{isEnglish ? 'Filtered by:' : 'Filtrando por:'}</span>
                    {selectedProfile !== 'all' && (
                      <span className="font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                        {activeProfileLabel}
                      </span>
                    )}
                    {selectedTopic !== 'all' && (
                      <span className="font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-lg">
                        {quickTopics.find((t) => t.id === selectedTopic)?.label}
                      </span>
                    )}
                    {searchQuery && (
                      <span className="font-bold text-text-main bg-slate-100 px-2.5 py-1 rounded-lg">
                        "{searchQuery}"
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-primary hover:text-primary-dark font-bold text-caption underline cursor-pointer"
                  >
                    {isEnglish ? 'Clear all filters' : 'Limpiar todos los filtros'}
                  </button>
                </div>
              )}

              {/* Featured Hero Article only displayed on default initial view */}
              {isDefaultView && featuredPost && (
                <BlogFeaturedHero post={featuredPost} isEnglish={isEnglish} />
              )}

              {/* Grid of Articles (2 columns on tablet and desktop) */}
              {paginatedPosts.length > 0 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 text-left">
                    {paginatedPosts.map((post, index) => (
                      <React.Fragment key={post.slug}>
                        {index === 2 && (
                          <div className="sm:col-span-2">
                            <BlogGridInteractiveCard isEnglish={isEnglish} />
                          </div>
                        )}
                        <BlogPostCard post={post} />
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Accessible Numeric Pagination Bar */}
                  <BlogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalGridItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    isEnglish={isEnglish}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
                  <p className="text-base font-bold text-text-main">
                    {isEnglish
                      ? 'No guides match the selected profile or search query.'
                      : 'No hemos encontrado guías con los filtros seleccionados.'}
                  </p>
                  <p className="text-caption text-text-secondary max-w-md mx-auto">
                    {isEnglish
                      ? 'Try clearing active filters or searching with a different term.'
                      : 'Prueba a restablecer los filtros para explorar todas las publicaciones disponibles.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
                  >
                    {isEnglish ? 'Show all articles' : 'Ver todos los artículos'}
                  </button>
                </div>
              )}

            </main>

          </div>

        </div>
      </section>

      <BlogAdvisorCta isEnglish={isEnglish} variant="list" />
    </div>
  );
};

export default BlogList;
