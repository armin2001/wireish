'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Mail } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n/client';
import { format } from '@/lib/i18n/format';

export interface TeamCardData {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  email?: string;
  linkedin?: string;
}

const AVATAR_GRADIENTS = ['var(--gradient-wire)', 'var(--gradient-pulse)', 'var(--gradient-current)', 'var(--gradient-link)'];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

/**
 * Team cards: a swipeable scroll-snap carousel on phones (with position dots), a grid from
 * md up. Cards tilt toward the pointer in 3D on devices that hover.
 */
export function TeamShowcase({ members }: { members: TeamCardData[] }) {
  const { t } = useI18n();
  const trackRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);

  // Which card is centered in the mobile carousel (drives the dots).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(cards.indexOf(entry.target as HTMLElement));
        }
      },
      { root: track, threshold: 0.6 },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [members.length]);

  const scrollTo = (index: number) => {
    const card = trackRef.current?.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <section aria-label={t.team.title} className="mt-14">
      <ul
        ref={trackRef}
        className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-6 px-6 pb-4 [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
      >
        {members.map((member, i) => (
          <li key={member.id} className="w-[84%] shrink-0 snap-center sm:w-[60%] md:w-auto">
            <TiltCard member={member} gradient={AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} />
          </li>
        ))}
      </ul>

      {members.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-3 md:hidden">
          <span className="text-xs text-haze">{t.team.swipe}</span>
          <div className="flex gap-1.5">
            {members.map((member, i) => (
              <button
                key={member.id}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={member.name}
                aria-current={i === current ? 'true' : undefined}
                className="grid h-6 w-6 place-items-center"
              >
                <span
                  className={cn(
                    'block h-1.5 rounded-full transition-all duration-300',
                    i === current ? 'w-5 bg-signal shadow-glow-signal' : 'w-1.5 bg-white/25',
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function TiltCard({ member, gradient }: { member: TeamCardData; gradient: string }) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(420px circle at ${x} ${y}, rgb(21 195 255 / 0.10), transparent 45%)`,
  );

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduceMotion || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="h-full [perspective:1000px]">
      <motion.article
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileTap={{ scale: 0.985 }}
        className="glass wire-border group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 [--wire-opacity:0] [--wire-play:paused] hover:border-white/15 hover:[--wire-opacity:1] hover:[--wire-play:running]"
      >
        {/* Light that follows the pointer across the glass. */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
        />
        <div className="flex items-center gap-4" style={{ transform: 'translateZ(40px)' }}>
          <span className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl text-lg font-semibold text-white shadow-lg">
            {member.photo ? (
              <Image src={member.photo} alt="" fill sizes="64px" className="object-cover" />
            ) : (
              <>
                <span aria-hidden className="absolute inset-0" style={{ backgroundImage: gradient }} />
                <span aria-hidden className="relative font-display tracking-wide">
                  {initials(member.name)}
                </span>
              </>
            )}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold text-white">{member.name}</h3>
            <p className="mt-0.5 text-sm text-signal">{member.role}</p>
          </div>
        </div>

        <p className="mt-6 flex-1 leading-relaxed text-mist" style={{ transform: 'translateZ(24px)' }}>
          {member.bio}
        </p>

        {(member.email || member.linkedin) && (
          <div className="mt-6 flex gap-2" style={{ transform: 'translateZ(30px)' }}>
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                aria-label={format(t.team.contactPerson, { name: member.name })}
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-mist transition-[color,border-color,transform] duration-200 hover:border-signal/50 hover:text-white active:scale-95"
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={format(t.team.linkedinPerson, { name: member.name })}
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-mist transition-[color,border-color,transform] duration-200 hover:border-signal/50 hover:text-white active:scale-95"
              >
                <FaLinkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </motion.article>
    </div>
  );
}
