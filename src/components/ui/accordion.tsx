'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Accordion({ title, children, defaultOpen = false, className }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('border border-white/20 rounded-lg bg-white/5 overflow-hidden', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-sm font-medium text-white">{title}</span>
        <ChevronDown
          className={cn('w-4 h-4 text-white/70 transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-2 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

