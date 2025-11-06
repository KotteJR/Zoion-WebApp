'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  maxHeight?: string;
  topBreeds?: string[];
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  maxHeight = '200px',
  topBreeds = [],
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(true); // Always expanded by default
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus search input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Don't close on outside click - keep it always open
        // setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate top breeds and others
  const topOptions = filteredOptions.filter((opt) => topBreeds.includes(opt.value));
  const otherOptions = filteredOptions.filter((opt) => !topBreeds.includes(opt.value));

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  const selectedLabels = selected
    .map((val) => options.find((opt) => opt.value === val)?.label)
    .filter(Boolean) as string[];

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedLabels.map((label, idx) => {
            const value = selected[idx];
            return (
              <div
                key={value}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-white/10 text-white border border-white/20"
              >
                <span>{label}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemove(value, e)}
                  className="hover:bg-white/20 rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Always visible dropdown with search */}
      {isOpen && (
        <div
          className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm shadow-lg overflow-hidden"
          style={{ maxHeight }}
        >
          {/* Search input */}
          <div className="p-2 border-b border-white/20">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-2 rounded-md bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 60px)` }}>
            {/* Top breeds section */}
            {topOptions.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-white/60 mb-1 px-2">Popular</div>
                {topOptions.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleToggle(option.value)}
                      className={cn(
                        'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'text-white/90 hover:bg-white/10'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-white/60" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Other breeds section */}
            {otherOptions.length > 0 && (
              <div className="p-2">
                {topOptions.length > 0 && (
                  <div className="text-xs text-white/60 mb-1 px-2">All Breeds</div>
                )}
                {otherOptions.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleToggle(option.value)}
                      className={cn(
                        'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'text-white/90 hover:bg-white/10'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-white/60" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {filteredOptions.length === 0 && (
              <div className="p-4 text-center text-sm text-white/60">No breeds found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

