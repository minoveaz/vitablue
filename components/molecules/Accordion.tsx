import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const accordionId = `accordion-${Math.random().toString(36).substring(2, 9)}`;
  const panelId = `panel-${accordionId}`;

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={`border-b border-slate-200/80 last:border-none ${className}`}>
      <h3>
        <button
          type="button"
          id={accordionId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={toggle}
          className="flex w-full items-center justify-between py-5 text-left font-display text-base font-bold text-text-main hover:text-primary transition-colors duration-150 focus:outline-none group select-none"
        >
          <span>{title}</span>
          <ChevronDown 
            className={`w-5 h-5 text-text-secondary/60 group-hover:text-primary transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-primary' : 'rotate-0'
            }`} 
          />
        </button>
      </h3>
      
      <div
        id={panelId}
        role="region"
        aria-labelledby={accordionId}
        hidden={!isOpen}
        className={`overflow-hidden transition-all duration-200`}
      >
        <div className="pb-6 text-sm font-medium leading-relaxed text-text-secondary">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
