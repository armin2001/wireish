'use client';

import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useI18n } from '@/lib/i18n/client';

/** Icons in the same order as t.home.benefits.items. */
const ICONS: ComponentType<{ className?: string }>[] = [Clock, Zap, DollarSign, Sparkles, TrendingUp, ShieldCheck];

// Cycle through the four logo gradients so the grid carries the whole mark.
const GRADIENTS = ['var(--gradient-wire)', 'var(--gradient-pulse)', 'var(--gradient-current)', 'var(--gradient-link)'];

export default function Benefits() {
  const { t } = useI18n();
  const copy = t.home.benefits;
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-[-0.025em] text-white md:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-5 text-lg text-mist">
            {copy.body}
          </p>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {copy.items.map(({ title, body }, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass wire-border group rounded-3xl p-7 transition-[border-color,box-shadow] duration-300 [--wire-opacity:0] [--wire-play:paused] hover:border-white/15 hover:shadow-glow hover:[--wire-opacity:1] hover:[--wire-play:running]"
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-xl text-white transition-transform duration-300 ease-wire group-hover:-translate-y-0.5"
                style={{ backgroundImage: GRADIENTS[i % GRADIENTS.length] }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-6 font-display text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-mist">{body}</p>
            </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
