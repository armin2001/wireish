'use client';

import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { TransitionLink } from '@/components/layout/PageTransition';
import { cn } from '@/lib/cn';

export const FAQS = [
  {
    question: 'How long does it take to set up an AI chatbot?',
    answer:
      'Most basic integrations (website widget and FAQ training) are completed within 48 to 72 hours. Custom multi-channel setups with complex workflows typically take around 1 week.',
  },
  {
    question: 'Which platforms do you integrate with?',
    answer:
      'Wireish specializes in integrating AI agents across your website (via a lightweight chat widget), Instagram DMs, WhatsApp Business, Facebook Messenger, and custom APIs if required.',
  },
  {
    question: 'Can the AI chatbot hand over conversations to human agents?',
    answer:
      'Yes! You can configure seamless handovers. If the AI encounters a complex query or a high-value customer requesting a human, it instantly alerts your team via email or Slack.',
  },
  {
    question: 'Is my company data and customer privacy secure?',
    answer:
      'Absolutely. All conversations and training data are encrypted in transit and at rest. We comply with industry-standard privacy protocols and never share your proprietary data.',
  },
  {
    question: 'Do I need technical knowledge to manage the chatbot?',
    answer:
      'None at all. We handle 100% of the technical setup, maintenance, and ongoing optimization. You get a simple dashboard or direct reports on performance.',
  },
] as const;

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" className="scroll-mt-24 px-6 py-28">
      {/* Lets search engines show these answers directly in results. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="self-start lg:sticky lg:top-32">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Questions, answered
          </h2>
          <p className="mt-5 max-w-sm text-lg text-mist">
            Setup time, platforms, handover to your team, security. Anything else, ask us directly.
          </p>
          <TransitionLink href="/contact" className="mt-6 inline-block font-medium text-signal transition-colors hover:text-white">
            Send us a question
          </TransitionLink>
        </div>

        <ul className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            const buttonId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <li
                key={faq.question}
                className={cn(
                  'glass rounded-2xl transition-[border-color,background-color] duration-300',
                  isOpen && 'border-white/15 bg-white/5',
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
                    <span className="text-[17px]">{faq.question}</span>
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
                  <p className="px-5 pb-6 leading-relaxed text-mist sm:px-6">{faq.answer}</p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
