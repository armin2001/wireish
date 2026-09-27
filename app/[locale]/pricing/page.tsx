import type { Metadata } from 'next';
import { MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import Pricing from '@/components/pricing/Pricing';
import { ValueEstimator } from '@/components/pricing/ValueEstimator';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/i18n/metadata';
import { localeFrom, type LocaleParams } from '@/lib/i18n/server';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  return pageMetadata(locale, '/pricing', { title: t.pricing.metaTitle, description: t.pricing.metaDescription });
}

/** Visuals in the same order as t.pricing.included. */
const INCLUDED_VISUALS = [
  { Icon: MessageSquare, gradient: 'var(--gradient-wire)' },
  { Icon: Zap, gradient: 'var(--gradient-pulse)' },
  { Icon: ShieldCheck, gradient: 'var(--gradient-link)' },
];

export default async function PricingPage({ params }: LocaleParams) {
  const t = await getDictionary(await localeFrom(params));
  return (
    <main className="relative overflow-x-clip px-6 pb-28 pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[760px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ backgroundImage: 'var(--gradient-wire)' }}
      />
      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-6xl">{t.pricing.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-mist">{t.pricing.body}</p>
        </header>

        <div className="mt-16">
          <Pricing embedded />
        </div>

        <div id="estimator" className="mt-28 scroll-mt-28">
          <ValueEstimator />
        </div>

        <section aria-labelledby="included-title" className="mt-24">
          <h2 id="included-title" className="font-display text-3xl font-semibold tracking-[-0.02em] text-white">
            {t.pricing.includedTitle}
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {t.pricing.included.map(({ title, body }, i) => {
              const { Icon, gradient } = INCLUDED_VISUALS[i % INCLUDED_VISUALS.length];
              return (
                <li key={title} className="glass rounded-3xl p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ backgroundImage: gradient }}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 font-display text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-mist">{body}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
