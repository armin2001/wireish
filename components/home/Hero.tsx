'use client';

import { useRef } from 'react';
import { motion, transform, useScroll, useTransform } from 'framer-motion';
import { Globe, Play } from 'lucide-react';
import { FaFacebookMessenger, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { HeroVisual } from '@/components/home/HeroVisual';
import { ButtonLink } from '@/components/ui/Button';
import { Glow } from '@/components/ui/Glow';
import { DEMO_HREF } from '@/lib/content';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n/client';

const CHANNELS = [
  { key: 'website', Icon: Globe },
  { key: 'instagram', Icon: FaInstagram },
  { key: 'whatsapp', Icon: FaWhatsapp },
  { key: 'messenger', Icon: FaFacebookMessenger },
] as const;

/*
 * Copy opacity over the scroll. A function on purpose: given ranges, useTransform lets
 * framer-motion hand opacity to the browser's native ViewTimeline (new in Safari 26), whose
 * "exit" range also starts the fade late on a hero taller than the screen, as on every phone.
 */
const fadeCopy = transform([0, 0.75], [1, 0]);

/*
 * Entrances use the CSS `animate-rise` rather than framer-motion: they run before hydration,
 * so the headline (the LCP element) is never waiting on JavaScript, and globals.css holds
 * them paused while the first-visit splash is up.
 *
 * Scrolling out is a three-depth parallax: the glows lag behind the page (far), the inbox
 * mockup lags a little (middle), and the copy lifts and fades (near). Off for reduced motion.
 */
export default function Hero() {
  const { t } = useI18n();
  const hero = t.home.hero;
  const section = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  // 0 while the hero fills the screen, 1 once its bottom edge has left the top of the viewport.
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, fadeCopy);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <section ref={section} className="relative isolate overflow-hidden">
      {/* Backdrop: two logo-colored glows and a dot grid that fades out toward the edges. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div className="absolute inset-0" style={reduceMotion ? { y: 0 } : { y: backdropY }}>
          <Glow className="-left-48 -top-48 h-155 w-155" gradient="var(--gradient-wire)" blur={140} opacity={0.3} />
          <Glow className="-right-40 top-1/4 h-130 w-130" gradient="var(--gradient-pulse)" blur={140} opacity={0.25} />
          <div className="dot-grid absolute inset-0 mask-[radial-gradient(ellipse_75%_65%_at_50%_35%,#000_25%,transparent_75%)]" />
        </motion.div>
        {/* Hides where the glows are clipped; the demo section's light blends over it from below. */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-night" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-20 px-6 pb-24 pt-36 lg:min-h-svh lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12 lg:pb-20 lg:pt-32">
        <motion.div style={reduceMotion ? { y: 0, opacity: 1 } : { y: copyY, opacity: copyOpacity }}>
          <p className="inline-flex animate-rise items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2.5 pr-4 text-sm text-mist backdrop-blur-md">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            {hero.eyebrow}
          </p>

          <h1 className="mt-7 font-display text-[clamp(2.75rem,5.2vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white">
            {hero.lines.map((line, i) => (
              <span key={line} className="block animate-rise" style={{ animationDelay: `${80 + i * 90}ms` }}>
                {line}
              </span>
            ))}
            <span className="block animate-rise pb-[0.08em] [animation-delay:260ms]">
              <span className="text-gradient-flow">{hero.highlight}</span>
            </span>
          </h1>

          <p className="mt-7 max-w-xl animate-rise text-lg leading-relaxed text-mist [animation-delay:340ms] md:text-xl md:leading-relaxed">
            {hero.body}
          </p>

          <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:420ms]">
            <ButtonLink href={DEMO_HREF} size="lg">
              {hero.primary}
            </ButtonLink>
            <ButtonLink href="/#demo" size="lg" variant="secondary" className="pl-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
                <Play className="h-3.5 w-3.5 translate-x-px fill-current" aria-hidden />
              </span>
              {hero.secondary}
            </ButtonLink>
          </div>

          <div className="mt-14 flex animate-rise items-center gap-4 text-sm text-haze [animation-delay:500ms]">
            <span>{hero.answersOn}</span>
            <ul className="flex items-center gap-2">
              {CHANNELS.map(({ key, Icon }) => {
                const label = t.channels[key];
                return (
                  <li key={key}>
                    <span
                      title={label}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/3 text-mist"
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      <span className="sr-only">{label}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>

        <motion.div style={reduceMotion ? { y: 0 } : { y: visualY }}>
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
