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

/** Platform check for rendering the right modifier key (⌘ vs Ctrl). */
export function useIsMac(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent),
    () => false,
  );
}
