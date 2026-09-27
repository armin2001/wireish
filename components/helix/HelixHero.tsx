'use client';

/*
 * Helix hero: the wireframe double helix (HelixCanvas) under a blueprint-style layout.
 *
 * Entrance, played once the first-visit splash is gone:
 *   0.00s  canvas fades in over 2s
 *   0.15s  headline letters rise out of a clipped mask, 0.05s apart
 *   0.60s  top bar, description and bottom bar rise in, 0.1s apart
 *
 * MotionConfig reducedMotion="user" drops the movement for reduced-motion users and keeps
 * the fades; HelixCanvas draws a still frame for them.
 */
import { motion, MotionConfig, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { TransitionLink } from '@/components/layout/PageTransition';
import { DEMO_HREF } from '@/lib/content';
import { useSplashDone } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n/client';
import HelixCanvas from './HelixCanvas';

/** The brand name: never translated. */
const BRAND_NAME = 'Wireish';
const LETTERS = BRAND_NAME.toUpperCase().split('');

const EASE = [0.22, 1, 0.36, 1] as const; // --ease-wire in globals.css
const LETTER_DELAY = 0.15;
const LETTER_STAGGER = 0.05;
/** When the headline has mostly landed and the rest of the UI starts. */
const UI_DELAY = 0.6;

const canvasFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 2, ease: 'easeInOut' } },
};

const letterRise: Variants = {
  hidden: { y: '110%' },
  show: (i: number) => ({
    y: '0%',
    // Critically damped (damping² = 4·stiffness): lands firmly, no bounce past the mask edge.
    transition: { type: 'spring', damping: 20, stiffness: 100, delay: LETTER_DELAY + i * LETTER_STAGGER },
  }),
};

const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay } }),
};

export default function HelixHero() {
  const { t } = useI18n();
  const h = t.helix;
  const ready = useSplashDone();

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        aria-labelledby="helix-title"
        initial="hidden"
        animate={ready ? 'show' : 'hidden'}
        className="relative isolate flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[radial-gradient(120%_90%_at_70%_45%,var(--color-deep)_0%,var(--color-night)_62%)] px-6 pb-8 pt-28 md:px-12 md:pb-12 md:pt-32"
      >
        {/* Blueprint grid, strongest around the helix. */}
        <div
          aria-hidden
          className="dot-grid pointer-events-none absolute inset-0 -z-20 opacity-70 [mask-image:radial-gradient(60%_70%_at_70%_50%,#000_0%,transparent_100%)] max-lg:[mask-image:radial-gradient(80%_60%_at_50%_45%,#000_0%,transparent_100%)]"
        />
        <motion.div variants={canvasFade} className="pointer-events-none absolute inset-0 -z-10">
          <HelixCanvas />
        </motion.div>
        {/* Readability: the copy side stays dark; on small screens the helix sits behind the text. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[5] bg-[linear-gradient(90deg,var(--color-night)_0%,rgb(5_7_22/0.6)_36%,transparent_60%)] max-lg:bg-[linear-gradient(180deg,rgb(5_7_22/0.15)_0%,rgb(5_7_22/0.55)_45%,rgb(5_7_22/0.9)_100%)]"
        />

        {/* Top bar */}
        <motion.div
          variants={rise}
          custom={UI_DELAY}
          className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3"
        >
          <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-mist">
            <span aria-hidden className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-signal shadow-glow-signal" />
            </span>
            {h.eyebrow}
          </p>
          <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-white backdrop-blur-md">
            {h.badge}
            <span aria-hidden className="mx-1.5 text-haze">
              /
            </span>
            {h.badgeValue}
          </p>
        </motion.div>

        {/* Headline and description */}
        <div className="mx-auto w-full max-w-6xl py-12">
          <h1
            id="helix-title"
            className="font-display text-[clamp(3.5rem,19vw,9rem)] font-semibold leading-[0.9] tracking-tighter text-white"
          >
            <span className="sr-only">{BRAND_NAME}</span>
            {/* The mask: letters start below its bottom edge. The padding keeps glyph edges out of the clip. */}
            <span aria-hidden className="flex w-fit overflow-hidden pb-[0.06em] pr-[0.06em]">
              {LETTERS.map((letter, i) => (
                <motion.span key={i} variants={letterRise} custom={i} className="inline-block">
                  {letter}
                </motion.span>
              ))}
            </span>
          </h1>
          <motion.p
            variants={rise}
            custom={UI_DELAY + 0.1}
            className="relative mt-7 max-w-md pl-5 text-lg leading-relaxed text-mist before:absolute before:inset-y-1.5 before:left-0 before:w-px before:bg-[image:var(--gradient-wire)]"
          >
            {h.body}
          </motion.p>
        </div>

        {/* Bottom bar */}
        <motion.div
          variants={rise}
          custom={UI_DELAY + 0.2}
          className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <ul aria-label={h.tagsLabel} className="flex flex-wrap gap-2">
            {h.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/12 bg-night/40 px-3 py-1 font-mono text-xs text-mist backdrop-blur-sm"
              >
                {tag}
              </li>
            ))}
          </ul>
          <TransitionLink
            href={DEMO_HREF}
            className="glow-wire group inline-flex h-13 shrink-0 select-none items-center justify-center gap-2 self-start whitespace-nowrap rounded-full bg-white pl-7 pr-6 text-base font-medium text-night transition-[transform,box-shadow] duration-300 ease-wire active:scale-95 md:self-auto"
          >
            {t.common.bookDemo}
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 ease-wire group-hover:translate-x-1" />
          </TransitionLink>
        </motion.div>
      </motion.section>
    </MotionConfig>
  );
}
