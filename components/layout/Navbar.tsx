'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type PanInfo,
  type Transition,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { LanguageGrid, LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { TransitionLink } from '@/components/layout/PageTransition';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { Magnetic } from '@/components/ui/Magnetic';
import { cn } from '@/lib/cn';
import { DEMO_HREF, NAV_LINKS } from '@/lib/content';
import { OPEN_ROLES } from '@/lib/careers';
import { useI18n } from '@/lib/i18n/client';
import { splitLocale } from '@/lib/i18n/config';
import { HOVER_SPRING } from '@/lib/motion';

const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

/** Entrance timing (ms): the pill drops first, then logo → links → actions follow. */
const ENTRANCE = { logo: 220, firstLink: 280, perLink: 60, actions: 600 };

/** Hamburger bars, 6px apart; open, the outer two cross into an ✕ and the middle one fades. */
const BAR_SPRING: Transition = { type: 'spring', stiffness: 420, damping: 30 };
const BARS = [
  { key: 'top', className: 'right-0.5', closed: { y: -6, rotate: 0, opacity: 1 }, open: { y: 0, rotate: 45, opacity: 1 } },
  { key: 'middle', className: 'right-2', closed: { y: 0, rotate: 0, opacity: 1 }, open: { y: 0, rotate: 0, opacity: 0 } },
  { key: 'bottom', className: 'right-0.5', closed: { y: 6, rotate: 0, opacity: 1 }, open: { y: 0, rotate: -45, opacity: 1 } },
] as const;

export default function Navbar() {
  const { t } = useI18n();
  const path = splitLocale(usePathname()).path;
  const { scrollY, scrollYProgress } = useScroll();
  // Page progress, smoothed so the wire along the pill glides instead of stepping with the wheel.
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 16));

  // While the drawer is open: lock page scroll, close on Escape, keep Tab inside the drawer.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    const toggle = toggleRef.current;
    drawerRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  const close = () => setOpen(false);

  // Swipe right (or flick) to dismiss.
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 90 || info.velocity.x > 500) close();
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <motion.nav
        aria-label={t.nav.main}
        // Start at the target width: animating from the computed `none` is impossible and warns.
        initial={false}
        animate={{ maxWidth: scrolled ? 1000 : 1152 }}
        transition={{ type: 'spring', stiffness: 260, damping: 32 }}
        // Glass from the first pixel, barely tinted over the hero; denser once content scrolls beneath it.
        // Desktop is a 1fr / auto / 1fr grid so the links sit at the true center, whatever the logo and actions measure.
        // The animated wire border only runs while the pointer is over the pill or a keyboard user is inside it.
        className={cn(
          'pointer-events-auto flex h-16 w-full animate-nav-drop items-center justify-between gap-3 rounded-full border pl-5 pr-2 backdrop-blur-md backdrop-saturate-150 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:pr-3.5',
          'transition-[background-color,border-color,box-shadow] duration-300',
          'wire-border [--wire-opacity:0] [--wire-play:paused] hover:[--wire-opacity:1] hover:[--wire-play:running] has-focus-visible:[--wire-opacity:1] has-focus-visible:[--wire-play:running]',
          scrolled || open
            ? 'border-white/10 bg-night/60 shadow-[0_20px_60px_-24px_rgb(0_0_0/0.8)] backdrop-blur-xl'
            : 'border-white/8 bg-white/4',
        )}
      >
        <TransitionLink
          href="/"
          onClick={close}
          aria-label={t.nav.home}
          className="group relative shrink-0 animate-nav-item justify-self-start rounded-full p-1"
          style={{ animationDelay: `${ENTRANCE.logo}ms` }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-2 inset-y-1 -z-10 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"
            style={{ backgroundImage: 'var(--gradient-wire)' }}
          />
          <motion.span className="block" whileHover={{ scale: 1.05 }} transition={HOVER_SPRING}>
            <Logo height={24} priority />
          </motion.span>
        </TransitionLink>

        <LayoutGroup id="nav">
          <ul className="hidden items-center gap-0.5 lg:flex" onMouseLeave={() => setHovered(null)}>
            {NAV_LINKS.map((link, i) => {
              const active = isActive(path, link.href);
              const label = t.nav[link.key];
              return (
                <li
                  key={link.href}
                  className="relative animate-nav-item"
                  style={{ animationDelay: `${ENTRANCE.firstLink + i * ENTRANCE.perLink}ms` }}
                >
                  <TransitionLink
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    onMouseEnter={() => setHovered(link.href)}
                    onFocus={() => setHovered(link.href)}
                    className={cn(
                      'group relative z-10 block whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition-colors duration-200',
                      active ? 'text-white' : 'text-mist hover:text-white focus-visible:text-white',
                    )}
                  >
                    {/* Text roll: the label slides up and an identical copy rises into its place. */}
                    <span className="relative block overflow-hidden">
                      <span className="block transition-transform duration-300 ease-wire group-hover:-translate-y-full group-focus-visible:-translate-y-full">
                        {label}
                      </span>
                      <span
                        aria-hidden
                        className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-wire group-hover:translate-y-0 group-focus-visible:translate-y-0"
                      >
                        {label}
                      </span>
                    </span>
                  </TransitionLink>
                  {hovered === link.href && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-white/7 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08)]"
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

        <div
          className="flex animate-nav-item items-center gap-1.5 justify-self-end"
          style={{ animationDelay: `${ENTRANCE.actions}ms` }}
        >
          <LanguageSwitcher className="hidden sm:block" />
          <Magnetic className="hidden lg:inline-flex">
            <ButtonLink href={DEMO_HREF} size="sm">
              {t.common.bookDemo}
            </ButtonLink>
          </Magnetic>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="grid h-11 w-11 place-items-center rounded-full text-white transition-[background-color,scale] hover:bg-white/7 active:scale-90 lg:hidden"
          >
            <span aria-hidden className="relative block h-5 w-5">
              {BARS.map((bar) => (
                <motion.span
                  key={bar.key}
                  className={cn('absolute left-0.5 top-1/2 -mt-px h-0.5 rounded-full bg-current', bar.className)}
                  initial={false}
                  animate={open ? bar.open : bar.closed}
                  transition={BAR_SPRING}
                />
              ))}
            </span>
          </button>
        </div>

        {/* Reading progress: a wire along the pill's bottom edge, on the straight part between the rounded ends. */}
        <motion.span
          aria-hidden
          className={cn(
            'pointer-events-none absolute -bottom-px left-8 right-8 h-px origin-left rounded-full shadow-glow-signal transition-opacity duration-500',
            scrolled ? 'opacity-100' : 'opacity-0',
          )}
          style={{ scaleX: progress, backgroundImage: 'var(--gradient-spectrum)' }}
        />
      </motion.nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              aria-hidden
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-auto fixed inset-0 -z-10 bg-night/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              key="drawer"
              ref={drawerRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={t.nav.main}
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.04, right: 0.7 }}
              onDragEnd={onDragEnd}
              initial={{ x: '105%' }}
              animate={{ x: 0 }}
              exit={{ x: '105%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="glass-overlay pointer-events-auto fixed bottom-3 right-3 top-[calc(max(0.75rem,env(safe-area-inset-top))+76px)] flex w-[min(360px,calc(100vw-24px))] touch-pan-y flex-col overflow-y-auto overscroll-contain rounded-3xl p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
            >
              <span aria-hidden className="absolute left-1.5 top-1/2 h-12 w-1 -translate-y-1/2 rounded-full bg-white/15" />
              <ul className="flex flex-col">
                {NAV_LINKS.map((link, i) => {
                  const active = isActive(path, link.href);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i + 0.06 }}
                    >
                      <TransitionLink
                        href={link.href}
                        onClick={close}
                        aria-current={active ? 'page' : undefined}
                        className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-lg text-white transition-[background-color,transform] duration-150 hover:bg-white/6 active:scale-[0.98] aria-[current=page]:bg-white/6"
                      >
                        {t.nav[link.key]}
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-glow-signal" />}
                      </TransitionLink>
                    </motion.li>
                  );
                })}
                <motion.li initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <TransitionLink
                    href="/careers"
                    onClick={close}
                    aria-current={isActive(path, '/careers') ? 'page' : undefined}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-mist transition-colors hover:bg-white/6 hover:text-white aria-[current=page]:text-white"
                  >
                    <span className="flex items-center gap-2">
                      {t.footer.careers}
                      {OPEN_ROLES.length > 0 && (
                        <span className="rounded-full bg-signal/15 px-2 py-0.5 text-[11px] font-medium text-signal">{t.footer.hiring}</span>
                      )}
                    </span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </TransitionLink>
                </motion.li>
              </ul>

              <div className="my-3 h-px bg-white/[0.07]" />
              <LanguageGrid onPick={close} />

              <div className="mt-auto pt-4">
                <ButtonLink href={DEMO_HREF} onClick={close} size="lg" className="w-full">
                  {t.common.bookDemo}
                </ButtonLink>
                <p className="mt-3 text-center text-xs text-haze">{t.nav.swipeHint}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
