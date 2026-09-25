/**
 * Tiny external store that persists the canvas map in localStorage and shares it
 * between /canvas and /book-a-demo (and across tabs via the storage event).
 */
import { useSyncExternalStore } from 'react';
import { parseDoc, type CanvasDoc } from './model';

const KEY = 'wireish:blueprint:v1';
const listeners = new Set<() => void>();
let cache: CanvasDoc | null | undefined; // undefined = not read yet

function read(): CanvasDoc | null {
  if (cache !== undefined) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? parseDoc(JSON.parse(raw)) : null;
  } catch {
    cache = null;
  }
  return cache;
}

export const blueprintStore = {
  get: read,
  set(doc: CanvasDoc | null) {
    cache = doc;
    try {
      if (doc) window.localStorage.setItem(KEY, JSON.stringify(doc));
      else window.localStorage.removeItem(KEY);
    } catch {
      /* Private mode or quota: keep the in-memory copy. */
    }
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== KEY) return;
      cache = undefined;
      listener();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  },
};

export function useBlueprint(): CanvasDoc | null {
  return useSyncExternalStore(blueprintStore.subscribe, blueprintStore.get, () => null);
}
