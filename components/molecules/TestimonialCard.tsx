import React from 'react';
import { Star } from 'lucide-react';
import Card from './Card';

interface TestimonialCardProps {
  comment: string;
  author: string;
  meta: string;
  stars?: number;
  avatarUrl?: string;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  comment,
  author,
  meta,
  stars = 5,
  avatarUrl,
  className = '',
}) => {
  // Generate user initials for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <Card 
      hoverEffect={true} 
      padding="sm"
      className={`flex flex-col gap-5 bg-white border border-slate-100 ${className}`}
    >
      {/* Stars row */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < stars 
                ? 'fill-accent text-accent' 
                : 'text-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Review Comment text */}
      <p className="font-sans text-sm font-medium leading-relaxed text-text-secondary italic">
        "{comment}"
      </p>

      {/* Author Info Block */}
      <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-auto">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={author}
            className="size-10 rounded-full object-cover border border-slate-100 flex-shrink-0"
            loading="lazy"
          />
        ) : (
          <div className="size-10 rounded-full bg-primary/10 text-primary font-display font-extrabold text-xs flex items-center justify-center flex-shrink-0">
            {getInitials(author)}
          </div>
        )}
        
        <div className="flex flex-col">
          <span className="font-sans text-xs font-bold text-text-main">
            {author}
          </span>
          <span className="text-[10px] text-text-secondary/70 font-semibold mt-0.5">
            {meta}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TestimonialCard;
