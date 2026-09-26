'use client';

import { ButtonLink } from '@/components/ui/Button';
import { TransitionLink } from '@/components/layout/PageTransition';
import { BRAND } from '@/lib/brand';
import { DEMO_HREF, NAV_LINKS } from '@/lib/content';
import { useI18n } from '@/lib/i18n/client';

/** A wire from the logo that stops short: the two ends spark across the gap. */
function BrokenWire() {
  return (
    <svg viewBox="0 0 320 120" className="mx-auto h-auto w-full max-w-[320px]" aria-hidden>
      <defs>
        <linearGradient id="nf-left" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={BRAND.signal} />
          <stop offset="0.5053" stopColor={BRAND.iris} />
          <stop offset="1" stopColor={BRAND.charge} />
        </linearGradient>
        <linearGradient id="nf-right" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BRAND.spark} />
          <stop offset="0.5053" stopColor={BRAND.pulse} />
          <stop offset="1" stopColor={BRAND.conduit} />
        </linearGradient>
        <radialGradient id="nf-glow">
          <stop offset="0" stopColor={BRAND.signal} stopOpacity="0.9" />
          <stop offset="1" stopColor={BRAND.signal} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M 12 92 C 60 92, 80 40, 138 58" fill="none" stroke="url(#nf-left)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 182 62 C 240 80, 260 28, 308 28" fill="none" stroke="url(#nf-right)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="12" cy="92" r="9" fill={BRAND.current} />
      <circle cx="308" cy="28" r="9" fill={BRAND.spark} />
      <g className="origin-center animate-spark [transform-box:fill-box]">
        <circle cx="160" cy="60" r="26" fill="url(#nf-glow)" />
        <path d="M 150 50 L 162 60 L 154 62 L 170 72" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** Rendered inside app/[locale]/layout.tsx, so it has the visitor's language. */
export default function NotFound() {
  const { t } = useI18n();
  return (
    <main className="relative grid flex-1 place-items-center overflow-hidden px-6 pb-24 pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[420px] w-[520px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ backgroundImage: 'var(--gradient-pulse)' }}
      />
      <div className="w-full max-w-lg text-center">
        <BrokenWire />
        <title>{`${t.notFound.code} | Wireish`}</title>
        <meta name="robots" content="noindex" />
        <p className="mt-10 text-sm tabular-nums text-haze">{t.notFound.code}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
          {t.notFound.title}
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-lg text-mist">
          {t.notFound.body}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" size="lg">
            {t.common.backHome}
          </ButtonLink>
          <ButtonLink href={DEMO_HREF} size="lg" variant="secondary">
            {t.common.bookDemo}
          </ButtonLink>
        </div>
        <nav aria-label={t.notFound.popular} className="mt-10">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <TransitionLink href={link.href} className="text-haze transition-colors hover:text-white">
                  {t.nav[link.key]}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
