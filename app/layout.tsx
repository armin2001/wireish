import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Script from 'next/script'; // <-- 1. Uvezen Script
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'Wireish | Omnichannel AI Chatbot Integration',
  description: 'Automate customer communication across Website, Instagram, and WhatsApp with intelligent AI agents. 24/7 support, lead generation, and instant sales.',
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
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <Navbar />
        <main className="relative flex flex-col min-h-screen">
          {children}
        </main>
        <Footer />

        {/* 2. Voiceflow Chat Widget Skripta */}
        <Script
          id="voiceflow-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(d, t) {
                var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
                v.onload = function() {
                  window.voiceflow.chat.load({
                    verify: { projectID: '6ab17309b5c99d6f94fb35d9' },
                    url: 'https://general-runtime.voiceflow.com',
                    voice: {
                      url: "https://runtime-api.voiceflow.com"
                    }
                  });
                }
                v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
              })(document, 'script');
            `,
          }}
        />
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}