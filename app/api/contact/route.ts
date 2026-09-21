import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicijalizacija sa tvojim API ključem (koji ćemo staviti u .env)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    // Slanje maila na tvoju adresu
    const data = await resend.emails.send({
      from: 'Wireish Demo <onboarding@resend.dev>', // Kasnije možeš verifikovati svoju domenu
      to: ['armin@wireish.com'],
      subject: `New Demo Request from ${name} (${company || 'No Company'})`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0f0f13; color: #ffffff; border-radius: 10px;">
          <h2 style="color: #8b5cf6;">New Demo / Contact Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <p><strong>Message / Details:</strong></p>
          <blockquote style="background: rgba(255,255,255,0.05); padding: 15px; border-left: 4px solid #8b5cf6; margin: 10px 0;">
            ${message || 'No additional message provided.'}
          </blockquote>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}