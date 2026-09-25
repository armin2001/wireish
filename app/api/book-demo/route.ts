import { NextResponse } from 'next/server';
import { bookingSchema, CHANNEL_OPTIONS, GOAL_OPTIONS, labelFor, VOLUME_OPTIONS } from '@/lib/schema';
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
export async function POST(req: Request) {
  if (!rateLimit(`book:${clientIp(req)}`)) {
    return NextResponse.json({ error: 'Too many booking attempts from this connection. Try again in a few minutes.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'The request was not valid JSON.' }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Some booking details need attention.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  const data = parsed.data;
  if (data.hp) {
    console.warn('[book-demo] spam trap field was filled; booking dropped without sending');
    return NextResponse.json({ ok: true, confirmationSent: false });
  }

  const start = new Date(data.slotStart);
  if (!isBookableSlot(start)) {
    return NextResponse.json({ error: 'That time is no longer available. Pick another slot.' }, { status: 409 });
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
        ],
        sections: [
          ['Napomene', data.notes],
          ['Mapa sa canvasa', data.blueprint],
        ],
      }),
    });
    if (team.error) {
      console.error('[book-demo] Resend rejected the team email', team.error);
      return NextResponse.json({ error: `The booking service is not responding.${devDetail(team.error)}` }, { status: 502 });
    }

    // Visitor confirmation is best-effort: the booking already reached the team.
    let confirmationSent = false;
    try {
      const visitor = await resend.emails.send({
        from: BOOKING_FROM,
        replyTo: BOOKING_REPLY_TO,
        to: [data.email],
        subject: 'Your Wireish demo is booked',
        attachments: [attachment],
        html: renderEmail({
          heading: 'Your Wireish demo is booked',
          intro: `Thanks, ${data.name}. We will email you the video call link before the meeting. The attached file adds it to your calendar.`,
          rows: [
            ['When', `${format(visitorZone, 'en-GB')} (${visitorZone})`],
            ['Length', `${MEETING_MINUTES} minutes`],
            ['Channels', channels],
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
    return NextResponse.json({ error: `The booking service is not responding.${devDetail(err)}` }, { status: 500 });
  }
}
