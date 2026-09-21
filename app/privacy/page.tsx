'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ShieldAlert, Lock, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
              <ShieldAlert className="w-3.5 h-3.5" /> Legal Defense &amp; Compliance
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 text-white">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
        </div>

        {/* Sadržaj politike */}
        <div className="space-y-10 text-sm md:text-base leading-relaxed">
          
          <section className="glass p-6 md:p-8 border border-border/80">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">01.</span> Overview &amp; Scope
            </h2>
            <p className="text-gray-400">
              Welcome to <strong className="text-white">Wireish</strong> (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We provide advanced AI chatbot integration services across web and messaging platforms. This Privacy Policy governs your access to and use of our website, services, and infrastructure. By accessing or using Wireish, you explicitly agree to be bound by this Policy. If you disagree with any part of these terms, you must immediately cease all use of our services.
            </p>
          </section>

          <section className="glass p-6 md:p-8 border border-border/80">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">02.</span> Zero Liability &amp; &quot;As-Is&quot; Disclaimer
            </h2>
            <p className="text-gray-400 mb-4">
              To the maximum extent permitted by applicable law, Wireish and its operators, developers, and partners provide all services <strong className="text-white">&quot;AS IS&quot;</strong> and <strong className="text-white">&quot;AS AVAILABLE&quot;</strong>, without warranty of any kind, express or implied.
            </p>
            <ul className="space-y-2 text-gray-400 list-disc pl-5">
              <li>We disclaim all warranties of merchantability, fitness for a particular purpose, and non-infringement.</li>
              <li>We do not guarantee that AI-generated responses will be 100% free from errors, hallucinations, or unintended outputs.</li>
              <li><strong className="text-white">Limitation of Liability:</strong> Under no circumstances shall Wireish be held liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business interruption arising from the use of our AI infrastructure.</li>
            </ul>
          </section>

          <section className="glass p-6 md:p-8 border border-border/80">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">03.</span> Data Processing &amp; AI Training Rights
            </h2>
            <p className="text-gray-400">
              When interacting with our client bots (Website, Instagram, WhatsApp), conversation logs and interaction data may be processed to deliver real-time AI responses. We implement industry-standard encryption protocols (SSL/TLS and secure database storage) to protect data streams. However, no digital transmission over the internet is 100% secure, and we assume no liability for malicious third-party breaches beyond our reasonable control.
            </p>
          </section>

          <section className="glass p-6 md:p-8 border border-border/80">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">04.</span> Client Responsibility &amp; Indemnification
            </h2>
            <p className="text-gray-400">
              Clients using Wireish integration services are solely responsible for ensuring that their training data, proprietary knowledge bases, and customer interactions comply with local data protection laws (such as GDPR, CCPA, etc.). You agree to defend, indemnify, and hold harmless Wireish from any claims, damages, or legal expenses arising from your misuse of the AI agent or violation of third-party platform terms (Meta/Instagram/WhatsApp).
            </p>
          </section>

          <section className="glass p-6 md:p-8 border border-border/80">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">05.</span> Modifications to Terms
            </h2>
            <p className="text-gray-400">
              We reserve the right to modify, amend, or update this Privacy Policy at any time and at our sole discretion. Continued use of the platform following any modifications constitutes your formal acceptance of the revised terms.
            </p>
          </section>

          <section className="glass p-6 md:p-8 border border-border/80">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">06.</span> Contact &amp; Legal Inquiries
            </h2>
            <p className="text-gray-400">
              For any formal legal notices, compliance questions, or data removal requests, you may contact our legal desk directly via our main contact channel or schedule a discussion with our team.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}