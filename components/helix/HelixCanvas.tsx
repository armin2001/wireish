'use client';

/*
 * Wireframe double helix drawn on a native 2D canvas: no three.js chunk, and every line
 * is a real 1px stroke.
 *
 * Coordinates ("helix units"): origin at the centre of the helix, +x right, +y up,
 * +z toward the viewer. Every frame each point goes through:
 *
 *   1. strand equation     θ = t·turns·2π + spin + strand·strandOffset
 *                          x = radius·cos θ,  y = (t − ½)·length,  z = radius·sin θ
 *   2. roll   (around z)   the resting lean, plus a little sway from the pointer's x
 *   3. yaw    (around y)   pointer x
 *   4. pitch  (around x)   pointer y
 *   5. perspective         p = cameraDistance / (cameraDistance − z)
 *   6. screen              sx = cx + x·p·scale,  sy = cy − y·p·scale
 *
 * `scale` (CSS px per helix unit) is set from the canvas height alone, so the helix keeps
 * its proportions at any size. The backing store is CSS size × devicePixelRatio, so lines
 * stay sharp and are never stretched.
 *
 * Performance: the loop stops when the canvas is off-screen or the tab is hidden, and
 * reduced motion draws one still frame (redrawn on resize). Stroke styles and glow sprites
 * are built once per mount, so a frame allocates almost nothing.
 */
import { useEffect, useRef } from 'react';
import { useReducedMotion, useSpring } from 'framer-motion';
import { BRAND } from '@/lib/brand';
import { cn } from '@/lib/cn';

export interface HelixConfig {
  /** Amplitude: distance from the axis to each strand, in helix units. */
  radius: number;
  /** Length of the helix along its axis, in helix units. */
  length: number;
  /** Frequency: full twists over the whole length. */
  turns: number;
  /** Phase gap between the two strands, in radians. π is symmetric; ~0.8π gives DNA's major and minor grooves. */
  strandOffset: number;
  /** Line samples per turn. Higher is smoother but costs more strokes. */
  samplesPerTurn: number;
  /** Base-pair struts per turn (real B-DNA has about 10.5). */
  rungsPerTurn: number;
  /** Spin around the helix's own axis, in radians per second. Negative reverses it. */
  rotationSpeed: number;
  /** Resting lean of the axis, in radians. Negative leans the top to the right. */
  tilt: number;
  /** Largest pointer tilt on each axis, in radians (0.21 ≈ 12°). */
  maxParallax: number;
  /** Camera distance in helix units. Smaller gives stronger perspective; keep it well above length / 2. */
  cameraDistance: number;
  /** Projected length as a fraction of canvas height. Above 1, the faded ends run off-screen. */
  heightFill: number;
  /** Horizontal position of the axis as a fraction of the width, on wide (≥ 1024px) and narrow canvases. */
  anchorX: { wide: number; narrow: number };
  /** Part of the length at each end that fades out (0–0.5). */
  endFade: number;
  /** Strand colors (hex), one per strand. */
  colors: readonly [string, string];
  /** Line opacity at the back and at the front of the helix. */
  lineAlpha: readonly [number, number];
  /** Node radius in CSS px at the back and at the front. */
  nodeRadius: readonly [number, number];
}

export const HELIX_DEFAULTS: HelixConfig = {
  radius: 1.3,
  length: 10,
  turns: 3,
  strandOffset: Math.PI * 0.8,
  samplesPerTurn: 64,
  rungsPerTurn: 10.5,
  rotationSpeed: 0.32,
  tilt: -0.26,
  maxParallax: 0.21,
  cameraDistance: 12,
  heightFill: 1.12,
  anchorX: { wide: 0.7, narrow: 0.5 },
  endFade: 0.2,
  colors: [BRAND.signal, BRAND.iris],
  lineAlpha: [0.07, 0.72],
  nodeRadius: [0.7, 2.3],
};

/** Parallax spring: slightly over-damped, so the helix eases into place without wobbling. */
const PARALLAX_SPRING = { stiffness: 50, damping: 16, mass: 1 };
/** Pointer x also sways the lean by this share of the yaw. Yaw alone mostly reads as extra spin. */
const ROLL_SWAY = 0.35;
/** Resolution of the cached stroke styles along the back-to-front depth range. */
const DEPTH_STEPS = 48;
/** Nodes deeper than this get no glow. */
const GLOW_FROM = 0.55;
const MAX_DPR = 2;
const TAU = Math.PI * 2;

