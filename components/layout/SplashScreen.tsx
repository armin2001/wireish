'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { useI18n } from '@/lib/i18n/client';
import { splitLocale } from '@/lib/i18n/config';
import { SPLASH_KEY } from './splash-boot';

const MIN_MS = 1100; // long enough to read the brand, short enough not to annoy
const MAX_MS = 4200; // never hold the page longer than this, whatever is still loading
const PALETTE = [
  [21, 195, 255], // signal #15C3FF
  [42, 102, 247], // current #2A66F7
  [90, 65, 253], // charge #5A41FD
  [156, 41, 254], // spark #9C29FE
] as const;

function seenThisSession(): boolean {
  if (document.documentElement.dataset.splash === 'done') return true;
  try {
    return Boolean(sessionStorage.getItem(SPLASH_KEY));
  } catch {
    return false;
  }
}
const noopSubscribe = () => () => {};

/**
 * First-visit splash: logo, a particle sphere that assembles as the app loads, and a
 * percentage driven by real work (fonts, page load, the 3D scene chunk) plus a gentle time
 * floor so it never looks stuck. Server-rendered so it covers the very first paint; the
 * server snapshot below keeps hydration consistent, then the client decides to skip it.
 */
export function SplashScreen() {
  const seen = useSyncExternalStore(noopSubscribe, seenThisSession, () => false);
  const [finished, setFinished] = useState(false);
  const path = splitLocale(usePathname()).path;

  const finish = () => {
    document.documentElement.dataset.splash = 'done';
    try {
      sessionStorage.setItem(SPLASH_KEY, '1');
    } catch {
      /* private mode: the splash simply plays again next time */
    }
    setFinished(true);
  };

  if (seen || finished) return null;
  // The home hero and the booking panel render the 3D scene: fetch it while the splash plays.
  return <SplashOverlay preloadScene={path === '/' || path === '/book-a-demo'} onDone={finish} />;
}

