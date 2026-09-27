'use client';

import { useId, type ComponentType, type PointerEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Bot,
  BrainCircuit,
  ChartColumnIncreasing,
  FileText,
  Globe,
  Headset,
  Lock,
  Mail,
  MessageCircle,
  MessagesSquare,
  Moon,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { FaFacebookMessenger, FaInstagram, FaSlack, FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/lib/cn';
import type { Dictionary } from '@/lib/i18n/dictionaries/en';
import { useI18n } from '@/lib/i18n/client';
import { EASE_WIRE, REVEAL, STAGGER_GROUP, STAGGER_ITEM } from '@/lib/motion';

type FeatureCopy = Dictionary['home']['features'];
type IconComponent = ComponentType<{ className?: string }>;

interface FeatureCardProps {
  title: string;
  body: string;
  Icon: IconComponent;
  /** One of the logo gradients from globals.css, e.g. 'var(--gradient-wire)'. */
  gradient: string;
  /** Decorative illustration above the text; hidden from screen readers. */
  visual: ReactNode;
  className?: string;
}

export default function BentoFeatures() {
  const { t } = useI18n();
  const copy = t.home.features;

  return (
    <section id="features" className="relative isolate scroll-mt-24 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div {...REVEAL} className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">{copy.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-mist">{copy.body}</p>
        </motion.div>

        {/*
          Bento layout on large screens, 4 columns × 2 rows:
            [ training ········ ][ always ][ handoff ]
            [ channels ][ security ][ analytics ······ ]
        */}
        <motion.ul
          variants={STAGGER_GROUP}
          initial="hidden"
          whileInView="show"
          viewport={REVEAL.viewport}
          className="mt-14 grid gap-4 md:grid-cols-2 lg:auto-rows-[minmax(23rem,auto)] lg:grid-cols-4"
        >
          <FeatureCard
            className="md:col-span-2"
            title={copy.training.title}
            body={copy.training.body}
            Icon={BrainCircuit}
            gradient="var(--gradient-wire)"
            visual={<TrainingVisual copy={copy.training} />}
          />
          <FeatureCard
            title={copy.always.title}
            body={copy.always.body}
            Icon={Moon}
            gradient="var(--gradient-pulse)"
            visual={<AlwaysOnVisual copy={copy.always} />}
          />
          <FeatureCard
            title={copy.handoff.title}
            body={copy.handoff.body}
            Icon={Headset}
            gradient="var(--gradient-current)"
            visual={<HandoffVisual copy={copy.handoff} />}
          />
          <FeatureCard
            title={copy.channels.title}
            body={copy.channels.body}
            Icon={MessagesSquare}
            gradient="var(--gradient-link)"
            visual={<ChannelsVisual />}
          />
          <FeatureCard
            title={copy.security.title}
            body={copy.security.body}
            Icon={ShieldCheck}
            gradient="var(--gradient-pulse)"
            visual={<SecurityVisual copy={copy.security} />}
          />
          <FeatureCard
            className="md:col-span-2"
            title={copy.analytics.title}
            body={copy.analytics.body}
            Icon={ChartColumnIncreasing}
            gradient="var(--gradient-wire)"
            visual={<AnalyticsVisual copy={copy.analytics} />}
          />
        </motion.ul>
      </div>
    </section>
  );
}

function FeatureCard({ title, body, Icon, gradient, visual, className }: FeatureCardProps) {
  // Feeds the spotlight: a soft glow that follows the pointer. CSS variables, so no re-render.
  const onPointerMove = (event: PointerEvent<HTMLLIElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <motion.li
      variants={STAGGER_ITEM}
      onPointerMove={onPointerMove}
      className={cn(
        'glass group relative flex flex-col overflow-hidden rounded-3xl p-6 sm:p-7',
        'transition-[border-color,box-shadow] duration-300 hover:border-charge/50 hover:shadow-[0_0_30px_-5px_rgb(90_65_253/0.3)]',
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(380px circle at var(--spot-x, 50%) var(--spot-y, 0%), rgb(90 65 253 / 0.14), transparent 45%)',
        }}
      />
      <div aria-hidden className="relative min-h-44 flex-1">
        {visual}
      </div>
      <div className="relative mt-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundImage: gradient }}>
            <Icon className="h-4.5 w-4.5" />
          </span>
          <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-mist">{body}</p>
      </div>
    </motion.li>
  );
}

/* ─── Visuals ──────────────────────────────────────────────────────────────── */

const SOURCE_ICONS: IconComponent[] = [Globe, ShoppingBag, FileText, MessageCircle];

/** Four knowledge sources wired into one agent. */
function TrainingVisual({ copy }: { copy: FeatureCopy['training'] }) {
  const gradientId = useId();
  const rows = copy.sources.length;
  return (
    <div className="flex h-full items-center gap-2 sm:gap-4">
      <ul className="grid shrink-0 grid-rows-4 gap-2">
        {copy.sources.map((source, i) => {
          const Icon = SOURCE_ICONS[i % SOURCE_ICONS.length];
          return (
            <li
              key={source}
              className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-[13px] text-mist transition-colors duration-300 group-hover:text-white"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-signal" />
              {source}
            </li>
          );
        })}
      </ul>

      {/* One curve per source row, converging on the agent. */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-44 min-w-8 flex-1">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#15C3FF" stopOpacity="0.5" />
            <stop offset="1" stopColor="#5A41FD" />
          </linearGradient>
        </defs>
        {copy.sources.map((source, i) => {
          const y = ((i + 0.5) / rows) * 100;
          const d = `M0 ${y} C 55 ${y}, 45 50, 100 50`;
          return (
            <g key={source}>
              <path d={d} fill="none" stroke={`url(#${gradientId})`} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
              <path
                d={d}
                fill="none"
                stroke="white"
                strokeOpacity={0.7}
                strokeWidth={1.5}
                strokeDasharray="2 14"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="animate-wire-flow"
              />
            </g>
          );
        })}
      </svg>

      <div className="flex shrink-0 flex-col items-center gap-2.5">
        <span className="relative grid h-18 w-18 place-items-center rounded-3xl text-white shadow-glow" style={{ backgroundImage: 'var(--gradient-pulse)' }}>
          <span className="absolute inset-0 animate-ping rounded-3xl border border-spark/40 [animation-duration:2.4s]" />
          <Bot className="h-8 w-8" />
        </span>
        <span className="text-xs font-medium text-white">{copy.agent}</span>
      </div>
    </div>
  );
}

const STARS = [
  { top: '8%', left: '14%', delay: 0 },
  { top: '22%', left: '80%', delay: 0.8 },
  { top: '70%', left: '8%', delay: 1.6 },
  { top: '12%', left: '52%', delay: 2.1 },
  { top: '62%', left: '88%', delay: 1.1 },
];

/** A lead captured in the middle of the night. */
function AlwaysOnVisual({ copy }: { copy: FeatureCopy['always'] }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      {STARS.map((star) => (
        <motion.span
          key={`${star.top}-${star.left}`}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{ top: star.top, left: star.left }}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: star.delay }}
        />
      ))}
      <p className="font-display text-6xl font-semibold tabular-nums tracking-[-0.04em] text-white">{copy.time}</p>
      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1.5 text-xs font-medium text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-glow-signal" />
        {copy.event}
      </p>
    </div>
  );
}

