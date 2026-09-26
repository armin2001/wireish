'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Trash2, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n/client';
import { format } from '@/lib/i18n/format';

interface SelectionBarProps {
  nodeCount: number;
  edgeSelected: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  onClear: () => void;
}

/**
 * Contextual actions for the current selection. Keyboard users have shortcuts; this bar is
 * what makes duplicate and delete reachable on touch screens.
 */
export function SelectionBar({ nodeCount, edgeSelected, onDuplicate, onDelete, onClear }: SelectionBarProps) {
  const { t } = useI18n();
  const s = t.canvas.selection;
  const visible = edgeSelected || nodeCount > 0;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[148px] z-20 flex justify-center px-3 md:pl-[288px] md:pr-[220px]">
      <AnimatePresence>
        {visible && (
          <motion.div
            key="selection"
            role="toolbar"
            aria-label={edgeSelected ? s.edge : format(s.nodes, { n: nodeCount })}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 520, damping: 36 }}
            className="glass-overlay pointer-events-auto flex items-center gap-1 rounded-2xl p-1.5 text-sm"
          >
            <span className="px-2.5 tabular-nums text-mist">{edgeSelected ? s.edge : format(s.nodes, { n: nodeCount })}</span>
            {!edgeSelected && (
              <BarButton label={s.duplicate} onClick={onDuplicate}>
                <Copy className="h-4 w-4" aria-hidden />
              </BarButton>
            )}
            <BarButton label={s.delete} onClick={onDelete} danger>
              <Trash2 className="h-4 w-4" aria-hidden />
            </BarButton>
            <span className="mx-0.5 h-5 w-px bg-white/10" aria-hidden />
            <button
              type="button"
              onClick={onClear}
              aria-label={s.clear}
              className="grid h-9 w-9 place-items-center rounded-xl text-haze transition-[color,background-color,transform] hover:bg-white/[0.08] hover:text-white active:scale-90"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BarButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'flex h-9 items-center gap-1.5 rounded-xl px-3 font-medium transition-[color,background-color,transform] duration-150 active:scale-95 ' +
        (danger ? 'text-white hover:bg-danger/20 hover:text-white' : 'text-white hover:bg-white/[0.08]')
      }
    >
      {children}
      <span className="max-sm:sr-only">{label}</span>
    </button>
  );
}
