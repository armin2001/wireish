'use client';

import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface Benefit {
  title: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
}

const BENEFITS: Benefit[] = [
  {
    title: 'Available around the clock',
    description: 'Your agent answers questions, qualifies leads and books appointments at any hour, so no inquiry waits for Monday.',
    Icon: Clock,
  },
  {
    title: 'Answers in seconds',
    description: 'Customers get precise answers right away on every channel instead of waiting in a queue.',
    Icon: Zap,
  },
  {
    title: 'Lower support costs',
    description: 'Repetitive questions are handled for you, so your team can focus on complex cases and closing deals.',
    Icon: DollarSign,
  },
  {
    title: 'Sounds like your brand',
    description: 'Trained on your tone of voice, product catalog and guidelines, so replies read like your team wrote them.',
    Icon: Sparkles,
  },
  {
    title: 'Handles peak traffic',
    description: 'Hundreds of conversations at once during launches or sales, without adding support staff.',
    Icon: TrendingUp,
  },
  {
    title: 'Enterprise-grade security',
    description: "Your data and your customers' conversations are protected with industry-leading security and privacy protocols.",
    Icon: ShieldCheck,
  },
];

// Cycle through the four logo gradients so the grid carries the whole mark.
const GRADIENTS = ['var(--gradient-wire)', 'var(--gradient-pulse)', 'var(--gradient-current)', 'var(--gradient-link)'];

export default function Benefits() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Why businesses choose Wireish
          </h2>
          <p className="mt-5 text-lg text-mist">
            Automation that answers faster, costs less than hiring for every peak, and still sounds like you.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(({ title, description, Icon }, i) => (
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
              <p className="mt-2.5 text-[15px] leading-relaxed text-mist">{description}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
