'use client';

/*
 * The infinite canvas.
 *
 * Interaction model (all pointer input is handled here through event delegation; nodes,
 * ports and edges only carry data-* attributes):
 *   drag empty canvas ........ pan            Shift + drag empty ..... box select
 *   Space + drag / middle .... pan            scroll / two fingers ... pan
 *   Ctrl/⌘ + scroll, pinch ... zoom at cursor drag node ............. move (snaps to grid)
 *   drag blue port ........... connect        Alt while dragging ..... place freely
 * Keyboard shortcuts are listed in ShortcutsDialog.
 */
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTransitionRouter } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toaster';
import { blueprintStore } from '@/lib/canvas/blueprint-store';
import {
  GRID,
  NODE_H,
  NODE_W,
  canConnect,
  createTemplate,
  inPort,
  nodesBounds,
  snap,
  uid,
  type CanvasNode,
  type NodeKind,
  type Point,
} from '@/lib/canvas/model';
import { canvasReducer, createInitialState, duplicateSelection } from '@/lib/canvas/state';
import { cn } from '@/lib/cn';
import { DEMO_HREF } from '@/lib/content';
import { useIsMac } from '@/lib/hooks';
import { CanvasNodeView } from './CanvasNode';
import { CanvasToolbar } from './CanvasToolbar';
import { EdgeLayer, type Guide, type PendingEdge } from './EdgeLayer';
import { Minimap } from './Minimap';
import { NodePalette } from './NodePalette';
import { ShortcutsDialog } from './ShortcutsDialog';
import { useViewport, type Insets } from './useViewport';

type Mode = 'idle' | 'panning' | 'dragging' | 'connecting' | 'selecting';

type Gesture =
  | { kind: 'pan'; pointerId: number; lastX: number; lastY: number; moved: boolean }
  | { kind: 'drag'; pointerId: number; primary: string; start: Point; origins: Record<string, Point>; moved: boolean }
  | { kind: 'connect'; pointerId: number; from: string }
  | { kind: 'marquee'; pointerId: number; origin: Point; base: string[] }
  | { kind: 'pinch'; startDistance: number; startMid: Point; start: { x: number; y: number; zoom: number } };

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const HINTS: Record<Mode, string> = {
  idle: 'Drag from a blue dot to connect. Hold Space to pan, Shift-drag to select.',
  panning: 'Moving the view',
  dragging: 'Hold Alt to place freely',
  connecting: 'Release on a violet dot to connect',
  selecting: 'Release to select',
};

function fitInsets(): Insets {
  const wide = window.innerWidth >= 768;
  return wide ? { top: 160, right: 240, bottom: 80, left: 300 } : { top: 150, right: 24, bottom: 170, left: 24 };
}

