'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n/client';
import { intlLocale } from '@/lib/i18n/config';

interface CalendarProps {
  /** Visitor-local days with at least one free slot, as YYYY-MM-DD. */
  availableDays: Set<string>;
  selected: string | null;
  todayKey: string;
  onSelect: (day: string) => void;
}

interface Month {
  year: number;
  month: number; // 0 to 11
}

const pad = (n: number) => String(n).padStart(2, '0');
const toKey = (y: number, m: number, d: number) => {
  const date = new Date(Date.UTC(y, m, d));
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
};
const parseKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return { y, m: m - 1, d };
};
const monthOf = (key: string): Month => {
  const { y, m } = parseKey(key);
  return { year: y, month: m };
};
const addDays = (key: string, days: number) => {
  const { y, m, d } = parseKey(key);
  return toKey(y, m, d + days);
};
const compareMonth = (a: Month, b: Month) => a.year * 12 + a.month - (b.year * 12 + b.month);

export function Calendar({ availableDays, selected, todayKey, onSelect }: CalendarProps) {
  const { t, locale } = useI18n();
  const tt = t.booking.time;
  const intl = intlLocale(locale);
  // 2024-01-01 was a Monday; weeks start on Monday. Same locale on server and client, so no hydration mismatch.
  const weekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        new Intl.DateTimeFormat(intl, { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + i))),
      ),
    [intl],
  );
  const dayLabel = useMemo(
    () => new Intl.DateTimeFormat(intl, { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' }),
    [intl],
  );
  const sorted = [...availableDays].sort();
  const first = sorted[0] ?? todayKey;
  const last = sorted[sorted.length - 1] ?? todayKey;
  const minMonth = monthOf(todayKey);
  const maxMonth = monthOf(last);

  const [cursor, setCursor] = useState<Month>(() => monthOf(selected ?? first));
  const [focusKey, setFocusKey] = useState(selected ?? first);
  const [direction, setDirection] = useState(1);
  const grid = useRef<HTMLDivElement>(null);
  const keyboardNav = useRef(false);

  // Move DOM focus only when the user is navigating with the keyboard.
  useEffect(() => {
    if (!keyboardNav.current) return;
    keyboardNav.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focusKey}"]`)?.focus();
  }, [focusKey, cursor]);

  const goToMonth = (next: Month, focus?: string) => {
    if (compareMonth(next, minMonth) < 0 || compareMonth(next, maxMonth) > 0) return;
    setDirection(compareMonth(next, cursor) >= 0 ? 1 : -1);
    setCursor(next);
    const firstAvailable = sorted.find((k) => compareMonth(monthOf(k), next) === 0);
    setFocusKey(focus ?? firstAvailable ?? toKey(next.year, next.month, 1));
  };

  const moveFocus = (key: string) => {
    const target = monthOf(key);
    if (compareMonth(target, minMonth) < 0 || compareMonth(target, maxMonth) > 0) return;
    keyboardNav.current = true;
    if (compareMonth(target, cursor) !== 0) {
      setDirection(compareMonth(target, cursor) > 0 ? 1 : -1);
      setCursor(target);
    }
    setFocusKey(key);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const { y, m, d } = parseKey(focusKey);
    const weekday = (new Date(Date.UTC(y, m, d)).getUTCDay() + 6) % 7;
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(focusKey, -1),
      ArrowRight: () => addDays(focusKey, 1),
      ArrowUp: () => addDays(focusKey, -7),
      ArrowDown: () => addDays(focusKey, 7),
      Home: () => addDays(focusKey, -weekday),
      End: () => addDays(focusKey, 6 - weekday),
      PageUp: () => toKey(y, m - 1, Math.min(d, 28)),
      PageDown: () => toKey(y, m + 1, Math.min(d, 28)),
    };
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      moveFocus(move());
    } else if ((e.key === 'Enter' || e.key === ' ') && availableDays.has(focusKey)) {
      e.preventDefault();
      onSelect(focusKey);
    }
  };

  const firstWeekday = (new Date(Date.UTC(cursor.year, cursor.month, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(cursor.year, cursor.month + 1, 0)).getUTCDate();
  const cells: Array<string | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => toKey(cursor.year, cursor.month, i + 1)),
  ];
  const monthLabel = new Intl.DateTimeFormat(intl, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(cursor.year, cursor.month, 1)),
  );
  const canPrev = compareMonth(cursor, minMonth) > 0;
  const canNext = compareMonth(cursor, maxMonth) < 0;

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display font-semibold text-white" aria-live="polite">
          {monthLabel}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => goToMonth(monthOf(toKey(cursor.year, cursor.month - 1, 1)))}
            disabled={!canPrev}
            aria-label={tt.prevMonth}
            className="grid h-9 w-9 place-items-center rounded-full text-mist transition-colors hover:bg-white/[0.07] hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goToMonth(monthOf(toKey(cursor.year, cursor.month + 1, 1)))}
            disabled={!canNext}
            aria-label={tt.nextMonth}
            className="grid h-9 w-9 place-items-center rounded-full text-mist transition-colors hover:bg-white/[0.07] hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-haze" aria-hidden>
        {weekdays.map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>

      <div ref={grid} className="relative mt-1 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={`${cursor.year}-${cursor.month}`}
            role="group"
            aria-label={`${monthLabel}. ${tt.monthHelp}`}
            onKeyDown={onKeyDown}
            custom={direction}
            variants={{
              enter: (d: number) => ({ x: d * 40, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -40, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-7 gap-1"
          >
            {cells.map((key, i) => {
              if (!key) return <span key={`blank-${i}`} aria-hidden />;
              const available = availableDays.has(key);
              const isSelected = key === selected;
              const label = dayLabel.format(new Date(`${key}T00:00:00Z`));
              return (
                <span key={key}>
                  <button
                    type="button"
                    data-day={key}
                    tabIndex={key === focusKey ? 0 : -1}
                    aria-disabled={!available}
                    aria-pressed={isSelected}
                    onClick={() => {
                      setFocusKey(key);
                      if (available) onSelect(key);
                    }}
                    aria-label={available ? label : `${label}, ${tt.unavailable}`}
                    className={cn(
                      'relative grid aspect-square w-full place-items-center rounded-xl text-sm tabular-nums transition-colors duration-150',
                      available ? 'bg-field text-white hover:bg-field-hover' : 'cursor-default text-white/20',
                      isSelected && 'font-semibold',
                    )}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="calendar-selected"
                        className="absolute inset-0 rounded-xl shadow-glow-signal"
                        style={{ backgroundImage: 'var(--gradient-wire)' }}
                        transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                      />
                    )}
                    <span className="relative">{Number(key.slice(8))}</span>
                    {available && !isSelected && (
                      <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-signal/80" aria-hidden />
                    )}
                    {key === todayKey && !isSelected && (
                      <span className="absolute inset-1 rounded-lg border border-white/15" aria-hidden />
                    )}
                  </button>
                </span>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
