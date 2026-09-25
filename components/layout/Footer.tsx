import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { TransitionLink } from '@/components/layout/PageTransition';
import { Logo } from '@/components/ui/Logo';
import { DEMO_HREF, SITE } from '@/lib/content';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/services', label: 'Services' },
      { href: '/#how-it-works', label: 'How it works' },
      { href: '/canvas', label: 'Canvas' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/contact', label: 'Contact' },
      { href: DEMO_HREF, label: 'Book a demo' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms of service' },
    ],
  },
];

const SOCIAL = [
  { href: SITE.instagram, label: 'Wireish on Instagram', Icon: FaInstagram },
  { href: SITE.linkedin, label: 'Wireish on LinkedIn', Icon: FaLinkedin },
  { href: SITE.x, label: 'Wireish on X', Icon: FaXTwitter },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/6 bg-night px-6 pb-10 pt-16">
      <div className="wire-line absolute inset-x-0 top-0 opacity-40" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
        <div className="max-w-xs">
          <TransitionLink href="/" aria-label="Wireish home" className="inline-block rounded-lg">
            <Logo height={28} />
          </TransitionLink>
          <p className="mt-5 text-sm leading-relaxed text-mist">
            AI agents that answer your customers on your website, Instagram and WhatsApp, built and run by our team.
          </p>
          <ul className="mt-6 flex gap-2">
            {SOCIAL.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-mist transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-signal/50 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-semibold text-white">{column.title}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <TransitionLink href={link.href} className="text-mist transition-colors hover:text-white">
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-2 border-t border-white/6 pt-6 text-xs text-haze sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Wireish. All rights reserved.</p>
        <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-white">
          {SITE.email}
        </a>
      </div>
    </footer>
  );
}
