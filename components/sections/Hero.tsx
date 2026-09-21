'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dinamički import isključuje SSR za 3D scenu kako ne bi rušilo Next.js
const Scene = dynamic(() => import('../three/Scene'), { ssr: false });

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Učitavanje 3D pozadine */}
      <Scene />
      
      {/* Dekorativni sjaj (blob) centriran u pozadini */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/20 rounded-full blur-[120px] -z-10 animate-blob" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="px-4 py-1.5 rounded-full border border-border bg-card text-primary text-sm font-medium mb-6 inline-block glass">
            Next-gen Customer Experience
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Automate communication with <span className="text-gradient">AI chatbots</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Wireish seamlessly integrates intelligent AI agents into your Website, Instagram, and WhatsApp. Deliver 24/7 support, drive sales, and scale effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#contact" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_20px_var(--color-primary-glow)]">
              Book a demo
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-full glass font-medium hover:bg-white/5 transition-all">
              See how it works
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}