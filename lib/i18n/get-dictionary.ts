/**
 * Server-side dictionary loader. Each language is its own chunk, so a page only ships
 * the language it renders. Never import this from a client component: client code gets
 * the dictionary through I18nProvider.
 */
import { cache } from 'react';
import type { Locale } from './config';
import type { Dictionary } from './dictionaries/en';

const loaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  en: () => import('./dictionaries/en'),
  bs: () => import('./dictionaries/bs'),
  de: () => import('./dictionaries/de'),
  fr: () => import('./dictionaries/fr'),
  es: () => import('./dictionaries/es'),
  sv: () => import('./dictionaries/sv'),
  ja: () => import('./dictionaries/ja'),
  ko: () => import('./dictionaries/ko'),
};

export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => (await loaders[locale]()).default);
