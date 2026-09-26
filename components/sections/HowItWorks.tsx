'use client';

import { useRef, type ComponentType } from 'react';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { Bot, PhoneCall, Plug, TrendingUp } from 'lucide-react';
import { useI18n } from '@/lib/i18n/client';
import { format } from '@/lib/i18n/format';

interface Step {
  title: string;
  body: string;
}

const ICONS: ComponentType<{ className?: string }>[] = [PhoneCall, Bot, Plug, TrendingUp];

export default function HowItWorks() {
  const { t } = useI18n();
  const how = t.home.how;
  const track = useRef<HTMLOListElement>(null);
  // The wire fills as the list scrolls through the viewport; each step lights up as the wire reaches it.
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 75%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <section id="how-it-works" className="scroll-mt-24 px-6 py-28">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="self-start lg:sticky lg:top-32">
          <h2 className="font-display text-4xl font-semibold tracking-[-0.025em] text-white md:text-5xl">
            {how.title}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-mist">
            {how.body}
          </p>
        </div>

        <ol ref={track} className="relative">
          <div className="absolute bottom-6 left-[23px] top-6 w-px bg-white/10" aria-hidden>
            <motion.div
              className="h-full w-full origin-top shadow-glow-signal"
              style={{ scaleY: progress, backgroundImage: 'var(--gradient-wire)' }}
            />
          </div>
          {how.steps.map((step, i) => (
            <StepItem
              key={step.title}
              step={step}
              label={format(how.step, { n: i + 1 })}
              Icon={ICONS[i % ICONS.length]}
              index={i}
              total={how.steps.length}
              progress={progress}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

interface StepItemProps {
  step: Step;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function StepItem({ step, label, Icon, index, total, progress }: StepItemProps) {
  const at = total > 1 ? index / (total - 1) : 0;
  const lit = useTransform(progress, [at - 0.1, at], [0, 1]);

  return (
    <li className="relative pb-14 pl-20 last:pb-0">
      <span className="absolute left-0 top-0 grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-deep">
        <motion.span
          aria-hidden
          className="absolute inset-0"
          style={{ opacity: lit, backgroundImage: 'var(--gradient-wire)' }}
        />
        <Icon className="relative h-5 w-5 text-white" />
      </span>
      <p className="pt-0.5 text-sm tabular-nums text-haze">{label}</p>
      <h3 className="mt-1 font-display text-2xl font-semibold text-white">{step.title}</h3>
      <p className="mt-3 max-w-lg leading-relaxed text-mist">{step.body}</p>
    </li>
  );
}
