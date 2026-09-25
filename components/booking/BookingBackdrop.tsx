'use client';

import dynamic from 'next/dynamic';
import { useIdle } from '@/lib/hooks';

const BrandScene = dynamic(() => import('@/components/three/BrandScene'), { ssr: false });

/** Ambient version of the brand scene behind the booking flow. Loads when idle, never takes input. */
export function BookingBackdrop() {
  const idle = useIdle(2500);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] opacity-45 [mask-image:radial-gradient(70%_60%_at_60%_35%,#000_30%,transparent_80%)]"
    >
      {idle && <BrandScene variant="ambient" />}
    </div>
  );
}
