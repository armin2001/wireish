'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 flex justify-center ${scrolled ? 'py-4' : 'py-0'}`}>
      <div 
        style={{ borderRadius: scrolled ? '9999px' : '0px' }}
        className={`transition-all duration-500 flex items-center justify-between px-8 h-20 ${
          scrolled 
            ? 'max-w-5xl w-[92%] glass shadow-2xl bg-background/80 border border-border/80' 
            : 'max-w-7xl w-full bg-transparent border-b border-transparent'
        }`}
      >
        
        {/* LOGO - Gigantski format */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Wireish Logo"
            width={560}
            height={160}
            className="h-28 md:h-36 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <Link href="/#services" className="hover:text-white transition-colors">Services</Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
        </nav>

        <div className="hidden md:block">
          <Link href="/#contact" className="px-5 py-2.5 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors shadow-[0_0_20px_var(--color-primary-glow)]">
            Book a demo
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-24 left-6 right-6 glass flex flex-col p-6 gap-4 rounded-3xl shadow-2xl"
          >
            <Link href="/#services" onClick={() => setMobileMenu(false)} className="text-lg">Services</Link>
            <Link href="/#how-it-works" onClick={() => setMobileMenu(false)} className="text-lg">How it works</Link>
            <Link href="/pricing" onClick={() => setMobileMenu(false)} className="text-lg">Pricing</Link>
            <Link href="/#faq" onClick={() => setMobileMenu(false)} className="text-lg">FAQ</Link>
            <Link href="/#contact" className="mt-2 text-center py-3 rounded-full bg-white text-black font-medium" onClick={() => setMobileMenu(false)}>
              Book a demo
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}