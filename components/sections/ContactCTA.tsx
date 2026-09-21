'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { contactSchema, type ContactFormData } from '@/lib/schema';

export default function ContactCTA() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Ovdje simuliramo slanje (kasnije ćemo ovo spojiti sa pravim email servisom)
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Podaci iz forme:", data);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <section id="contact" className="py-32 px-6 relative">
      <div className="max-w-4xl mx-auto glass p-8 md:p-16 relative overflow-hidden">
        {/* Dekorativni sjaj unutar kartice */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] -z-10" />

        <div className="grid md:grid-cols-2 gap-12 relative z-10">
          <div>
            <h2 className="font-display text-4xl font-bold mb-4">Ready to automate?</h2>
            <p className="text-gray-400 mb-8">
              Book a free demo. We&apos;ll analyze your current workflows and show you exactly how Wireish can save you time and increase conversions.
            </p>
          </div>

          <div>
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8"
              >
                <CheckCircle2 className="w-16 h-16 text-accent" />
                <h3 className="text-2xl font-bold">Request Sent!</h3>
                <p className="text-gray-400">We will get back to you within 24 hours to schedule your demo.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input {...register('name')} placeholder="Your Name" className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white placeholder:text-gray-600" />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                </div>
                
                <div>
                  <input {...register('email')} placeholder="Work Email" className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white placeholder:text-gray-600" />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <input {...register('company')} placeholder="Company Name" className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white placeholder:text-gray-600" />
                  {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company.message}</p>}
                </div>

                <div>
                  <textarea {...register('message')} placeholder="How can we help you?" rows={4} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none text-white placeholder:text-gray-600" />
                  {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full bg-white text-black font-bold rounded-lg px-4 py-4 flex items-center justify-center hover:bg-gray-200 transition-colors shadow-[0_0_15px_var(--color-primary-glow)]">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Book Demo'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}