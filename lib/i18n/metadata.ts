import type { Metadata } from 'next';
import { LOCALES, LOCALE_META, type Locale } from './config';

export const SITE_URL = 'https://wireish.com';

/**
 * Canonical URL plus hreflang alternates for every language, so search engines show
 * each visitor the version in their language.
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description }: { title?: string; description: string },
): Metadata {
  const suffix = path === '/' ? '' : path;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[LOCALE_META[l].htmlLang] = `/${l}${suffix}`;
  languages['x-default'] = `/en${suffix}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: `/${locale}${suffix}`, languages },
    openGraph: {
      ...(title ? { title } : {}),
      description,
      url: `/${locale}${suffix}`,
      locale: LOCALE_META[locale].ogLocale,
      siteName: 'Wireish',
      type: 'website',
    },
  };
}
