import type { Metadata } from 'next';
import { Clock, Mail, Video } from 'lucide-react';
import { BookingBackdrop } from '@/components/booking/BookingBackdrop';
import { BookingFlow } from '@/components/booking/BookingFlow';
import { DemoScenePanel } from '@/components/booking/DemoScenePanel';
import { MEETING_MINUTES } from '@/lib/availability';
import { format } from '@/lib/i18n/format';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/i18n/metadata';
import { localeFrom, type LocaleParams } from '@/lib/i18n/server';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  return pageMetadata(locale, '/book-a-demo', { title: t.booking.metaTitle, description: t.booking.metaDescription });
}

export default async function BookDemoPage({ params }: LocaleParams) {
  const t = await getDictionary(await localeFrom(params));
  const facts = [
    { label: format(t.booking.facts.minutes, { n: MEETING_MINUTES }), Icon: Clock },
    { label: t.booking.facts.video, Icon: Video },
    { label: t.booking.facts.link, Icon: Mail },
  ];

  return (
    <main className="relative isolate overflow-x-clip px-6 pb-28 pt-36">
      <BookingBackdrop />
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <aside>
          <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-6xl">{t.booking.title}</h1>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-mist">{t.booking.lead}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {facts.map(({ label, Icon }) => (
              <li
                key={label}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white/[0.08] bg-field px-3.5 text-sm text-white"
              >
                <Icon className="h-4 w-4 text-signal" aria-hidden />
                {label}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-sm font-semibold text-white">{t.booking.agendaTitle}</h2>
          <ol className="relative mt-5 space-y-6 before:absolute before:bottom-3 before:left-[13px] before:top-3 before:w-px before:bg-white/10">
            {t.booking.agenda.map((item, i) => (
              <li key={item} className="relative flex gap-4 text-mist">
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums text-white ring-4 ring-night"
                  style={{ backgroundImage: 'var(--gradient-wire)' }}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>

          <div className="mt-12 hidden lg:block">
            <DemoScenePanel />
          </div>
        </aside>

        <div className="relative">
          {/* Soft brand glow around the card; the card itself is opaque. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[3rem] opacity-[0.18] blur-3xl"
            style={{ backgroundImage: 'var(--gradient-spectrum)' }}
          />
          <BookingFlow />
        </div>
      </div>
    </main>
  );
}