type RGB = readonly [number, number, number];
/** Cosine and sine of the roll, yaw and pitch angles for one frame. */
interface Rotation {
  cr: number;
  sr: number;
  cy: number;
  sy: number;
  cp: number;
  sp: number;
}

const toRgb = (hex: string): RGB => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (edge: number, v: number) => {
  const x = clamp01(v / edge);
  return x * x * (3 - 2 * x);
};
/** Opacity along the length: 0 at both tips, 1 in the middle. */
const endFade = (t: number, edge: number) => (edge <= 0 ? 1 : smoothstep(edge, t) * smoothstep(edge, 1 - t));

/** Soft round glow, drawn with 'lighter' behind front nodes. Built once, then stamped with drawImage. */
function createGlowSprite([r, g, b]: RGB): HTMLCanvasElement {
  const size = 64;
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = size;
  const ctx = sprite.getContext('2d');
  if (!ctx) return sprite;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, `rgba(${r},${g},${b},0.85)`);
  gradient.addColorStop(0.3, `rgba(${r},${g},${b},0.28)`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return sprite;
}

/** Everything a frame needs that only changes with the config: colors, sprites, buffers. */
function prepare(config: HelixConfig) {
  const rgb = config.colors.map(toRgb) as [RGB, RGB];
  const step = (i: number) => i / DEPTH_STEPS;
  const lineStyles = rgb.map(([r, g, b]) =>
    Array.from({ length: DEPTH_STEPS + 1 }, (_, i) => {
      // Depth is eased (^1.4) so the back half fades away faster than the front half brightens.
      const alpha = lerp(config.lineAlpha[0], config.lineAlpha[1], step(i) ** 1.4);
      return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
    }),
  );
  const nodeStyles = rgb.map(([r, g, b]) =>
    Array.from({ length: DEPTH_STEPS + 1 }, (_, i) => {
      // Front nodes move toward white and full opacity: the "closer = brighter" cue.
      const d = step(i);
      const mix = d * 0.7;
      const alpha = lerp(0.22, 1, d);
      return `rgba(${Math.round(lerp(r, 255, mix))},${Math.round(lerp(g, 255, mix))},${Math.round(lerp(b, 255, mix))},${alpha.toFixed(3)})`;
    }),
  );
  const samples = Math.max(2, Math.ceil(config.turns * config.samplesPerTurn) + 1);
  const rungs = Math.max(2, Math.round(config.turns * config.rungsPerTurn) + 1);
  return {
    lineStyles,
    nodeStyles,
    glows: rgb.map(createGlowSprite),
    samples,
    rungs,
    // Projected points, 3 floats each: screen x, screen y, depth (0 = back, 1 = front).
    strandPoints: [new Float32Array(samples * 3), new Float32Array(samples * 3)],
    rungPoints: [new Float32Array(rungs * 3), new Float32Array(rungs * 3)],
  };
}

interface HelixCanvasProps {
  className?: string;
  /** Overrides for HELIX_DEFAULTS. Pass a stable object (module constant or useMemo): a new one restarts the scene. */
  config?: Partial<HelixConfig>;
}

