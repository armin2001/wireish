import type { Transition, Variants } from 'framer-motion';

/** --ease-wire from globals.css, for framer-motion. */
export const EASE_WIRE = [0.22, 1, 0.36, 1] as const;

/** Buttons and tiles: a quick, slightly bouncy scale on hover. */
export const HOVER_SPRING: Transition = { type: 'spring', stiffness: 400, damping: 17 };

/** Section entrance: fade and rise once, 100px before the section reaches the viewport edge. */
export const REVEAL = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: EASE_WIRE },
} as const;

/** Grid parent: reveals its children one after another, 0.1s apart. Pair with STAGGER_ITEM. */
export const STAGGER_GROUP: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export const STAGGER_ITEM: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_WIRE } },
};
