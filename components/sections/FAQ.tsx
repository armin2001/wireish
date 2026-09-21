'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How long does it take to set up an AI chatbot?',
    answer: 'Most basic integrations (website widget and FAQ training) are completed within 48 to 72 hours. Custom multi-channel setups with complex workflows typically take around 1 week.'
  },
  {
    question: 'Which platforms do you integrate with?',
    answer: 'Wireish specializes in integrating AI agents across your website (via a lightweight chat widget), Instagram DMs, WhatsApp Business, Facebook Messenger, and custom APIs if required.'
  },
  {
    question: 'Can the AI chatbot hand over conversations to human agents?',
    answer: 'Yes! You can configure seamless handovers. If the AI encounters a complex query or a high-value customer requesting a human, it instantly alerts your team via email or Slack.'
  },
  {
    question: 'Is my company data and customer privacy secure?',
    answer: 'Absolutely. All conversations and training data are encrypted in transit and at rest. We comply with industry-standard privacy protocols and never share your proprietary data.'
  },
  {
    question: 'Do I need technical knowledge to manage the chatbot?',
    answer: 'None at all. We handle 100% of the technical setup, maintenance, and ongoing optimization. You get a simple dashboard or direct reports on performance.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 relative z-10 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Got questions about integration, security, or how it works? We’ve got answers.
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="glass overflow-hidden border border-border"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-lg hover:text-primary transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 text-primary shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-border/50 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}