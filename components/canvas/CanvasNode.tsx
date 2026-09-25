'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { CATEGORY_GRADIENT, KINDS, NODE_H, NODE_W, type CanvasNode } from '@/lib/canvas/model';
import { KIND_ICONS } from './node-icons';

interface CanvasNodeProps {
  node: CanvasNode;
  selected: boolean;
  dragging: boolean;
  /** A connection is being drawn somewhere on the canvas. */
  connecting: boolean;
  /** This node can accept the connection being drawn. */
  accepts: boolean;
  /** The connection being drawn is snapped to this node's input. */
  targeted: boolean;
}

/**
 * Presentational only: all pointer logic is delegated to CanvasWorkspace via data attributes.
 * Positioned by a plain transform on the outer div (so framer-motion's scale on the inner
 * card never fights the position), and memoised so panning doesn't re-render nodes.
 */
export const CanvasNodeView = memo(function CanvasNodeView({
  node,
  selected,
  dragging,
  connecting,
  accepts,
  targeted,
}: CanvasNodeProps) {
  const meta = KINDS[node.kind];
  const Icon = KIND_ICONS[node.kind];

  return (
    <div
      data-node-id={node.id}
      className="absolute left-0 top-0"
      style={{
        width: NODE_W,
        height: NODE_H,
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
        zIndex: dragging ? 30 : selected ? 20 : 10,
      }}
    >
      <motion.div
        role="group"
        aria-roledescription="node"
        aria-label={`${meta.label}${selected ? ', selected' : ''}`}
        initial={{ opacity: 0, scale: 0.86 }}
        animate={{ opacity: connecting && !accepts && !targeted ? 0.5 : 1, scale: dragging ? 1.035 : 1 }}
        exit={{ opacity: 0, scale: 0.86, transition: { duration: 0.16 } }}
        transition={{ type: 'spring', stiffness: 520, damping: 34 }}
        className={cn(
          'wire-border group relative flex h-full w-full cursor-grab select-none items-center gap-3 rounded-2xl border bg-[#0E1330]/95 px-3 active:cursor-grabbing',
          'transition-[border-color,box-shadow] duration-200',
          selected ? 'border-transparent shadow-glow [--wire-opacity:1]' : 'border-white/10 [--wire-opacity:0] [--wire-play:paused] hover:border-white/25',
          dragging && 'shadow-lift',
          targeted && 'shadow-glow-signal',
        )}
      >
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
          style={{ backgroundImage: CATEGORY_GRADIENT[meta.category] }}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-white">{meta.label}</span>
          <span className="block truncate text-xs text-haze">{meta.hint}</span>
        </span>

        {meta.inputs && (
          <span data-port="in" data-node-id={node.id} aria-hidden className="absolute -left-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center">
            <span
              className={cn(
                'h-3 w-3 rounded-full border-2 border-night bg-charge transition-transform duration-150',
                connecting && accepts && 'scale-125 shadow-glow',
                targeted && 'scale-[1.6] bg-white',
              )}
            />
          </span>
        )}
        {meta.outputs && (
          <span
            data-port="out"
            data-node-id={node.id}
            aria-hidden
            className="absolute -right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 cursor-crosshair place-items-center"
          >
            <span className="h-3 w-3 rounded-full border-2 border-night bg-signal transition-transform duration-150 group-hover:scale-125 hover:scale-150!" />
          </span>
        )}
      </motion.div>
    </div>
  );
});
