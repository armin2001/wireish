import { cn } from '@/lib/cn';

/*
 * public/logo.svg has a 3000x2000 viewBox with the artwork in a thin band in the middle,
 * which is why the old navbar needed a 144px-tall image. This crops to the artwork
 * without editing the file. (Alternative: set viewBox="310 770 2380 455" in a copy.)
 */
const VIEW = { w: 3000, h: 2000 };
const CROP = { x: 310, y: 770, w: 2380, h: 455 };

interface LogoProps {
  /** Rendered height of the visible artwork, in px. */
  height?: number;
  className?: string;
  priority?: boolean;
}

export function Logo({ height = 26, className, priority = false }: LogoProps) {
  const scale = height / CROP.h;
  return (
    <span
      className={cn('relative block shrink-0 overflow-hidden', className)}
      style={{ width: Math.round(CROP.w * scale), height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local SVG, cropped by CSS; next/image adds nothing here */}
      <img
        src="/logo.svg"
        alt="Wireish"
        draggable={false}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        style={{
          position: 'absolute',
          maxWidth: 'none',
          width: VIEW.w * scale,
          height: VIEW.h * scale,
          left: -CROP.x * scale,
          top: -CROP.y * scale,
        }}
      />
    </span>
  );
}
