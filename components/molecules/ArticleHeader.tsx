import React from 'react';
import { Calendar, Clock, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import { BlogPostData } from '@/utils/blogData';

const ArticleHeader: React.FC<{ post: BlogPostData; isEnglish: boolean }> = ({ post, isEnglish }) => (
  <>
    <div className="space-y-4">
      <span className="inline-flex items-center bg-primary/5 border border-primary/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-primary select-none shadow-sm">
        {post.categoryLabel}
      </span>
      <h1 className="text-h1 font-display font-black text-text-main leading-tight">
        {post.title}
      </h1>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 border-b border-slate-100 pb-6 text-xs font-bold text-text-secondary">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-primary/60" /> {post.date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-primary/60" /> {post.readTime}
        </span>
        <span className="inline-flex items-center gap-1 text-success-strong bg-emerald-50 border border-emerald-100/50 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> {isEnglish ? 'Consular Compliant 2026' : 'Normativa Consular 2026'}
        </span>
      </div>
    </div>

    {/* E-E-A-T Author & Editorial Review Box */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-150/60 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          width="48"
          height="48"
          className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
          loading="lazy"
          decoding="async"
        />
        <div className="text-left">
          <span className="text-[9px] text-text-secondary font-black uppercase tracking-wider block">
            {isEnglish ? 'Written by' : 'Redactado por'}
          </span>
          <h4 className="text-sm font-bold text-text-main flex items-center gap-1 leading-none mt-0.5">
            {post.author.name}
            {post.author.verified && (
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500 fill-sky-50 shrink-0" />
            )}
          </h4>
          <p className="text-[10.5px] text-text-secondary leading-tight mt-1 font-medium">
            {post.author.role}
          </p>
        </div>
      </div>
      <div className="inline-flex items-center gap-1.5 self-start sm:self-center bg-white border border-primary/20 px-3 py-1.5 rounded-full text-primary font-bold text-[10px] tracking-wide shadow-xs">
        <Award className="w-3.5 h-3.5 text-primary" />
        <span>{isEnglish ? 'Certified Brokerage Review' : 'Revisión por Correduría Colegiada'}</span>
      </div>
    </div>
  </>
);

export default ArticleHeader;

