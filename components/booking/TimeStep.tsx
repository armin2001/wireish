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
  { id: 'morning', label: 'Morning', test: (h: number) => h < 12 },
  { id: 'afternoon', label: 'Afternoon', test: (h: number) => h >= 12 && h < 17 },
  { id: 'evening', label: 'Evening', test: (h: number) => h >= 17 },
] as const;

/**
 * Only ever rendered after the visitor interacts (step 2), so reading the clock and the
 * browser time zone during render can't cause a hydration mismatch.
 */
export function TimeStep({ value, onChange, showError }: TimeStepProps) {
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
    () => new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', timeZone }),
    [timeZone],
  );
  const dayFormat = useMemo(
    () => new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' }),
    [],
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
            {selectedDay ? dayFormat.format(new Date(`${selectedDay}T00:00:00Z`)) : 'Pick a day'}
          </p>
          <p className="mt-1 text-sm text-haze">{MEETING_MINUTES}-minute video call</p>

          <div className="mt-4 max-h-85 space-y-5 overflow-y-auto pr-1">
            {daySlots.length === 0 && (
              <p className="rounded-2xl border border-white/8 bg-field p-4 text-sm text-mist">
                No free times on this day. Pick a day with a dot under it.
              </p>
            )}
            {PERIODS.map((period) => {
              const periodSlots = daySlots.filter((slot) => period.test(getZonedParts(slot, timeZone).hour));
              if (!periodSlots.length) return null;
              return (
                <div key={period.id} role="radiogroup" aria-label={`${period.label} times`}>
                  <p className="mb-2 text-xs text-haze">{period.label}</p>
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
                              : 'border-white/8 bg-field text-mist hover:border-signal/50 hover:bg-field-hover hover:text-white',
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
        Times shown in
        <select
          value={timeZone}
          onChange={(e) => {
            setPickedDay(null);
            onChange({ slot: value.slot, timeZone: e.target.value });
          }}
          className="h-9 max-w-[16rem] rounded-full border border-white/8 bg-field px-3 text-sm text-white outline-none transition-colors hover:border-white/25 focus-visible:border-signal/60"
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
          Pick a time to continue.
        </p>
      )}
    </div>
  );
}
