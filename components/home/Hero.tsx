'use client';

import dynamic from 'next/dynamic';
import { FaFacebookMessenger, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Globe } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { SceneFallback } from '@/components/three/SceneFallback';
import { DEMO_HREF } from '@/lib/content';
import { useIdle } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n/client';

// three.js (~150 kB gzip) is split into its own chunk and only fetched after first paint.
const BrandScene = dynamic(() => import('@/components/three/BrandScene'), {
  ssr: false,
  loading: () => <SceneFallback />,
});

const CHANNELS = [
  { key: 'website', Icon: Globe },
  { key: 'instagram', Icon: FaInstagram },
  { key: 'whatsapp', Icon: FaWhatsapp },
  { key: 'messenger', Icon: FaFacebookMessenger },
] as const;

export default function Hero() {
  const idle = useIdle();
  const { t } = useI18n();
  const hero = t.home.hero;

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      {/* 3D layer: interactive on pointer devices, decorative (and scroll-safe) on touch. */}
      <div className="absolute inset-0 -z-10 pointer-events-none lg:pointer-events-auto">
        {idle ? <BrandScene variant="hero" labels={hero.scene} /> : <SceneFallback />}
      </div>
      {/* Readability: fade the scene under the copy and into the next section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5] bg-[linear-gradient(90deg,var(--color-night)_0%,rgb(5_7_22/0.72)_34%,transparent_62%)] max-lg:bg-[linear-gradient(180deg,rgb(5_7_22/0.2)_0%,rgb(5_7_22/0.85)_55%,var(--color-night)_100%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-40 bg-linear-to-b from-transparent to-night" />

      <div className="pointer-events-none mx-auto w-full max-w-6xl px-6 pb-20 pt-32">
        <div className="pointer-events-auto max-w-xl">
          <h1 className="font-display text-[clamp(2.6rem,6.2vw,5.1rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
            {hero.lines.map((line, i) => (
              <span key={line} className="block animate-rise" style={{ animationDelay: `${i * 90}ms` }}>
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-7 max-w-md animate-rise text-lg leading-relaxed text-mist [animation-delay:280ms]">
            {hero.body}
          </p>
          <div className="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:360ms]">
            <ButtonLink href={DEMO_HREF} size="lg">
              {t.common.bookDemo}
            </ButtonLink>
            <ButtonLink href="/canvas" size="lg" variant="secondary">
              {hero.secondary}
            </ButtonLink>
          </div>

          <div className="mt-14 flex animate-rise items-center gap-4 text-sm text-haze [animation-delay:440ms]">
            <span>{hero.answersOn}</span>
            <ul className="flex items-center gap-2">
              {CHANNELS.map(({ key, Icon }) => {
                const label = t.channels[key];
                return (
                <li key={key}>
                  <span
                    title={label}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-mist"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    <span className="sr-only">{label}</span>
                  </span>
                </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <p className="pointer-events-none absolute bottom-8 right-8 hidden text-sm text-haze lg:block">
        {hero.hint}
      </p>
    </section>
  );
}
