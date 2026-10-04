import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { HideOnRoutes } from '@/components/layout/HideOnRoutes';
import { TransitionLink } from '@/components/layout/PageTransition';
import { ButtonLink } from '@/components/ui/Button';
import { Glow } from '@/components/ui/Glow';
import { Logo } from '@/components/ui/Logo';
import { Reveal } from '@/components/ui/Reveal';
import { OPEN_ROLES } from '@/lib/careers';
import { DEMO_HREF, SITE } from '@/lib/content';
import type { Dictionary } from '@/lib/i18n/dictionaries/en';

/**
 * Pages that already end on their own call to action (or are one): the footer's big CTA
 * would repeat it, or pitch a demo to someone looking for a job.
 */
const NO_CTA_ROUTES = ['/book-a-demo', '/contact', '/careers'];

/** Server component: gets the dictionary from the layout; only the CTA's wrappers run on the client. */
export function Footer({ t }: { t: Dictionary }) {
  const hiring = OPEN_ROLES.length > 0;
  const columns = [
    {
      title: t.footer.product,
      links: [
        { href: '/services', label: t.nav.services },
        { href: '/#demo', label: t.footer.liveDemo },
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
    <footer className="relative isolate overflow-hidden bg-night px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <HideOnRoutes routes={NO_CTA_ROUTES}>
        <Reveal className="mx-auto mb-20 max-w-6xl pt-8">
          <div className="glass-raised relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12 md:py-24">
            <div className="wire-line absolute inset-x-0 top-0" aria-hidden />
            <Glow
              className="-top-40 left-1/2 -z-10 h-120 w-[min(760px,120%)] -translate-x-1/2"
              gradient="var(--gradient-wire)"
              blur={110}
              opacity={0.45}
            />
            <Glow className="-bottom-48 -right-24 -z-10 h-100 w-100" gradient="var(--gradient-pulse)" blur={110} opacity={0.3} />
            <div
              aria-hidden
              className="dot-grid pointer-events-none absolute inset-0 -z-10 mask-[radial-gradient(ellipse_60%_70%_at_50%_30%,#000_20%,transparent_75%)]"
            />

            <h2 className="mx-auto max-w-3xl font-display text-[clamp(2.25rem,5.2vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
              {t.footer.cta.title}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist">{t.footer.cta.body}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <ButtonLink href={DEMO_HREF} size="lg">
                {t.common.bookDemo}
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="secondary">
                {t.common.sendMessage}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </HideOnRoutes>

      <div className="relative mx-auto max-w-6xl border-t border-white/6 pt-16">
        <div className="wire-line absolute inset-x-0 -top-px opacity-40" aria-hidden />
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
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
                    className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/3 text-mist transition-[color,border-color,box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:border-charge/50 hover:text-white hover:shadow-[0_0_24px_-6px_rgb(90_65_253/0.5)] active:scale-95"
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

        <div className="mt-14 flex flex-col gap-2 border-t border-white/6 pt-6 text-xs text-haze sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} Wireish. {t.footer.rights}
          </p>
          <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-white">
            {SITE.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
