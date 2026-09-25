import type { Metadata } from 'next';
import { MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { ValueEstimator } from '@/components/pricing/ValueEstimator';
import { DEMO_HREF } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Wireish prices each AI agent to your scope instead of fixed tiers. Estimate the hours you get back, then book a call for a quote.',
};

const INCLUDED = [
  {
    title: 'Omnichannel sync',
    body: 'One agent memory shared across your website widget, Instagram Direct and WhatsApp Business chats.',
    Icon: MessageSquare,
    gradient: 'var(--gradient-wire)',
  },
  {
    title: 'Deep data training',
    body: 'We ingest your product catalogs, PDF documentation and past transcripts so the agent speaks like your team.',
    Icon: Zap,
    gradient: 'var(--gradient-pulse)',
  },
  {
    title: 'Dedicated partnership',
    body: 'Ongoing optimization, conversation reviews and scaling as your traffic grows.',
    Icon: ShieldCheck,
    gradient: 'var(--gradient-link)',
  },
];

export default function PricingPage() {
  return (
    <main className="relative overflow-x-clip px-6 pb-28 pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[760px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ backgroundImage: 'var(--gradient-wire)' }}
      />
      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-6xl">
            Priced to your scope, not a tier
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-mist">
            Every business has different workflows, so we don&apos;t sell fixed packages. We scope each agent around your
            channels, volume and goals, and quote after a short call.
          </p>
        </header>

        <div className="mt-14">
          <ValueEstimator />
        </div>

        <section aria-labelledby="included-title" className="mt-24">
          <h2 id="included-title" className="font-display text-3xl font-semibold tracking-[-0.02em] text-white">
            In every build
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {INCLUDED.map(({ title, body, Icon, gradient }) => (
              <li key={title} className="glass rounded-3xl p-7">
                <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ backgroundImage: gradient }}>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-mist">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-raised relative mt-24 overflow-hidden rounded-[2rem] px-8 py-14 text-center md:px-14">
          <div className="wire-line absolute inset-x-0 top-0" aria-hidden />
          <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-white md:text-4xl">
            Let&apos;s scope your agent
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-mist">
            In a 30-minute call we look at your workflows and send a quote that matches your goals.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={DEMO_HREF} size="lg">
              Book a demo
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              Ask a question
            </ButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
