'use client';

import { motion } from 'framer-motion';
import { PhoneCall, Bot, Plug, TrendingUp } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Free Consultation',
    description: 'We analyze your current communication channels and identify the best AI chatbot solutions for your specific business needs.',
    icon: PhoneCall,
  },
  {
    id: 2,
    title: 'Setup & Training',
    description: 'Our team builds and trains your custom AI agent using your company data, FAQs, and brand voice guidelines.',
    icon: Bot,
  },
  {
    id: 3,
    title: 'Seamless Integration',
    description: 'We connect the chatbot to your Website, Instagram, WhatsApp, or other platforms without disrupting your existing workflow.',
    icon: Plug,
  },
  {
    id: 4,
    title: 'Support & Optimization',
    description: 'We monitor the chatbot\'s performance, analyze customer conversations, and continuously improve its responses.',
    icon: TrendingUp,
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 relative z-10 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              How <span className="text-gradient">Wireish</span> Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              From the first call to a fully autonomous AI agent. A simple, hands-off process for you.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Vertikalna linija u pozadini */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Središnji krug sa ikonicom */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 border-background bg-primary/20 text-primary z-10 shadow-[0_0_15px_var(--color-primary-glow)] backdrop-blur-md">
                  <step.icon className="w-5 h-5" />
                </div>

                {/* Sadržaj kartice (prazan prostor za balans na desktopu) */}
                <div className="hidden md:block md:w-1/2" />

                {/* Stvarni sadržaj (Tekst) */}
                <div className="w-full md:w-1/2 pl-20 md:pl-0 md:px-12">
                  <div className={`glass p-6 md:p-8 hover:border-primary/30 transition-colors ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <span className="text-primary font-bold mb-2 block">Step {step.id}</span>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}