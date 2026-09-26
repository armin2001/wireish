import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { ContactForm } from '@/components/contact/ContactForm';
import { TransitionLink } from '@/components/layout/PageTransition';
import { DEMO_HREF, SITE } from '@/lib/content';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/i18n/metadata';
import { localeFrom, type LocaleParams } from '@/lib/i18n/server';
import { isTopic } from '@/lib/schema';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  return pageMetadata(locale, '/contact', { title: t.contact.metaTitle, description: t.contact.metaDescription });
}

interface ContactPageProps extends LocaleParams {
  searchParams: Promise<{ topic?: string | string[] }>;
}

export default async function ContactPage({ params, searchParams }: ContactPageProps) {
  const t = await getDictionary(await localeFrom(params));
  // /contact?topic=careers (from the careers page) preselects the matching topic.
  const { topic } = await searchParams;
  const initialTopic = isTopic(topic) ? topic : undefined;

  const direct = [
    { label: t.contact.email, value: SITE.email, href: `mailto:${SITE.email}`, Icon: Mail },
    { label: 'Instagram', value: '@wireish', href: SITE.instagram, Icon: FaInstagram },
    { label: 'LinkedIn', value: t.contact.linkedinValue, href: SITE.linkedin, Icon: FaLinkedin },
  ];

  return (
    <main className="relative overflow-x-clip px-6 pb-28 pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] -z-10 h-[520px] w-[520px] rounded-full opacity-25 blur-[120px]"
        style={{ backgroundImage: 'var(--gradient-wire)' }}
      />
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="lg:pt-4">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-6xl">{t.contact.title}</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-mist">{t.contact.body}</p>

          <ul className="mt-10 space-y-2">
            {direct.map(({ label, value, href, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
                  className="group flex items-center gap-4 rounded-2xl border border-transparent p-3 transition-[border-color,background-color,transform] duration-200 hover:border-white/10 hover:bg-white/[0.03] active:scale-[0.99]"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-mist transition-colors group-hover:border-signal/40 group-hover:text-white">
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
            <p className="font-medium text-white">{t.contact.demoTitle}</p>
            <p className="mt-1 text-sm text-mist">{t.contact.demoBody}</p>
            <TransitionLink href={DEMO_HREF} className="mt-3 inline-block text-sm font-medium text-signal hover:text-white">
              {t.common.bookDemo}
            </TransitionLink>
          </div>
        </section>

        <ContactForm initialTopic={initialTopic} />
      </div>
    </main>
  );
}
