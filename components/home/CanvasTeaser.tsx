import { ButtonLink } from '@/components/ui/Button';
import { BRAND } from '@/lib/brand';
import type { Dictionary } from '@/lib/i18n/dictionaries/en';

/** Lightweight SVG preview of the canvas. No JS, no three.js: the real editor lives on /canvas. */
const NODES = [
  { id: 'web', x: 24, y: 40, tone: 'wire' },
  { id: 'ig', x: 24, y: 150, tone: 'wire' },
  { id: 'wa', x: 24, y: 260, tone: 'wire' },
  { id: 'agent', x: 250, y: 150, tone: 'pulse' },
  { id: 'crm', x: 476, y: 90, tone: 'link' },
  { id: 'team', x: 476, y: 210, tone: 'link' },
] as const;

const W = 160;
const H = 52;
const EDGES: Array<[string, string]> = [
  ['web', 'agent'],
  ['ig', 'agent'],
  ['wa', 'agent'],
  ['agent', 'crm'],
  ['agent', 'team'],
];

const TONES = {
  wire: [BRAND.signal, BRAND.iris, BRAND.charge],
  pulse: [BRAND.spark, BRAND.pulse, BRAND.conduit],
  link: [BRAND.current, BRAND.azure, '#2775FF'],
} as const;

function edgePath(ax: number, ay: number, bx: number, by: number) {
  const dx = Math.max(40, (bx - ax) / 2);
  return `M ${ax} ${ay} C ${ax + dx} ${ay}, ${bx - dx} ${by}, ${bx} ${by}`;
}

const LABEL_MAX = 98; // px available for the label inside a node

/** Rough rendered width at 13px: CJK glyphs are square, Latin ones about half as wide. */
function textWidth(text: string) {
  let em = 0;
  for (const ch of text) em += /[\u1100-\u11ff\u3000-\u9fff\uac00-\ud7af\uff00-\uffef]/.test(ch) ? 1 : 0.56;
  return em * 13;
}

export default function CanvasTeaser({ t }: { t: Dictionary }) {
  const copy = t.home.teaser;
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
  return (
    <section className="px-6 py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="max-w-md">
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-[-0.025em] text-white md:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-mist">
            {copy.body}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-haze">
            {copy.note}
          </p>
          <ButtonLink href="/canvas" variant="secondary" className="mt-8">
            {copy.cta}
          </ButtonLink>
        </div>

        <div className="glass-raised dot-grid relative overflow-hidden rounded-3xl">
          <svg viewBox="0 0 660 340" className="block h-auto w-full" role="img" aria-label={copy.alt}>
            <defs>
              {Object.entries(TONES).map(([tone, stops]) => (
                <linearGradient key={tone} id={`teaser-${tone}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor={stops[0]} />
                  <stop offset="0.5053" stopColor={stops[1]} />
                  <stop offset="1" stopColor={stops[2]} />
                </linearGradient>
              ))}
              <linearGradient id="teaser-edge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={BRAND.signal} />
                <stop offset="1" stopColor={BRAND.charge} />
              </linearGradient>
            </defs>

            {EDGES.map(([from, to]) => {
              const a = byId[from];
              const b = byId[to];
              const d = edgePath(a.x + W, a.y + H / 2, b.x, b.y + H / 2);
              return (
                <g key={`${from}-${to}`}>
                  <path d={d} fill="none" stroke="url(#teaser-edge)" strokeWidth={2} />
                  <path
                    d={d}
                    fill="none"
                    stroke="white"
                    strokeOpacity={0.6}
                    strokeWidth={2}
                    strokeDasharray="2 14"
                    strokeLinecap="round"
                    className="animate-wire-flow"
                  />
                </g>
              );
            })}

            {NODES.map((n) => (
              <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
                <rect width={W} height={H} rx={14} fill="#0E1330" stroke="#ffffff" strokeOpacity={0.12} />
                <rect x={10} y={10} width={32} height={32} rx={9} fill={`url(#teaser-${n.tone})`} />
                <text
                  x={54}
                  y={31}
                  fill="#fff"
                  fontSize={13}
                  fontWeight={600}
                  style={{ fontFamily: 'var(--font-sans)' }}
                  {...(textWidth(copy.nodes[n.id]) > LABEL_MAX
                    ? { textLength: LABEL_MAX, lengthAdjust: 'spacingAndGlyphs' as const }
                    : {})}
                >
                  {copy.nodes[n.id]}
                </text>
                {n.id !== 'crm' && n.id !== 'team' && <circle cx={W} cy={H / 2} r={5} fill={BRAND.signal} stroke="#050716" strokeWidth={2} />}
                {(n.id === 'agent' || n.id === 'crm' || n.id === 'team') && <circle cx={0} cy={H / 2} r={5} fill={BRAND.charge} stroke="#050716" strokeWidth={2} />}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
