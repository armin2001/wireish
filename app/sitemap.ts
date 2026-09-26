import type { MetadataRoute } from 'next';
import { LOCALES, LOCALE_META } from '@/lib/i18n/config';
import { SITE_URL } from '@/lib/i18n/metadata';

// `lastModified` is left out on purpose: `new Date()` would claim every page changed on every crawl.
const ROUTES: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }> = [
  { path: '', changeFrequency: 'monthly', priority: 1.0 },
  { path: '/book-a-demo', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/pricing', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/team', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/careers', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/canvas', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
];

/** One entry per page and language, each listing all its translations (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap(({ path, changeFrequency, priority }) => {
    const languages = Object.fromEntries(LOCALES.map((l) => [LOCALE_META[l].htmlLang, `${SITE_URL}/${l}${path}`]));
    return LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
