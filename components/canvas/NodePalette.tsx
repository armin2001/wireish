'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { CATEGORIES, CATEGORY_GRADIENT, KINDS, type NodeKind } from '@/lib/canvas/model';
import { KIND_ICONS } from './node-icons';

interface NodePaletteProps {
  /** Click or keyboard: add at the centre of the view. */
  onAdd: (kind: NodeKind) => void;
  /** Drag and drop: returns false when dropped outside the canvas. */
  onDrop: (kind: NodeKind, clientX: number, clientY: number) => boolean;
}

interface Press {
  kind: NodeKind;
  pointerId: number;
  x: number;
  y: number;
  dragging: boolean;
}

export function NodePalette({ onAdd, onDrop }: NodePaletteProps) {
  const [ghost, setGhost] = useState<NodeKind | null>(null);
  const [rejected, setRejected] = useState(false);
  const ghostX = useMotionValue(0);
  const ghostY = useMotionValue(0);
  const press = useRef<Press | null>(null);

  const onPointerDown = (kind: NodeKind) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    press.current = { kind, pointerId: e.pointerId, x: e.clientX, y: e.clientY, dragging: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const p = press.current;
    if (!p || p.pointerId !== e.pointerId) return;
    if (!p.dragging && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 5) {
      p.dragging = true;
      setRejected(false);
      setGhost(p.kind);
    }
    if (p.dragging) {
      ghostX.set(e.clientX);
      ghostY.set(e.clientY);
    }
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const p = press.current;
    press.current = null;
    if (!p || p.pointerId !== e.pointerId) return;
    if (!p.dragging) {
      onAdd(p.kind);
      return;
    }
    const accepted = onDrop(p.kind, e.clientX, e.clientY);
    setRejected(!accepted);
    setGhost(null);
  };

  const onPointerCancel = () => {
    press.current = null;
    setGhost(null);
  };

  return (
    <>
      <aside
        aria-label="Add to canvas"
        className="glass-overlay absolute z-20 flex gap-4 overflow-auto rounded-3xl p-3 md:bottom-4 md:left-4 md:top-[92px] md:w-64 md:flex-col max-md:inset-x-3 max-md:bottom-3 max-md:items-start"
      >
        <p className="px-2 pt-1 text-xs text-haze max-md:hidden">Drag onto the canvas, or click to add</p>
        {CATEGORIES.map((category) => (
          <section key={category.id} className="max-md:shrink-0">
            <h2 className="px-2 pb-1.5 text-xs font-medium text-mist">{category.label}</h2>
            <ul className="flex gap-1 md:flex-col">
              {category.kinds.map((kind) => {
                const meta = KINDS[kind];
                const Icon = KIND_ICONS[kind];
                return (
                  <li key={kind}>
                    <button
                      type="button"
                      onPointerDown={onPointerDown(kind)}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      onPointerCancel={onPointerCancel}
                      // detail === 0 means the click came from the keyboard.
                      onClick={(e) => e.detail === 0 && onAdd(kind)}
                      aria-label={`Add ${meta.label}`}
                      className="group flex w-full touch-pan-x items-center gap-3 rounded-2xl p-2 text-left transition-colors duration-150 hover:bg-white/[0.06] active:scale-[0.98] max-md:w-auto max-md:pr-3"
                    >
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white transition-transform duration-200 group-hover:scale-105"
                        style={{ backgroundImage: CATEGORY_GRADIENT[meta.category] }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-white">{meta.label}</span>
                        <span className="block truncate text-xs text-haze max-md:hidden">{meta.hint}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </aside>

      <AnimatePresence>
        {ghost && (
          <motion.div
            key="ghost"
            className="pointer-events-none fixed left-0 top-0 z-50"
            style={{ x: ghostX, y: ghostY }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={rejected ? { opacity: 0, scale: 0.6, transition: { duration: 0.2 } } : { opacity: 0, transition: { duration: 0.08 } }}
          >
            <div className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-2xl border border-signal/50 bg-[#0E1330]/90 px-3 py-2.5 shadow-glow-signal">
              <span
                className="grid h-8 w-8 place-items-center rounded-lg text-white"
                style={{ backgroundImage: CATEGORY_GRADIENT[KINDS[ghost].category] }}
              >
                {(() => {
                  const Icon = KIND_ICONS[ghost];
                  return <Icon className="h-4 w-4" />;
                })()}
              </span>
              <span className="text-sm font-medium text-white">{KINDS[ghost].label}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
