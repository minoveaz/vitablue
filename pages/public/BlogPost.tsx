import React, { useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft } from 'lucide-react';
import { blogPosts } from '@/utils/blogData';
import ArticleHeader from '@/components/molecules/ArticleHeader';
import ArticleToc from '@/components/molecules/ArticleToc';
import BlogSectionRenderer from '@/components/molecules/BlogSectionRenderer';
import BlogAdvisorCta from '@/components/molecules/BlogAdvisorCta';
import BlogConsularValidatorCallout from '@/components/molecules/BlogConsularValidatorCallout';
import LeadMagnetBanner from '@/components/molecules/LeadMagnetBanner';
import BlogRelatedPosts from '@/components/molecules/BlogRelatedPosts';

const createHeadingId = (text = '') => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = useMemo(() => blogPosts.find((item) => item.slug === slug), [slug]);
  if (!post) return <Navigate to="/blog/" replace />;
  const isEnglish = post.lang === 'en';
  const tocItems = post.sections.filter((section) => section.type === 'heading-2').map((section) => ({ text: section.text || '', id: createHeadingId(section.text) }));
  const blogPath = isEnglish ? '/en/blog/' : '/blog/';
  const alternatePost = post.alternateSlug ? blogPosts.find((item) => item.slug === post.alternateSlug) : undefined;
  const alternateSlug = alternatePost?.slug;
  const resolvedImageUrl = post.featuredImage.startsWith('http')
    ? post.featuredImage
    : `https://www.vitablue.es${post.featuredImage}`;


  const isoDate = useMemo(() => {
    if (!post.date) return '2026-09-01';
    const monthMap: Record<string, string> = {
      enero: '01', january: '01',
      febrero: '02', february: '02',
      marzo: '03', march: '03',
      abril: '04', april: '04',
      mayo: '05', may: '05',
      junio: '06', june: '06',
      julio: '07', july: '07',
      agosto: '08', august: '08',
      septiembre: '09', september: '09',
      octubre: '10', october: '10',
      noviembre: '11', november: '11',
      diciembre: '12', december: '12',
    };
    const parts = post.date.trim().split(/\s+/);
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = monthMap[parts[1].toLowerCase()] || '09';
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return post.date;
  }, [post.date]);

  const jsonLdArticle = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: resolvedImageUrl,
    datePublished: isoDate,
    dateModified: isoDate,
    inLanguage: isEnglish ? 'en-US' : 'es-ES',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.vitablue.es${blogPath}${post.slug}/`,
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
  }), [post, blogPath, isEnglish, resolvedImageUrl]);

  const jsonLdBreadcrumb = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'VitaBlue',
        item: isEnglish ? 'https://www.vitablue.es/en/' : 'https://www.vitablue.es/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `https://www.vitablue.es${blogPath}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://www.vitablue.es${blogPath}${post.slug}/`,
      },
    ],
  }), [post.title, post.slug, blogPath, isEnglish]);

  const jsonLdFaq = useMemo(() => {
    const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');
    const faqSectionIndex = post.sections.findIndex(
      (s) => s.type === 'heading-2' && s.text && s.text.includes('FAQ')
    );
    const faqListSection =
      faqSectionIndex !== -1 && post.sections[faqSectionIndex + 1]?.type === 'list'
        ? post.sections[faqSectionIndex + 1]
        : null;

    const faqEntities = faqListSection?.items
      ?.map((item) => {
        const match = item.match(/<strong>(.*?)<\/strong>[:\s]*(.*)/s);
        if (match) {
          return {
            '@type': 'Question',
            name: stripHtml(match[1]).trim(),
            acceptedAnswer: {
              '@type': 'Answer',
              text: stripHtml(match[2]).trim(),
            },
          };
        }
        return null;
      })
      .filter(Boolean);

    return faqEntities && faqEntities.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqEntities,
        }
      : null;
  }, [post.sections]);

  useEffect(() => {
    document.title = post.title;

    const metaDesc = document.head.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', post.excerpt);
    }

    [
      ['og:title', post.title],
      ['og:description', post.excerpt],
      ['og:image', resolvedImageUrl],
      ['twitter:title', post.title],
      ['twitter:description', post.excerpt],
    ].forEach(([property, content]) => {
      let tag = document.head.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(property.startsWith('twitter:') ? 'name' : 'property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    const existingSchemas = document.head.querySelectorAll('script[data-schema-post="true"]');
    existingSchemas.forEach((s) => s.remove());

    [jsonLdArticle, jsonLdBreadcrumb, jsonLdFaq].filter(Boolean).forEach((schemaData) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema-post', 'true');
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    });

    return () => {
      const postSchemas = document.head.querySelectorAll('script[data-schema-post="true"]');
      postSchemas.forEach((s) => s.remove());
    };
  }, [post, resolvedImageUrl, jsonLdArticle, jsonLdBreadcrumb, jsonLdFaq]);

  return (
    <div className="w-full flex flex-col bg-background-light">
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://www.vitablue.es${blogPath}${post.slug}/`} />
        {alternateSlug && (
          <link
            rel="alternate"
            hrefLang={isEnglish ? 'es' : 'en'}
            href={`https://www.vitablue.es${isEnglish ? '/blog' : '/en/blog'}/${alternateSlug}/`}
          />
        )}
        <script type="application/ld+json">{JSON.stringify(jsonLdArticle)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdBreadcrumb)}</script>
        {jsonLdFaq && (
          <script type="application/ld+json">{JSON.stringify(jsonLdFaq)}</script>
        )}
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
            {(post.category === 'visados' || post.slug.includes('estudiante') || post.slug.includes('student') || post.slug.includes('visa')) && (
              <LeadMagnetBanner
                isEnglish={isEnglish}
                sourceContext={post.slug}
              />
            )}
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
            {(post.category === 'visados' || post.slug.includes('estudiante') || post.slug.includes('student') || post.slug.includes('visa')) ? (
              <LeadMagnetBanner
                variant="sidebar"
                isEnglish={isEnglish}
                sourceContext={`sidebar-${post.slug}`}
              />
            ) : (
              <BlogConsularValidatorCallout variant="sidebar" isEnglish={isEnglish} />
            )}
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

        {/* Related articles full-width section */}
        <div className="mx-auto w-full max-w-6xl mt-12 sm:mt-16">
          <BlogRelatedPosts
            currentPost={post}
            allPosts={blogPosts}
            isEnglish={isEnglish}
          />
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
