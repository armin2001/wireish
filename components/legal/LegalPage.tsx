'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { SITE } from '@/lib/content';
import { TransitionLink } from '@/components/layout/PageTransition';
import { useI18n } from '@/lib/i18n/client';
import { intlLocale } from '@/lib/i18n/config';

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalPageProps {
  title: string;
  /** ISO date (YYYY-MM-DD) the text last changed. Never `new Date()`: that changes on every request. */
  updated: string;
  sections: LegalSection[];
}

export function LegalPage({ title, updated, sections }: LegalPageProps) {
  const { t, locale } = useI18n();
  const [active, setActive] = useState(sections[0]?.id ?? '');

  // Scroll-spy: highlight the section whose heading most recently crossed the top third of the screen.
  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const updatedLabel = new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${updated}T00:00:00Z`),
  );

  return (
    <main className="px-6 pb-28 pt-36">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label={t.legal.onThisPage} className="hidden self-start lg:sticky lg:top-32 lg:block">
          <p className="mb-3 text-xs font-medium text-haze">{t.legal.onThisPage}</p>
          <ol className="space-y-0.5 border-l border-white/10">
            {sections.map((section, i) => {
              const isActive = active === section.id;
              return (
                <li key={section.id} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="legal-active"
                      className="absolute -left-px top-0 h-full w-px shadow-glow-signal"
                      style={{ backgroundImage: 'var(--gradient-wire)' }}
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      'block py-1.5 pl-4 text-sm transition-colors',
                      isActive ? 'text-white' : 'text-haze hover:text-mist',
                    )}
                  >
                    <span className="tabular-nums text-haze">{String(i + 1).padStart(2, '0')}</span> {section.title}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <article className="max-w-3xl">
          <header className="border-b border-white/[0.07] pb-10">
            <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">{title}</h1>
            <p className="mt-4 text-sm text-haze">
              {/* Bosnian can format differently on the server than in Chrome (see intlLocale). */}
              {t.legal.lastUpdated} <time dateTime={updated} suppressHydrationWarning>{updatedLabel}</time>
            </p>
            {locale !== 'en' && (
              <p className="mt-6 rounded-2xl border border-signal/25 bg-signal/6 px-4 py-3 text-sm text-white">
                {t.legal.englishOnly}
              </p>
            )}
          </header>

          {/* The legal text itself is English; lang tells screen readers and translators so. */}
          <div lang="en" className="space-y-12 pt-10">
            {sections.map((section, i) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="flex items-baseline gap-3 font-display text-xl font-semibold text-white">
                  <span className="text-sm tabular-nums text-signal">{String(i + 1).padStart(2, '0')}</span>
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-mist [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-white [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:marker:text-signal">
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-14 rounded-2xl border border-white/10 p-5 text-sm text-mist">
            {t.legal.questions}{' '}
            <a href={`mailto:${SITE.email}`} className="text-white underline underline-offset-2">
              {SITE.email}
            </a>{' '}
            {t.legal.orUse}{' '}
            <TransitionLink href="/contact" className="text-white underline underline-offset-2">
              {t.legal.form}
            </TransitionLink>
            .
          </p>
        </article>
      </div>
    </main>
  );
}
