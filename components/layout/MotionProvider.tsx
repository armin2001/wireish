'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

/**
 * Honors the OS "reduce motion" setting for every framer-motion animation: movement
 * (slides, floats, scale) is skipped, fades still play. The CSS side lives in globals.css.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
