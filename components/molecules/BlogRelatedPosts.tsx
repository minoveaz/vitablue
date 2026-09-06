import React, { useRef } from 'react';
import { BlogPostData } from '@/utils/blogData';
import { Sparkles, ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogRelatedPostsProps {
  currentPost: BlogPostData;
  allPosts: BlogPostData[];
  isEnglish: boolean;
}

export const BlogRelatedPosts: React.FC<BlogRelatedPostsProps> = ({
  currentPost,
  allPosts,
  isEnglish,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter by same language and exclude current post
  const candidatePosts = allPosts.filter(
    (p) => (p.lang || 'es') === (currentPost.lang || 'es') && p.slug !== currentPost.slug
  );

  // Score candidates by relevance
  const scoredPosts = candidatePosts.map((post) => {
    let score = 0;
    // Same category gives 10 points
    if (post.category === currentPost.category) {
      score += 10;
    }

    // Keyword match in title or slug
    const currentKeywords = currentPost.slug.split('-');
    const postKeywords = post.slug.split('-');
    currentKeywords.forEach((kw) => {
      if (kw.length > 3 && postKeywords.includes(kw)) {
        score += 3;
      }
    });

    return { post, score };
  });

  // Sort by score descending and take up to 6 candidates for a rich slider
  scoredPosts.sort((a, b) => b.score - a.score);
  const relatedPosts = scoredPosts.slice(0, 6).map((item) => item.post);

  if (relatedPosts.length === 0) return null;

  const sectionTitle = isEnglish ? 'Related Guides & Analyses' : 'Guías y Artículos Relacionados';
  const sectionSubtitle = isEnglish
    ? 'Continue exploring expert insights on health insurance, visas, and legal compliance in Spain.'
    : 'Continúa explorando análisis expertos sobre seguros médicos, visados y extranjería en España.';

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full pt-10 sm:pt-14 border-t border-slate-200">
      {/* Header with Title and Slider Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-caption uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {isEnglish ? 'Recommended Reading' : 'Lecturas recomendadas'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-text-main tracking-tight">
            {sectionTitle}
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
            {sectionSubtitle}
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-primary text-text-main flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
            aria-label={isEnglish ? 'Previous articles' : 'Artículos anteriores'}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-primary text-text-main flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
            aria-label={isEnglish ? 'Next articles' : 'Siguientes artículos'}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slider Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-1 px-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {relatedPosts.map((post) => {
          const postUrl = post.lang === 'en' ? `/en/blog/${post.slug}/` : `/blog/${post.slug}/`;
          const readMoreText = post.lang === 'en' ? 'Read guide' : 'Leer guía';

          return (
            <article
              key={post.slug}
              className="w-[290px] sm:w-[320px] md:w-[340px] shrink-0 snap-start group flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
              {/* Media banner */}
              <Link to={postUrl} className="block relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-slate-100 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-primary shadow-xs">
                  {post.categoryLabel}
                </div>
              </Link>

              {/* Compact Body Content */}
              <div className="flex-1 flex flex-col p-5 space-y-3">
                {/* Meta details */}
                <div className="flex items-center gap-3 text-[11px] font-bold text-text-secondary">
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <Calendar className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                    {post.readTime}
                  </span>
                </div>

                {/* Card Title clamped to 2 lines */}
                <h4 className="text-sm sm:text-base font-display font-bold text-text-main group-hover:text-primary transition-colors leading-snug line-clamp-2">
                  <Link to={postUrl} title={post.title}>
                    {post.title}
                  </Link>
                </h4>

                {/* Excerpt clamped to 2 lines */}
                <p className="text-xs text-text-secondary/80 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex-1" />

                {/* Footer with author & CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <span className="text-[10px] font-bold text-text-main flex items-center gap-0.5 leading-none truncate max-w-[110px]">
                      {post.author.name}
                      {post.author.verified && (
                        <ShieldCheck className="w-3 h-3 text-sky-500 fill-sky-50 shrink-0" />
                      )}
                    </span>
                  </div>

                  <Link
                    to={postUrl}
                    className="text-xs font-black text-primary group-hover:text-primary-dark inline-flex items-center gap-1 transition-colors whitespace-nowrap"
                  >
                    {readMoreText}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default BlogRelatedPosts;

