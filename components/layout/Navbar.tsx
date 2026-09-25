'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { TransitionLink } from '@/components/layout/PageTransition';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/cn';
import { DEMO_HREF, NAV_LINKS } from '@/lib/content';

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 16));

  // Lock page scroll and listen for Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3">
      <motion.nav
        aria-label="Main"
        animate={{ maxWidth: scrolled ? 880 : 1152 }}
        transition={{ type: 'spring', stiffness: 260, damping: 32 }}
        className={cn(
          'pointer-events-auto flex h-16 w-full items-center justify-between gap-4 rounded-full pl-5 pr-2 transition-[background-color,border-color,box-shadow] duration-300',
          scrolled || open ? 'glass-overlay' : 'border border-transparent',
        )}
      >
        <TransitionLink href="/" onClick={close} aria-label="Wireish home" className="rounded-full p-1">
          <Logo height={24} priority />
        </TransitionLink>

        <LayoutGroup id="nav">
          <ul className="hidden items-center gap-1 md:flex" onMouseLeave={() => setHovered(null)}>
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href} className="relative">
                  <TransitionLink
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    onMouseEnter={() => setHovered(link.href)}
                    onFocus={() => setHovered(link.href)}
                    className={cn(
                      'relative z-10 block rounded-full px-4 py-2 text-sm transition-colors duration-200',
                      active ? 'text-white' : 'text-mist hover:text-white',
                    )}
                  >
                    {link.label}
                  </TransitionLink>
                  {hovered === link.href && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: 'spring', stiffness: 520, damping: 40 }}
                    />
                  )}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="wire-line absolute inset-x-4 -bottom-0.5 rounded-full shadow-glow-signal"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </LayoutGroup>

        <div className="flex items-center gap-2">
          <ButtonLink href={DEMO_HREF} size="sm" className="hidden md:inline-flex">
            Book a demo
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-11 w-11 place-items-center rounded-full text-white transition-colors hover:bg-white/[0.07] active:scale-95 md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.16 }}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="glass-overlay pointer-events-auto absolute inset-x-3 top-[84px] rounded-3xl p-3 md:hidden"
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.05 }}
                >
                  <TransitionLink
                    href={link.href}
                    onClick={close}
                    aria-current={isActive(pathname, link.href) ? 'page' : undefined}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-lg text-white transition-colors hover:bg-white/[0.06] aria-[current=page]:bg-white/[0.06]"
                  >
                    {link.label}
                    {isActive(pathname, link.href) && <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-glow-signal" />}
                  </TransitionLink>
                </motion.li>
              ))}
            </ul>
            <ButtonLink href={DEMO_HREF} onClick={close} size="lg" className="mt-2 w-full">
              Book a demo
            </ButtonLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
