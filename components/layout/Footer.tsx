import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // Official X logo

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="space-y-4 md:col-span-2">
          <Link href="/" className="inline-block" aria-label="Wireish home">
            <Image
              src="/logo.svg"
              alt="Wireish Logo"
              width={240}
              height={64}
              className="h-32 w-auto object-contain"
            />
          </Link>
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
            Automating customer communication with intelligent AI agents across Web, Instagram, and WhatsApp. Scale your support and sales 24/7.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">Navigation</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">Connect</h4>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-border flex items-center justify-center hover:text-white hover:border-primary/50 transition-all">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-border flex items-center justify-center hover:text-white hover:border-primary/50 transition-all">
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-border flex items-center justify-center hover:text-white hover:border-primary/50 transition-all">
              <FaXTwitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© {new Date().getFullYear()} Wireish. All rights reserved.</p>
        <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}