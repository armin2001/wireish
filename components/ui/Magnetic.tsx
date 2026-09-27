'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { cn } from '@/lib/cn';

interface MagneticProps {
  children: ReactNode;
  /** Share of the pointer's distance from the center that the content follows (0.2 = 20%). */
  strength?: number;
  className?: string;
}

const SPRING = { stiffness: 320, damping: 22, mass: 0.6 };

/**
 * Lets its content lean toward a mouse pointer and spring back when it leaves. Mouse only:
 * touch and pen get no pull, and neither do visitors who prefer reduced motion.
 */
export function Magnetic({ children, strength = 0.2, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const onPointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse' || !ref.current) return;
    // The measured box already includes the current pull; remove it to get the resting center.
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 - x.get();
    const centerY = rect.top + rect.height / 2 - y.get();
    x.set((event.clientX - centerX) * strength);
    y.set((event.clientY - centerY) * strength);
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={release}
      style={{ x, y }}
      className={cn('inline-flex', className)}
    >
      {children}
    </motion.span>
  );
}
