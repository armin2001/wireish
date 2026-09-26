'use client';

import dynamic from 'next/dynamic';
import { SceneFallback } from '@/components/three/SceneFallback';
import { useIdle } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n/client';

// Same code-split chunk as the home hero, loaded only once the page is idle.
const BrandScene = dynamic(() => import('@/components/three/BrandScene'), {
  ssr: false,
  loading: () => <SceneFallback />,
});

/** The brand scene in a contained frame, so it decorates the page without sitting behind the form. */
export function DemoScenePanel() {
  const idle = useIdle(2500);
  const { t } = useI18n();
  return (
    <figure className="overflow-hidden rounded-3xl border border-white/[0.08] bg-night shadow-lift">
      <div className="dot-grid relative h-64">
        {idle ? <BrandScene variant="ambient" /> : <SceneFallback />}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-night" />
      </div>
      <figcaption className="border-t border-white/[0.07] px-5 py-4 text-sm leading-relaxed text-mist">
        {t.booking.sceneCaption}
      </figcaption>
    </figure>
  );
}
