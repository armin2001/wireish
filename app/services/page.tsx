import type { Metadata } from 'next';
import DemoCta from '@/components/home/DemoCta';
import { ServiceGrid } from '@/components/sections/Services';

export const metadata: Metadata = {
  title: 'Services',
  description: 'AI agents for your website, Instagram and WhatsApp, connected to your CRM and tools. Built and run by Wireish.',
};

export default function ServicesPage() {
  return (
    <main className="relative overflow-x-clip px-6 pb-28 pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ backgroundImage: 'var(--gradient-wire)' }}
      />
      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-6xl">
            What we build and run for you
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-mist">
            Every agent is set up by our team, trained on your business and monitored after launch. Pick the channels you
            need; they share one memory of each customer.
          </p>
        </header>
        <ServiceGrid className="mt-14" />
        <div className="mt-20">
          <DemoCta />
        </div>
      </div>
    </main>
  );
}
