'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { REVEAL } from '@/lib/motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait after the element enters the viewport. */
  delay?: number;
}

/**
 * Fades and slides a section up the first time it scrolls into view. Works around server
 * components too: the children render on the server, only this wrapper runs on the client.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={REVEAL.initial}
      whileInView={REVEAL.whileInView}
      viewport={REVEAL.viewport}
      transition={{ ...REVEAL.transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
