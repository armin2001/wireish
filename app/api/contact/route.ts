import { NextResponse } from 'next/server';
import { contactSchema, labelFor, TOPIC_OPTIONS } from '@/lib/schema';
import { clientIp, devDetail, getResend, MAIL_FROM, MAIL_TO, MailConfigError, rateLimit, renderEmail, singleLine } from '@/lib/server/mail';

/*
 * Fixes vs. the previous handler:
 *  - input is validated with the shared zod schema (was trusted as-is)
 *  - every value is HTML-escaped before it goes into the email (was injectable)
 *  - Resend's { error } result is checked (send() doesn't throw, so failures used to report success)
 *  - Resend is created lazily, rate limited per IP, with a honeypot for bots
 */
export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`)) {
    return NextResponse.json({ error: 'Too many messages from this connection. Try again in a few minutes.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'The request was not valid JSON.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Some fields need attention.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
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
        ],
        sections: [['Poruka', data.message]],
      }),
    });
    if (error) {
      console.error('[contact] Resend rejected the email', error);
      return NextResponse.json({ error: `The message service is not responding.${devDetail(error)}` }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err instanceof MailConfigError ? '[contact] RESEND_API_KEY is missing' : '[contact] send failed', err);
    return NextResponse.json({ error: `The message service is not responding.${devDetail(err)}` }, { status: 500 });
  }
}
