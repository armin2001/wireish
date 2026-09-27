import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/*
 * tailwind-merge only knows Tailwind's default theme. Teach it the tokens from app/globals.css,
 * otherwise `shadow-glow` reads as a shadow *color* and `animate-rise` is never deduplicated.
 */
const twMerge = extendTailwindMerge<'surface'>({
  extend: {
    theme: {
      shadow: ['glow', 'glow-signal', 'lift'],
      animate: ['wire-spin', 'wire-flow', 'rise', 'blob', 'spark', 'nav-drop', 'nav-item'],
      ease: ['wire'],
    },
    classGroups: {
      // The glass depth layers replace each other: `cn('glass', raised && 'glass-raised')` keeps one.
      surface: ['glass', 'glass-raised', 'glass-overlay', 'panel'],
    },
  },
});

/**
 * Joins class names and resolves Tailwind conflicts, last one wins:
 * `cn('px-4 text-mist', active && 'text-white')` → `'px-4 text-white'`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
