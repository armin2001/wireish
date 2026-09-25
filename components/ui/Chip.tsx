'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ChipProps {
  selected: boolean;
  onToggle: () => void;
  children: ReactNode;
  /** 'checkbox' for multi-select groups, 'radio' for single choice. */
  role?: 'checkbox' | 'radio';
  icon?: ReactNode;
}

export function Chip({ selected, onToggle, children, role = 'checkbox', icon }: ChipProps) {
  return (
    <motion.button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onToggle}
      whileTap={{ scale: 0.96 }}
      className={cn(
        'wire-border inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-[background-color,border-color,color,box-shadow] duration-200',
        selected
          ? 'border-transparent bg-white/[0.08] text-white shadow-glow [--wire-opacity:1]'
          : 'border-white/10 text-mist [--wire-opacity:0] [--wire-play:paused] hover:border-white/25 hover:text-white',
      )}
    >
      {icon}
      {children}
      <motion.span
        initial={false}
        animate={{ width: selected ? 16 : 0, opacity: selected ? 1 : 0 }}
        transition={{ duration: 0.18 }}
        className="inline-flex overflow-hidden text-signal"
        aria-hidden
      >
        <Check className="h-4 w-4 shrink-0" />
      </motion.span>
    </motion.button>
  );
}
