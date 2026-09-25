'use client';

import dynamic from 'next/dynamic';

// Client-only: the canvas reads localStorage and measures the DOM. Its code ships in the
// /canvas route chunk only, so no other page pays for it.
const CanvasWorkspace = dynamic(() => import('./CanvasWorkspace'), {
  ssr: false,
  loading: () => (
    <div className="dot-grid absolute inset-0 grid place-items-center">
      <p className="animate-pulse text-sm text-haze">Loading canvas</p>
    </div>
  ),
});

export function CanvasLoader() {
  return <CanvasWorkspace />;
}