/** The agent steps aside and your team gets the alert. */
function HandoffVisual({ copy }: { copy: FeatureCopy['handoff'] }) {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="flex items-end gap-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-white" style={{ backgroundImage: 'var(--gradient-pulse)' }}>
          <Bot className="h-3 w-3" />
        </span>
        <p className="rounded-2xl rounded-bl-md border border-white/6 bg-white/6 px-3 py-2 text-xs leading-relaxed text-white/90">
          {copy.bubble}
        </p>
      </div>
      <div className="glass-overlay ml-auto flex items-center gap-2.5 rounded-2xl py-2.5 pl-2.5 pr-3 transition-transform duration-500 ease-wire group-hover:-translate-y-1">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white" style={{ backgroundImage: 'var(--gradient-current)' }}>
          <Bell className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-semibold text-white">{copy.alert}</span>
          <span className="block text-[11px] text-mist">{copy.alertDetail}</span>
        </span>
        <span className="ml-1 flex shrink-0 gap-1 text-mist">
          <FaSlack className="h-3.5 w-3.5" />
          <Mail className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

const CHANNEL_SPOKES: Array<{ Icon: IconComponent; x: number; y: number; position: string }> = [
  { Icon: Globe, x: 50, y: 12, position: 'left-1/2 top-0 -translate-x-1/2' },
  { Icon: FaInstagram, x: 88, y: 50, position: 'right-0 top-1/2 -translate-y-1/2' },
  { Icon: FaWhatsapp, x: 50, y: 88, position: 'bottom-0 left-1/2 -translate-x-1/2' },
  { Icon: FaFacebookMessenger, x: 12, y: 50, position: 'left-0 top-1/2 -translate-y-1/2' },
];

/** Every channel on the rim, one agent (and one memory) in the middle. */
function ChannelsVisual() {
  const gradientId = useId();
  return (
    <div className="relative mx-auto aspect-square h-full max-h-48 min-h-44">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id={gradientId}>
            <stop offset="0" stopColor="#5A41FD" />
            <stop offset="1" stopColor="#15C3FF" stopOpacity="0.4" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeOpacity="0.06" />
        {CHANNEL_SPOKES.map(({ x, y }) => (
          <g key={`${x}-${y}`}>
            <line x1="50" y1="50" x2={x} y2={y} stroke={`url(#${gradientId})`} strokeWidth="1" />
            <line
              x1={x}
              y1={y}
              x2="50"
              y2="50"
              stroke="white"
              strokeOpacity="0.7"
              strokeWidth="1"
              strokeDasharray="1.5 10"
              strokeLinecap="round"
              className="animate-wire-flow"
            />
          </g>
        ))}
      </svg>
      <span
        className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl text-white shadow-glow transition-transform duration-500 ease-wire group-hover:scale-110"
        style={{ backgroundImage: 'var(--gradient-wire)' }}
      >
        <Bot className="h-6 w-6" />
      </span>
      {CHANNEL_SPOKES.map(({ Icon, position }, i) => (
        <span
          key={position}
          className={cn(
            'absolute grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-deep text-mist transition-colors duration-300 group-hover:border-white/20 group-hover:text-white',
            position,
          )}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <Icon className="h-4 w-4" />
        </span>
      ))}
    </div>
  );
}

/** A shield inside slowly pulsing rings. */
function SecurityVisual({ copy }: { copy: FeatureCopy['security'] }) {
  return (
    <div className="relative flex h-full items-center justify-center">
      {[176, 128, 84].map((size, i) => (
        <motion.span
          key={size}
          className="absolute rounded-full border border-white/8"
          style={{ width: size, height: size }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}
      <span className="relative grid h-16 w-16 place-items-center rounded-2xl text-white shadow-glow" style={{ backgroundImage: 'var(--gradient-link)' }}>
        <ShieldCheck className="h-7 w-7" />
      </span>
      <span className="absolute left-0 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-deep px-2.5 py-1 text-[11px] font-medium text-mist">
        <Lock className="h-3 w-3 text-signal" />
        {copy.transit}
      </span>
      <span className="absolute bottom-3 right-0 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-deep px-2.5 py-1 text-[11px] font-medium text-mist">
        <Lock className="h-3 w-3 text-signal" />
        {copy.rest}
      </span>
    </div>
  );
}

/*
 * Illustrative numbers only (the card says so): two weeks of conversations per day,
 * split into what the agent resolved and what it handed to the team.
 */
const DAYS = [
  [42, 29],
  [55, 40],
  [48, 35],
  [61, 46],
  [58, 45],
  [70, 55],
  [66, 53],
  [74, 60],
  [69, 57],
  [83, 69],
  [78, 66],
  [88, 75],
  [85, 73],
  [96, 84],
] as const;
const PEAK = 100;

/** Stacked columns: resolved by the agent (gradient) under handed to the team (faint). */
function AnalyticsVisual({ copy }: { copy: FeatureCopy['analytics'] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-mist">
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
          <li className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundImage: 'var(--gradient-wire)' }} />
            {copy.resolved}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-white/15" />
            {copy.team}
          </li>
        </ul>
        <span className="text-haze">{copy.example}</span>
      </div>

      {/* Marks: ≤24px wide, 4px rounded top on the stack, square at the baseline, 2px gap between segments. */}
      <div className="mt-5 flex min-h-32 flex-1 items-end justify-between gap-1.5 border-b border-white/10">
        {DAYS.map(([total, resolved], i) => (
          <motion.div
            key={i}
            className="flex h-full w-full max-w-6 origin-bottom flex-col justify-end gap-0.5"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_WIRE, delay: 0.25 + i * 0.035 }}
          >
            <span
              className="block rounded-t-[4px] bg-white/15 transition-colors duration-300 group-hover:bg-white/20"
              style={{ height: `${((total - resolved) / PEAK) * 100}%` }}
            />
            <span
              className="block"
              style={{ height: `${(resolved / PEAK) * 100}%`, backgroundImage: 'var(--gradient-wire)' }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
