'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageSquareOff } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { TypingIndicator } from '@/components/ui/TypingIndicator';
import { cn } from '@/lib/cn';
import { DEMO_HREF } from '@/lib/content';

interface VoiceflowChatApi {
  load: (config: Record<string, unknown>) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    voiceflow?: { chat: VoiceflowChatApi };
  }
}

const PROJECT_ID = '6ab17309b5c99d6f94fb35d9';
const BUNDLE_SRC = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
/** How long to wait for the widget to draw before showing the fallback. */
const RENDER_TIMEOUT_MS = 20_000;

/*
 * The logo's charge violet (#5A41FD) as shade 500. A full palette is needed: the one set in the
 * Voiceflow dashboard outranks a local `color`, but not a local `palette`.
 */
const BRAND_PALETTE = {
  50: '#f1efff',
  100: '#e3deff',
  200: '#c8bfff',
  300: '#a898ff',
  400: '#8570fe',
  500: '#5a41fd',
  600: '#4a31e6',
  700: '#3b26bd',
  800: '#2c1d8f',
  900: '#1d1461',
};

let bundle: Promise<void> | null = null;

/** Adds the Voiceflow script once per page load; later mounts reuse it. */
function loadBundle(): Promise<void> {
  if (window.voiceflow) return Promise.resolve();
  bundle ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = BUNDLE_SRC;
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      bundle = null; // let a later mount retry
      script.remove();
      reject(new Error('Voiceflow bundle failed to load'));
    };
    document.head.appendChild(script);
  });
  return bundle;
}

type Status = 'waiting' | 'loading' | 'ready' | 'failed';

interface VoiceflowChatProps {
  /** Accessible name for the chat region. */
  label: string;
  loading: string;
  error: string;
  bookDemo: string;
  className?: string;
}

/*
 * The Wireish Voiceflow agent, rendered inline instead of as a floating launcher.
 *
 * - The script is only fetched when the section comes within 600px of the viewport.
 * - Voiceflow attaches a shadow root to the target, and an element accepts only one, so the
 *   target is an empty div React never renders into; loading and error states sit beside it.
 * - Leaving the page calls destroy(); coming back loads it into the new target.
 * - Embedded mode doesn't autostart, so a session (and its credits) only begins once a
 *   visitor actually engages.
 */
export function VoiceflowChat({ label, loading, error, bookDemo, className }: VoiceflowChatProps) {
  const target = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>('waiting');

  useEffect(() => {
    const element = target.current;
    if (!element) return;
    let cancelled = false;
    let mounted = false;
    let poll: number | undefined;

    // The widget is transparent (voiceflow.css), so the placeholder must go once it has drawn.
    const waitForRender = () => {
      const started = performance.now();
      poll = window.setInterval(() => {
        if (element.shadowRoot?.querySelector('.vfrc-chat')) {
          window.clearInterval(poll);
          setStatus('ready');
        } else if (performance.now() - started > RENDER_TIMEOUT_MS) {
          window.clearInterval(poll);
          window.voiceflow?.chat.destroy();
          mounted = false;
          setStatus('failed');
        }
      }, 150);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setStatus('loading');
        loadBundle()
          .then(() => {
            if (cancelled || !window.voiceflow) return;
            window.voiceflow.chat.load({
              verify: { projectID: PROJECT_ID },
              url: 'https://general-runtime.voiceflow.com',
              voice: { url: 'https://runtime-api.voiceflow.com' },
              render: { mode: 'embedded', target: element },
              assistant: {
                // The dashboard still says "widget" (the old corner launcher). In that mode the widget
                // reconnects a saved conversation on page load and never catches the failure, so an
                // expired one surfaced as an uncaught "Session is stale" error and left a dead chat.
                // "embed" reconnects on the visitor's next message instead, where Voiceflow ends an
                // expired conversation cleanly.
                renderMode: 'embed',
                color: BRAND_PALETTE[500],
                palette: BRAND_PALETTE,
                fontFamily: 'inherit',
                // Dark theme to match the page (public/voiceflow.css).
                stylesheet: `${window.location.origin}/voiceflow.css`,
              },
            });
            mounted = true;
            waitForRender();
          })
          .catch(() => {
            if (!cancelled) setStatus('failed');
          });
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(element);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearInterval(poll);
      if (mounted) window.voiceflow?.chat.destroy();
    };
  }, []);

  return (
    <div role="region" aria-label={label} className={cn('relative isolate overflow-hidden', className)}>
      {(status === 'waiting' || status === 'loading') && (
        <div className="absolute inset-0 -z-10 grid place-items-center">
          <p className="flex items-center gap-3 text-sm text-mist">
            <TypingIndicator />
            {loading}
          </p>
        </div>
      )}

      {status === 'failed' ? (
        <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/6 text-mist">
            <MessageSquareOff className="h-5 w-5" aria-hidden />
          </span>
          <p className="max-w-xs leading-relaxed text-mist">{error}</p>
          <ButtonLink href={DEMO_HREF}>{bookDemo}</ButtonLink>
        </div>
      ) : (
        <div ref={target} className="h-full w-full" />
      )}
    </div>
  );
}
