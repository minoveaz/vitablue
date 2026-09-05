import React from 'react';
import { BlogPostData } from '@/utils/blogData';
import BlogPostCard from '@/components/molecules/BlogPostCard';
import { Sparkles } from 'lucide-react';

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

  // Sort by score descending and take top 3
  scoredPosts.sort((a, b) => b.score - a.score);
  const relatedPosts = scoredPosts.slice(0, 3).map((item) => item.post);

  if (relatedPosts.length === 0) return null;

  const sectionTitle = isEnglish ? 'Related Articles & Guides' : 'Artículos y Guías Relacionadas';
  const sectionSubtitle = isEnglish
    ? 'Continue reading our expert analyses on health insurance and legal procedures.'
    : 'Continúa leyendo nuestros análisis expertos sobre seguros de salud y extranjería.';

  return (
    <div className="w-full pt-10 sm:pt-14 border-t border-slate-150">
      <div className="space-y-3 mb-8 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-caption uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          {isEnglish ? 'Recommended Reading' : 'Lecturas recomendadas'}
        </div>
        <h3 className="text-h2 font-display font-black text-text-main">
          {sectionTitle}
        </h3>
        <p className="text-body-reg text-text-secondary">
          {sectionSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default BlogRelatedPosts;