function SplashOverlay({ preloadScene, onDone }: { preloadScene: boolean; onDone: () => void }) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const start = performance.now();
    let completed = 0;
    let raf = 0;
    let last = start;
    let shown = 0;
    let lastStage = 0;
    let lastAria = -1;

    // ── Real loading work ───────────────────────────────────────────────────
    const tasks: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener('load', resolve, { once: true, signal: controller.signal })),
    ];
    if (preloadScene) tasks.push(import('@/components/three/BrandScene').catch(() => undefined));
    tasks.forEach((task) => task.then(() => (completed += 1)));

    // ── Particle sphere (2D canvas, so nothing heavy loads before the app) ───
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const count = window.innerWidth < 640 ? 180 : 300;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const points = Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const scatter = 1.6 + Math.random() * 1.8;
      return {
        x: Math.cos(theta) * r,
        y,
        z: Math.sin(theta) * r,
        // Where the point starts before it assembles into the sphere.
        sx: (Math.random() - 0.5) * scatter,
        sy: (Math.random() - 0.5) * scatter,
        sz: (Math.random() - 0.5) * scatter,
        delay: Math.random() * 0.35,
      };
    });
    let size = 0;
    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { signal: controller.signal });

    const colorAt = (v: number) => {
      const pos = Math.min(0.999, Math.max(0, v)) * (PALETTE.length - 1);
      const i = Math.floor(pos);
      const f = pos - i;
      const a = PALETTE[i];
      const b = PALETTE[i + 1];
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
    };

    const draw = (time: number, assembled: number) => {
      if (!ctx || !size) return;
      ctx.clearRect(0, 0, size, size);
      const spin = reduceMotion ? 0.6 : time * 0.00032;
      const tilt = 0.38;
      const cos = Math.cos(spin);
      const sin = Math.sin(spin);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const radius = size * 0.34;
      const cx = size / 2;
      const cy = size / 2;
      ctx.globalCompositeOperation = 'lighter';
      for (const p of points) {
        const k = Math.min(1, Math.max(0, (assembled - p.delay) / (1 - p.delay)));
        const e = 1 - Math.pow(1 - k, 3);
        const x0 = p.sx + (p.x - p.sx) * e;
        const y0 = p.sy + (p.y - p.sy) * e;
        const z0 = p.sz + (p.z - p.sz) * e;
        // rotate around Y, then tilt around X
        const x1 = x0 * cos - z0 * sin;
        const z1 = x0 * sin + z0 * cos;
        const y2 = y0 * cosT - z1 * sinT;
        const z2 = y0 * sinT + z1 * cosT;
        const depth = (z2 + 1.8) / 3.6; // 0 (back) … 1 (front)
        const perspective = 1.9 / (2.6 - z2);
        const [r, g, b] = colorAt((y2 + 1) / 2);
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${(0.18 + depth * 0.82) * (0.35 + 0.65 * e)})`;
        ctx.beginPath();
        ctx.arc(cx + x1 * radius * perspective, cy + y2 * radius * perspective, 0.6 + depth * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    // ── One loop drives progress, text and particles ────────────────────────
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const elapsed = now - start;
      const allDone = completed === tasks.length;
      const target =
        (allDone && elapsed >= MIN_MS) || elapsed >= MAX_MS
          ? 1
          : Math.min(0.94, 0.08 + 0.6 * (completed / tasks.length) + 0.3 * Math.min(1, elapsed / 1800));
      shown += (target - shown) * (1 - Math.exp(-dt / 140)); // frame-rate independent easing
      if (target === 1 && shown > 0.995) shown = 1;

      const percent = Math.round(shown * 100);
      if (percentRef.current) percentRef.current.textContent = `${percent}`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown})`;
      if (meterRef.current && percent !== lastAria && percent % 10 === 0) {
        lastAria = percent;
        meterRef.current.setAttribute('aria-valuenow', String(percent));
      }
      const nextStage = shown >= 1 ? 2 : shown >= 0.45 ? 1 : 0;
      if (nextStage !== lastStage) {
        lastStage = nextStage;
        setStage(nextStage);
      }
      draw(now, shown);

      if (shown >= 1) {
        setLeaving(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      controller.abort();
    };
  }, [preloadScene, reduceMotion]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!leaving && (
        <motion.div
          id="splash"
          key="splash"
          exit={
            reduceMotion
              ? { opacity: 0, transition: { duration: 0.25 } }
              : { clipPath: 'circle(0% at 50% 50%)', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }
          }
          initial={false}
          style={{ clipPath: 'circle(150% at 50% 50%)' }}
          className="fixed inset-0 z-[200] grid place-items-center bg-night"
        >
          <div aria-hidden className="dot-grid absolute inset-0 opacity-40" />
          <div className="relative flex flex-col items-center">
            <div className="relative h-[min(72vw,320px)] w-[min(72vw,320px)]">
              <div
                aria-hidden
                className="absolute inset-[18%] rounded-full opacity-40 blur-3xl"
                style={{ backgroundImage: 'var(--gradient-spectrum)', animation: 'splash-pulse 2.4s ease-in-out infinite' }}
              />
              <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0 grid place-items-center">
                <Logo height={30} priority />
              </div>
            </div>

            <div
              ref={meterRef}
              role="progressbar"
              aria-label={t.loader.label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={0}
              className="mt-6 w-56"
            >
              <div className="flex items-baseline justify-between text-xs text-haze">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={stage}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                  >
                    {t.loader.stages[stage]}
                  </motion.span>
                </AnimatePresence>
                <span className="font-display text-sm font-semibold tabular-nums text-white">
                  <span ref={percentRef}>0</span>%
                </span>
              </div>
              <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
                <span
                  ref={barRef}
                  className="block h-full origin-left rounded-full shadow-glow-signal"
                  style={{ backgroundImage: 'var(--gradient-wire)', transform: 'scaleX(0)' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
