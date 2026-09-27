import type { Metadata } from 'next';
import { LOCALES, LOCALE_META, type Locale } from './config';

export const SITE_URL = 'https://wireish.com';

/** Share image for every page. Set here, not as a file convention: a page's openGraph would replace the layout's. */
const SHARE_IMAGE = { url: '/og-image.jpg', width: 3000, height: 2000, alt: 'Wireish' };

/**
 * Canonical URL plus hreflang alternates for every language, so search engines show
 * each visitor the version in their language. Metadata merges shallowly, so the share
 * image and Twitter card are repeated per page instead of inherited from the layout.
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
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      ...(title ? { title } : {}),
      description,
      images: [SHARE_IMAGE],
    },
  };
}
