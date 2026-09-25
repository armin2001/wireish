import type { Metadata } from 'next';
import { BookingBackdrop } from '@/components/booking/BookingBackdrop';
import { BookingFlow } from '@/components/booking/BookingFlow';
import { MEETING_MINUTES } from '@/lib/availability';

export const metadata: Metadata = {
  title: 'Book a demo',
  description: 'Pick a 30-minute slot and see a Wireish AI agent answer questions from your own website.',
};

const AGENDA = [
  'We look at the channels you picked and how customers reach you today.',
  'You watch a live agent answer questions using content from your own website.',
  'You leave with a proposed scope, timeline and price for your build.',
];

export default function BookDemoPage() {
  return (
    <main className="relative isolate overflow-x-clip px-6 pb-28 pt-36">
      <BookingBackdrop />
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <aside className="lg:sticky lg:top-32">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-6xl">Book a demo</h1>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-mist">
            {MEETING_MINUTES} minutes on a video call with the team that would build your agent. We email you the link.
          </p>
          <h2 className="mt-10 text-sm font-semibold text-white">On the call</h2>
          <ol className="mt-4 space-y-4">
            {AGENDA.map((item, i) => (
              <li key={item} className="flex gap-4 text-mist">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/12 text-xs font-semibold text-white tabular-nums">
                  {i + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        </aside>
        <BookingFlow />
      </div>
    </main>
  );
}
