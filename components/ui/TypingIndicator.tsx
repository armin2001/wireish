'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface TypingIndicatorProps {
  /** Read by screen readers instead of the dots, e.g. "Wireish Bot is typing". */
  label?: string;
  className?: string;
}

/** Three dots that bob in sequence, like every messenger's "is typing". */
export function TypingIndicator({ label, className }: TypingIndicatorProps) {
  return (
    <span className={cn('inline-flex h-5 items-center gap-1', className)}>
      {label && <span className="sr-only">{label}</span>}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-white/80"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}
