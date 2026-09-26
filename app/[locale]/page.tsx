import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import CanvasTeaser from '@/components/home/CanvasTeaser';
import DemoCta from '@/components/home/DemoCta';
import Services from '@/components/sections/Services';
import HowItWorks from '@/components/sections/HowItWorks';
import Benefits from '@/components/sections/Benefits';
import FAQ from '@/components/sections/FAQ';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/i18n/metadata';
import { localeFrom, type LocaleParams } from '@/lib/i18n/server';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  return pageMetadata(locale, '/', { description: t.meta.description });
}

export default async function HomePage({ params }: LocaleParams) {
  const t = await getDictionary(await localeFrom(params));
  return (
    <main>
      <Hero />
      <Services t={t} />
      <CanvasTeaser t={t} />
      <HowItWorks />
      <Benefits />
      <FAQ />
      <section className="px-6 pb-28 pt-8">
        <DemoCta t={t} />
      </section>
    </main>
  );
}
