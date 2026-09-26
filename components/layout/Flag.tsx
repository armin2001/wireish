import type { FlagCode } from '@/lib/i18n/config';
import { cn } from '@/lib/cn';

/*
 * Inline SVG flags. Emoji flags don't render on Windows (they show as "BA", "DE"), so every
 * flag is drawn here: no network requests, crisp at any size, identical on every platform.
 * Details (coats of arms, star counts) are simplified to what reads at 20 px.
 */
const FLAGS: Record<FlagCode, React.ReactNode> = {
  gb: (
    <>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0l60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0l60 40M60 0L0 40" stroke="#C8102E" strokeWidth="3" />
      <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="12" />
      <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="7" />
    </>
  ),
  ba: (
    <>
      <rect width="60" height="40" fill="#002395" />
      <path d="M16 0h28v40z" fill="#FECB00" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <circle key={i} cx={11 + i * 3.5} cy={1 + i * 5} r="1.4" fill="#fff" />
      ))}
    </>
  ),
  de: (
    <>
      <rect width="60" height="40" fill="#FFCE00" />
      <rect width="60" height="26.67" fill="#DD0000" />
      <rect width="60" height="13.33" fill="#000" />
    </>
  ),
  fr: (
    <>
      <rect width="60" height="40" fill="#EF4135" />
      <rect width="40" height="40" fill="#fff" />
      <rect width="20" height="40" fill="#0055A4" />
    </>
  ),
  es: (
    <>
      <rect width="60" height="40" fill="#AA151B" />
      <rect y="10" width="60" height="20" fill="#F1BF00" />
    </>
  ),
  se: (
    <>
      <rect width="60" height="40" fill="#006AA7" />
      <path d="M0 20h60M22 0v40" stroke="#FECC02" strokeWidth="8" />
    </>
  ),
  jp: (
    <>
      <rect width="60" height="40" fill="#fff" />
      <circle cx="30" cy="20" r="12" fill="#BC002D" />
    </>
  ),
  kr: (
    <>
      <rect width="60" height="40" fill="#fff" />
      <g transform="rotate(33.69 30 20)">
        <circle cx="30" cy="20" r="10" fill="#0047A0" />
        <path d="M20 20a10 10 0 0 1 20 0a5 5 0 0 1-10 0a5 5 0 0 0-10 0z" fill="#CD2E3A" />
      </g>
      {/* The four trigrams, simplified to solid bars. */}
      {[
        [13.5, 9, 33.69 + 90],
        [46.5, 31, 33.69 + 90],
        [46.5, 9, -33.69 + 90],
        [13.5, 31, -33.69 + 90],
      ].map(([x, y, angle]) => (
        <g key={`${x}-${y}`} transform={`rotate(${angle} ${x} ${y})`} fill="#000">
          <rect x={x - 5} y={y - 3.4} width="10" height="1.6" />
          <rect x={x - 5} y={y - 0.8} width="10" height="1.6" />
          <rect x={x - 5} y={y + 1.8} width="10" height="1.6" />
        </g>
      ))}
    </>
  ),
};

export function Flag({ code, className }: { code: FlagCode; className?: string }) {
  return (
    <svg
      viewBox="0 0 60 40"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
      className={cn('inline-block h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-white/15', className)}
    >
      {FLAGS[code]}
    </svg>
  );
}
