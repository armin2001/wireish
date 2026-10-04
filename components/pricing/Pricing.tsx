'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { TransitionLink } from '@/components/layout/PageTransition';
import { ButtonLink } from '@/components/ui/Button';
import { Glow } from '@/components/ui/Glow';
import { cn } from '@/lib/cn';
import { DEMO_HREF } from '@/lib/content';
import type { Dictionary } from '@/lib/i18n/dictionaries/en';
import { useI18n } from '@/lib/i18n/client';
import { REVEAL, STAGGER_GROUP, STAGGER_ITEM } from '@/lib/motion';

type PlansCopy = Dictionary['pricing']['plans'];
type TierId = keyof PlansCopy['tiers'];
type Billing = keyof PlansCopy['cadence'];

const TIERS: TierId[] = ['starter', 'growth', 'enterprise'];
const FEATURED: TierId = 'growth';
const BILLING_OPTIONS: Billing[] = ['monthly', 'yearly'];

interface PricingTierProps {
  tier: PlansCopy['tiers'][TierId];
  copy: PlansCopy;
  billing: Billing;
  featured?: boolean;
  /** h3 under the section's h2; h2 when the plans sit directly under a page h1. */
  headingLevel: 'h2' | 'h3';
}

interface PricingProps {
  /**
   * For /pricing: no section heading, padding or estimator link, because the page's own
   * header introduces the plans and the estimator follows right below.
   */
  embedded?: boolean;
}

/*
 * Plans are defined by scope (channels, volume, support), never by a price: every build is
 * quoted after a call. The billing toggle switches how that quote is framed.
 */
export default function Pricing({ embedded = false }: PricingProps) {
  const { t } = useI18n();
  const copy = t.pricing.plans;
  const [billing, setBilling] = useState<Billing>('monthly');

  return (
    <section
      id={embedded ? undefined : 'pricing'}
      aria-labelledby={embedded ? undefined : 'pricing-title'}
      aria-label={embedded ? copy.title : undefined}
      // overflow-x-clip: the glow spills past the screen edge, which would widen the page on phones.
      className={cn('relative', !embedded && 'scroll-mt-24 overflow-x-clip px-6 py-28')}
    >
      {!embedded && (
        <Glow
          className="left-1/2 top-1/2 -z-10 h-130 w-[min(900px,100%)] -translate-x-1/2 -translate-y-1/2"
          gradient="var(--gradient-wire)"
          blur={140}
          opacity={0.2}
        />
      )}

      <div className="mx-auto max-w-6xl">
        {!embedded && (
          <motion.div {...REVEAL} className="mx-auto max-w-2xl text-center">
            <h2 id="pricing-title" className="font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
              {copy.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-mist">{copy.body}</p>
          </motion.div>
        )}

        <BillingToggle value={billing} onChange={setBilling} copy={copy} className={embedded ? undefined : 'mt-10'} />

        <motion.ul
          variants={STAGGER_GROUP}
          initial="hidden"
          whileInView="show"
          viewport={REVEAL.viewport}
          className="mt-16 grid gap-8 lg:grid-cols-3 lg:items-stretch lg:gap-5"
        >
          {TIERS.map((id) => (
            <PricingTier
              key={id}
              tier={copy.tiers[id]}
              copy={copy}
              billing={billing}
              featured={id === FEATURED}
              headingLevel={embedded ? 'h2' : 'h3'}
            />
          ))}
        </motion.ul>

        {!embedded && (
          <p className="mt-14 text-center text-mist">
            {copy.compare}{' '}
            <TransitionLink
              href="/pricing#estimator"
              className="group inline-flex items-center gap-1.5 font-medium text-signal transition-colors hover:text-white"
            >
              {copy.compareLink}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </TransitionLink>
          </p>
        )}
      </div>
    </section>
  );
}

interface BillingToggleProps {
  value: Billing;
  onChange: (value: Billing) => void;
  copy: PlansCopy;
  className?: string;
}

/** Segmented control, built as a radio group: arrow keys move the selection, Tab leaves it. */
function BillingToggle({ value, onChange, copy, className }: BillingToggleProps) {
  const buttons = useRef<Partial<Record<Billing, HTMLButtonElement | null>>>({});

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = BILLING_OPTIONS.length - 1;
    const index = BILLING_OPTIONS.indexOf(value);
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? (index + 1) % BILLING_OPTIONS.length
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? (index - 1 + BILLING_OPTIONS.length) % BILLING_OPTIONS.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    const option = BILLING_OPTIONS[next];
    onChange(option);
    buttons.current[option]?.focus();
  };

  return (
    <div className={cn('flex justify-center', className)}>
      <div
        role="radiogroup"
        aria-label={copy.billing}
        className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md"
      >
        {BILLING_OPTIONS.map((option) => {
          const checked = option === value;
          return (
            <button
              key={option}
              ref={(element) => {
                buttons.current[option] = element;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onClick={() => onChange(option)}
              onKeyDown={onKeyDown}
              className={cn(
                'relative h-10 rounded-full px-6 text-sm font-medium transition-colors duration-200',
                checked ? 'text-night' : 'text-mist hover:text-white',
              )}
            >
              {checked && (
                <motion.span
                  layoutId="billing-pill"
                  className="glow-wire absolute inset-0 rounded-full bg-white"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{copy[option]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PricingTier({ tier, copy, billing, featured = false, headingLevel: Heading }: PricingTierProps) {
  return (
    <motion.li
      variants={STAGGER_ITEM}
      className={cn(
        'relative flex flex-col rounded-3xl p-7 sm:p-8',
        featured
          ? 'wire-border shadow-[0_0_70px_-14px_rgb(90_65_253/0.6)] lg:-my-6 lg:py-12'
          : 'glass transition-[border-color,box-shadow] duration-300 hover:border-charge/50 hover:shadow-[0_0_30px_-5px_rgb(90_65_253/0.3)]',
      )}
      style={
        featured
          ? {
              backgroundColor: 'var(--color-surface)',
              backgroundImage: 'radial-gradient(120% 55% at 50% 0%, rgb(90 65 253 / 0.24), transparent 70%)',
            }
          : undefined
      }
    >
      {featured && (
        <span
          className="absolute -top-3.5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1 text-xs font-semibold text-white shadow-glow"
          style={{ backgroundImage: 'var(--gradient-wire)' }}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {copy.popular}
        </span>
      )}

      <Heading className="font-display text-xl font-semibold text-white">{tier.name}</Heading>
      <p className="mt-2 text-[15px] leading-relaxed text-mist lg:min-h-12">{tier.tagline}</p>

      <div className="mt-7">
        <p className="font-display text-3xl font-semibold tracking-[-0.03em] text-white">{tier.volume}</p>
        <p className="mt-1 text-sm text-haze">{copy.volume}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
        <p className="text-sm font-semibold text-white">{copy.price}</p>
        <div className="relative h-5 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={billing}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="text-sm text-mist"
            >
              {copy.cadence[billing]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <ButtonLink href={DEMO_HREF} variant={featured ? 'primary' : 'secondary'} size="lg" className="mt-7 w-full">
        {copy.cta}
      </ButtonLink>

      <div className="mt-8 border-t border-white/8 pt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-haze">{copy.includes}</p>
        <ul className="mt-4 space-y-3">
          {tier.features.map((feature) => (
            <li key={feature} className="flex gap-3 text-[15px] leading-relaxed text-mist">
              <span
                className={cn(
                  'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full',
                  featured ? 'text-white' : 'bg-white/8 text-signal',
                )}
                style={featured ? { backgroundImage: 'var(--gradient-wire)' } : undefined}
              >
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </motion.li>
  );
}
