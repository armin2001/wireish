import type { ComponentType } from 'react';
import { MessageSquare, Workflow } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/lib/cn';

interface Service {
  title: string;
  body: string;
  Icon: ComponentType<{ className?: string }>;
  gradient: string;
}

/** Single source for the home section and /services. Colors come from the logo, not the channels' own brands. */
export const SERVICES: Service[] = [
  {
    title: 'Website AI agent',
    body: 'A chat widget that answers questions, captures leads and books calls around the clock, trained on your site and documents.',
    Icon: MessageSquare,
    gradient: 'var(--gradient-wire)',
  },
  {
    title: 'Instagram DMs',
    body: 'Replies to direct messages and story mentions in seconds and turns interested followers into qualified leads.',
    Icon: FaInstagram,
    gradient: 'var(--gradient-pulse)',
  },
  {
    title: 'WhatsApp Business',
    body: 'Handles inquiries, order questions and reminders on the WhatsApp Business API, with a clean handoff to your team.',
    Icon: FaWhatsapp,
    gradient: 'var(--gradient-current)',
  },
  {
    title: 'CRM and custom integrations',
    body: 'Connects the agent to your CRM, calendar, payments and internal tools, so conversations become records and bookings.',
    Icon: Workflow,
    gradient: 'var(--gradient-link)',
  },
];

export function ServiceGrid({ className }: { className?: string }) {
  return (
    <ul className={cn('grid gap-5 md:grid-cols-2', className)}>
      {SERVICES.map(({ title, body, Icon, gradient }) => (
        <li
          key={title}
          className="glass wire-border group rounded-3xl p-8 transition-colors duration-300 [--wire-opacity:0] [--wire-play:paused] hover:border-white/15 hover:[--wire-opacity:1] hover:[--wire-play:running]"
        >
          <span
            className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg transition-transform duration-300 ease-wire group-hover:-translate-y-0.5"
            style={{ backgroundImage: gradient }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="mt-7 font-display text-xl font-semibold text-white">{title}</h3>
          <p className="mt-3 leading-relaxed text-mist">{body}</p>
        </li>
      ))}
    </ul>
  );
}

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-[-0.025em] text-white md:text-5xl">
            One agent, on the channels your customers already use.
          </h2>
          <p className="mt-5 text-lg text-mist">
            We set it up, train it on your business and keep improving it. You get the conversations, the leads and the
            bookings.
          </p>
        </div>
        <ServiceGrid className="mt-14" />
      </div>
    </section>
  );
}
