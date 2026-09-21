'use client';

import { motion } from 'framer-motion';
import { Clock, Zap, DollarSign, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';

const benefits = [
  {
    title: '24/7 Availability',
    description: 'Never miss a potential customer. Your AI agent answers inquiries, qualifies leads, and books appointments around the clock.',
    icon: Clock,
  },
  {
    title: 'Lightning-Fast Responses',
    description: 'Eliminate wait times. Customers get precise, instant answers to their questions within seconds across all channels.',
    icon: Zap,
  },
  {
    title: 'Cost & Time Efficiency',
    description: 'Reduce support overhead and free up your human team to focus on complex tasks and high-value closing.',
    icon: DollarSign,
  },
  {
    title: 'Brand-Tailored Persona',
    description: 'Custom-trained on your specific tone of voice, product catalog, and guidelines to sound authentically like your brand.',
    icon: Sparkles,
  },
  {
    title: 'Effortless Scalability',
    description: 'Handle hundreds of simultaneous conversations during peak traffic or flash sales without adding extra support staff.',
    icon: TrendingUp,
  },
  {
    title: 'Enterprise-Grade Security',
    description: 'Your data and your customers\' conversations are protected with industry-leading security and privacy protocols.',
    icon: ShieldCheck,
  }
];

export default function Benefits() {
  return (
    <section className="py-24 px-6 relative z-10 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Why Businesses Choose <span className="text-gradient">Wireish</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Empower your business with intelligent automation designed to increase conversions and delight customers.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass p-8 group hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <benefit.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}