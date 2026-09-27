import type { Metadata } from 'next';
import BentoFeatures from '@/components/home/BentoFeatures';
import CanvasTeaser from '@/components/home/CanvasTeaser';
import Hero from '@/components/home/Hero';
import InteractiveChatDemo from '@/components/home/InteractiveChatDemo';
import Pricing from '@/components/pricing/Pricing';
import FAQ from '@/components/sections/FAQ';
import HowItWorks from '@/components/sections/HowItWorks';
import { Reveal } from '@/components/ui/Reveal';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/i18n/metadata';
import { localeFrom, type LocaleParams } from '@/lib/i18n/server';
import { homeStructuredData, jsonLd } from '@/lib/structured-data';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  return pageMetadata(locale, '/', { description: t.meta.description });
}

/*
 * Hero, demo, features and pricing animate their own entrances (staggered grids included);
 * the older sections get the same fade-and-rise from <Reveal>. The closing call to action
 * is the footer's, shared with every page.
 */
export default async function HomePage({ params }: LocaleParams) {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeStructuredData(locale, t.meta.description)) }} />
      <Hero />
      <InteractiveChatDemo />
      <BentoFeatures />
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <CanvasTeaser t={t} />
      </Reveal>
      <Pricing />
      <Reveal>
        <FAQ />
      </Reveal>
    </main>
  );
}
