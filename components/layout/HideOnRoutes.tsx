'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/** Hides global chrome (the footer) on full-screen routes such as /canvas. */
export function HideOnRoutes({ routes, children }: { routes: string[]; children: ReactNode }) {
  const pathname = usePathname();
  const hidden = routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  return hidden ? null : <>{children}</>;
}
