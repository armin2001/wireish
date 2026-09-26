import type { Metadata } from 'next';
import { CanvasLoader } from '@/components/canvas/CanvasLoader';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/i18n/metadata';
import { localeFrom, type LocaleParams } from '@/lib/i18n/server';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  return pageMetadata(locale, '/canvas', { title: t.canvas.metaTitle, description: t.canvas.metaDescription });
}

export default async function CanvasPage({ params }: LocaleParams) {
  const t = await getDictionary(await localeFrom(params));
  return (
    <main className="relative h-dvh overflow-hidden bg-night">
      <h1 className="sr-only">{t.canvas.h1}</h1>
      <CanvasLoader />
    </main>
  );
}
