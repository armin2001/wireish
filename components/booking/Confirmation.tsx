'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarPlus, Download } from 'lucide-react';
import { Button, ButtonLink, buttonStyles } from '@/components/ui/Button';
import { SuccessMark } from '@/components/ui/SuccessMark';
import { MEETING_MINUTES } from '@/lib/availability';
import { buildIcs, googleCalendarUrl, type CalendarEvent } from '@/lib/ics';
import { useI18n } from '@/lib/i18n/client';
import { intlLocale } from '@/lib/i18n/config';
import { format } from '@/lib/i18n/format';

interface ConfirmationProps {
  slot: string;
  timeZone: string;
  email: string;
  confirmationSent: boolean;
  onBookAnother: () => void;
}

export function Confirmation({ slot, timeZone, email, confirmationSent, onBookAnother }: ConfirmationProps) {
  const { t, locale } = useI18n();
  const d = t.booking.done;
  const event: CalendarEvent = useMemo(
    () => ({
      uid: `demo-${slot}-${email}@wireish.com`,
      start: new Date(slot),
      durationMinutes: MEETING_MINUTES,
      title: d.eventTitle,
      description: d.eventBody,
    }),
    [slot, email, d.eventTitle, d.eventBody],
  );

  const when = new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(new Date(slot));

  const downloadIcs = () => {
    const url = URL.createObjectURL(new Blob([buildIcs(event)], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wireish-demo.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Release the blob once the download has been handed to the browser.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center py-8 text-center"
      role="status"
    >
      <SuccessMark />
      <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-0.02em] text-white">{d.title}</h2>
      <p className="mt-3 text-lg text-white">{when}</p>
      <p className="text-sm text-haze">{timeZone.replace(/_/g, ' ')}</p>
      <p className="mt-5 max-w-sm text-mist">
        {format(confirmationSent ? d.sent : d.notSent, { email })}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={downloadIcs}>
          <Download className="h-4 w-4" aria-hidden /> {d.ics}
        </Button>
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noreferrer"
          className={buttonStyles({ variant: 'secondary' })}
        >
          <CalendarPlus className="h-4 w-4" aria-hidden /> {d.google}
        </a>
      </div>
      <div className="mt-6 flex gap-5 text-sm">
        <button type="button" onClick={onBookAnother} className="text-mist hover:text-white">
          {d.another}
        </button>
        <ButtonLink href="/" variant="ghost" size="sm">
          {t.common.backHome}
        </ButtonLink>
      </div>
    </motion.div>
  );
}
