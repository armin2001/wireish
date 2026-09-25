'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ShortcutsDialogProps {
  open: boolean;
  mod: string;
  onClose: () => void;
}

export function ShortcutsDialog({ open, mod, onClose }: ShortcutsDialogProps) {
  const closeButton = useRef<HTMLButtonElement>(null);

  // Focus the dialog on open and give focus back to whatever opened it.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    return () => previous?.focus?.();
  }, [open]);

  const groups: Array<{ title: string; items: Array<[string, string]> }> = [
    {
      title: 'Navigate',
      items: [
        ['Pan', 'Space + drag, middle-drag, scroll'],
        ['Zoom', `${mod} + scroll, pinch, + and −`],
        ['Zoom to 100%', '0'],
        ['Fit to content', 'F'],
      ],
    },
    {
      title: 'Select and move',
      items: [
        ['Select', 'Click, Shift + click'],
        ['Box select', 'Shift + drag on empty canvas'],
        ['Select all', `${mod}A`],
        ['Nudge', 'Arrow keys (Shift for bigger steps)'],
        ['Move freely', 'Hold Alt while dragging'],
        ['Toggle snapping', 'G'],
      ],
    },
    {
      title: 'Edit',
      items: [
        ['Connect', 'Drag from a blue dot to a violet dot'],
        ['Duplicate', `${mod}D`],
        ['Delete', 'Delete or Backspace'],
        ['Undo / redo', `${mod}Z / ${mod}⇧Z`],
        ['Save', `${mod}S (also saves automatically)`],
      ],
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-80 grid place-items-center bg-night/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onPointerDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="glass-overlay relative max-h-[85dvh] w-full max-w-2xl overflow-auto rounded-3xl p-7"
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
          >
            <div className="wire-line absolute inset-x-0 top-0" aria-hidden />
            <div className="flex items-center justify-between">
              <h2 id="shortcuts-title" className="font-display text-xl font-semibold text-white">
                Keyboard shortcuts
              </h2>
              <button
                ref={closeButton}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full text-mist hover:bg-white/8 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {groups.map((group) => (
                <section key={group.title}>
                  <h3 className="mb-3 text-sm font-medium text-mist">{group.title}</h3>
                  <dl className="space-y-2.5">
                    {group.items.map(([action, keys]) => (
                      <div key={action} className="flex items-baseline justify-between gap-4 text-sm">
                        <dt className="text-white">{action}</dt>
                        <dd className="text-right text-haze">{keys}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
