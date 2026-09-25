import { ButtonLink } from '@/components/ui/Button';
import { DEMO_HREF } from '@/lib/content';

export default function DemoCta() {
  return (
    <div className="glass-raised relative mx-auto max-w-6xl overflow-hidden rounded-4xl px-8 py-14 md:px-14 md:py-16">
      <div className="wire-line absolute inset-x-0 top-0" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-[90px]"
        style={{ backgroundImage: 'var(--gradient-wire)' }}
      />
      <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
            See it answer your customers.
          </h2>
          <p className="mt-4 text-lg text-mist">
            Pick a 30-minute slot. We show you an agent trained on your own website, then scope the build with you.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={DEMO_HREF} size="lg">
            Book a demo
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="secondary">
            Send a message
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
