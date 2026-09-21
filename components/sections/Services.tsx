'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Zap } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'; // Uvozimo prave brend ikonice

const services = [
  {
    title: 'Website AI Chatbot',
    description: 'Engage visitors 24/7, capture leads, and answer FAQs instantly directly on your website.',
    icon: MessageSquare,
    color: 'text-blue-400'
  },
  {
    title: 'Instagram DM Integration',
    description: 'Automate story replies and direct messages to convert followers into paying customers.',
    icon: FaInstagram,
    color: 'text-pink-400'
  },
  {
    title: 'WhatsApp Business',
    description: 'Provide seamless customer support and send automated notifications on the world\'s most popular app.',
    icon: FaWhatsapp,
    color: 'text-green-400'
  },
  {
    title: 'Custom AI Agents',
    description: 'Tailor-made AI solutions trained on your company data to handle complex workflows.',
    icon: Zap,
    color: 'text-primary'
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 relative z-10 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Omnichannel <span className="text-gradient">Automation</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Meet your customers wherever they are. Our AI chatbots integrate seamlessly across all major platforms.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass p-6 group hover:-translate-y-2 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
            >
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${service.color}`}>
                {/* Ovdje smo dodali className umjesto strokeWidth kako bi radilo sa svim tipovima ikonica */}
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}