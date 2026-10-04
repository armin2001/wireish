'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, CalendarCheck, CheckCheck, Sparkles, UserPlus } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Glow } from '@/components/ui/Glow';
import { TypingIndicator } from '@/components/ui/TypingIndicator';
import { cn } from '@/lib/cn';
import { usePrefersReducedMotion, useSplashDone } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n/client';
import { EASE_WIRE } from '@/lib/motion';

/*
 * The scripted conversation, in milliseconds after the splash lifts:
 * typing dots → agent reply → customer confirms → booking chip → CRM chip.
 */
const SCRIPT_MS = [700, 2200, 3400, 4200, 4900];
const FINAL_STEP = SCRIPT_MS.length;

const bubbleIn = {
  initial: { opacity: 0, y: 10, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
  transition: { duration: 0.35, ease: EASE_WIRE },
} as const;

/** Floating inbox mockup: a Wireish agent books an appointment at 21:47, while the team is off. */
export function HeroVisual() {
  const { t } = useI18n();
  const m = t.home.hero.mockup;
  const splashDone = useSplashDone();
  const reduceMotion = usePrefersReducedMotion();
  const [played, setPlayed] = useState(0);
  // Reduced motion shows the finished conversation instead of playing it out.
  const step = reduceMotion ? FINAL_STEP : played;

  useEffect(() => {
    if (!splashDone || reduceMotion) return;
    const timers = SCRIPT_MS.map((ms, i) => window.setTimeout(() => setPlayed(i + 1), ms));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [splashDone, reduceMotion]);

  return (
    <div role="img" aria-label={m.label} className="relative mx-auto w-full max-w-[440px] animate-rise [animation-delay:320ms] lg:mr-0">
      <Glow className="inset-6 -z-10" shape="rect" gradient="var(--gradient-spectrum)" blur={70} opacity={0.45} />

      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="glass-raised overflow-hidden rounded-[1.75rem]"
      >
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-white/6 px-5 py-3.5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <p className="text-xs font-medium text-haze">{m.title}</p>
          <p className="flex items-center gap-1.5 text-xs text-mist">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            {m.online}
          </p>
        </div>

        {/* Conversation header */}
        <div className="flex items-center justify-between px-5 pt-4">
          <p className="flex items-center gap-2 text-xs text-haze">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-white/6 text-mist">
              <FaWhatsapp className="h-3.5 w-3.5" />
            </span>
            {m.channel} · <span className="tabular-nums">{m.time}</span>
          </p>
          <p className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-2.5 py-1 text-[11px] font-medium text-white">
            <Bot className="h-3 w-3 text-signal" />
            {m.agent}
          </p>
        </div>

        {/* Thread: fixed height, newest at the bottom, so the window never jumps */}
        <div className="flex h-[252px] flex-col justify-end gap-2.5 px-5 pb-4 pt-3">
          <Bubble side="customer">{m.customer}</Bubble>
          <AnimatePresence mode="popLayout" initial={false}>
            {step === 1 && (
              <motion.div key="typing" {...bubbleIn} className="self-end rounded-2xl rounded-br-md bg-white/8 px-4 py-2.5">
                <TypingIndicator />
              </motion.div>
            )}
            {step >= 2 && (
              <motion.div key="reply" layout {...bubbleIn} className="self-end">
                <Bubble side="agent">{m.reply}</Bubble>
              </motion.div>
            )}
            {step >= 3 && (
              <motion.div key="confirm" layout {...bubbleIn}>
                <Bubble side="customer">{m.customer2}</Bubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Composer: the agent is in charge */}
        <div className="mx-4 mb-4 flex items-center gap-2.5 rounded-2xl border border-white/7 bg-white/3 px-4 py-3 text-xs text-haze">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-signal" />
          {m.autopilot}
        </div>
      </motion.div>

      {/* Satellites: what happened behind the scenes */}
      <Satellite show={step >= 4} float={7} className="-left-3 -top-8 sm:-left-10">
        <SatelliteBody icon={<CalendarCheck className="h-4 w-4" />} gradient="var(--gradient-wire)" title={m.booked} detail={m.bookedDetail} />
      </Satellite>
      <Satellite show={step >= 5} float={5.5} className="-bottom-12 right-2 sm:-bottom-5 sm:-right-8">
        <SatelliteBody icon={<UserPlus className="h-4 w-4" />} gradient="var(--gradient-pulse)" title={m.lead} detail={m.leadDetail} />
      </Satellite>
    </div>
  );
}

function Bubble({ side, children }: { side: 'customer' | 'agent'; children: ReactNode }) {
  if (side === 'customer') {
    return (
      <p className="max-w-[82%] rounded-2xl rounded-bl-md border border-white/6 bg-white/6 px-4 py-2.5 text-[13px] leading-relaxed text-white/90">
        {children}
      </p>
    );
  }
  return (
    <p
      className="ml-auto max-w-[86%] rounded-2xl rounded-br-md px-4 py-2.5 text-[13px] leading-relaxed text-white shadow-glow"
      style={{ backgroundImage: 'var(--gradient-wire)' }}
    >
      {children}
      <CheckCheck className="ml-1.5 inline h-3.5 w-3.5 align-[-2px] text-white/70" aria-hidden />
    </p>
  );
}

interface SatelliteProps {
  show: boolean;
  /** Seconds per float cycle; different values keep the satellites out of step. */
  float: number;
  className?: string;
  children: ReactNode;
}

function Satellite({ show, float, className, children }: SatelliteProps) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: float, repeat: Infinity, ease: 'easeInOut' }}
      className={cn('absolute z-10', className)}
    >
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SatelliteBody({ icon, gradient, title, detail }: { icon: ReactNode; gradient: string; title: string; detail: string }) {
  return (
    <div className="glass-overlay flex items-center gap-3 rounded-2xl py-2.5 pl-2.5 pr-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundImage: gradient }}>
        {icon}
      </span>
      <span>
        <span className="block text-[13px] font-semibold text-white">{title}</span>
        <span className="block text-xs text-mist">{detail}</span>
      </span>
    </div>
  );
}
