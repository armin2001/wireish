'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';

type Tone = 'info' | 'success' | 'error';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: Tone;
  action?: { label: string; onClick: () => void };
}

interface ToastItem extends ToastOptions {
  id: number;
  tone: Tone;
}

const ToastContext = createContext<(toast: ToastOptions) => void>(() => {});

export const useToast = () => useContext(ToastContext);

const ICONS = { info: Info, success: CircleCheck, error: CircleAlert } as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<number, number>());
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const handle = timers.current.get(id);
    if (handle !== undefined) {
      window.clearTimeout(handle);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (options: ToastOptions) => {
      nextId.current += 1;
      const id = nextId.current;
      setToasts((list) => [...list.slice(-3), { ...options, tone: options.tone ?? 'info', id }]);
      timers.current.set(id, window.setTimeout(() => dismiss(id), options.action ? 6500 : 4200));
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((handle) => window.clearTimeout(handle));
      pending.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex flex-col items-center gap-2 px-4"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.tone];
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.18 } }}
                transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                className="glass-overlay pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl p-3.5 pr-2.5"
                role={toast.tone === 'error' ? 'alert' : 'status'}
              >
                <Icon
                  aria-hidden
                  className={cn(
                    'mt-0.5 h-4.5 w-4.5 shrink-0',
                    toast.tone === 'success' && 'text-signal',
                    toast.tone === 'error' && 'text-danger',
                    toast.tone === 'info' && 'text-mist',
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{toast.title}</p>
                  {toast.description && <p className="mt-0.5 text-sm text-mist">{toast.description}</p>}
                </div>
                {toast.action && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.action?.onClick();
                      dismiss(toast.id);
                    }}
                    className="rounded-full px-3 py-1 text-sm font-medium text-signal transition-colors hover:bg-white/[0.06]"
                  >
                    {toast.action.label}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-haze transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
