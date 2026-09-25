'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { ArrowLeft, Check, CircleAlert } from 'lucide-react';
import { Button, Spinner } from '@/components/ui/Button';
import { TransitionLink } from '@/components/layout/PageTransition';
import { useToast } from '@/components/ui/Toaster';
import { Confirmation } from '@/components/booking/Confirmation';
import { DetailsStep, NeedsStep, ReviewStep, type NeedsDraft } from '@/components/booking/steps';
import { TimeStep, type TimeDraft } from '@/components/booking/TimeStep';
import { useBlueprint } from '@/lib/canvas/blueprint-store';
import { summarizeDoc } from '@/lib/canvas/model';
import { cn } from '@/lib/cn';
import { SITE } from '@/lib/content';
import { bookingDetailsSchema, type ApiError, type BookingDetails, type BookingInput } from '@/lib/schema';

const STEPS = [
  { title: 'Your setup', heading: 'Tell us what the agent should cover' },
  { title: 'Time', heading: 'Pick a time' },
  { title: 'Details', heading: 'Where should we send the invite?' },
  { title: 'Confirm', heading: 'Check and confirm' },
] as const;

const EMPTY_DETAILS: BookingDetails = { name: '', email: '', company: '', phone: '', notes: '', hp: '' };

export function BookingFlow() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [needs, setNeeds] = useState<NeedsDraft>({ channels: [], volume: null, goal: null, attachMap: true });
  const [time, setTime] = useState<TimeDraft>({ slot: null, timeZone: null });
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<'editing' | 'submitting' | 'done'>('editing');
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const heading = useRef<HTMLHeadingElement>(null);
  const stepChanged = useRef(false);
  const toast = useToast();
  const blueprint = useBlueprint();

  const form = useForm<BookingDetails>({
    resolver: zodResolver(bookingDetailsSchema),
    mode: 'onTouched',
    defaultValues: EMPTY_DETAILS,
  });
  const notes = useWatch({ control: form.control, name: 'notes' }) ?? '';

  // Move focus to the new step's heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (!stepChanged.current) return;
    stepChanged.current = false;
    heading.current?.focus({ preventScroll: true });
  }, [step]);

  const mapLines = needs.attachMap && blueprint?.nodes.length ? summarizeDoc(blueprint) : null;

  const goTo = (next: number) => {
    stepChanged.current = true;
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setShowErrors(false);
    setServerError(null);
  };

  const shake = () => {
    if (scope.current) animate(scope.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.4 });
  };

  const stepIsValid = (i: number) =>
    i === 0 ? needs.channels.length > 0 && Boolean(needs.volume) && Boolean(needs.goal) : i === 1 ? Boolean(time.slot) : true;

  const submit = async () => {
    if (!time.slot || !needs.volume || !needs.goal) return;
    setStatus('submitting');
    setServerError(null);
    const payload: BookingInput = {
      ...form.getValues(),
      channels: needs.channels,
      volume: needs.volume,
      goal: needs.goal,
      slotStart: time.slot,
      timeZone: time.timeZone ?? 'UTC',
      blueprint: mapLines ? mapLines.join('\n').slice(0, 2000) : undefined,
    };
    try {
      const res = await fetch('/api/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as ApiError & { confirmationSent?: boolean };
      if (res.ok) {
        setConfirmationSent(Boolean(body.confirmationSent));
        setStatus('done');
        return;
      }
      setStatus('editing');
      if (res.status === 409) {
        setTime((t) => ({ ...t, slot: null }));
        goTo(1);
        toast({ tone: 'error', title: 'That time is no longer available', description: 'Pick another slot to continue.' });
        return;
      }
      setServerError(body.error ?? 'The booking did not go through. Try again in a moment.');
      shake();
    } catch {
      setStatus('editing');
      setServerError('The booking did not go through because the connection dropped. Check your internet and try again.');
      shake();
    }
  };

  const next = async () => {
    if (step < 2) {
      if (!stepIsValid(step)) {
        setShowErrors(true);
        shake();
        return;
      }
      goTo(step + 1);
    } else if (step === 2) {
      if (await form.trigger(undefined, { shouldFocus: true })) goTo(3);
      else shake();
    } else {
      await submit();
    }
  };

  const reset = () => {
    form.reset(EMPTY_DETAILS);
    setTime({ slot: null, timeZone: time.timeZone });
    setStatus('editing');
    setStep(1);
  };

  const primaryLabel = ['Continue', 'Continue', 'Review booking', 'Confirm booking'][step];

  return (
    <div className="panel relative overflow-hidden rounded-4xl">
      <div className="wire-line absolute inset-x-0 top-0" aria-hidden />

      <AnimatePresence mode="wait" initial={false}>
        {status === 'done' && time.slot ? (
          <motion.div key="done" className="p-6 sm:p-10">
            <Confirmation
              slot={time.slot}
              timeZone={time.timeZone ?? 'UTC'}
              email={form.getValues('email')}
              confirmationSent={confirmationSent}
              onBookAnother={reset}
            />
          </motion.div>
        ) : (
          <motion.div key="flow" exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
            <StepIndicator current={step} onSelect={(i) => i < step && goTo(i)} />

            <div ref={scope} className="px-6 pb-6 pt-2 sm:px-10">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.section
                  key={step}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ x: d * 32, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d: number) => ({ x: d * -32, opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  aria-labelledby="booking-step-heading"
                >
                  <h2
                    id="booking-step-heading"
                    ref={heading}
                    tabIndex={-1}
                    className="mb-7 font-display text-2xl font-semibold tracking-[-0.02em] text-white outline-none"
                  >
                    {STEPS[step].heading}
                  </h2>

                  {step === 0 && (
                    <NeedsStep
                      value={needs}
                      onChange={(patch) => setNeeds((n) => ({ ...n, ...patch }))}
                      showErrors={showErrors}
                      blueprint={blueprint}
                    />
                  )}
                  {step === 1 && <TimeStep value={time} onChange={setTime} showError={showErrors} />}
                  {step === 2 && (
                    <DetailsStep register={form.register} errors={form.formState.errors} notesLength={notes.length} />
                  )}
                  {step === 3 && time.slot && (
                    <ReviewStep
                      needs={needs}
                      slot={time.slot}
                      timeZone={time.timeZone ?? 'UTC'}
                      details={form.getValues()}
                      mapLines={mapLines}
                      onEdit={goTo}
                    />
                  )}
                </motion.section>
              </AnimatePresence>

              <AnimatePresence>
                {serverError && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 flex gap-2.5 rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-white"
                  >
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />
                    <span>
                      {serverError} You can also email{' '}
                      <a className="underline underline-offset-2" href={`mailto:${SITE.email}`}>
                        {SITE.email}
                      </a>
                      .
                    </span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] bg-night/50 px-6 py-5 sm:px-10">
              <Button
                variant="ghost"
                onClick={() => goTo(step - 1)}
                className={cn(step === 0 && 'invisible')}
                aria-hidden={step === 0}
                tabIndex={step === 0 ? -1 : 0}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </Button>
              <div className="flex items-center gap-4">
                {step === 3 && (
                  <p className="hidden text-xs text-haze sm:block">
                    By confirming you agree to our{' '}
                    <TransitionLink href="/privacy" className="underline underline-offset-2 hover:text-white">
                      privacy policy
                    </TransitionLink>
                    .
                  </p>
                )}
                <Button size="lg" onClick={next} disabled={status === 'submitting'}>
                  {status === 'submitting' ? (
                    <>
                      <Spinner /> Booking
                    </>
                  ) : (
                    primaryLabel
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepIndicator({ current, onSelect }: { current: number; onSelect: (step: number) => void }) {
  const progress = current / (STEPS.length - 1);
  return (
    <nav aria-label="Booking progress" className="px-6 pb-6 pt-7 sm:px-10">
      <div className="relative">
      <div className="absolute left-4 right-4 top-4 h-px bg-white/10" aria-hidden>
        <motion.div
          className="h-full origin-left shadow-glow-signal"
          style={{ backgroundImage: 'var(--gradient-wire)' }}
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
      </div>
      <ol className="relative flex justify-between">
        {STEPS.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={s.title} className="relative flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => onSelect(i)}
                disabled={!done}
                aria-current={active ? 'step' : undefined}
                aria-label={`Step ${i + 1}: ${s.title}${done ? ', completed' : ''}`}
                className={cn(
                  'relative grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold tabular-nums transition-all duration-300',
                  active && 'border-transparent text-white shadow-glow-signal',
                  done && 'border-signal/50 bg-surface text-signal hover:scale-110',
                  !active && !done && 'border-white/15 bg-surface text-haze',
                )}
                style={active ? { backgroundImage: 'var(--gradient-wire)' } : undefined}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : i + 1}
              </button>
              <span className={cn('text-xs', active ? 'text-white' : 'text-haze')}>{s.title}</span>
            </li>
          );
        })}
      </ol>
      </div>
    </nav>
  );
}
