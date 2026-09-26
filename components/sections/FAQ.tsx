'use client';

import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { TransitionLink } from '@/components/layout/PageTransition';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n/client';
import { LOCALE_META } from '@/lib/i18n/config';

export default function FAQ() {
  const { t, locale } = useI18n();
  const copy = t.home.faq;
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  // Lets search engines show these answers directly in results, in the page's language.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: LOCALE_META[locale].htmlLang,
    mainEntity: copy.items.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <section id="faq" className="scroll-mt-24 px-6 py-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="self-start lg:sticky lg:top-32">
          <h2 className="font-display text-4xl font-semibold tracking-[-0.025em] text-white md:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-5 max-w-sm text-lg text-mist">
            {copy.body}
          </p>
          <TransitionLink href="/contact" className="mt-6 inline-block font-medium text-signal transition-colors hover:text-white">
            {copy.ask}
          </TransitionLink>
        </div>

        <ul className="space-y-3">
          {copy.items.map((faq, i) => {
            const isOpen = open === i;
            const buttonId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <li
                key={faq.q}
                className={cn(
                  'glass rounded-2xl transition-[border-color,background-color] duration-300',
                  isOpen && 'border-white/15 bg-white/[0.05]',
                )}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-5 rounded-2xl p-5 text-left font-medium text-white sm:p-6"
                  >
                    <span className="text-[17px]">{faq.q}</span>
                    <span
                      aria-hidden
                      className={cn(
                        'grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ease-wire',
                        isOpen
                          ? 'rotate-45 border-signal/60 text-signal shadow-glow-signal'
                          : 'border-white/12 text-mist group-hover:border-white/30 group-hover:text-white',
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-6 leading-relaxed text-mist sm:px-6">{faq.a}</p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
