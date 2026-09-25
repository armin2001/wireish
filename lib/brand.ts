/**
 * Wireish brand palette, extracted from the gradient stops in public/logo.svg.
 * The CSS mirror lives in app/globals.css (@theme + :root). Keep both in sync:
 * Three.js and SVG attributes need raw hex values, Tailwind needs CSS tokens.
 */
export const BRAND = {
  night: '#050716',
  deep: '#0A0E24',
  raised: '#111736',
  white: '#FFFFFF',
  signal: '#15C3FF', // SVGID_2 stop 0
  ion: '#21A9FD', // .st2 flat fill
  azure: '#0F9EFD', // SVGID_4 stop 48.41%
  beam: '#1CA2FD', // SVGID_1 stop 100%
  current: '#2A66F7', // SVGID_1 / SVGID_4 stop 0
  iris: '#4A50FC', // SVGID_2 stop 50.53%
  charge: '#5A41FD', // SVGID_2 stop 100%
  pulse: '#6334FC', // SVGID_3 stop 50.53%
  conduit: '#322FE6', // SVGID_3 stop 100%
  spark: '#9C29FE', // SVGID_3 stop 0
} as const;

/** The four gradients defined in logo.svg, exact stops in order. */
export const LOGO_GRADIENTS = {
  /** SVGID_2, the main "W" stroke. Direction: top-left to bottom-right (135deg). */
  wire: ['#15C3FF', '#4A50FC', '#5A41FD'],
  /** SVGID_3, the right node. Direction: top-right to bottom-left (225deg). */
  pulse: ['#9C29FE', '#6334FC', '#322FE6'],
  /** SVGID_1, the short inner stroke (225deg). */
  current: ['#2A66F7', '#2894FD', '#1CA2FD'],
  /** SVGID_4, the left node (315deg). */
  link: ['#2A66F7', '#0F9EFD', '#2775FF'],
} as const satisfies Record<string, readonly [string, string, string]>;

export type GradientStops = readonly [string, string, string];
