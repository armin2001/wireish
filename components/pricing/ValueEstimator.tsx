'use client';

import { useEffect, useId, useState } from 'react';
import { motion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n/client';
import { intlLocale } from '@/lib/i18n/config';
import { format } from '@/lib/i18n/format';

/*
 * Replaces the old calculator, whose "pipeline value" was chats × $12 with no stated basis.
 * Every assumption is now a visible input, and the output is only what those inputs imply.
 */

const CURRENCY = 'USD'; // Change to 'EUR' or 'BAM' if you quote in those.

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  hint?: string;
}

function Slider({ label, value, min, max, step, format, onChange, hint }: SliderProps) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-mist">
          {label}
        </label>
        <output htmlFor={id} className="font-display text-lg font-semibold tabular-nums text-white">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={format(value)}
        className={cn(
          'mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full',
          '[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-night [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-glow-signal [&::-webkit-slider-thumb]:transition-transform active:[&::-webkit-slider-thumb]:scale-125',
          '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-night [&::-moz-range-thumb]:bg-white',
        )}
        style={{
          background: `linear-gradient(90deg, #15C3FF, #4A50FC 50.53%, #5A41FD) 0 / ${pct}% 100% no-repeat, rgb(255 255 255 / 0.1)`,
        }}
      />
      {hint && <p className="mt-2 text-xs text-haze">{hint}</p>}
    </div>
  );
}

/** Counts smoothly to the new value, so every slider move gives visible feedback. */
function AnimatedNumber({ value, format }: { value: number; format: (v: number) => string }) {
  const spring = useSpring(value, { stiffness: 180, damping: 28 });
  const text: MotionValue<string> = useTransform(spring, (v) => format(v));
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  return <motion.span className="tabular-nums">{text}</motion.span>;
}


export function ValueEstimator() {
  const { t, locale } = useI18n();
  const e = t.pricing.estimator;
  const numberLocale = intlLocale(locale);
  const whole = (v: number) => Math.round(v).toLocaleString(numberLocale);
  const [fteBefore, fteAfter = ''] = e.fte.split('{n}');
  const [chats, setChats] = useState(3000);
  const [share, setShare] = useState(60);
  const [minutes, setMinutes] = useState(6);
  const [hourly, setHourly] = useState(15);
  const costId = useId();

  const hours = (chats * (share / 100) * minutes) / 60;
  const cost = hours * hourly;
  const fte = hours / 160;
  // Bosnian already writes the code ("12.345 USD"); asking for it keeps Chrome's fallback locale
  // (see intlLocale) identical to the server, which would otherwise print "US$" and break hydration.
  const money = (v: number) =>
    new Intl.NumberFormat(numberLocale, {
      style: 'currency',
      currency: CURRENCY,
      currencyDisplay: locale === 'bs' ? 'code' : 'symbol',
      maximumFractionDigits: 0,
    }).format(Math.round(v));

  return (
    <section aria-labelledby="estimator-title" className="glass-raised relative overflow-hidden rounded-4xl">
      <div className="wire-line absolute inset-x-0 top-0" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-25 blur-[110px]"
        style={{ backgroundImage: 'var(--gradient-pulse)' }}
      />
      <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <h2 id="estimator-title" className="font-display text-2xl font-semibold text-white">
            {e.title}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-mist">
            {e.body}
          </p>

          <div className="mt-8 space-y-7">
            <Slider
              label={e.chats}
              value={chats}
              min={500}
              max={20000}
              step={500}
              format={whole}
              onChange={setChats}
            />
            <Slider
              label={e.share}
              value={share}
              min={20}
              max={90}
              step={5}
              format={(v) => `${v}%`}
              onChange={setShare}
              hint={e.shareHint}
            />
            <Slider
              label={e.minutes}
              value={minutes}
              min={1}
              max={20}
              step={1}
              format={(v) => format(e.minutesValue, { n: v })}
              onChange={setMinutes}
            />
            <div className="flex items-center justify-between gap-4">
              <label htmlFor={costId} className="text-sm text-mist">
                {e.hourly}
              </label>
              <div className="flex h-11 items-center rounded-full border border-white/10 bg-white/3 px-4 transition-colors focus-within:border-signal/60 hover:border-white/20">
                <span className="text-sm text-haze">{CURRENCY}</span>
                <input
                  id={costId}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={500}
                  value={hourly}
                  onChange={(e) => setHourly(Math.min(500, Math.max(0, Number(e.target.value) || 0)))}
                  className="w-16 bg-transparent pl-2 text-right font-display font-semibold tabular-nums text-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-3xl border border-white/10 bg-night/50 p-7" aria-live="polite">
          <p className="text-sm text-haze">{e.hours}</p>
          <p className="mt-1 font-display text-5xl font-semibold tracking-[-0.03em] text-white">
            <AnimatedNumber value={hours} format={whole} />
            <span className="ml-2 text-lg font-normal text-mist">{e.hoursUnit}</span>
          </p>
          <p className="mt-2 text-sm text-mist">
            {fteBefore}
            <AnimatedNumber
              value={fte}
              format={(v) => v.toLocaleString(numberLocale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            />
            {fteAfter}
          </p>

          <div className="wire-line my-6 opacity-40" aria-hidden />

          <p className="text-sm text-haze">{e.cost}</p>
          <p className="mt-1 font-display text-4xl font-semibold tracking-[-0.03em] text-white">
            <AnimatedNumber value={cost} format={money} />
            <span className="ml-2 text-lg font-normal text-mist">{e.perMonth}</span>
          </p>

          <p className="mt-6 text-xs leading-relaxed text-haze">
            {e.note}
          </p>
        </div>
      </div>
    </section>
  );
}
