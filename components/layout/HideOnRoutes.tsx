'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { splitLocale } from '@/lib/i18n/config';

/** Hides global chrome (the footer) on full-screen routes such as /canvas, in every language. */
export function HideOnRoutes({ routes, children }: { routes: string[]; children: ReactNode }) {
  const path = splitLocale(usePathname()).path;
  const hidden = routes.some((route) => path === route || path.startsWith(`${route}/`));
  return hidden ? null : <>{children}</>;
}
