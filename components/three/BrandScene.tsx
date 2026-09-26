'use client';

/*
 * WebGL wrapper. Performance and memory rules:
 *  - Only mounted client-side (next/dynamic, ssr:false) and after the browser is idle.
 *  - Render loop stops ('never') when scrolled off-screen or the tab is hidden.
 *  - Reduced motion renders on demand only (a still frame).
 *  - PerformanceMonitor drops the pixel ratio on slow GPUs.
 *  - On unmount, R3F disposes the renderer, forces a WebGL context loss and disposes every
 *    object declared in JSX; resources created imperatively are disposed in WireNetwork.
 */
import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { SceneFallback } from './SceneFallback';
import { WireNetwork, type SceneLabels, type SceneVariant } from './WireNetwork';

interface BrandSceneProps {
  variant?: SceneVariant;
  className?: string;
  /** Translated channel labels shown on hover. */
  labels?: SceneLabels;
}

export default function BrandScene({ variant = 'hero', className, labels }: BrandSceneProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '120px' });
    observer.observe(el);
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const frameloop = !inView || !pageVisible ? 'never' : reduceMotion ? 'demand' : 'always';

  return (
    <div ref={wrapper} className={cn('absolute inset-0', className)} aria-hidden>
      <Canvas
        frameloop={frameloop}
        dpr={[1, dpr]}
        shadows="percentage"
        camera={{ position: [0, 0.35, 7.5], fov: 38, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        fallback={<SceneFallback />}
      >
        <PerformanceMonitor
          flipflops={3}
          onIncline={() => setDpr(1.75)}
          onDecline={() => setDpr(1)}
          onFallback={() => setDpr(1)}
        />
        <WireNetwork variant={variant} reduceMotion={reduceMotion} labels={labels} />
      </Canvas>
    </div>
  );
}
