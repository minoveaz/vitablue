import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isEnglish: boolean;
  onPageChange: (page: number) => void;
}

export const BlogPagination: React.FC<BlogPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  isEnglish,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const renderPageButtons = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages.map((page, index) => {
      if (typeof page === 'string') {
        return (
          <span
            key={`ellipsis-${index}`}
            className="px-2 py-1.5 text-xs text-text-secondary select-none font-bold"
          >
            ...
          </span>
        );
      }

      const isActive = page === currentPage;
      return (
        <button
          key={`page-${page}`}
          type="button"
          onClick={() => onPageChange(page)}
          className={`min-w-9 h-9 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            isActive
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-text-main hover:bg-slate-100 border border-slate-200/80'
          }`}
          aria-current={isActive ? 'page' : undefined}
          aria-label={isEnglish ? `Page ${page}` : `Página ${page}`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <nav
      className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mt-10"
      aria-label={isEnglish ? 'Blog pagination' : 'Paginación del blog'}
    >
      <span className="text-caption font-semibold text-text-secondary text-center sm:text-left">
        {isEnglish ? (
          <>
            Showing <strong>{startItem} - {endItem}</strong> of <strong>{totalItems}</strong> guides
          </>
        ) : (
          <>
            Mostrando <strong>{startItem} - {endItem}</strong> de <strong>{totalItems}</strong> guías
          </>
        )}
      </span>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
            currentPage === 1
              ? 'text-slate-300 bg-slate-50 cursor-not-allowed border border-transparent'
              : 'text-text-main bg-white hover:bg-slate-100 border border-slate-200/80 cursor-pointer'
          }`}
          aria-label={isEnglish ? 'Previous page' : 'Página anterior'}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>{isEnglish ? 'Previous' : 'Anterior'}</span>
        </button>

        {renderPageButtons()}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
            currentPage === totalPages
              ? 'text-slate-300 bg-slate-50 cursor-not-allowed border border-transparent'
              : 'text-text-main bg-white hover:bg-slate-100 border border-slate-200/80 cursor-pointer'
          }`}
          aria-label={isEnglish ? 'Next page' : 'Página siguiente'}
        >
          <span>{isEnglish ? 'Next' : 'Siguiente'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
};

export default BlogPagination;
