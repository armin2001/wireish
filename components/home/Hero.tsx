'use client';

import dynamic from 'next/dynamic';
import { FaFacebookMessenger, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Globe } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { SceneFallback } from '@/components/three/SceneFallback';
import { DEMO_HREF } from '@/lib/content';
import { useIdle } from '@/lib/hooks';

// three.js (~150 kB gzip) is split into its own chunk and only fetched after first paint.
const BrandScene = dynamic(() => import('@/components/three/BrandScene'), {
  ssr: false,
  loading: () => <SceneFallback />,
});

const CHANNELS = [
  { label: 'Website', Icon: Globe },
  { label: 'Instagram', Icon: FaInstagram },
  { label: 'WhatsApp', Icon: FaWhatsapp },
  { label: 'Messenger', Icon: FaFacebookMessenger },
];

export default function Hero() {
  const idle = useIdle();

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      {/* 3D layer: interactive on pointer devices, decorative (and scroll-safe) on touch. */}
      <div className="absolute inset-0 -z-10 pointer-events-none lg:pointer-events-auto">
        {idle ? <BrandScene variant="hero" /> : <SceneFallback />}
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
            <span className="block animate-rise">Your AI agent,</span>
            <span className="block animate-rise [animation-delay:90ms]">wired into every</span>
            <span className="block animate-rise [animation-delay:180ms]">channel.</span>
          </h1>
          <p className="mt-7 max-w-md animate-rise text-lg leading-relaxed text-mist [animation-delay:280ms]">
            Wireish builds and runs AI agents that answer customers on your website, Instagram and WhatsApp. They
            are trained on your business and hand the conversation to your team when a person is needed.
          </p>
          <div className="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:360ms]">
            <ButtonLink href={DEMO_HREF} size="lg">
              Book a demo
            </ButtonLink>
            <ButtonLink href="/canvas" size="lg" variant="secondary">
              Map your setup
            </ButtonLink>
          </div>

          <div className="mt-14 flex animate-rise items-center gap-4 text-sm text-haze [animation-delay:440ms]">
            <span>Answers on</span>
            <ul className="flex items-center gap-2">
              {CHANNELS.map(({ label, Icon }) => (
                <li key={label}>
                  <span
                    title={label}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-mist"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    <span className="sr-only">{label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="pointer-events-none absolute bottom-8 right-8 hidden text-sm text-haze lg:block">
        Click a channel to send a test message
      </p>
    </section>
  );
}
