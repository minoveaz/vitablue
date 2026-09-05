import React from 'react';
import { Calendar, Clock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BlogPostData } from '@/utils/blogData';
import Button from '@/components/atoms/Button';

interface BlogFeaturedHeroProps {
  post: BlogPostData;
  isEnglish: boolean;
}

export const BlogFeaturedHero: React.FC<BlogFeaturedHeroProps> = ({ post, isEnglish }) => {
  const postUrl = isEnglish ? `/en/blog/${post.slug}/` : `/blog/${post.slug}/`;
  const badgeText = isEnglish ? "Editor's Pick · 2026 Recommended" : "Lectura Recomendada · Guía 2026";
  const buttonText = isEnglish ? "Read full guide" : "Leer guía completa";

  return (
    <div className="w-full mb-10">
      <article className="group relative overflow-hidden bg-white rounded-[36px] border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-0 text-left">
        {/* Visual Media Column */}
        <Link
          to={postUrl}
          className="relative lg:col-span-7 aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto overflow-hidden bg-slate-100 block"
        >
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
          <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-caption font-black uppercase tracking-wider text-primary shadow-sm border border-primary/10">
            {post.categoryLabel}
          </div>
        </Link>

        {/* Content Details Column */}
        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-black text-caption uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 fill-accent" />
                {badgeText}
              </span>
            </div>

            <div className="flex items-center gap-4 text-caption font-bold text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {post.readTime}
              </span>
            </div>

            <h2 className="text-h2 font-display font-black text-text-main group-hover:text-primary transition-colors duration-200 leading-snug">
              <Link to={postUrl}>
                {post.title}
              </Link>
            </h2>

            <p className="text-body-reg text-text-secondary leading-relaxed line-clamp-3 sm:line-clamp-4">
              {post.excerpt}
            </p>
          </div>

          <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 shadow-xs"
              />
              <div>
                <p className="text-xs font-bold text-text-main flex items-center gap-1 leading-none">
                  {post.author.name}
                  {post.author.verified && <ShieldCheck className="w-3.5 h-3.5 text-sky-500 fill-sky-50" />}
                </p>
                <span className="text-[10px] text-text-secondary font-medium block mt-1">
                  {post.author.role}
                </span>
              </div>
            </div>

            <Link to={postUrl}>
              <Button
                variant="accent"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold shadow-sm shadow-accent/20"
              >
                {buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogFeaturedHero;
