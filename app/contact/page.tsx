import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { ContactForm } from '@/components/contact/ContactForm';
import { TransitionLink } from '@/components/layout/PageTransition';
import { DEMO_HREF, SITE } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Send the Wireish team a message about a new project, an existing agent or a partnership.',
};

const DIRECT = [
  { label: 'Email', value: SITE.email, href: `mailto:${SITE.email}`, Icon: Mail },
  { label: 'Instagram', value: '@wireish', href: SITE.instagram, Icon: FaInstagram },
  { label: 'LinkedIn', value: 'Wireish team', href: SITE.linkedin, Icon: FaLinkedin },
];

export default function ContactPage() {
  return (
    <main className="relative overflow-x-clip px-6 pb-28 pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] -z-10 h-130 w-130 rounded-full opacity-25 blur-[120px]"
        style={{ backgroundImage: 'var(--gradient-wire)' }}
      />
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="lg:pt-4">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-6xl">
            Talk to the people who build your agent.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-mist">
            Ask about a new project, an agent we already run for you, or working together. A person from our team writes
            back by email.
          </p>

          <ul className="mt-10 space-y-2">
            {DIRECT.map(({ label, value, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
                  className="group flex items-center gap-4 rounded-2xl border border-transparent p-3 transition-colors hover:border-white/10 hover:bg-white/3"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/3 text-mist transition-colors group-hover:border-signal/40 group-hover:text-white">
                    <Icon className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm text-haze">{label}</span>
                    <span className="block text-white">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-white/10 p-5">
            <p className="font-medium text-white">Rather see it working?</p>
            <p className="mt-1 text-sm text-mist">
              Book a 30-minute demo and we show you an agent answering questions from your own website.
            </p>
            <TransitionLink href={DEMO_HREF} className="mt-3 inline-block text-sm font-medium text-signal hover:text-white">
              Book a demo
            </TransitionLink>
          </div>
        </section>

        <ContactForm />
      </div>
    </main>
  );
}
