'use client';

import { motion } from 'framer-motion';
import { BRAND } from '@/lib/brand';

/** Confirmation check that draws itself in the logo gradient. */
export function SuccessMark({ size = 72 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      aria-hidden
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="drop-shadow-[0_0_24px_rgb(21_195_255/0.45)]"
    >
      <defs>
        <linearGradient id="success-wire" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={BRAND.signal} />
          <stop offset="0.5053" stopColor={BRAND.iris} />
          <stop offset="1" stopColor={BRAND.charge} />
        </linearGradient>
      </defs>
      <motion.circle
        cx="36"
        cy="36"
        r="33"
        fill="none"
        stroke="url(#success-wire)"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M23 37.5 32 46 50 27"
        fill="none"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.svg>
  );
}