export default function CanvasWorkspace() {
  const container = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const pointers = useRef(new Map<number, Point>());

  const [state, dispatch] = useReducer(canvasReducer, null, () =>
    createInitialState(blueprintStore.get() ?? createTemplate()),
  );
  const viewport = useViewport(container, world, grid);
  const toast = useToast();
  const navigate = useTransitionRouter();
  const isMac = useIsMac();
  const mod = isMac ? '⌘' : 'Ctrl+';

  const [mode, setMode] = useState<Mode>('idle');
  const [snapping, setSnapping] = useState(true);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [dragIds, setDragIds] = useState<string[]>([]);
  const [pending, setPending] = useState<PendingEdge | null>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [marquee, setMarquee] = useState<Rect | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const { doc, selection, selectedEdge } = state;
  const selected = useMemo(() => new Set(selection), [selection]);
  const dragging = useMemo(() => new Set(dragIds), [dragIds]);

  /* ------------------------------------------------------------ persistence */

  // Save after edits only: merely opening the canvas shouldn't attach the example to a booking.
  const initialDoc = useRef(doc);
  useEffect(() => {
    if (doc === initialDoc.current) return;
    const t = window.setTimeout(() => blueprintStore.set(doc), 250);
    return () => window.clearTimeout(t);
  }, [doc]);

  /* ------------------------------------------------------------ layout */

  const fit = useCallback(
    (smooth = true) => {
      const targets = selection.length ? doc.nodes.filter((n) => selected.has(n.id)) : doc.nodes;
      const bounds = nodesBounds(targets);
      if (bounds) viewport.fitBounds(bounds, fitInsets(), smooth);
    },
    [doc.nodes, selection.length, selected, viewport],
  );

  const initialFit = useEffectEvent(() => {
    fit(false);
    if (world.current) world.current.dataset.ready = 'true';
  });

  useLayoutEffect(() => {
    initialFit();
  }, []);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ------------------------------------------------------------ helpers */

  const localPoint = (clientX: number, clientY: number): Point => {
    const { left, top } = viewport.size();
    return { x: clientX - left, y: clientY - top };
  };

  const addNode = (kind: NodeKind, at: Point) => {
    const node: CanvasNode = { id: uid('n'), kind, x: snap(at.x - NODE_W / 2), y: snap(at.y - NODE_H / 2) };
    // Don't stack new nodes exactly on top of each other.
    while (doc.nodes.some((n) => n.x === node.x && n.y === node.y)) {
      node.x += GRID;
      node.y += GRID;
    }
    dispatch({ type: 'insert', nodes: [node], select: true });
  };

  const addAtCenter = (kind: NodeKind) => {
    const { width, height, left, top } = viewport.size();
    addNode(kind, viewport.screenToWorld(left + width / 2, top + height / 2));
  };

  const dropFromPalette = (kind: NodeKind, clientX: number, clientY: number) => {
    const hit = document.elementFromPoint(clientX, clientY);
    if (!hit || !container.current?.contains(hit)) return false;
    addNode(kind, viewport.screenToWorld(clientX, clientY));
    return true;
  };

  const findInputTarget = (from: string, at: Point) => {
    const radius = 36 / viewport.vp.current.zoom;
    let best: { id: string; x: number; y: number; distance: number } | null = null;
    for (const node of doc.nodes) {
      if (!canConnect(doc, from, node.id)) continue;
      const port = inPort(node);
      const inside = at.x >= node.x && at.x <= node.x + NODE_W && at.y >= node.y && at.y <= node.y + NODE_H;
      const distance = inside ? 0 : Math.hypot(port.x - at.x, port.y - at.y);
      if (distance <= radius && (!best || distance < best.distance)) best = { id: node.id, ...port, distance };
    }
    return best;
  };

  /** Snap the lead node to neighbours' rows/columns and return the guides to draw. */
  const align = (x: number, y: number, excluded: Set<string>, threshold: number) => {
    const found: Guide[] = [];
    let ax = x;
    let ay = y;
    let bestX = threshold + 1;
    let bestY = threshold + 1;
    for (const other of doc.nodes) {
      if (excluded.has(other.id)) continue;
      const dx = Math.abs(other.x - x);
      const dy = Math.abs(other.y - y);
      if (dx <= threshold && dx < bestX) {
        bestX = dx;
        ax = other.x;
      }
      if (dy <= threshold && dy < bestY) {
        bestY = dy;
        ay = other.y;
      }
    }
    for (const other of doc.nodes) {
      if (excluded.has(other.id)) continue;
      if (other.x === ax && bestX <= threshold) {
        const cx = ax + NODE_W / 2;
        found.push({ axis: 'x', at: cx, from: Math.min(other.y, ay), to: Math.max(other.y, ay) + NODE_H });
      }
      if (other.y === ay && bestY <= threshold) {
        const cy = ay + NODE_H / 2;
        found.push({ axis: 'y', at: cy, from: Math.min(other.x, ax), to: Math.max(other.x, ax) + NODE_W });
      }
    }
    return { x: ax, y: ay, guides: found };
  };

  const deleteSelection = () => {
    const count = selectedEdge ? 0 : selection.length;
    if (!selectedEdge && !count) return;
    dispatch({ type: 'delete' });
    toast({
      title: selectedEdge ? 'Connection deleted' : `Deleted ${count} ${count === 1 ? 'node' : 'nodes'}`,
      action: { label: 'Undo', onClick: () => dispatch({ type: 'undo' }) },
    });
  };

  const duplicate = () => {
    const copy = duplicateSelection(state);
    if (copy) dispatch({ type: 'insert', nodes: copy.nodes, edges: copy.edges, select: true });
  };

  const loadExample = () => {
    dispatch({ type: 'replace', doc: createTemplate() });
    toast({ title: 'Example setup loaded', action: { label: 'Undo', onClick: () => dispatch({ type: 'undo' }) } });
    window.requestAnimationFrame(() => {
      const bounds = nodesBounds(createTemplate().nodes);
      if (bounds) viewport.fitBounds(bounds, fitInsets());
    });
  };

  const toggleSnapping = () => {
    setSnapping((on) => {
      toast({ title: on ? 'Snapping off' : 'Snapping on', description: on ? 'Nodes move freely.' : 'Nodes snap to a 24px grid.' });
      return !on;
    });
  };

  const bookWithMap = () => {
    blueprintStore.set(doc);
    navigate(DEMO_HREF);
  };

  /* ------------------------------------------------------------ pointer input */

  const endDrag = () => {
    dispatch({ type: 'commit' });
    setDragIds([]);
    setGuides([]);
  };

  const beginPinch = () => {
    const current = gesture.current;
    if (current?.kind === 'drag') endDrag();
    setPending(null);
    setMarquee(null);
    const [a, b] = [...pointers.current.values()];
    gesture.current = {
      kind: 'pinch',
      startDistance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
      startMid: localPoint((a.x + b.x) / 2, (a.y + b.y) / 2),
      start: { ...viewport.vp.current },
    };
    setMode('panning');
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 1) return;
    container.current?.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) return beginPinch();
    if (pointers.current.size > 2) return;
    if (e.button === 1) e.preventDefault(); // no autoscroll cursor

    const target = e.target as Element;
    const wantsPan = e.button === 1 || spaceHeld;

    if (!wantsPan) {
      const port = target.closest<HTMLElement>('[data-port="out"]');
      if (port?.dataset.nodeId) {
        const from = port.dataset.nodeId;
        const at = viewport.screenToWorld(e.clientX, e.clientY);
        gesture.current = { kind: 'connect', pointerId: e.pointerId, from };
        setPending({ from, x: at.x, y: at.y, target: null });
        setMode('connecting');
        return;
      }

      const nodeEl = target.closest<HTMLElement>('[data-node-id]');
      const id = nodeEl?.dataset.nodeId;
      if (id) {
        let ids: string[];
        if (e.shiftKey) {
          ids = selected.has(id) ? selection.filter((s) => s !== id) : [...selection, id];
          dispatch({ type: 'select', ids });
          if (!ids.includes(id)) return; // shift-click deselected it: nothing to drag
        } else {
          ids = selected.has(id) ? selection : [id];
          if (!selected.has(id)) dispatch({ type: 'select', ids });
        }
        const origins: Record<string, Point> = {};
        for (const n of doc.nodes) if (ids.includes(n.id)) origins[n.id] = { x: n.x, y: n.y };
        dispatch({ type: 'begin' });
        gesture.current = {
          kind: 'drag',
          pointerId: e.pointerId,
          primary: id,
          start: viewport.screenToWorld(e.clientX, e.clientY),
          origins,
          moved: false,
        };
        setDragIds(ids);
        setMode('dragging');
        return;
      }

      const edgeId = target.closest('[data-edge-id]')?.getAttribute('data-edge-id');
      if (edgeId) {
        dispatch({ type: 'selectEdge', id: edgeId });
        gesture.current = null;
        return;
      }

      if (e.shiftKey) {
        const origin = viewport.screenToWorld(e.clientX, e.clientY);
        gesture.current = { kind: 'marquee', pointerId: e.pointerId, origin, base: selection };
        setMarquee({ x: origin.x, y: origin.y, w: 0, h: 0 });
        setMode('selecting');
        return;
      }
    }

    gesture.current = { kind: 'pan', pointerId: e.pointerId, lastX: e.clientX, lastY: e.clientY, moved: false };
    setMode('panning');
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;

    if (g.kind === 'pinch') {
      if (pointers.current.size < 2) return;
      const [a, b] = [...pointers.current.values()];
      const mid = localPoint((a.x + b.x) / 2, (a.y + b.y) / 2);
      const zoom = g.start.zoom * (Math.hypot(a.x - b.x, a.y - b.y) / g.startDistance);
      const wx = (g.startMid.x - g.start.x) / g.start.zoom;
      const wy = (g.startMid.y - g.start.y) / g.start.zoom;
      const z = Math.min(2.5, Math.max(0.25, zoom));
      viewport.set({ zoom: z, x: mid.x - wx * z, y: mid.y - wy * z });
      return;
    }
    if (g.pointerId !== e.pointerId) return;

    switch (g.kind) {
      case 'pan': {
        const dx = e.clientX - g.lastX;
        const dy = e.clientY - g.lastY;
        g.lastX = e.clientX;
        g.lastY = e.clientY;
        if (dx || dy) {
          g.moved = true;
          viewport.panBy(dx, dy);
        }
        break;
      }
      case 'drag': {
        const at = viewport.screenToWorld(e.clientX, e.clientY);
        let dx = at.x - g.start.x;
        let dy = at.y - g.start.y;
        if (!g.moved && Math.hypot(dx, dy) * viewport.vp.current.zoom < 3) return;
        g.moved = true;
        const origin = g.origins[g.primary];
        const free = e.altKey || !snapping;
        const px = free ? origin.x + dx : snap(origin.x + dx);
        const py = free ? origin.y + dy : snap(origin.y + dy);
        const aligned = align(px, py, new Set(Object.keys(g.origins)), free ? 6 / viewport.vp.current.zoom : 0.5);
        dx = aligned.x - origin.x;
        dy = aligned.y - origin.y;
        const positions: Record<string, Point> = {};
        for (const [id, o] of Object.entries(g.origins)) positions[id] = { x: o.x + dx, y: o.y + dy };
        dispatch({ type: 'move', positions });
        setGuides(aligned.guides);
        break;
      }
      case 'connect': {
        const at = viewport.screenToWorld(e.clientX, e.clientY);
        const target = findInputTarget(g.from, at);
        setPending({ from: g.from, x: target?.x ?? at.x, y: target?.y ?? at.y, target: target?.id ?? null });
        break;
      }
      case 'marquee': {
        const at = viewport.screenToWorld(e.clientX, e.clientY);
        setMarquee({
          x: Math.min(g.origin.x, at.x),
          y: Math.min(g.origin.y, at.y),
          w: Math.abs(at.x - g.origin.x),
          h: Math.abs(at.y - g.origin.y),
        });
        break;
      }
    }
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (!g) return;
    if (g.kind === 'pinch') {
      if (pointers.current.size < 2) {
        gesture.current = null;
        setMode('idle');
      }
      return;
    }
    if (g.pointerId !== e.pointerId) return;
    gesture.current = null;
    const cancelled = e.type === 'pointercancel';

    switch (g.kind) {
      case 'pan':
        if (!g.moved && !cancelled) dispatch({ type: 'select', ids: [] });
        break;
      case 'drag':
        endDrag();
        break;
      case 'connect':
        if (pending?.target && !cancelled) {
          dispatch({ type: 'connect', edge: { id: uid('e'), from: g.from, to: pending.target } });
        }
        setPending(null);
        break;
      case 'marquee':
        if (marquee && !cancelled) {
          const hits = doc.nodes
            .filter(
              (n) =>
                n.x < marquee.x + marquee.w &&
                n.x + NODE_W > marquee.x &&
                n.y < marquee.y + marquee.h &&
                n.y + NODE_H > marquee.y,
            )
            .map((n) => n.id);
          dispatch({ type: 'select', ids: [...new Set([...g.base, ...hits])] });
        }
        setMarquee(null);
        break;
    }
    setMode('idle');
  };

  /* ------------------------------------------------------------ wheel + Safari pinch */

  const onWheel = useEffectEvent((e: WheelEvent) => {
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
    if (e.ctrlKey || e.metaKey) {
      const p = localPoint(e.clientX, e.clientY);
      viewport.zoomAt(viewport.vp.current.zoom * Math.exp(-e.deltaY * unit * 0.0022), p.x, p.y);
    } else {
      viewport.panBy(-e.deltaX * unit, -e.deltaY * unit);
    }
  });

  const onGesture = useEffectEvent((scale: number, clientX: number, clientY: number) => {
    const p = localPoint(clientX, clientY);
    viewport.zoomAt(viewport.vp.current.zoom * scale, p.x, p.y);
  });

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    let lastScale = 1;
    type GestureEvent = Event & { scale: number; clientX: number; clientY: number };
    const wheel = (e: WheelEvent) => onWheel(e);
    const start = (e: Event) => {
      e.preventDefault();
      lastScale = 1;
    };
    const change = (e: Event) => {
      e.preventDefault();
      const ge = e as GestureEvent;
      onGesture(ge.scale / lastScale, ge.clientX, ge.clientY);
      lastScale = ge.scale;
    };
    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('gesturestart', start);
    el.addEventListener('gesturechange', change);
    return () => {
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('gesturestart', start);
      el.removeEventListener('gesturechange', change);
    };
  }, []);

  /* ------------------------------------------------------------ keyboard */

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    const typing = target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    if (typing || e.defaultPrevented) return;
    if (helpOpen) {
      if (e.key === 'Escape') setHelpOpen(false);
      return;
    }
    const onControl = target && target !== document.body && /^(BUTTON|A)$/.test(target.tagName);
    const modKey = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();

    if (e.key === ' ') {
      if (onControl) return; // let Space press the focused button
      e.preventDefault();
      if (!e.repeat) setSpaceHeld(true);
      return;
    }
    if (modKey) {
      if (key === 'z') {
        e.preventDefault();
        dispatch({ type: e.shiftKey ? 'redo' : 'undo' });
      } else if (key === 'y') {
        e.preventDefault();
        dispatch({ type: 'redo' });
      } else if (key === 'a') {
        e.preventDefault();
        dispatch({ type: 'selectAll' });
      } else if (key === 'd') {
        e.preventDefault();
        duplicate();
      } else if (key === 's') {
        e.preventDefault();
        blueprintStore.set(doc);
        toast({ tone: 'success', title: 'Saved in this browser', description: 'Your map is also attached when you book a demo.' });
      }
      return;
    }
    switch (e.key) {
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        deleteSelection();
        return;
      case 'Escape':
        if (gesture.current?.kind === 'connect') {
          gesture.current = null;
          setPending(null);
          setMode('idle');
        } else dispatch({ type: 'select', ids: [] });
        return;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight': {
        if (onControl) return;
        e.preventDefault();
        const step = (snapping ? GRID : 1) * (e.shiftKey ? 4 : 1);
        const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
        const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
        if (selection.length) dispatch({ type: 'nudge', dx, dy });
        else viewport.panBy(-dx * 2, -dy * 2);
        return;
      }
      case '+':
      case '=':
        viewport.zoomBy(1.2);
        return;
      case '-':
      case '_':
        viewport.zoomBy(1 / 1.2);
        return;
      case '0':
        viewport.zoomBy(1 / viewport.vp.current.zoom);
        return;
      case '?':
        setHelpOpen(true);
        return;
    }
    if (key === 'f' || e.key === '!') fit();
    else if (key === 'g') toggleSnapping();
  });

  const onKeyUp = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === ' ') setSpaceHeld(false);
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => onKeyDown(e);
    const up = (e: KeyboardEvent) => onKeyUp(e);
    const blur = () => setSpaceHeld(false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, []);

  /* ------------------------------------------------------------ render */

  const connectingFrom = pending?.from ?? null;
  const cursor =
    mode === 'panning' ? 'cursor-grabbing' : spaceHeld ? 'cursor-grab' : mode === 'connecting' ? 'cursor-crosshair' : 'cursor-default';

  return (
    <div className="absolute inset-0 select-none">
      <div
        ref={container}
        data-canvas-surface
        className={cn('absolute inset-0 touch-none overflow-hidden outline-none', cursor)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div ref={grid} className="dot-grid pointer-events-none absolute inset-0" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,transparent,rgb(5_7_22/0.7))]"
        />

        <div
          ref={world}
          className="absolute left-0 top-0 origin-top-left opacity-0 transition-opacity duration-300 will-change-transform data-[ready=true]:opacity-100"
        >
          <EdgeLayer doc={doc} selectedEdge={selectedEdge} pending={pending} guides={guides} />

          <AnimatePresence>
            {doc.nodes.map((node) => (
              <CanvasNodeView
                key={node.id}
                node={node}
                selected={selected.has(node.id)}
                dragging={dragging.has(node.id)}
                connecting={connectingFrom !== null}
                accepts={connectingFrom !== null && canConnect(doc, connectingFrom, node.id)}
                targeted={pending?.target === node.id}
              />
            ))}
          </AnimatePresence>

          {marquee && (
            <div
              className="pointer-events-none absolute rounded-md border border-signal/70 bg-signal/10"
              style={{ left: marquee.x, top: marquee.y, width: marquee.w, height: marquee.h }}
            />
          )}
        </div>

        {doc.nodes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center p-6">
            <div className="glass-overlay pointer-events-auto max-w-sm rounded-3xl p-7 text-center">
              <p className="font-display text-lg font-semibold text-white">The canvas is empty</p>
              <p className="mt-2 text-sm text-mist">
                Drag a channel from the panel onto the canvas, or start from the example setup.
              </p>
              <Button className="mt-5" onClick={loadExample}>
                Load example setup
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[92px] z-20 flex justify-center px-3 md:pl-[288px] md:pr-[220px]">
        <div className="pointer-events-auto">
          <CanvasToolbar
            zoom={viewport.view.zoom}
            mod={mod}
            canUndo={state.past.length > 0}
            canRedo={state.future.length > 0}
            snapping={snapping}
            onZoomIn={() => viewport.zoomBy(1.2)}
            onZoomOut={() => viewport.zoomBy(1 / 1.2)}
            onZoomReset={() => viewport.zoomBy(1 / viewport.vp.current.zoom)}
            onFit={() => fit()}
            onUndo={() => dispatch({ type: 'undo' })}
            onRedo={() => dispatch({ type: 'redo' })}
            onToggleSnap={toggleSnapping}
            onLoadExample={loadExample}
            onHelp={() => setHelpOpen(true)}
            action={
              <Button size="sm" onClick={bookWithMap} disabled={!doc.nodes.length} className="ml-1">
                Book a demo with this map
              </Button>
            }
          />
        </div>
      </div>

      <NodePalette onAdd={addAtCenter} onDrop={dropFromPalette} />

      <div className="absolute right-4 top-[92px] z-20 hidden md:block">
        <Minimap
          nodes={doc.nodes}
          view={viewport.view}
          size={size}
          onNavigate={(wx, wy) => {
            const z = viewport.vp.current.zoom;
            viewport.set({ zoom: z, x: size.width / 2 - wx * z, y: size.height / 2 - wy * z });
          }}
        />
      </div>

      <div className="pointer-events-none absolute bottom-4 left-[288px] z-10 hidden items-center gap-3 md:flex">
        <motion.p
          key={mode}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-overlay rounded-full px-4 py-2 text-xs text-mist"
          aria-live="polite"
        >
          {HINTS[mode]}
        </motion.p>
        <p className="text-xs tabular-nums text-haze">
          {doc.nodes.length} {doc.nodes.length === 1 ? 'node' : 'nodes'}, {doc.edges.length}{' '}
          {doc.edges.length === 1 ? 'connection' : 'connections'}
        </p>
      </div>

      <ShortcutsDialog open={helpOpen} mod={mod} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
