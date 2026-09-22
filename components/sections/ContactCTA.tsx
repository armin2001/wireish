'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactCTA() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState(''); // Dodan state za telefon
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Sada se telefon uspješno šalje na tvoj API
        body: JSON.stringify({ name, email, company, phone, message }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while sending your message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass p-8 md:p-14 relative overflow-hidden border border-border/80 shadow-2xl rounded-3xl bg-linear-to-b from-white/2 to-transparent"
        >
          {/* Pozadinski glow efekat */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />

          <div className="text-center mb-12">
            <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm font-medium mb-4 inline-block backdrop-blur-md">
              Get in Touch
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-white">
              Book a <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-100 to-gray-500">Demo</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-base leading-relaxed">
              Ready to automate your customer communication? Fill out the details below and we&apos;ll set up a tailored walkthrough.
            </p>
          </div>

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 space-y-4"
            >
              <div className="w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Request Received!</h3>
              <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-white font-medium">{name}</span>. We have received your message and will contact you shortly at <span className="text-white font-medium">{email}</span>.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Prvi red: Ime i Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-semibold">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" 
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none text-white text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-semibold">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@company.com" 
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none text-white text-sm transition-all"
                  />
                </div>
              </div>

              {/* Drugi red: Kompanija i Telefon */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-semibold">
                    Company Name <span className="text-gray-600 font-normal normal-case">(Optional)</span>
                  </label>
                  <input 
                    type="text" 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Wireish Inc." 
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none text-white text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-semibold">
                    Phone Number <span className="text-gray-600 font-normal normal-case">(Optional)</span>
                  </label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+387 60 123 4567" 
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none text-white text-sm transition-all"
                  />
                </div>
              </div>

              {/* Treći red: Poruka */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-semibold">Project Details / Message</label>
                <textarea 
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your automation needs..." 
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none text-white text-sm transition-all resize-none"
                />
              </div>

              {/* Dugme za slanje */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  {loading ? (
                    'Sending Request...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Demo Request
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}