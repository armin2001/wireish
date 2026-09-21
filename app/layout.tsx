import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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
      </body>
    </html>
  );
}