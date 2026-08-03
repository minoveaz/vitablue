import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = ''
}) => {
  // Block body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${className}`}>
      {/* Dark overlay backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        aria-hidden="true"
      />

      {/* Sliding Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-in-out translate-x-0 animate-slideInRight border-l border-slate-100">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm sm:text-base font-display font-bold text-text-main">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-text-secondary/70 hover:text-text-main transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 text-sm font-semibold text-text-secondary/85 leading-relaxed space-y-4">
            {children}
          </div>

          {/* Drawer Footer */}
          {footer && (
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
              {footer}
            </div>
          )}

        </div>
      </div>

      {/* Local keyframes style injection */}
      <style>{`
        @keyframes slideInRight {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Drawer;
