import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface AutocompleteProps {
  options: string[];
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  placeholder = 'Buscar...',
  value = '',
  onChange,
  className = '',
  label
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredOptions([]);
      return;
    }
    const cleanInput = inputValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const filtered = options.filter(opt => 
      opt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(cleanInput)
    );
    setFilteredOptions(filtered.slice(0, 8)); // Limit to 8 suggestions
  }, [inputValue, options]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredOptions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Scroll active item into view inside dropdown
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="bg-primary/10 text-primary font-black rounded px-0.5">{part}</mark>
            : part
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col w-full gap-1.5 ${className}`}>
      {label && (
        <span className="text-xs font-bold text-text-main tracking-wide select-none">
          {label}
        </span>
      )}

      <div className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-white border border-slate-200/80 focus:border-primary text-text-main text-sm font-semibold rounded-xl pl-10 pr-9 py-3 transition-colors duration-150 focus:outline-none focus:ring-4 focus:ring-primary/5 placeholder-slate-400"
          aria-label={label || placeholder}
        />
        
        {/* Search Left Icon */}
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50" />

        {/* Clear Right Icon */}
        {inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue('');
              onChange('');
              setFilteredOptions([]);
              setIsOpen(false);
              setHighlightedIndex(-1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-secondary/50 hover:text-text-main transition-colors duration-150 focus:outline-none"
            aria-label="Limpiar campo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && filteredOptions.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white border border-slate-100/80 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1.5 divide-y divide-slate-50/50"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={highlightedIndex === index}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-4 py-2.5 text-xs font-semibold text-text-main cursor-pointer select-none transition-colors duration-150 ${
                highlightedIndex === index ? 'bg-primary/5 text-primary' : 'hover:bg-slate-50'
              }`}
            >
              {highlightMatch(option, inputValue)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
