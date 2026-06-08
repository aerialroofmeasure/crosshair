import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

const resendKey = process.env.RESEND_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, subject, message } = body as Record<string, string>;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // No API key configured — accept the form but log it. Lets dev work without secrets.
    if (!resendKey) {
      console.warn("[contact] RESEND_API_KEY missing — submission logged only:", {
        name,
        email,
        subject,
      });
      return NextResponse.json({ ok: true });
    }

    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: `Aerial Roof Measure <${siteConfig.email.support}>`,
      to: [siteConfig.email.support],
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text:
        `From: ${name} <${email}>\n` +
        (company ? `Company: ${company}\n` : "") +
        `\nSubject: ${subject}\n\n${message}\n`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
