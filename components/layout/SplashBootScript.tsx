'use client';

import { useSyncExternalStore } from 'react';
import { SPLASH_BOOT_SCRIPT } from './splash-boot';

const noopSubscribe = () => () => {};

/**
 * The splash boot script, emitted only in the server HTML. A locale switch soft-navigates
 * and remounts the root layout on the client, where an inline script would never run and
 * React warns about it; the server snapshot keeps it for hydration, the client drops it.
 */
export function SplashBootScript() {
  const fromServer = useSyncExternalStore(noopSubscribe, () => false, () => true);
  return fromServer ? <script dangerouslySetInnerHTML={{ __html: SPLASH_BOOT_SCRIPT }} /> : null;
}
