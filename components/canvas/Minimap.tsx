'use client';

import { memo, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { BRAND } from '@/lib/brand';
import { KINDS, NODE_H, NODE_W, nodesBounds, type Bounds, type CanvasNode } from '@/lib/canvas/model';
import type { Viewport } from './useViewport';
import { useI18n } from '@/lib/i18n/client';

const W = 184;
const H = 116;
const PAD = 120;
const CATEGORY_COLOR = { channel: BRAND.signal, intelligence: BRAND.spark, action: BRAND.current } as const;

interface MinimapProps {
  nodes: CanvasNode[];
  view: Viewport;
  size: { width: number; height: number };
  onNavigate: (worldX: number, worldY: number) => void;
}

function union(a: Bounds | null, b: Bounds): Bounds {
  if (!a) return b;
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
}

export const Minimap = memo(function Minimap({ nodes, view, size, onNavigate }: MinimapProps) {
  const { t } = useI18n();
  // Freeze the frame while dragging, otherwise the map rescales under the pointer.
  const [frozen, setFrozen] = useState<Bounds | null>(null);

  const visible: Bounds = {
    minX: -view.x / view.zoom,
    minY: -view.y / view.zoom,
    maxX: (size.width - view.x) / view.zoom,
    maxY: (size.height - view.y) / view.zoom,
  };
  const live = union(nodesBounds(nodes), visible);
  const b = frozen ?? { minX: live.minX - PAD, minY: live.minY - PAD, maxX: live.maxX + PAD, maxY: live.maxY + PAD };
  const scale = Math.min(W / (b.maxX - b.minX), H / (b.maxY - b.minY));
  const ox = (W - (b.maxX - b.minX) * scale) / 2 - b.minX * scale;
  const oy = (H - (b.maxY - b.minY) * scale) / 2 - b.minY * scale;

  const navigate = (e: ReactPointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onNavigate((e.clientX - rect.left - ox) / scale, (e.clientY - rect.top - oy) / scale);
  };

  return (
    <div className="glass-overlay overflow-hidden rounded-2xl p-1.5">
      <svg
        width={W}
        height={H}
        role="img"
        aria-label={t.canvas.minimap}
        className="block cursor-pointer touch-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFrozen(b);
          navigate(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) navigate(e);
        }}
        onPointerUp={() => setFrozen(null)}
        onPointerCancel={() => setFrozen(null)}
      >
        {nodes.map((n) => (
          <rect
            key={n.id}
            x={n.x * scale + ox}
            y={n.y * scale + oy}
            width={Math.max(2, NODE_W * scale)}
            height={Math.max(2, NODE_H * scale)}
            rx={2}
            fill={CATEGORY_COLOR[KINDS[n.kind].category]}
            fillOpacity={0.85}
          />
        ))}
        <rect
          x={visible.minX * scale + ox}
          y={visible.minY * scale + oy}
          width={(visible.maxX - visible.minX) * scale}
          height={(visible.maxY - visible.minY) * scale}
          rx={4}
          fill="#ffffff"
          fillOpacity={0.05}
          stroke="#ffffff"
          strokeOpacity={0.55}
        />
      </svg>
    </div>
  );
});
