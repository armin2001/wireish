import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Sora } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HideOnRoutes } from '@/components/layout/HideOnRoutes';
import { TransitionProvider } from '@/components/layout/PageTransition';
import { VoiceflowWidget } from '@/components/layout/VoiceflowWidget';
import { ToastProvider } from '@/components/ui/Toaster';

// Sora's geometric lowercase echoes the logo wordmark; Instrument Sans keeps long copy compact.
// latin-ext covers č, ć, đ, š, ž in names typed into the forms.
const sora = Sora({ subsets: ['latin', 'latin-ext'], variable: '--font-sora', display: 'swap' });
const instrument = Instrument_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-instrument', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://wireish.com'),
  title: {
    default: 'Wireish | Omnichannel AI Chatbot Integration',
    template: '%s | Wireish',
  },
  description:
    'Automate customer communication across Website, Instagram, and WhatsApp with intelligent AI agents. 24/7 support, lead generation, and instant sales.',
  keywords: ['AI chatbot', 'WhatsApp automation', 'Instagram DM bot', 'Customer support AI', 'Wireish'],
  openGraph: {
    title: 'Wireish | Omnichannel AI Chatbot Integration',
    description: 'Automate customer communication across Website, Instagram, and WhatsApp with intelligent AI agents.',
    url: 'https://wireish.com',
    siteName: 'Wireish',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wireish | Omnichannel AI Chatbot Integration',
    description: 'Automate customer communication with intelligent AI agents.',
  },
};

export const viewport: Viewport = {
  themeColor: '#050716',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior lets Next.js turn smooth scrolling off during route changes.
    <html lang="en" data-scroll-behavior="smooth" className={`scroll-smooth ${sora.variable} ${instrument.variable}`}>
      <body className="font-sans">
        <ToastProvider>
          <TransitionProvider>
            <a
              href="#content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-night"
            >
              Skip to content
            </a>
            <Navbar />
            <div id="content" className="relative flex min-h-dvh flex-col">
              {children}
            </div>
            <HideOnRoutes routes={['/canvas']}>
              <Footer />
            </HideOnRoutes>
          </TransitionProvider>
        </ToastProvider>
        <VoiceflowWidget />
        <Analytics />
      </body>
    </html>
  );
}
