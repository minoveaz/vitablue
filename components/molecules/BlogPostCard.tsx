import React from 'react';
import { Calendar, Clock, ChevronRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BlogPostData } from '@/utils/blogData';

const BlogPostCard: React.FC<{ post: BlogPostData }> = ({ post }) => (
  <article className="group flex flex-col bg-white rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden">
    <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100"><img src={post.featuredImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /><div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-primary select-none shadow-sm">{post.categoryLabel}</div></Link>
    <div className="flex-1 flex flex-col p-6 sm:p-8 space-y-4">
      <div className="flex items-center gap-4 text-[11px] font-bold text-text-secondary"><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary/60" /> {post.date}</span><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary/60" /> {post.readTime}</span></div>
      <h2 className="text-h3 font-display font-black text-text-main group-hover:text-primary transition-colors duration-150 leading-tight"><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
      <p className="text-body-reg text-text-secondary/90 leading-relaxed line-clamp-3">{post.excerpt}</p><div className="flex-1" />
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4"><div className="flex items-center gap-2.5"><img src={post.author.avatar} alt={post.author.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" /><div className="text-left"><p className="text-[10px] font-bold text-text-main flex items-center gap-0.5 leading-none">{post.author.name}{post.author.verified && <ShieldCheck className="w-3 h-3 text-sky-500 fill-sky-50" />}</p><span className="text-[8px] text-text-secondary font-semibold block mt-0.5">Asesor experto</span></div></div><Link to={`/blog/${post.slug}`} className="text-xs font-bold text-primary group-hover:text-primary-dark flex items-center gap-1 transition-colors">Leer más <ChevronRight className="w-4 h-4" /></Link></div>
    </div>
  </article>
);
export default BlogPostCard;
