import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import HelixHero from '@/components/helix/HelixHero';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/i18n/metadata';
import { localeFrom, type LocaleParams } from '@/lib/i18n/server';

// Loaded on this page only; the font-mono utility picks it up through --font-jetbrains-mono (globals.css).
const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], variable: '--font-jetbrains-mono', display: 'swap' });

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  return {
    ...pageMetadata(locale, '/helix', { title: 'Helix', description: t.meta.description }),
    // Preview of a hero concept: shareable by link, kept out of search results (and not in sitemap.ts).
    robots: { index: false, follow: false },
  };
}

export default function HelixPage() {
  return (
    <main className={mono.variable}>
      <HelixHero />
    </main>
  );
}
