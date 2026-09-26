import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { TransitionLink } from '@/components/layout/PageTransition';
import { Logo } from '@/components/ui/Logo';
import { OPEN_ROLES } from '@/lib/careers';
import { DEMO_HREF, SITE } from '@/lib/content';
import type { Dictionary } from '@/lib/i18n/dictionaries/en';

/** Server component: gets the dictionary from the layout, ships no JavaScript of its own. */
export function Footer({ t }: { t: Dictionary }) {
  const hiring = OPEN_ROLES.length > 0;
  const columns = [
    {
      title: t.footer.product,
      links: [
        { href: '/services', label: t.nav.services },
        { href: '/#how-it-works', label: t.footer.howItWorks },
        { href: '/canvas', label: t.nav.canvas },
        { href: '/pricing', label: t.nav.pricing },
        { href: '/#faq', label: t.footer.faq },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { href: '/team', label: t.footer.team },
        { href: '/careers', label: t.footer.careers, badge: hiring ? t.footer.hiring : undefined },
        { href: '/contact', label: t.nav.contact },
        { href: DEMO_HREF, label: t.common.bookDemo },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { href: '/privacy', label: t.footer.privacy },
        { href: '/terms', label: t.footer.terms },
      ],
    },
  ];
  const social = [
    { href: SITE.instagram, label: t.footer.instagram, Icon: FaInstagram },
    { href: SITE.linkedin, label: t.footer.linkedin, Icon: FaLinkedin },
    { href: SITE.x, label: t.footer.x, Icon: FaXTwitter },
  ];

  return (
    <footer className="relative border-t border-white/[0.06] bg-night px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-16">
      <div className="wire-line absolute inset-x-0 top-0 opacity-40" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
        <div className="max-w-xs sm:col-span-2 md:col-span-1">
          <TransitionLink href="/" aria-label={t.nav.home} className="inline-block rounded-lg">
            <Logo height={28} />
          </TransitionLink>
          <p className="mt-5 text-sm leading-relaxed text-mist">{t.footer.tagline}</p>
          <ul className="mt-6 flex gap-2">
            {social.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-mist transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-signal/50 hover:text-white active:scale-95"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-semibold text-white">{column.title}</h2>
            <ul className="mt-4 space-y-1 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <TransitionLink
                    href={link.href}
                    className="inline-flex min-h-9 items-center gap-2 text-mist transition-colors hover:text-white"
                  >
                    {link.label}
                    {'badge' in link && link.badge && (
                      <span className="rounded-full border border-signal/30 bg-signal/10 px-2 py-0.5 text-[11px] font-medium text-signal">
                        {link.badge}
                      </span>
                    )}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-2 border-t border-white/[0.06] pt-6 text-xs text-haze sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} Wireish. {t.footer.rights}
        </p>
        <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-white">
          {SITE.email}
        </a>
      </div>
    </footer>
  );
}
