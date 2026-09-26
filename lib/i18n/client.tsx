'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_LOCALE, type Locale } from './config';
import type { Dictionary } from './dictionaries/en';

interface I18nValue {
  locale: Locale;
  t: Dictionary;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, dictionary, children }: { locale: Locale; dictionary: Dictionary; children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: dictionary }}>{children}</I18nContext.Provider>;
}

/** Current locale and its dictionary: `const { t, locale } = useI18n(); t.nav.pricing`. */
export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider (app/[locale]/layout.tsx).');
  return value;
}

/** Locale only, for components outside the provider (falls back to English). */
export function useLocale(): Locale {
  return useContext(I18nContext)?.locale ?? DEFAULT_LOCALE;
}
