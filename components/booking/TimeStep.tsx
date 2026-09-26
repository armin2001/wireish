'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { Calendar } from '@/components/booking/Calendar';
import { cn } from '@/lib/cn';
import {
  dateKey,
  generateSlots,
  getVisitorTimeZone,
  getZonedParts,
  groupSlotsByDay,
  listTimeZones,
  MEETING_MINUTES,
} from '@/lib/availability';
import { useI18n } from '@/lib/i18n/client';
import { intlLocale } from '@/lib/i18n/config';
import { format } from '@/lib/i18n/format';

export interface TimeDraft {
  slot: string | null; // ISO instant
  timeZone: string | null;
}

interface TimeStepProps {
  value: TimeDraft;
  onChange: (value: TimeDraft) => void;
  showError: boolean;
}

const PERIODS = [
  { id: 'morning', test: (h: number) => h < 12 },
  { id: 'afternoon', test: (h: number) => h >= 12 && h < 17 },
  { id: 'evening', test: (h: number) => h >= 17 },
] as const;

/**
 * Only ever rendered after the visitor interacts (step 2), so reading the clock and the
 * browser time zone during render can't cause a hydration mismatch.
 */
export function TimeStep({ value, onChange, showError }: TimeStepProps) {
  const { t, locale } = useI18n();
  const tt = t.booking.time;
  const intl = intlLocale(locale);
  const [visitorZone] = useState(getVisitorTimeZone);
  const [slots] = useState(() => generateSlots());
  const [now] = useState(() => new Date());
  const [pickedDay, setPickedDay] = useState<string | null>(null);

  const timeZone = value.timeZone ?? visitorZone;
  const zones = useMemo(() => listTimeZones([visitorZone]), [visitorZone]);
  const byDay = useMemo(() => groupSlotsByDay(slots, timeZone), [slots, timeZone]);
  const availableDays = useMemo(() => new Set(byDay.keys()), [byDay]);
  const firstDay = useMemo(() => [...availableDays].sort()[0] ?? null, [availableDays]);

  const slotDay = value.slot ? dateKey(new Date(value.slot), timeZone) : null;
  const selectedDay = slotDay ?? pickedDay ?? firstDay;
  const daySlots = selectedDay ? byDay.get(selectedDay) ?? [] : [];

  const timeFormat = useMemo(
    () => new Intl.DateTimeFormat(intl, { hour: 'numeric', minute: '2-digit', timeZone }),
    [intl, timeZone],
  );
  const dayFormat = useMemo(
    () => new Intl.DateTimeFormat(intl, { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' }),
    [intl],
  );

  const selectDay = (day: string) => {
    setPickedDay(day);
    if (value.slot && day !== slotDay) onChange({ slot: null, timeZone });
  };

  return (
    <div>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <Calendar
          availableDays={availableDays}
          selected={selectedDay}
          todayKey={dateKey(now, timeZone)}
          onSelect={selectDay}
        />

        <div>
          <p className="font-display font-semibold text-white">
            {selectedDay ? dayFormat.format(new Date(`${selectedDay}T00:00:00Z`)) : tt.pickDay}
          </p>
          <p className="mt-1 text-sm text-haze">{format(tt.length, { n: MEETING_MINUTES })}</p>

          <div className="mt-4 max-h-[340px] space-y-5 overflow-y-auto pr-1">
            {daySlots.length === 0 && (
              <p className="rounded-2xl border border-white/[0.08] bg-field p-4 text-sm text-mist">
                {tt.noSlots}
              </p>
            )}
            {PERIODS.map((period) => {
              const periodSlots = daySlots.filter((slot) => period.test(getZonedParts(slot, timeZone).hour));
              if (!periodSlots.length) return null;
              return (
                <div key={period.id} role="radiogroup" aria-label={format(tt.periodTimes, { period: tt[period.id] })}>
                  <p className="mb-2 text-xs text-haze">{tt[period.id]}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {periodSlots.map((slot) => {
                      const iso = slot.toISOString();
                      const selected = value.slot === iso;
                      return (
                        <motion.button
                          key={iso}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onChange({ slot: iso, timeZone })}
                          className={cn(
                            'relative h-10 rounded-xl border text-sm tabular-nums transition-colors duration-150',
                            selected
                              ? 'border-transparent font-semibold text-white'
                              : 'border-white/[0.08] bg-field text-mist hover:border-signal/50 hover:bg-field-hover hover:text-white',
                          )}
                        >
                          {selected && (
                            <motion.span
                              layoutId="slot-selected"
                              className="absolute inset-0 rounded-xl shadow-glow-signal"
                              style={{ backgroundImage: 'var(--gradient-wire)' }}
                              transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                            />
                          )}
                          <span className="relative">{timeFormat.format(slot)}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <label className="mt-8 flex flex-wrap items-center gap-3 text-sm text-mist">
        <Globe className="h-4 w-4 text-haze" aria-hidden />
        {tt.timezone}
        <select
          value={timeZone}
          onChange={(e) => {
            setPickedDay(null);
            onChange({ slot: value.slot, timeZone: e.target.value });
          }}
          className="h-9 max-w-[16rem] rounded-full border border-white/[0.08] bg-field px-3 text-sm text-white outline-none transition-colors hover:border-white/25 focus-visible:border-signal/60"
        >
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </label>

      {showError && !value.slot && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {t.errors.pickTime}
        </p>
      )}
    </div>
  );
}
