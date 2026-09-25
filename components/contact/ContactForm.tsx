'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { CircleAlert, Send } from 'lucide-react';
import { Button, ButtonLink, Spinner } from '@/components/ui/Button';
import { Honeypot, TextArea, TextField } from '@/components/ui/Field';
import { SuccessMark } from '@/components/ui/SuccessMark';
import { cn } from '@/lib/cn';
import { DEMO_HREF, SITE } from '@/lib/content';
import { contactSchema, TOPIC_OPTIONS, type ApiError, type ContactInput } from '@/lib/schema';

const MESSAGE_MAX = 4000;

export function ContactForm() {
  const [scope, animate] = useAnimate<HTMLFormElement>();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: { topic: 'project', name: '', email: '', company: '', phone: '', message: '', hp: '' },
  });
  const message = useWatch({ control, name: 'message' }) ?? '';

  const shake = () => {
    if (scope.current) animate(scope.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.4 });
  };

  const onSubmit = async (values: ContactInput) => {
    setServerError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setSentTo(values.name.split(' ')[0] ?? values.name);
        reset();
        return;
      }
      const body = (await res.json().catch(() => ({}))) as ApiError;
      if (res.status === 422 && body.fieldErrors) {
        for (const [field, messages] of Object.entries(body.fieldErrors)) {
          if (messages?.[0]) setError(field as keyof ContactInput, { message: messages[0] });
        }
        shake();
        return;
      }
      setServerError(body.error ?? 'Your message was not sent. Try again in a moment.');
      shake();
    } catch {
      setServerError('Your message was not sent because the connection dropped. Check your internet and try again.');
      shake();
    }
  };

  return (
    <div className="glass-raised relative overflow-hidden rounded-[2rem] p-6 sm:p-9">
      <div className="wire-line absolute inset-x-0 top-0" aria-hidden />
      <AnimatePresence mode="wait" initial={false}>
        {sentTo ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-[460px] flex-col items-center justify-center py-10 text-center"
            role="status"
          >
            <SuccessMark />
            <h2 className="mt-6 font-display text-2xl font-semibold text-white">Message sent</h2>
            <p className="mt-3 max-w-sm text-mist">
              Thanks, {sentTo}. We reply by email, usually within one business day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="secondary" onClick={() => setSentTo(null)}>
                Send another message
              </Button>
              <ButtonLink href={DEMO_HREF}>Book a demo</ButtonLink>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={scope}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => handleSubmit(onSubmit, shake)(e)}
            noValidate
            className="space-y-5"
          >
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-white">What is this about?</legend>
              <div className="flex flex-wrap gap-2">
                {TOPIC_OPTIONS.map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input type="radio" value={option.value} className="peer sr-only" {...register('topic')} />
                    <span
                      className={cn(
                        'inline-flex h-10 items-center rounded-full border border-white/10 px-4 text-sm text-mist transition-all duration-200',
                        'hover:border-white/25 hover:text-white active:scale-[0.97]',
                        'peer-checked:border-signal/60 peer-checked:bg-signal/10 peer-checked:text-white peer-checked:shadow-glow-signal',
                        'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal',
                      )}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Your name" autoComplete="name" error={errors.name?.message} {...register('name')} />
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                inputMode="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <TextField
                label="Company"
                optional
                autoComplete="organization"
                error={errors.company?.message}
                {...register('company')}
              />
              <TextField
                label="Phone"
                optional
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>

            <TextArea
              label="Message"
              maxLength={MESSAGE_MAX}
              count={message.length}
              error={errors.message?.message}
              hint="What do you want your agent to handle?"
              {...register('message')}
            />

            <Honeypot {...register('hp')} />

            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p role="alert" className="flex gap-2.5 rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-white">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />
                    <span>
                      {serverError} You can also email{' '}
                      <a className="underline underline-offset-2" href={`mailto:${SITE.email}`}>
                        {SITE.email}
                      </a>
                      .
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col-reverse items-start gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-haze">We only use your details to reply to this message.</p>
              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Spinner /> Sending
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden /> Send message
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