export default function HelixCanvas({ className, config }: HelixCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Kept outside the effect so a restart (new config, reduced-motion toggle) doesn't jump the rotation.
  const spinRef = useRef(0.6);
  const reduceMotion = useReducedMotion() ?? false;
  const yaw = useSpring(0, PARALLAX_SPRING);
  const pitch = useSpring(0, PARALLAX_SPRING);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const cfg: HelixConfig = { ...HELIX_DEFAULTS, ...config };
    const res = prepare(cfg);
    const view = { width: 0, height: 0, dpr: 1, cx: 0, cy: 0, scale: 1 };

    // ── Sizing ──────────────────────────────────────────────────────────────
    const resize = () => {
      view.width = canvas.clientWidth;
      view.height = canvas.clientHeight;
      view.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.max(1, Math.round(view.width * view.dpr));
      canvas.height = Math.max(1, Math.round(view.height * view.dpr));
      // Draw in CSS pixels; the transform maps them onto the high-density backing store.
      ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
      view.cx = view.width * (view.width >= 1024 ? cfg.anchorX.wide : cfg.anchorX.narrow);
      view.cy = view.height / 2;
      view.scale = (view.height * cfg.heightFill) / cfg.length;
    };

    // ── Projection: steps 2–6 from the header ───────────────────────────────
    const project = (out: Float32Array, o: number, x: number, y: number, z: number, rot: Rotation) => {
      const x1 = x * rot.cr - y * rot.sr; // roll
      const y1 = x * rot.sr + y * rot.cr;
      const x2 = x1 * rot.cy + z * rot.sy; // yaw
      const z2 = -x1 * rot.sy + z * rot.cy;
      const y3 = y1 * rot.cp - z2 * rot.sp; // pitch
      const z3 = y1 * rot.sp + z2 * rot.cp;
      const p = cfg.cameraDistance / (cfg.cameraDistance - z3);
      out[o] = view.cx + x2 * p * view.scale;
      out[o + 1] = view.cy - y3 * p * view.scale;
      out[o + 2] = clamp01(0.5 + z3 / (2 * cfg.radius));
    };

    /** Step 1: a point on strand `s` at parameter t ∈ [0, 1], projected into `out`. */
    const strandPoint = (out: Float32Array, o: number, t: number, s: number, spin: number, rot: Rotation) => {
      const theta = t * cfg.turns * TAU + spin + s * cfg.strandOffset;
      project(out, o, cfg.radius * Math.cos(theta), (t - 0.5) * cfg.length, cfg.radius * Math.sin(theta), rot);
    };

    const styleIndex = (depth: number) => Math.round(depth * DEPTH_STEPS);
    const axis = new Float32Array(6); // projected axis ends

    // ── One frame ───────────────────────────────────────────────────────────
    const draw = (spin: number, yawAngle: number, pitchAngle: number) => {
      const roll = cfg.tilt + yawAngle * ROLL_SWAY;
      const rot: Rotation = {
        cr: Math.cos(roll),
        sr: Math.sin(roll),
        cy: Math.cos(yawAngle),
        sy: Math.sin(yawAngle),
        cp: Math.cos(pitchAngle),
        sp: Math.sin(pitchAngle),
      };

      for (let s = 0; s < 2; s++) {
        for (let i = 0; i < res.samples; i++) strandPoint(res.strandPoints[s], i * 3, i / (res.samples - 1), s, spin, rot);
        for (let k = 0; k < res.rungs; k++) strandPoint(res.rungPoints[s], k * 3, k / (res.rungs - 1), s, spin, rot);
      }

      ctx.clearRect(0, 0, view.width, view.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';

      // Centre axis, dashed like a construction line, with a tick at every full turn.
      project(axis, 0, 0, -cfg.length / 2, 0, rot);
      project(axis, 3, 0, cfg.length / 2, 0, rot);
      const ax = axis[3] - axis[0];
      const ay = axis[4] - axis[1];
      const axisLength = Math.hypot(ax, ay) || 1;
      const nx = -ay / axisLength; // unit normal to the axis on screen
      const ny = ax / axisLength;
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(167,174,203,0.14)'; // --color-mist
      ctx.setLineDash([2, 7]);
      ctx.beginPath();
      ctx.moveTo(axis[0], axis[1]);
      ctx.lineTo(axis[3], axis[4]);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let turn = 0; turn <= cfg.turns; turn++) {
        const t = turn / cfg.turns;
        ctx.globalAlpha = endFade(t, cfg.endFade);
        if (ctx.globalAlpha < 0.01) continue;
        const px = lerp(axis[0], axis[3], t);
        const py = lerp(axis[1], axis[4], t);
        ctx.beginPath();
        ctx.moveTo(px - nx * 6, py - ny * 6);
        ctx.lineTo(px + nx * 6, py + ny * 6);
        ctx.stroke();
      }

      // Base-pair struts: each half in its own strand's color, with a small gap in the middle
      // where the pair meets.
      for (let k = 0; k < res.rungs; k++) {
        const fade = endFade(k / (res.rungs - 1), cfg.endFade);
        if (fade < 0.01) continue;
        const a = res.rungPoints[0];
        const b = res.rungPoints[1];
        const o = k * 3;
        const mx = (a[o] + b[o]) / 2;
        const my = (a[o + 1] + b[o + 1]) / 2;
        ctx.globalAlpha = fade * 0.6;
        for (let s = 0; s < 2; s++) {
          const p = res.rungPoints[s];
          ctx.strokeStyle = res.lineStyles[s][styleIndex(p[o + 2])];
          ctx.beginPath();
          ctx.moveTo(p[o], p[o + 1]);
          ctx.lineTo(lerp(p[o], mx, 0.84), lerp(p[o + 1], my, 0.84));
          ctx.stroke();
        }
      }

      // Strands: one stroke per segment, so opacity can follow depth along the curve.
      for (let s = 0; s < 2; s++) {
        const p = res.strandPoints[s];
        for (let i = 0; i < res.samples - 1; i++) {
          const fade = endFade((i + 0.5) / (res.samples - 1), cfg.endFade);
          if (fade < 0.01) continue;
          const o = i * 3;
          ctx.globalAlpha = fade;
          ctx.strokeStyle = res.lineStyles[s][styleIndex((p[o + 2] + p[o + 5]) / 2)];
          ctx.beginPath();
          ctx.moveTo(p[o], p[o + 1]);
          ctx.lineTo(p[o + 3], p[o + 4]);
          ctx.stroke();
        }
      }

      // Nodes at every strut end: back half first, then front half with a glow on top.
      for (let pass = 0; pass < 2; pass++) {
        for (let s = 0; s < 2; s++) {
          const p = res.rungPoints[s];
          for (let k = 0; k < res.rungs; k++) {
            const o = k * 3;
            const depth = p[o + 2];
            if (pass === 0 ? depth >= 0.5 : depth < 0.5) continue;
            const fade = endFade(k / (res.rungs - 1), cfg.endFade);
            if (fade < 0.01) continue;
            const x = p[o];
            const y = p[o + 1];

            if (depth > GLOW_FROM) {
              const strength = (depth - GLOW_FROM) / (1 - GLOW_FROM);
              const size = 10 + 18 * strength;
              ctx.globalCompositeOperation = 'lighter';
              ctx.globalAlpha = fade * strength * 0.75;
              ctx.drawImage(res.glows[s], x - size / 2, y - size / 2, size, size);
              ctx.globalCompositeOperation = 'source-over';
            }

            ctx.globalAlpha = fade;
            ctx.fillStyle = res.nodeStyles[s][styleIndex(depth)];
            ctx.beginPath();
            ctx.arc(x, y, lerp(cfg.nodeRadius[0], cfg.nodeRadius[1], depth), 0, TAU);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawCurrent = () => draw(spinRef.current, yaw.get(), pitch.get());

    // ── Loop: runs only while the canvas is on-screen and the tab is visible ─
    let raf = 0;
    let running = false;
    let last = 0;
    let inView = true;

    const frame = (now: number) => {
      // Capped so a long pause (tab switch, debugger) never makes the helix jump.
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      if (Math.min(window.devicePixelRatio || 1, MAX_DPR) !== view.dpr) resize(); // moved to another screen
      spinRef.current = (spinRef.current + cfg.rotationSpeed * dt) % TAU;
      drawCurrent();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => (inView && document.visibilityState === 'visible' ? start() : stop());

    resize();
    drawCurrent();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      drawCurrent(); // repaint right away, so there's no blank frame when the loop is stopped
    });
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    intersection.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    sync();

    // ── Pointer parallax (mouse only: touch would jerk the scene while scrolling) ─
    const controller = new AbortController();
    if (reduceMotion) {
      yaw.jump(0);
      pitch.jump(0);
    } else {
      window.addEventListener(
        'pointermove',
        (e) => {
          if (e.pointerType !== 'mouse') return;
          const px = (e.clientX / window.innerWidth) * 2 - 1; // −1 (left) … 1 (right)
          const py = (e.clientY / window.innerHeight) * 2 - 1; // −1 (top) … 1 (bottom)
          // The helix turns to face the pointer: that side moves away from the viewer.
          yaw.set(Math.max(-1, Math.min(1, px)) * cfg.maxParallax);
          pitch.set(Math.max(-1, Math.min(1, py)) * cfg.maxParallax);
        },
        { passive: true, signal: controller.signal },
      );
      // Pointer left the window (no element to move into): ease back to rest.
      window.addEventListener(
        'pointerout',
        (e) => {
          if (e.relatedTarget) return;
          yaw.set(0);
          pitch.set(0);
        },
        { passive: true, signal: controller.signal },
      );
    }

    return () => {
      stop();
      controller.abort();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [config, reduceMotion, yaw, pitch]);

  return <canvas ref={canvasRef} aria-hidden className={cn('absolute inset-0 block h-full w-full', className)} />;
}
