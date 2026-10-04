'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check } from 'lucide-react';
import { VoiceflowChat } from '@/components/home/VoiceflowChat';
import { Glow } from '@/components/ui/Glow';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n/client';
import { REVEAL } from '@/lib/motion';

/** The live demo: the real Wireish agent, embedded next to what it does. */
export default function InteractiveChatDemo() {
  const { t } = useI18n();
  const copy = t.home.demo;
  const section = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  // 0 as the section's top enters the viewport, 1 as its bottom leaves it.
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] });
  const lightY = useTransform(scrollYProgress, [0, 1], [-140, 140]);
  const chatY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    // `isolate` keeps this section's light in its own layer, painted over the hero's bottom fade
    // instead of sliding underneath it (which showed as a hard horizontal edge).
    // overflow-x-clip: the glows spill past the screen edge, and without it mobile browsers widen
    // (and zoom out) the whole page to fit them. Only x, so the light still bleeds up and down.
    <section ref={section} id="demo" className="relative isolate scroll-mt-24 overflow-x-clip px-6 py-28">
      {/*
        Ambient light, far layer: reaches 16rem into the hero and 10rem into the next section,
        feathered by the mask so no edge ever shows, and drifts slower than the page.
      */}
      <motion.div
        aria-hidden
        style={reduceMotion ? { y: 0 } : { y: lightY }}
        className="pointer-events-none absolute inset-x-0 -top-64 -bottom-40 -z-10 mask-[linear-gradient(to_bottom,transparent,#000_35%,#000_65%,transparent)]"
      >
        <Glow className="right-[6%] top-1/2 h-152 w-152 -translate-y-1/2" gradient="var(--gradient-pulse)" blur={130} opacity={0.35} />
        <Glow className="left-[10%] top-[42%] h-104 w-104 -translate-y-1/2" gradient="var(--gradient-wire)" blur={130} opacity={0.2} />
      </motion.div>

      <motion.div
        {...REVEAL}
        className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
      >
        <div className="max-w-md">
          <h2 className="font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">{copy.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-mist">{copy.body}</p>
          <ul className="mt-9 space-y-4">
            {copy.points.map((point) => (
              <li key={point} className="flex gap-3.5 leading-relaxed text-mist">
                <span
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white"
                  style={{ backgroundImage: 'var(--gradient-wire)' }}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Near layer: the chat drifts a little faster than the page, ahead of the copy. */}
        <motion.div className="relative" style={reduceMotion ? { y: 0 } : { y: chatY }}>
          <Glow className="-inset-6 -z-10" shape="rect" gradient="var(--gradient-spectrum)" blur={90} opacity={0.25} />
          <VoiceflowChat
            label={copy.label}
            loading={copy.loading}
            error={copy.error}
            bookDemo={t.common.bookDemo}
            className="glass-raised h-150 rounded-[1.75rem] max-sm:h-[min(600px,80svh)]"
          />
          <p className="mt-4 text-center text-xs text-haze">{copy.note}</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
