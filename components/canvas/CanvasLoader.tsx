'use client';

import dynamic from 'next/dynamic';
import { useI18n } from '@/lib/i18n/client';

function CanvasLoading() {
  const { t } = useI18n();
  return (
    <div className="dot-grid absolute inset-0 grid place-items-center">
      <p className="animate-pulse text-sm text-haze">{t.canvas.loading}</p>
    </div>
  );
}

// Client-only: the canvas reads localStorage and measures the DOM. Its code ships in the
// /canvas route chunk only, so no other page pays for it.
const CanvasWorkspace = dynamic(() => import('./CanvasWorkspace'), {
  ssr: false,
  loading: () => <CanvasLoading />,
});

export function CanvasLoader() {
  return <CanvasWorkspace />;
}
