import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useSearchParams } from 'react-router-dom';
import BlogHeader from '@/components/molecules/BlogHeader';
import BlogFilterBar from '@/components/molecules/BlogFilterBar';
import BlogPostCard from '@/components/molecules/BlogPostCard';
import BlogAdvisorCta from '@/components/molecules/BlogAdvisorCta';
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
  const categories = isEnglish ? [{ value: 'all', label: 'All Articles' }, { value: 'visados', label: 'Visas & NIE' }] : [{ value: 'all', label: 'Todos los artículos' }, { value: 'visados', label: 'Visados y NIE' }, { value: 'tramites', label: 'Trámites en España' }];
  const filteredPosts = blogPosts.filter((post) => (post.lang || 'es') === (isEnglish ? 'en' : 'es')).filter((post) => selectedCategory === 'all' || post.category === selectedCategory).filter((post) => { const query = searchQuery.toLowerCase(); return !query || post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query) || post.categoryLabel.toLowerCase().includes(query); });
  useEffect(() => {
    const title = isEnglish ? 'Guides and Advice | VitaBlue Blog' : 'Guías y Consejos | Blog VitaBlue';
    const description = isEnglish ? 'Expert guides on health insurance and immigration in Spain.' : 'Guías de expertos sobre seguros de salud y extranjería en España.';
    [['og:title', title], ['og:description', description], ['og:image', 'https://www.vitablue.es/vitablue_logo_social.jpg']].forEach(([property, content]) => {
      let tag = document.head.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag); }
      tag.setAttribute('content', content);
    });
  }, [isEnglish]);

  return <div className="w-full flex flex-col bg-background-light"><Helmet><title>{isEnglish ? 'Guides and Advice | VitaBlue Blog' : 'Guías y Consejos | Blog VitaBlue'}</title><meta name="description" content={isEnglish ? 'Expert guides on health insurance and immigration in Spain.' : 'Guías de expertos sobre seguros de salud y extranjería en España.'} /><link rel="canonical" href={`https://www.vitablue.es${isEnglish ? '/en/blog' : '/blog'}`} /></Helmet><BlogHeader isEnglish={isEnglish} /><section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16"><div className="mx-auto w-full max-w-6xl space-y-10"><BlogFilterBar query={searchQuery} categories={categories} selectedCategory={selectedCategory} isEnglish={isEnglish} onQueryChange={handleSearchChange} onCategoryChange={setSelectedCategory} />{filteredPosts.length ? <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{filteredPosts.map((post) => <BlogPostCard key={post.slug} post={post} />)}</div> : <div className="text-center py-16 space-y-4"><p className="text-lg font-bold text-text-secondary">{isEnglish ? 'No articles match your search criteria.' : 'No se han encontrado artículos que coincidan con tu búsqueda.'}</p><button type="button" onClick={() => { setSelectedCategory('all'); handleSearchChange(''); }} className="text-sm font-bold text-primary hover:underline bg-transparent border-0">{isEnglish ? 'Clear filters and search' : 'Limpiar filtros y búsqueda'}</button></div>}</div></section><BlogAdvisorCta isEnglish={isEnglish} variant="list" /></div>;
};
export default BlogList;
