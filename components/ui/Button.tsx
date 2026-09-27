'use client';

import type { ComponentProps } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';
import { HOVER_SPRING } from '@/lib/motion';
import { TransitionLink } from '@/components/layout/PageTransition';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface StyleOptions {
  variant?: Variant;
  size?: Size;
  className?: string;
}

/*
 * Hover scale comes from framer-motion (a spring on `transform`); the press comes from CSS
 * (`active:scale`, which Tailwind v4 writes to the separate `scale` property), so the two
 * compose instead of fighting. `transform` stays out of the CSS transition list on purpose:
 * a CSS transition would smooth every spring frame a second time and make hover feel laggy.
 */
export function buttonStyles({ variant = 'primary', size = 'md', className }: StyleOptions = {}) {
  return cn(
    'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium',
    'transition-[scale,background-color,border-color,color,box-shadow] duration-300 ease-wire',
    'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
    size === 'sm' && 'h-9 px-4 text-sm',
    size === 'md' && 'h-11 px-5 text-[15px]',
    size === 'lg' && 'h-13 px-7 text-base',
    variant === 'primary' && 'glow-wire bg-white text-night',
    variant === 'secondary' &&
      'border border-white/12 bg-white/[0.04] text-white backdrop-blur-md hover:border-white/25 hover:bg-white/[0.08]',
    variant === 'ghost' && 'text-mist hover:bg-white/[0.06] hover:text-white',
    className,
  );
}

/** Ghost buttons sit inline with text; scaling them would nudge the words around them. */
const hoverFor = (variant: Variant) => (variant === 'ghost' ? undefined : { scale: 1.05 });

type ButtonProps = HTMLMotionProps<'button'> & StyleOptions;

export function Button({ variant = 'primary', size, className, type = 'button', ...props }: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={hoverFor(variant)}
      transition={HOVER_SPRING}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}

const MotionLink = motion.create(TransitionLink);

type ButtonLinkProps = ComponentProps<typeof MotionLink> & StyleOptions;

export function ButtonLink({ variant = 'primary', size, className, ...props }: ButtonLinkProps) {
  return (
    <MotionLink
      whileHover={hoverFor(variant)}
      transition={HOVER_SPRING}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-4 w-4 animate-spin', className)} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
