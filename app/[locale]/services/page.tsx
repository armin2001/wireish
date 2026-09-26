import type { Metadata } from 'next';
import DemoCta from '@/components/home/DemoCta';
import { ServiceGrid } from '@/components/sections/Services';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/i18n/metadata';
import { localeFrom, type LocaleParams } from '@/lib/i18n/server';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  return pageMetadata(locale, '/services', { title: t.services.metaTitle, description: t.services.metaDescription });
}

export default async function ServicesPage({ params }: LocaleParams) {
  const t = await getDictionary(await localeFrom(params));
  return (
    <main className="relative overflow-x-clip px-6 pb-28 pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ backgroundImage: 'var(--gradient-wire)' }}
      />
      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-6xl">{t.services.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-mist">{t.services.body}</p>
        </header>
        <ServiceGrid t={t} className="mt-14" />
        <div className="mt-20">
          <DemoCta t={t} />
        </div>
      </div>
    </main>
  );
}
