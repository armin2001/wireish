'use client';

import dynamic from 'next/dynamic';
import { SceneFallback } from '@/components/three/SceneFallback';
import { useIdle, useMediaQuery } from '@/lib/hooks';

// Same code-split chunk as the home hero, loaded only once the page is idle.
const BrandScene = dynamic(() => import('@/components/three/BrandScene'), {
  ssr: false,
  loading: () => <SceneFallback />,
});

/** The brand scene in a contained frame, so it decorates the page without sitting behind the form. */
export function DemoScenePanel() {
  const idle = useIdle(2500);
  // The page hides this panel below lg; don't download three.js or open a WebGL context there.
  const shown = useMediaQuery('(min-width: 1024px)');
  return (
    <figure className="overflow-hidden rounded-3xl border border-white/8 bg-night shadow-lift">
      <div className="dot-grid relative h-64">
        {idle && shown ? <BrandScene variant="ambient" /> : <SceneFallback />}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-night" />
      </div>
      <figcaption className="border-t border-white/[0.07] px-5 py-4 text-sm leading-relaxed text-mist">
        Every channel wired into one agent that routes each conversation to the right place.
      </figcaption>
    </figure>
  );
}
