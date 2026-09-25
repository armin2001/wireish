'use client';

/*
 * Animated route transitions for the App Router without touching Next internals.
 *
 *   click TransitionLink → curtain covers (~0.3s) → router.push → pathname changes
 *   → curtain reveals → idle
 *
 * Back/forward and plain <Link>s skip the curtain and get app/template.tsx's enter
 * animation instead. Reduced-motion users get instant navigation.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { BRAND } from '@/lib/brand';

type Phase = 'idle' | 'covering' | 'covered';

const TransitionContext = createContext<((href: string) => void) | null>(null);

/** Programmatic navigation with the curtain (falls back to plain push). */
export function useTransitionRouter() {
  const navigate = useContext(TransitionContext);
  const router = useRouter();
  return useCallback((href: string) => (navigate ? navigate(href) : router.push(href)), [navigate, router]);
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('idle');
  const [origin, setOrigin] = useState<string | null>(null);
  const target = useRef<string | null>(null);
  const safety = useRef<number | undefined>(undefined);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.assign(url.href);
        return;
      }
      const next = url.pathname + url.search + url.hash;
      if (reduceMotion || phase !== 'idle' || url.pathname === window.location.pathname) {
        router.push(next);
        return;
      }
      target.current = next;
      setOrigin(window.location.pathname);
      setPhase('covering');
    },
    [phase, reduceMotion, router],
  );

  // Derived, not stored: once the router lands on a new path, the curtain lifts.
  const arrived = phase === 'covered' && pathname !== origin;
  const variant = phase === 'covering' || (phase === 'covered' && !arrived) ? 'cover' : phase === 'idle' ? 'rest' : 'reveal';

  const onAnimationComplete = (definition: unknown) => {
    if (definition === 'cover' && phase === 'covering' && target.current) {
      setPhase('covered');
      router.push(target.current);
      // If the route never changes (error, same path), lift the curtain anyway.
      safety.current = window.setTimeout(() => setOrigin(null), 3500);
    } else if (definition === 'reveal') {
      window.clearTimeout(safety.current);
      target.current = null;
      setPhase('idle');
    }
  };

  useEffect(() => () => window.clearTimeout(safety.current), []);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <motion.div
        aria-hidden
        initial={false}
        animate={variant}
        variants={{
          rest: { clipPath: 'inset(100% 0% 0% 0%)', transition: { duration: 0 } },
          cover: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.34, ease: [0.65, 0, 0.35, 1] } },
          reveal: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] } },
        }}
        onAnimationComplete={onAnimationComplete}
        className="fixed inset-0 z-[100] grid place-items-center bg-night"
        style={{ pointerEvents: phase === 'idle' ? 'none' : 'auto' }}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="curtain-wire" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={BRAND.signal} />
              <stop offset="0.5053" stopColor={BRAND.iris} />
              <stop offset="1" stopColor={BRAND.charge} />
            </linearGradient>
          </defs>
          <motion.path
            d="M -5 70 C 30 70, 35 30, 105 30"
            fill="none"
            stroke="url(#curtain-wire)"
            strokeWidth={2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ pathLength: variant === 'cover' ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <motion.div
          initial={false}
          animate={{ opacity: variant === 'cover' ? 1 : 0, scale: variant === 'cover' ? 1 : 0.94 }}
          transition={{ duration: 0.3 }}
        >
          <Logo height={30} />
        </motion.div>
      </motion.div>
    </TransitionContext.Provider>
  );
}

type LinkProps = ComponentProps<typeof Link>;

/** Drop-in replacement for next/link that plays the page transition. */
export function TransitionLink({ href, onClick, target, ...rest }: LinkProps) {
  const navigate = useContext(TransitionContext);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !navigate || typeof href !== 'string') return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (target && target !== '_self') return;
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
    event.preventDefault();
    navigate(href);
  };

  return <Link href={href} target={target} onClick={handleClick} {...rest} />;
}
