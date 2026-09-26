'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Flag } from '@/components/layout/Flag';
import { useTransitionRouter } from '@/components/layout/PageTransition';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n/client';
import { LOCALES, LOCALE_COOKIE, LOCALE_META, splitLocale, type Locale } from '@/lib/i18n/config';

/** Remembers the choice for a year, so proxy.ts sends the visitor to it next time. */
function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/** Same page in another language, keeping ?query and #hash. */
function useSwitchLocale() {
  const pathname = usePathname();
  const navigate = useTransitionRouter();
  return (next: Locale) => {
    rememberLocale(next);
    const { path } = splitLocale(pathname);
    const suffix = path === '/' ? '' : path;
    navigate(`/${next}${suffix}${window.location.search}${window.location.hash}`);
  };
}

/** Desktop: flag button with an accessible listbox (arrow keys, Home/End, Enter, Escape). */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { t, locale } = useI18n();
  const switchLocale = useSwitchLocale();
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(() => LOCALES.indexOf(locale));
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listId = useId();

  // Close on outside pointer or focus leaving the widget.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[focusIndex]?.focus();
  }, [open, focusIndex]);

  const openList = () => {
    setFocusIndex(LOCALES.indexOf(locale));
    setOpen(true);
  };

  const choose = (next: Locale) => {
    setOpen(false);
    buttonRef.current?.focus();
    if (next !== locale) switchLocale(next);
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const last = LOCALES.length - 1;
    const moves: Record<string, () => number> = {
      ArrowDown: () => (focusIndex >= last ? 0 : focusIndex + 1),
      ArrowUp: () => (focusIndex <= 0 ? last : focusIndex - 1),
      Home: () => 0,
      End: () => last,
    };
    if (moves[e.key]) {
      e.preventDefault();
      setFocusIndex(moves[e.key]());
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(LOCALES[focusIndex]);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      if (e.key === 'Escape') e.preventDefault();
      setOpen(false);
      if (e.key === 'Escape') buttonRef.current?.focus();
    }
  };

  const meta = LOCALE_META[locale];

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${t.nav.language}: ${meta.native}`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            openList();
          }
        }}
        className={cn(
          'flex h-10 items-center gap-2 rounded-full px-3 text-sm text-mist transition-[background-color,color,transform] duration-200 hover:bg-white/[0.07] hover:text-white active:scale-95',
          open && 'bg-white/[0.07] text-white',
        )}
      >
        <Flag code={meta.flag} />
        <span className="font-medium uppercase tracking-wide">{locale}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label={t.nav.language}
            onKeyDown={onListKeyDown}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="glass-overlay absolute right-0 top-[calc(100%+10px)] z-10 w-60 origin-top-right rounded-2xl p-1.5"
          >
            {LOCALES.map((code, i) => {
              const item = LOCALE_META[code];
              const selected = code === locale;
              return (
                <li
                  key={code}
                  id={`${listId}-${code}`}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  role="option"
                  aria-selected={selected}
                  lang={item.htmlLang}
                  tabIndex={i === focusIndex ? 0 : -1}
                  onClick={() => choose(code)}
                  onPointerMove={() => i !== focusIndex && setFocusIndex(i)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors',
                    i === focusIndex ? 'bg-white/[0.08] text-white' : 'text-mist',
                  )}
                >
                  <Flag code={item.flag} className="h-4 w-6" />
                  <span className="flex-1">
                    <span className="block font-medium text-white">{item.native}</span>
                    {item.native !== item.english && <span className="block text-xs text-haze">{item.english}</span>}
                  </span>
                  {selected && <Check className="h-4 w-4 text-signal" aria-hidden />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Mobile drawer: every language as a large tap target. */
export function LanguageGrid({ onPick }: { onPick?: () => void }) {
  const { t, locale } = useI18n();
  const switchLocale = useSwitchLocale();
  return (
    <fieldset>
      <legend className="mb-2 flex items-center gap-2 px-1 text-xs font-medium text-haze">
        <Globe className="h-3.5 w-3.5" aria-hidden />
        {t.nav.language}
      </legend>
      <div className="grid grid-cols-2 gap-1.5">
        {LOCALES.map((code) => {
          const item = LOCALE_META[code];
          const selected = code === locale;
          return (
            <button
              key={code}
              type="button"
              lang={item.htmlLang}
              aria-pressed={selected}
              onClick={() => {
                onPick?.();
                if (!selected) switchLocale(code);
              }}
              className={cn(
                'flex min-h-11 items-center gap-2.5 rounded-xl border px-3 text-left text-sm transition-[background-color,border-color,transform] duration-150 active:scale-[0.97]',
                selected ? 'border-signal/50 bg-signal/10 text-white' : 'border-white/[0.07] bg-white/[0.02] text-mist',
              )}
            >
              <Flag code={item.flag} />
              <span className="truncate">{item.native}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
