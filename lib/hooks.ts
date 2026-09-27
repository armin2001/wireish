import { useEffect, useState, useSyncExternalStore } from 'react';

const subscribeNoop = () => () => {};

/** True only on the client after hydration. Safe for rendering browser-only values. */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

/** Flips to true once the browser is idle, so heavy work (WebGL) never competes with first paint. */
export function useIdle(timeout = 1500): boolean {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setIdle(true), 250);
    return () => window.clearTimeout(id);
  }, [timeout]);
  return idle;
}

function subscribeSplash(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-splash'] });
  return () => observer.disconnect();
}

/**
 * False while the first-visit splash covers the page (html[data-splash="active"], set by
 * splash-boot.ts), then true. Start entrance sequences on this so they don't play unseen.
 */
export function useSplashDone(): boolean {
  return useSyncExternalStore(subscribeSplash, () => document.documentElement.dataset.splash !== 'active', () => false);
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/**
 * The OS "reduce motion" setting, safe to render with. framer-motion's useReducedMotion
 * reports the real value during hydration while the server assumed `false`, which breaks
 * hydration for those visitors; this reports `false` until hydration is done, then updates.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false);
}

/** Platform check for rendering the right modifier key (⌘ vs Ctrl). */
export function useIsMac(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent),
    () => false,
  );
}
