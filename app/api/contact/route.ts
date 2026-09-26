import { NextResponse } from 'next/server';
import { LOCALE_META } from '@/lib/i18n/config';
import { contactRequestSchema, labelFor, TOPIC_OPTIONS, type ApiError } from '@/lib/schema';
import { clientIp, devDetail, getResend, MAIL_FROM, MAIL_TO, MailConfigError, rateLimit, renderEmail, singleLine } from '@/lib/server/mail';

/*
 * Contact form handler:
 *  - input is validated with the shared zod schema; field errors are dictionary keys
 *  - every value is HTML-escaped before it goes into the email
 *  - Resend's { error } result is checked (send() doesn't throw)
 *  - Resend is created lazily, rate limited per IP, with a honeypot for bots
 * Errors are codes (ApiErrorCode); the form turns them into text in the visitor's language.
 */
const fail = (body: ApiError, status: number) => NextResponse.json(body, { status });

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`)) return fail({ error: 'rate_limited' }, 429);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail({ error: 'bad_request' }, 400);
  }

  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) return fail({ error: 'invalid', fieldErrors: parsed.error.flatten().fieldErrors }, 422);

  const data = parsed.data;
  if (data.hp) {
    console.warn('[contact] spam trap field was filled; submission dropped without sending');
    return NextResponse.json({ ok: true }); // bot: pretend it worked
  }

  try {
    const { error } = await getResend().emails.send({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: data.email,
      subject: `Novi upit: ${singleLine(data.name)}${data.company ? ` (${singleLine(data.company)})` : ''}`,
      html: renderEmail({
        heading: 'Novi upit sa kontakt forme',
        rows: [
          ['Tema', labelFor(TOPIC_OPTIONS, data.topic)],
          ['Ime', data.name],
          ['Email', data.email],
          ['Kompanija', data.company || 'Nije uneseno'],
          ['Telefon', data.phone || 'Nije uneseno'],
          ['Jezik stranice', LOCALE_META[data.locale].english],
        ],
        sections: [['Poruka', data.message]],
      }),
    });
    if (error) {
      console.error('[contact] Resend rejected the email', error);
      return fail({ error: 'send_failed', detail: devDetail(error) }, 502);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err instanceof MailConfigError ? '[contact] RESEND_API_KEY is missing' : '[contact] send failed', err);
    return fail({ error: 'send_failed', detail: devDetail(err) }, 500);
  }
}
