import Hero from '@/components/home/Hero';
import CanvasTeaser from '@/components/home/CanvasTeaser';
import DemoCta from '@/components/home/DemoCta';
import Services from '@/components/sections/Services';
import HowItWorks from '@/components/sections/HowItWorks';
import Benefits from '@/components/sections/Benefits';
import FAQ from '@/components/sections/FAQ';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <CanvasTeaser />
      <HowItWorks />
      <Benefits />
      <FAQ />
      <section className="px-6 pb-28 pt-8">
        <DemoCta />
      </section>
    </main>
  );
}
