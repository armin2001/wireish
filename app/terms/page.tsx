'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Scale, FileText } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 relative z-10 bg-background text-gray-300">
      <div className="max-w-4xl mx-auto">
        {/* Dugme za povratak */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Zaglavlje */}
        <div className="mb-12 border-b border-border/80 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Scale className="w-3.5 h-3.5" /> Service Agreement & Legal Framework
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 text-white">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
        </div>

        {/* Sadržaj uvjeta */}
        <div className="space-y-10 text-sm md:text-base leading-relaxed">
          
          <section className="glass p-6 md:p-8 border border-border/80">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">01.</span> Acceptance of Terms
            </h2>
            <p className="text-gray-400">
              By accessing, integrating, or utilizing the <strong className="text-white">Wireish</strong> platform, website, or AI chatbot infrastructure, you agree to be legally bound by these Terms of Service. If you are entering into this agreement on behalf of a company or legal entity, you represent that you have the authority to bind such entity. If you lack such authority, or if you do not agree with these terms, you must not use our services.
            </p>
          </section>

          <section className="glass p-6 md:p-8 border border-border/80">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">02.</span> Description of Services & AI Limitations
            </h2>
            <p className="text-gray-400 mb-4">
              Wireish provides automated AI agent integration for customer communication channels (Web widgets, Instagram, WhatsApp). You acknowledge and agree to the following operational realities of generative AI:
            </p>
            <ul className="space-y-2 text-gray-400 list-disc pl-5">
              <li>AI responses are generated dynamically and may occasionally contain inaccuracies, hallucinations, or unverified statements.</li>
              <li>You are solely responsible for reviewing and supervising the outputs and knowledge base configured for your AI agents.</li>
              <li>We do not guarantee 100% uptime, as services rely on third-party cloud infrastructure, APIs, and messaging network availability.</li>
            </ul>
          </section>

          <section className="glass p-6 md:p-8 border border-border/80">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">03.</span> Acceptable Use Policy
            </h2>
            <p className="text-gray-400 mb-4">
              You agree not to misuse the Wireish platform or assist any third party in doing so. Prohibited actions include, but are not limited to:
            </p>
            <ul className="space-y-2 text-gray-400 list-disc pl-5">
              <li>Using the AI agents to distribute spam, unsolicited promotional material, or malicious content.</li>
              <li>Attempting to bypass security controls, reverse-engineer, or extract underlying model weights and proprietary source code.</li>
              <li>Training the AI on content that violates intellectual property rights, privacy rights, or local and international laws.</li>
            </ul>
          </section>

          <section className="glass p-6 md:p-8 border border-border/80">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">04.</span> Payment Terms & Custom Agreements
            </h2>
            <p className="text-gray-400">
              Services provided via custom scopes and tailored architectures are governed by individual client agreements, statements of work (SOW), or direct invoicing terms. Failure to settle agreed-upon billing cycles may result in the immediate suspension or termination of AI agent integrations.
            </p>
          </section>

          <section className="glass p-6 md:p-8 border border-border/80">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">05.</span> Indemnification & Limitation of Liability
            </h2>
            <p className="text-gray-400">
              To the fullest extent permitted by law, Wireish shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services. You agree to indemnify and hold harmless Wireish, its founders, and contractors from any third-party claims, liabilities, or expenses resulting from your breach of these terms or misuse of platform integrations.
            </p>
          </section>

          <section className="glass p-6 md:p-8 border border-border/80">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">06.</span> Modifications & Termination
            </h2>
            <p className="text-gray-400">
              We reserve the right to suspend, modify, or terminate access to our services at any time, with or without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}