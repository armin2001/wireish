'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, MessageSquare, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [chatsPerMonth, setChatsPerMonth] = useState(3000);
  
  // Izračunavanje ušteđenog vremena i novca na bazi unosa
  const estimatedHoursSaved = Math.round(chatsPerMonth * 0.15);
  const estimatedValueGenerated = chatsPerMonth * 12;

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 relative z-10 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Dugme za povratak nazad */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Naslov sekcije */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full border border-border bg-card text-primary text-sm font-medium mb-6 inline-block glass">
              Tailored Architecture
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Custom Solutions, <span className="text-gradient">Custom Impact</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Every business has unique workflows. We don&apos;t believe in rigid cookie-cutter tiers. Instead, we architect bespoke AI agents tailored specifically to your conversion goals.
            </p>
          </motion.div>
        </div>

        {/* Interaktivni ROI Simulator / Kalkulator */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass p-8 md:p-12 mb-16 relative overflow-hidden border border-border/80"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" /> Interactive Value Estimator
              </h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Estimate how much operational bandwidth your business can recover by automating repetitive inquiries across Website, Instagram, and WhatsApp.
              </p>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 font-medium">Estimated monthly customer chats:</span>
                    <span className="text-primary font-bold">{chatsPerMonth.toLocaleString()} messages</span>
                  </div>
                  <input 
                    type="range" 
                    min="500" 
                    max="20000" 
                    step="500"
                    value={chatsPerMonth} 
                    onChange={(e) => setChatsPerMonth(Number(e.target.value))}
                    className="w-full accent-primary bg-background/50 cursor-pointer h-2 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-background/40 p-8 rounded-2xl border border-border/60 flex flex-col justify-center space-y-6 text-center md:text-left">
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Estimated Human Hours Saved</span>
                <div className="text-4xl md:text-5xl font-extrabold text-white mt-1">
                  ~{estimatedHoursSaved} hrs <span className="text-primary text-2xl">/mo</span>
                </div>
              </div>

              <div className="border-t border-border/50 pt-6">
                <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Potential Revenue Impact</span>
                <div className="text-3xl md:text-4xl font-extrabold text-gradient mt-1">
                  ${estimatedValueGenerated.toLocaleString()} <span className="text-sm font-normal text-gray-400">pipeline value</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic">
                *Calculated based on average conversion lifts reported by automated support integrations.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Šta dobijate kroz personalizovani dogovor (Garantovane vrijednosti) */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="glass p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold mb-3">Omnichannel Sync</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Unified agent memory across website widgets, Instagram Direct Messages, and WhatsApp Business chats.
            </p>
          </div>

          <div className="glass p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold mb-3">Deep Data Training</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              We ingest your product catalogs, PDF documentation, and past transcripts so the AI speaks authentically.
            </p>
          </div>

          <div className="glass p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold mb-3">Dedicated Partnership</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ongoing optimization, conversation auditing, and instant scaling as your business traffic grows.
            </p>
          </div>
        </div>

        {/* Call to Action na dnu stranice */}
        <div className="glass p-10 md:p-14 text-center relative overflow-hidden border border-primary/30">
          <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
          
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Let&apos;s discuss your custom scope</h3>
          <p className="text-gray-400 max-w-xl mx-auto mb-8 text-lg">
            Book a discovery call. We will examine your workflows and design a bespoke pricing structure that matches your exact ROI targets.
          </p>

          <Link 
            href="/#contact"
            className="inline-block px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-[0_0_25px_var(--color-primary-glow)] hover:scale-105"
          >
            Schedule Discovery Call
          </Link>
        </div>

      </div>
    </main>
  );
}