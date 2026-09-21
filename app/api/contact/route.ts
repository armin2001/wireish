import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicijalizacija Resend-a sa tvojim ključem iz .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 1. Ovdje sada izvlačimo i 'phone' i 'company' iz zahtjeva
    const { name, email, company, phone, message } = await req.json();

    // 2. Sastavljamo i šaljemo email
    const data = await resend.emails.send({
      from: 'Wireish <contact@wireish.com>', // Zadrži ovo ili stavi svoju domenu ako si je verifikovao
      to: ['armin@wireish.com'], // <-- OBAVEZNO OVDJE UPIŠI SVOJ EMAIL!
      subject: `Novi Demo Upit - ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #333;">Novi lead sa Wireish platforme! 🚀</h2>
          <hr style="border: 1px solid #eaeaea; margin-bottom: 20px;" />
          
          <p><strong>Ime:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Kompanija:</strong> ${company ? company : 'Nije uneseno'}</p>
          <p><strong>Telefon:</strong> ${phone ? phone : 'Nije uneseno'}</p>
          
          <br/>
          <h3 style="color: #555;">Detalji projekta / Poruka:</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; color: #333;">
            ${message}
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Greška pri slanju' }, { status: 500 });
  }
}