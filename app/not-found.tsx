import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Pozadinski glow efekat */}
      <div className="absolute w-125 h-125 bg-primary/15 rounded-full blur-[140px] -z-10" />

      <div className="max-w-md w-full glass p-8 md:p-10 border border-border/80 shadow-2xl rounded-3xl relative text-center flex flex-col items-center">
        
        {/* Ikonica */}
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
          <AlertTriangle className="w-8 h-8 text-primary" />
        </div>
        
        {/* Tekst */}
        <h1 className="text-5xl font-display font-bold text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          The page you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
        </p>

        {/* Dugme za povratak */}
        <Link 
          href="/"
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_var(--color-primary-glow)] text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}