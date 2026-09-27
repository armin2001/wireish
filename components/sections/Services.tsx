import type { ComponentType } from 'react';
import { MessageSquare, Workflow } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/lib/cn';
import type { Dictionary } from '@/lib/i18n/dictionaries/en';

/** Visuals per service, in the same order as t.services.items. Colors come from the logo, not the channels' own brands. */
const SERVICE_VISUALS: Array<{ Icon: ComponentType<{ className?: string }>; gradient: string }> = [
  { Icon: MessageSquare, gradient: 'var(--gradient-wire)' },
  { Icon: FaInstagram, gradient: 'var(--gradient-pulse)' },
  { Icon: FaWhatsapp, gradient: 'var(--gradient-current)' },
  { Icon: Workflow, gradient: 'var(--gradient-link)' },
];

/** The service cards on /services. (The home page covers the same ground in BentoFeatures.) */
export function ServiceGrid({ t, className }: { t: Dictionary; className?: string }) {
  return (
    <ul className={cn('grid gap-5 md:grid-cols-2', className)}>
      {t.services.items.map(({ title, body }, i) => {
        const { Icon, gradient } = SERVICE_VISUALS[i % SERVICE_VISUALS.length];
        return (
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
        );
      })}
    </ul>
  );
}
