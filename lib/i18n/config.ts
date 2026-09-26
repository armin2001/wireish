/**
 * Locale configuration. Every page lives under /[locale]/..., e.g. /bs/pricing.
 * proxy.ts sends visitors without a prefix to their preferred language.
 */
export const LOCALES = ['en', 'bs', 'de', 'fr', 'es', 'sv', 'ja', 'ko'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export type FlagCode = 'gb' | 'ba' | 'de' | 'fr' | 'es' | 'se' | 'jp' | 'kr';

export interface LocaleMeta {
  /** Name in its own language, shown in the switcher. */
  native: string;
  /** English name, shown as secondary text. */
  english: string;
  flag: FlagCode;
  /** BCP 47 tag for <html lang>, Intl formatting and Open Graph. */
  htmlLang: string;
  ogLocale: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { native: 'English', english: 'English', flag: 'gb', htmlLang: 'en', ogLocale: 'en_GB' },
  bs: { native: 'Bosanski', english: 'Bosnian', flag: 'ba', htmlLang: 'bs', ogLocale: 'bs_BA' },
  de: { native: 'Deutsch', english: 'German', flag: 'de', htmlLang: 'de', ogLocale: 'de_DE' },
  fr: { native: 'Français', english: 'French', flag: 'fr', htmlLang: 'fr', ogLocale: 'fr_FR' },
  es: { native: 'Español', english: 'Spanish', flag: 'es', htmlLang: 'es', ogLocale: 'es_ES' },
  sv: { native: 'Svenska', english: 'Swedish', flag: 'se', htmlLang: 'sv', ogLocale: 'sv_SE' },
  ja: { native: '日本語', english: 'Japanese', flag: 'jp', htmlLang: 'ja', ogLocale: 'ja_JP' },
  ko: { native: '한국어', english: 'Korean', flag: 'kr', htmlLang: 'ko', ogLocale: 'ko_KR' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Picks a locale from a saved cookie, then from the Accept-Language header
 * ("de-AT,de;q=0.9,en;q=0.8"), then falls back to English. Bosnian also answers
 * for Croatian, Serbian and Montenegrin browsers, which read it without effort.
 */
export function negotiateLocale(cookie: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(cookie)) return cookie;
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { tag, q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter((entry) => entry.tag && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  const aliases: Record<string, Locale> = { hr: 'bs', sr: 'bs', sh: 'bs', cnr: 'bs', nb: 'sv', no: 'sv', nn: 'sv' };
  for (const { tag } of ranked) {
    const base = tag.split('-')[0];
    if (isLocale(base)) return base;
    if (aliases[base]) return aliases[base];
  }
  return DEFAULT_LOCALE;
}

/** Splits "/bs/pricing" into { locale: 'bs', path: '/pricing' }. */
export function splitLocale(pathname: string): { locale: Locale | null; path: string } {
  const [, first, ...rest] = pathname.split('/');
  if (isLocale(first)) return { locale: first, path: `/${rest.join('/')}`.replace(/\/$/, '') || '/' };
  return { locale: null, path: pathname || '/' };
}

/** Adds the locale prefix to an internal href ("/pricing#faq" → "/bs/pricing#faq"). */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/api/')) return href;
  if (splitLocale(href.split(/[?#]/)[0]).locale) return href;
  if (href === '/') return `/${locale}`;
  if (href.startsWith('/#') || href.startsWith('/?')) return `/${locale}${href.slice(1)}`;
  return `/${locale}${href}`;
}

/** Locale for Intl date and number formatting (English uses day-month order and a 24-hour clock). */
export function intlLocale(locale: Locale): string {
  if (locale === 'en') return 'en-GB';
  if (locale === 'bs') return bosnianIntlLocale();
  return LOCALE_META[locale].htmlLang;
}

let bosnian: string | undefined;

/**
 * Chrome and Edge report `bs` as supported but ship no data for it, so it formats in the root
 * locale ("2026 M09", "Mon"). There we fall back to Serbian Latin for Bosnia: same ijekavian day
 * names, date order and number format; only jun/jul/avgust differ from juni/juli/august.
 */
function bosnianIntlLocale(): string {
  if (bosnian === undefined) {
    // Real data gives a month name ("septembar"); the root locale gives "M09".
    const month = new Intl.DateTimeFormat('bs', { month: 'long', timeZone: 'UTC' }).format(Date.UTC(2026, 8, 1));
    bosnian = /\d/.test(month) ? 'sr-Latn-BA' : 'bs';
  }
  return bosnian;
}
