import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Instrument_Sans, Sora } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import '../globals.css';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HideOnRoutes } from '@/components/layout/HideOnRoutes';
import { TransitionProvider } from '@/components/layout/PageTransition';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { SplashBootScript } from '@/components/layout/SplashBootScript';
import { VoiceflowWidget } from '@/components/layout/VoiceflowWidget';
import { ToastProvider } from '@/components/ui/Toaster';
import { I18nProvider } from '@/lib/i18n/client';
import { LOCALES, LOCALE_META } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata, SITE_URL } from '@/lib/i18n/metadata';
import { localeFrom, type LocaleParams } from '@/lib/i18n/server';

// Sora's geometric lowercase echoes the logo wordmark; Instrument Sans keeps long copy compact.
// latin-ext covers č, ć, đ, š, ž, ä, ö, å, ñ, é …; Korean and Japanese use system fonts (globals.css).
const sora = Sora({ subsets: ['latin', 'latin-ext'], variable: '--font-sora', display: 'swap' });
const instrument = Instrument_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-instrument', display: 'swap' });

/** Every language is pre-rendered at build time; any other first segment is a 404. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: '%s | Wireish' },
    keywords: ['AI chatbot', 'WhatsApp automation', 'Instagram DM bot', 'Customer support AI', 'Wireish'],
    twitter: { card: 'summary_large_image', title: t.meta.title, description: t.meta.description },
    ...pageMetadata(locale, '/', { title: t.meta.title, description: t.meta.description }),
  };
}

export const viewport: Viewport = {
  themeColor: '#050716',
  colorScheme: 'dark',
  // Lets the page draw under the notch and home indicator; safe-area insets keep content clear.
  viewportFit: 'cover',
};

export default async function LocaleLayout({ children, params }: LocaleParams & { children: ReactNode }) {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);

  return (
    // data-scroll-behavior lets Next.js turn smooth scrolling off during route changes.
    <html
      lang={LOCALE_META[locale].htmlLang}
      data-scroll-behavior="smooth"
      className={`scroll-smooth ${sora.variable} ${instrument.variable}`}
      suppressHydrationWarning // the boot script below sets data-splash before React hydrates
    >
      <head>
        {/* Runs before first paint: skips the splash for visitors who already saw it this session. */}
        <SplashBootScript />
        <noscript>
          <style>{'#splash{display:none!important}'}</style>
        </noscript>
      </head>
      <body className="font-sans">
        <I18nProvider locale={locale} dictionary={t}>
          <SplashScreen />
          <ToastProvider>
            <TransitionProvider>
              <a
                href="#content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-night"
              >
                {t.common.skipToContent}
              </a>
              <Navbar />
              <div id="content" className="relative flex min-h-dvh flex-col">
                {children}
              </div>
              <HideOnRoutes routes={['/canvas']}>
                <Footer t={t} />
              </HideOnRoutes>
            </TransitionProvider>
          </ToastProvider>
        </I18nProvider>
        <VoiceflowWidget />
        <Analytics />
      </body>
    </html>
  );
}
