import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import HowItWorks from '@/components/sections/HowItWorks';
import Benefits from '@/components/sections/Benefits';
import FAQ from '@/components/sections/FAQ';
import ContactCTA from '@/components/sections/ContactCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <HowItWorks />
      <Benefits />
      <FAQ />
      <ContactCTA />
    </>
  );
}