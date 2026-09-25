'use client';

/*
 * Pan/zoom state for the infinite canvas.
 *
 * The transform is written straight to the DOM (no React render per wheel tick), and a
 * snapshot is pushed to React state at most once per animation frame for the UI that
 * needs it (zoom %, minimap). This is what keeps panning at 60fps with many nodes.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { animate } from 'framer-motion';
import { GRID, type Bounds } from '@/lib/canvas/model';

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 2.5;
const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

export function useViewport(
  containerRef: RefObject<HTMLDivElement | null>,
  worldRef: RefObject<HTMLDivElement | null>,
  gridRef: RefObject<HTMLDivElement | null>,
) {
  const vp = useRef<Viewport>({ x: 0, y: 0, zoom: 1 });
  const [view, setView] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const frame = useRef<number | null>(null);
  const tween = useRef<{ stop: () => void } | null>(null);

  const paint = useCallback(() => {
    const { x, y, zoom } = vp.current;
    if (worldRef.current) worldRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoom})`;
    if (gridRef.current) {
      // Switch to a coarser dot grid when zoomed out, so dots never turn into noise.
      const step = GRID * zoom < 12 ? GRID * 4 * zoom : GRID * zoom;
      gridRef.current.style.backgroundSize = `${step}px ${step}px`;
      gridRef.current.style.backgroundPosition = `${x}px ${y}px`;
    }
    if (frame.current === null) {
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        setView({ ...vp.current });
      });
    }
  }, [worldRef, gridRef]);

  const stop = useCallback(() => {
    tween.current?.stop();
    tween.current = null;
  }, []);

  const set = useCallback(
    (next: Viewport) => {
      vp.current = { x: next.x, y: next.y, zoom: clampZoom(next.zoom) };
      paint();
    },
    [paint],
  );

  const animateTo = useCallback(
    (target: Viewport, duration = 0.45) => {
      stop();
      const from = { ...vp.current };
      const to = { ...target, zoom: clampZoom(target.zoom) };
      tween.current = animate(0, 1, {
        duration,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (t) => {
          vp.current = {
            x: from.x + (to.x - from.x) * t,
            y: from.y + (to.y - from.y) * t,
            zoom: from.zoom + (to.zoom - from.zoom) * t,
          };
          paint();
        },
      });
    },
    [paint, stop],
  );

  const panBy = useCallback(
    (dx: number, dy: number) => {
      stop();
      set({ ...vp.current, x: vp.current.x + dx, y: vp.current.y + dy });
    },
    [set, stop],
  );

  /** Zoom keeping the point (cx, cy), in container pixels, fixed under the cursor. */
  const zoomAt = useCallback(
    (nextZoom: number, cx: number, cy: number, smooth = false) => {
      const { x, y, zoom } = vp.current;
      const z = clampZoom(nextZoom);
      const k = z / zoom;
      const target = { zoom: z, x: cx - (cx - x) * k, y: cy - (cy - y) * k };
      if (smooth) animateTo(target, 0.25);
      else {
        stop();
        set(target);
      }
    },
    [animateTo, set, stop],
  );

  const size = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    return { width: rect?.width ?? 0, height: rect?.height ?? 0, left: rect?.left ?? 0, top: rect?.top ?? 0 };
  }, [containerRef]);

  const zoomBy = useCallback(
    (factor: number) => {
      const { width, height } = size();
      zoomAt(vp.current.zoom * factor, width / 2, height / 2, true);
    },
    [size, zoomAt],
  );

  const screenToWorld = useCallback(
    (clientX: number, clientY: number) => {
      const { left, top } = size();
      const { x, y, zoom } = vp.current;
      return { x: (clientX - left - x) / zoom, y: (clientY - top - y) / zoom };
    },
    [size],
  );

  const fitBounds = useCallback(
    (b: Bounds, insets: Insets, smooth = true) => {
      const { width, height } = size();
      const availW = Math.max(120, width - insets.left - insets.right);
      const availH = Math.max(120, height - insets.top - insets.bottom);
      const w = Math.max(1, b.maxX - b.minX);
      const h = Math.max(1, b.maxY - b.minY);
      const zoom = clampZoom(Math.min(availW / w, availH / h, 1.1));
      const target = {
        zoom,
        x: insets.left + availW / 2 - (b.minX + w / 2) * zoom,
        y: insets.top + availH / 2 - (b.minY + h / 2) * zoom,
      };
      if (smooth) animateTo(target);
      else set(target);
    },
    [animateTo, set, size],
  );

  useLayoutEffect(() => {
    paint();
  }, [paint]);

  useEffect(
    () => () => {
      stop();
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [stop],
  );

  return { vp, view, set, panBy, zoomAt, zoomBy, animateTo, screenToWorld, fitBounds, size };
}

export type ViewportApi = ReturnType<typeof useViewport>;
