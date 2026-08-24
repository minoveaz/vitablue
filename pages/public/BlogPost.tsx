import React, { useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft } from 'lucide-react';
import { blogPosts } from '@/utils/blogData';
import ArticleHeader from '@/components/molecules/ArticleHeader';
import ArticleToc from '@/components/molecules/ArticleToc';
import BlogSectionRenderer from '@/components/molecules/BlogSectionRenderer';
import BlogAdvisorCta from '@/components/molecules/BlogAdvisorCta';

const createHeadingId = (text = '') => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = useMemo(() => blogPosts.find((item) => item.slug === slug), [slug]);
  if (!post) return <Navigate to="/blog" replace />;
  const isEnglish = post.lang === 'en';
  const tocItems = post.sections.filter((section) => section.type === 'heading-2').map((section) => ({ text: section.text || '', id: createHeadingId(section.text) }));
  const blogPath = isEnglish ? '/en/blog' : '/blog';
  const alternatePost = post.alternateSlug ? blogPosts.find((item) => item.slug === post.alternateSlug) : undefined;
  const alternateSlug = alternatePost?.slug;
  const resolvedImageUrl = post.featuredImage.startsWith('http')
    ? post.featuredImage
    : `https://www.vitablue.es${post.featuredImage}`;


  useEffect(() => {
    [['og:title', post.title], ['og:description', post.excerpt], ['og:image', resolvedImageUrl]].forEach(([property, content]) => {
      let tag = document.head.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag); }
      tag.setAttribute('content', content);
    });
  }, [post, resolvedImageUrl]);
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: resolvedImageUrl,
    datePublished: post.date,
    dateModified: post.date,

    inLanguage: isEnglish ? 'en-US' : 'es-ES',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.vitablue.es${blogPath}/${post.slug}`,
    },
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'VitaBlue',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.vitablue.es/favicon.svg',
      },
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'VitaBlue',
        item: isEnglish ? 'https://www.vitablue.es/en' : 'https://www.vitablue.es',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isEnglish ? 'Blog' : 'Blog',
        item: `https://www.vitablue.es${blogPath}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://www.vitablue.es${blogPath}/${post.slug}`,
      },
    ],
  };

  return (
    <div className="w-full flex flex-col bg-background-light">
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://www.vitablue.es${blogPath}/${post.slug}`} />
        {alternateSlug && (
          <link
            rel="alternate"
            hrefLang={isEnglish ? 'es' : 'en'}
            href={`https://www.vitablue.es${isEnglish ? '/blog' : '/en/blog'}/${alternateSlug}`}
          />
        )}
        <script type="application/ld+json">{JSON.stringify(jsonLdArticle)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdBreadcrumb)}</script>
      </Helmet>
      <div className="bg-white border-b border-slate-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 text-xs font-bold text-text-secondary">
          <Link to={blogPath} className="inline-flex items-center gap-1 hover:text-primary">
            <ChevronLeft className="w-4 h-4" />
            {isEnglish ? 'Back to blog' : 'Volver al blog'}
          </Link>
          <div className="truncate">{post.title}</div>
        </div>
      </div>
      <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
          <article className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-6 sm:p-10 lg:p-12 space-y-8 text-left">
            <ArticleHeader post={post} isEnglish={isEnglish} />
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100">
              <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <BlogSectionRenderer sections={post.sections} />
            <BlogAdvisorCta
              isEnglish={isEnglish}
              title={
                isEnglish
                  ? 'Do you have questions about the visa health requirements?'
                  : '¿Tienes dudas sobre los requisitos del seguro para tu visado?'
              }
              description={
                isEnglish
                  ? 'Write to us and we will clarify which policy fits your requirements.'
                  : 'Escríbenos y te aclaramos qué póliza se adapta a tus requisitos.'
              }
              postTitle={post.title}
            />
          </article>
          <aside className="space-y-8 sticky top-28 hidden lg:block">
            <ArticleToc items={tocItems} isEnglish={isEnglish} />
            <BlogAdvisorCta
              variant="sidebar"
              isEnglish={isEnglish}
              title={
                isEnglish
                  ? 'Need health insurance for your visa or residency?'
                  : '¿Necesitas contratar un seguro para tu trámite?'
              }
              description={
                isEnglish
                  ? 'Our advisors can help you choose a compliant policy.'
                  : 'Nuestros asesores te ayudan a elegir una póliza homologada.'
              }
              postTitle={post.title}
            />
          </aside>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;

