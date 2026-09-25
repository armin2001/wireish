'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Module scope survives client navigations but is fresh on every server render,
// so the very first paint is never hidden behind an opacity-0 wrapper (good for LCP).
let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [animate] = useState(() => hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div
      initial={animate && !reduceMotion ? { opacity: 0, y: 14, filter: 'blur(6px)' } : false}
      // `filter: none` at the end matters: any leftover filter would re-parent position:fixed children.
      animate={animate ? { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
