import { notFound } from 'next/navigation';
import { isLocale, type Locale } from './config';

/** Props every page and layout under app/[locale] receives. */
export interface LocaleParams {
  params: Promise<{ locale: string }>;
}

/** Reads and validates the [locale] segment; unknown values render the 404 page. */
export async function localeFrom(params: LocaleParams['params']): Promise<Locale> {
  const { locale } = await params;
  if (isLocale(locale)) return locale;
  return notFound();
}
