'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useI18n } from '@/lib/i18n/client';

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

  const { t } = useI18n();
  const sc = t.canvas.shortcuts;
  const it = sc.items;
  // "{mod}A" → "⌘A" / "Ctrl+A"; "{mod} + scroll" → "⌘ + scroll" / "Ctrl + scroll".
  const keys = (text: string) => text.replaceAll('{mod} +', `${mod.replace(/\+$/, '')} +`).replaceAll('{mod}', mod);
  const row = ([action, combo]: readonly string[]): [string, string] => [action, keys(combo)];
  const groups: Array<{ title: string; items: Array<[string, string]> }> = [
    { title: sc.navigate, items: [it.pan, it.zoom, it.reset, it.fit].map(row) },
    { title: sc.select, items: [it.pick, it.box, it.all, it.nudge, it.free, it.snap].map(row) },
    { title: sc.edit, items: [it.connect, it.duplicate, it.remove, it.history, it.save].map(row) },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-night/60 p-4 backdrop-blur-sm"
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
                {sc.title}
              </h2>
              <button
                ref={closeButton}
                type="button"
                onClick={onClose}
                aria-label={t.common.close}
                className="grid h-9 w-9 place-items-center rounded-full text-mist hover:bg-white/[0.08] hover:text-white"
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
