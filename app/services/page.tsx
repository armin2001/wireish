import type { Metadata } from 'next';
import { BrainCircuit, Workflow } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Services | Wireish AI Automation',
  description: 'Enterprise-grade AI automation solutions for Web, Instagram, and WhatsApp.',
};

const services = [
  {
    title: "Web AI Agents",
    description: "Intelligent chatbots integrated directly into your website to capture leads, qualify prospects, and provide 24/7 customer support.",
    icon: <BrainCircuit className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />,
    gradient: "from-indigo-600/20 to-cyan-400/10",
    glow: "group-hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]",
    border: "group-hover:border-cyan-500/40"
  },
  {
    title: "WhatsApp Automation",
    description: "Automated WhatsApp Business flows to handle inquiries, process orders, and engage customers securely on their favorite app.",
    icon: <FaWhatsapp className="w-7 h-7 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />,
    gradient: "from-green-600/20 to-emerald-400/10",
    glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    border: "group-hover:border-emerald-500/40"
  },
  {
    title: "Instagram DM Bots",
    description: "Convert followers into customers instantly with automated reply sequences, story mentions, and smart DM funnels.",
    icon: <FaInstagram className="w-7 h-7 text-pink-400 group-hover:text-pink-300 transition-colors duration-300" />,
    gradient: "from-pink-600/20 to-purple-500/10",
    glow: "group-hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]",
    border: "group-hover:border-pink-500/40"
  },
  {
    title: "Custom Integrations",
    description: "Bespoke API connections linking your AI agents seamlessly to your CRM, payment gateways, and existing operational tools.",
    icon: <Workflow className="w-7 h-7 text-amber-400 group-hover:text-amber-300 transition-colors duration-300" />,
    gradient: "from-yellow-600/20 to-amber-500/10",
    glow: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]",
    border: "group-hover:border-amber-500/40"
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 relative overflow-hidden flex flex-col items-center">
      {/* Poboljšan pozadinski glow za cijelu stranicu */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/15 to-transparent rounded-full blur-[120px] -z-10 opacity-60" />

      <div className="max-w-7xl mx-auto w-full">
        
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Our Services</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            End-to-end AI automation infrastructure designed to scale your customer interactions, reduce support costs, and maximize revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`glass p-10 rounded-3xl border border-white/5 transition-all duration-500 relative group flex flex-col items-start bg-gradient-to-br from-white/[0.03] to-transparent ${service.glow} ${service.border}`}
            >
              {/* Box za ikonicu sa dvobojnim gradijentom */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white/10 bg-gradient-to-br ${service.gradient} transition-all duration-500 group-hover:scale-110 group-hover:border-white/20 shadow-lg`}>
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-100 transition-colors">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}