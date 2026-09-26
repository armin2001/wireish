import { NextResponse } from 'next/server';
import { bookingSchema, CHANNEL_OPTIONS, GOAL_OPTIONS, labelFor, VOLUME_OPTIONS, type ApiError } from '@/lib/schema';
import { parseDoc, summarizeDoc } from '@/lib/canvas/model';
import { intlLocale, LOCALE_META } from '@/lib/i18n/config';
import { format as fill } from '@/lib/i18n/format';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { HOST_TIME_ZONE, isBookableSlot, isValidTimeZone, MEETING_MINUTES } from '@/lib/availability';
import { buildIcs } from '@/lib/ics';
import {
  BOOKING_FROM,
  BOOKING_REPLY_TO,
  clientIp,
  devDetail,
  getResend,
  MAIL_FROM,
  MAIL_TO,
  MailConfigError,
  rateLimit,
  renderEmail,
  singleLine,
} from '@/lib/server/mail';

/*
 * Books a demo: validates, re-checks the slot against business rules, emails the team
 * (with an .ics attached) and sends the visitor a confirmation.
 *
 * Note: nothing is stored, so two people can pick the same slot. To prevent that, check
 * and write busy times here (Google Calendar API, Cal.com, or a small database table).
 */
const fail = (body: ApiError, status: number) => NextResponse.json(body, { status });

export async function POST(req: Request) {
  if (!rateLimit(`book:${clientIp(req)}`)) return fail({ error: 'rate_limited' }, 429);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail({ error: 'bad_request' }, 400);
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return fail({ error: 'invalid', fieldErrors: parsed.error.flatten().fieldErrors }, 422);
  const data = parsed.data;
  if (data.hp) {
    console.warn('[book-demo] spam trap field was filled; booking dropped without sending');
    return NextResponse.json({ ok: true, confirmationSent: false });
  }

  const start = new Date(data.slotStart);
  if (!isBookableSlot(start)) {
    return fail({ error: 'slot_taken' }, 409);
  }

  const visitorZone = isValidTimeZone(data.timeZone) ? data.timeZone : 'UTC';
  const format = (timeZone: string, locale: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short', timeZone }).format(start);

  const ics = buildIcs({
    uid: `demo-${start.getTime()}-${crypto.randomUUID()}@wireish.com`,
    start,
    durationMinutes: MEETING_MINUTES,
    title: `Wireish demo: ${singleLine(data.company)}`,
    description: `Demo call between Wireish and ${singleLine(data.name)} (${data.email}).`,
  });
  const attachment = { filename: 'wireish-demo.ics', content: Buffer.from(ics, 'utf-8') };
  const channels = data.channels.map((c) => labelFor(CHANNEL_OPTIONS, c)).join(', ');
  // The canvas map arrives as structured data: re-validate it and describe it in English for the team.
  const doc = data.blueprint ? parseDoc(data.blueprint) : null;
  const mapSummary = doc?.nodes.length ? summarizeDoc(doc).join('\n').slice(0, 2000) : '';

  // The visitor's confirmation (email and calendar file) is written in the language they booked in.
  const t = await getDictionary(data.locale);
  const visitorIcs = buildIcs({
    uid: `demo-${start.getTime()}-${crypto.randomUUID()}@wireish.com`,
    start,
    durationMinutes: MEETING_MINUTES,
    title: t.booking.done.eventTitle,
    description: t.booking.done.eventBody,
  });
  const visitorAttachment = { filename: 'wireish-demo.ics', content: Buffer.from(visitorIcs, 'utf-8') };
  const visitorChannels = data.channels.map((c) => t.channels[c]).join(', ');

  try {
    const resend = getResend();
    const team = await resend.emails.send({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: data.email,
      subject: `Demo: ${singleLine(data.name)} (${singleLine(data.company)}), ${format(HOST_TIME_ZONE, 'bs-BA')}`,
      attachments: [attachment],
      html: renderEmail({
        heading: 'Nova rezervacija demo poziva',
        rows: [
          ['Termin', `${format(HOST_TIME_ZONE, 'bs-BA')} (${HOST_TIME_ZONE})`],
          ['Kod klijenta', `${format(visitorZone, 'en-GB')} (${visitorZone})`],
          ['Ime', data.name],
          ['Email', data.email],
          ['Kompanija', data.company],
          ['Telefon', data.phone || 'Nije uneseno'],
          ['Kanali', channels],
          ['Mjesečni obim', labelFor(VOLUME_OPTIONS, data.volume)],
          ['Cilj', labelFor(GOAL_OPTIONS, data.goal)],
          ['Jezik stranice', LOCALE_META[data.locale].english],
        ],
        sections: [
          ['Napomene', data.notes],
          ['Mapa sa canvasa', mapSummary],
        ],
      }),
    });
    if (team.error) {
      console.error('[book-demo] Resend rejected the team email', team.error);
      return fail({ error: 'send_failed', detail: devDetail(team.error) }, 502);
    }

    // Visitor confirmation is best-effort: the booking already reached the team.
    let confirmationSent = false;
    try {
      const visitor = await resend.emails.send({
        from: BOOKING_FROM,
        replyTo: BOOKING_REPLY_TO,
        to: [data.email],
        subject: t.booking.email.subject,
        attachments: [visitorAttachment],
        html: renderEmail({
          heading: t.booking.email.subject,
          lang: LOCALE_META[data.locale].htmlLang,
          intro: fill(t.booking.email.intro, { name: data.name }),
          rows: [
            [t.booking.email.when, `${format(visitorZone, intlLocale(data.locale))} (${visitorZone})`],
            [t.booking.email.length, fill(t.booking.email.lengthValue, { n: MEETING_MINUTES })],
            [t.booking.email.channels, visitorChannels],
          ],
        }),
      });
      confirmationSent = !visitor.error;
      if (visitor.error) console.warn('[book-demo] visitor confirmation failed', visitor.error);
    } catch (err) {
      console.warn('[book-demo] visitor confirmation failed', err);
    }

    return NextResponse.json({ ok: true, confirmationSent });
  } catch (err) {
    console.error(err instanceof MailConfigError ? '[book-demo] RESEND_API_KEY is missing' : '[book-demo] send failed', err);
    return fail({ error: 'send_failed', detail: devDetail(err) }, 500);
  }
}
