import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

interface GlowProps {
  /** Position, size and stacking of the lit box: what the blurred shape's classes were, minus the blur. */
  className?: string;
  /** One of the logo gradients from globals.css, e.g. 'var(--gradient-wire)'. */
  gradient: string;
  /** Softness in px, as the radius of `blur-[…]`. The light spills 2.5 × this past the box. */
  blur: number;
  opacity: number;
  /** `round` fades as an ellipse fitted to the box, `rect` as a card. */
  shape?: 'round' | 'rect';
}

/**
 * Soft light in logo colors, without a blur filter (globals.css, "Glows", says why).
 * The light spills past the box, so put it inside an ancestor that clips horizontally
 * (overflow-hidden or overflow-x-clip); otherwise phones widen the page to fit it.
 */
export function Glow({ className, gradient, blur, opacity, shape = 'round' }: GlowProps) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute', className)}>
      <div
        className={shape === 'rect' ? 'glow-rect' : 'glow-round'}
        // Opacity sits on the masked element itself, so Safari paints both through one offscreen layer.
        style={{ '--glow-blur': `${blur}px`, backgroundImage: gradient, opacity } as CSSProperties}
      />
    </div>
  );
}
