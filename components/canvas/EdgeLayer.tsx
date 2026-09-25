'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { BRAND } from '@/lib/brand';
import { inPort, outPort, type CanvasDoc } from '@/lib/canvas/model';

export interface PendingEdge {
  from: string;
  x: number;
  y: number;
  target: string | null;
}

export interface Guide {
  axis: 'x' | 'y';
  at: number;
  from: number;
  to: number;
}

export function edgePath(sx: number, sy: number, tx: number, ty: number) {
  const dx = Math.max(56, Math.abs(tx - sx) * 0.5);
  return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
}

interface EdgeLayerProps {
  doc: CanvasDoc;
  selectedEdge: string | null;
  pending: PendingEdge | null;
  guides: Guide[];
}

/** All wires in one SVG in world space. Hit paths are wide and transparent for easy clicking. */
export const EdgeLayer = memo(function EdgeLayer({ doc, selectedEdge, pending, guides }: EdgeLayerProps) {
  const byId = new Map(doc.nodes.map((n) => [n.id, n]));
  const source = pending ? byId.get(pending.from) : undefined;

  return (
    <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width={1} height={1} aria-hidden>
      <defs>
        {doc.edges.map((edge) => {
          const a = byId.get(edge.from);
          const b = byId.get(edge.to);
          if (!a || !b) return null;
          const s = outPort(a);
          const t = inPort(b);
          return (
            <linearGradient key={edge.id} id={`wire-${edge.id}`} gradientUnits="userSpaceOnUse" x1={s.x} y1={s.y} x2={t.x} y2={t.y}>
              <stop offset="0" stopColor={BRAND.signal} />
              <stop offset="0.5053" stopColor={BRAND.iris} />
              <stop offset="1" stopColor={BRAND.charge} />
            </linearGradient>
          );
        })}
      </defs>

      {guides.map((g, i) =>
        g.axis === 'x' ? (
          <line key={i} x1={g.at} x2={g.at} y1={g.from} y2={g.to} stroke={BRAND.signal} strokeOpacity={0.7} strokeDasharray="4 4" />
        ) : (
          <line key={i} y1={g.at} y2={g.at} x1={g.from} x2={g.to} stroke={BRAND.signal} strokeOpacity={0.7} strokeDasharray="4 4" />
        ),
      )}

      {doc.edges.map((edge) => {
        const a = byId.get(edge.from);
        const b = byId.get(edge.to);
        if (!a || !b) return null;
        const s = outPort(a);
        const t = inPort(b);
        const d = edgePath(s.x, s.y, t.x, t.y);
        const selected = edge.id === selectedEdge;
        return (
          <g key={edge.id}>
            <path d={d} data-edge-id={edge.id} fill="none" stroke="transparent" strokeWidth={16} pointerEvents="stroke" className="cursor-pointer" />
            {selected && <path d={d} fill="none" stroke={`url(#wire-${edge.id})`} strokeWidth={10} strokeOpacity={0.3} strokeLinecap="round" />}
            <motion.path
              d={d}
              fill="none"
              stroke={`url(#wire-${edge.id})`}
              strokeWidth={selected ? 3 : 2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
            <path
              d={d}
              fill="none"
              stroke="#fff"
              strokeOpacity={0.55}
              strokeWidth={2}
              strokeDasharray="2 14"
              strokeLinecap="round"
              className="animate-wire-flow"
            />
          </g>
        );
      })}

      {pending && source && (
        <path
          d={edgePath(outPort(source).x, outPort(source).y, pending.x, pending.y)}
          fill="none"
          stroke={pending.target ? BRAND.signal : '#ffffff'}
          strokeOpacity={pending.target ? 1 : 0.5}
          strokeWidth={2}
          strokeDasharray={pending.target ? undefined : '6 6'}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
});
