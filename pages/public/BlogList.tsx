import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useSearchParams } from 'react-router-dom';
import BlogHeader from '@/components/molecules/BlogHeader';
import BlogFilterBar, { BlogCategoryOption } from '@/components/molecules/BlogFilterBar';
import BlogPostCard from '@/components/molecules/BlogPostCard';
import BlogAdvisorCta from '@/components/molecules/BlogAdvisorCta';
import BlogFeaturedHero from '@/components/molecules/BlogFeaturedHero';
import BlogGridInteractiveCard from '@/components/molecules/BlogGridInteractiveCard';
import { blogPosts } from '@/utils/blogData';

export const BlogList: React.FC = () => {
  const isEnglish = useLocation().pathname.startsWith('/en');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => setSearchQuery(searchParams.get('search') || ''), [searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSearchParams(value ? { search: value } : {}, { replace: true });
  };

  // Base list filtered by language
  const languagePosts = useMemo(
    () => blogPosts.filter((post) => (post.lang || 'es') === (isEnglish ? 'en' : 'es')),
    [isEnglish]
  );

  // Dynamic category options with counts
  const categories: BlogCategoryOption[] = useMemo(() => {
    const total = languagePosts.length;
    const visadosCount = languagePosts.filter((p) => p.category === 'visados').length;
    const tramitesCount = languagePosts.filter((p) => p.category === 'tramites').length;
    const saludCount = languagePosts.filter((p) => p.category === 'salud').length;

    if (isEnglish) {
      return [
        { value: 'all', label: 'All Articles', count: total },
        { value: 'visados', label: 'Visas & NIE', count: visadosCount },
        { value: 'salud', label: 'Health & Expat Care', count: saludCount },
        { value: 'tramites', label: 'Visa Procedures', count: tramitesCount },
      ];
    }
    return [
      { value: 'all', label: 'Todos los artículos', count: total },
      { value: 'visados', label: 'Visados y NIE', count: visadosCount },
      { value: 'tramites', label: 'Trámites en España', count: tramitesCount },
      { value: 'salud', label: 'Salud y Carencias', count: saludCount },
    ];
  }, [languagePosts, isEnglish]);

  // Determine the featured hero post
  const featuredPost = useMemo(() => {
    const preferredSlug = isEnglish
      ? 'asisa-student-insurance-spain-visa-validity'
      : 'asisa-sanitas-adeslas-comparativa-visado-estudiante-espana';

    return languagePosts.find((p) => p.slug === preferredSlug) || languagePosts[0];
  }, [languagePosts, isEnglish]);

  const isDefaultView = selectedCategory === 'all' && !searchQuery.trim();

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return languagePosts
      .filter((post) => selectedCategory === 'all' || post.category === selectedCategory)
      .filter((post) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.categoryLabel.toLowerCase().includes(query)
        );
      });
  }, [languagePosts, selectedCategory, searchQuery]);

  // If in default view, exclude the featured post from the grid to avoid duplication
  const gridPosts = useMemo(() => {
    if (isDefaultView && featuredPost) {
      return filteredPosts.filter((p) => p.slug !== featuredPost.slug);
    }
    return filteredPosts;
  }, [filteredPosts, isDefaultView, featuredPost]);

  useEffect(() => {
    const title = isEnglish ? 'Guides and Advice | VitaBlue Blog' : 'Guías y Consejos | Blog VitaBlue';
    const description = isEnglish
      ? 'Expert guides on health insurance and immigration in Spain.'
      : 'Guías de expertos sobre seguros de salud y extranjería en España.';

    [['og:title', title], ['og:description', description], ['og:image', 'https://www.vitablue.es/vitablue_logo_social.jpg']].forEach(
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

  return (
    <div className="w-full flex flex-col bg-background-light">
      <Helmet>
        <title>{isEnglish ? 'Guides and Advice | VitaBlue Blog' : 'Guías y Consejos | Blog VitaBlue'}</title>
        <meta
          name="description"
          content={
            isEnglish
              ? 'Expert guides on health insurance and immigration in Spain.'
              : 'Guías de expertos sobre seguros de salud y extranjería en España.'
          }
        />
        <link rel="canonical" href={`https://www.vitablue.es${isEnglish ? '/en/blog/' : '/blog/'}`} />
        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/blog/" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/blog/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/blog/" />
      </Helmet>

      <BlogHeader isEnglish={isEnglish} />

      <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          {/* Featured Hero Article when on default view */}
          {isDefaultView && featuredPost && (
            <BlogFeaturedHero post={featuredPost} isEnglish={isEnglish} />
          )}

          {/* Filter Bar with micro-icons and dynamic counters */}
          <BlogFilterBar
            query={searchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            isEnglish={isEnglish}
            onQueryChange={handleSearchChange}
            onCategoryChange={setSelectedCategory}
          />

          {/* Articles Grid with interactive promotional card injected at position #3 */}
          {gridPosts.length ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post, index) => (
                <React.Fragment key={post.slug}>
                  {index === 3 && (
                    <BlogGridInteractiveCard isEnglish={isEnglish} />
                  )}
                  <BlogPostCard post={post} />
                </React.Fragment>
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
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  handleSearchChange('');
                }}
                className="text-sm font-bold text-primary hover:underline bg-transparent border-0 cursor-pointer"
              >
                {isEnglish ? 'Clear filters and search' : 'Limpiar filtros y búsqueda'}
              </button>
            </div>
          )}
        </div>
      </section>

      <BlogAdvisorCta isEnglish={isEnglish} variant="list" />
    </div>
  );
};

export default BlogList;
