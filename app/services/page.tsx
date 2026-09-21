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
    icon: <BrainCircuit className="w-7 h-7 text-gray-300 group-hover:text-white transition-colors duration-300" />,
    gradient: "from-blue-500/10 to-transparent",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    border: "group-hover:border-blue-500/30"
  },
  {
    title: "WhatsApp Automation",
    description: "Automated WhatsApp Business flows to handle inquiries, process orders, and engage customers securely on their favorite app.",
    icon: <FaWhatsapp className="w-7 h-7 text-gray-300 group-hover:text-white transition-colors duration-300" />,
    gradient: "from-emerald-500/10 to-transparent",
    glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    border: "group-hover:border-emerald-500/30"
  },
  {
    title: "Instagram DM Bots",
    description: "Convert followers into customers instantly with automated reply sequences, story mentions, and smart DM funnels.",
    icon: <FaInstagram className="w-7 h-7 text-gray-300 group-hover:text-white transition-colors duration-300" />,
    gradient: "from-purple-500/10 to-transparent",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    border: "group-hover:border-purple-500/30"
  },
  {
    title: "Custom Integrations",
    description: "Bespoke API connections linking your AI agents seamlessly to your CRM, payment gateways, and existing operational tools.",
    icon: <Workflow className="w-7 h-7 text-gray-300 group-hover:text-white transition-colors duration-300" />,
    gradient: "from-orange-500/10 to-transparent",
    glow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]",
    border: "group-hover:border-orange-500/30"
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -z-10" />

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
              className={`glass p-10 rounded-3xl border border-border/80 transition-all duration-500 relative group flex flex-col items-start bg-gradient-to-b from-white/[0.02] to-transparent ${service.glow} ${service.border}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white/5 bg-gradient-to-br ${service.gradient} transition-all duration-500 group-hover:scale-110`}>
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