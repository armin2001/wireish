/**
 * Server-only helpers for the API routes. Never import this from a client component.
 */
import { Resend } from 'resend';

export class MailConfigError extends Error {
  constructor() {
    super('RESEND_API_KEY is not set');
  }
}

let client: Resend | null = null;

/** Lazy, so a missing key fails one request with a clear log line instead of crashing the build. */
export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new MailConfigError();
  client ??= new Resend(key);
  return client;
}

export const MAIL_FROM = process.env.MAIL_FROM ?? 'Wireish <contact@wireish.com>';
export const MAIL_TO = (process.env.MAIL_TO ?? 'armin@wireish.com')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Strips line breaks so user input can't break out of a header such as the subject. */
export const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim().slice(0, 120);

export function clientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Best-effort sliding-window limiter. State lives in this server instance's memory,
 * so on serverless it limits per instance. Swap for Upstash/Redis if abuse appears.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}

interface EmailContent {
  heading: string;
  intro?: string;
  rows: Array<[string, string]>;
  sections?: Array<[string, string | undefined]>;
}

/** Brand-styled, email-client-safe HTML. Every dynamic value is escaped. */
export function renderEmail({ heading, intro, rows, sections = [] }: EmailContent): string {
  const row = ([label, value]: [string, string]) =>
    `<tr><td style="padding:8px 16px 8px 0;color:#7A83A6;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(
      label,
    )}</td><td style="padding:8px 0;color:#0A0E24;font-size:14px;line-height:1.5">${escapeHtml(value)}</td></tr>`;

  const section = ([label, value]: [string, string | undefined]) =>
    value
      ? `<h3 style="margin:24px 0 8px;font-size:13px;color:#7A83A6;font-weight:600">${escapeHtml(label)}</h3>
         <div style="white-space:pre-wrap;background:#F4F6FF;border-radius:12px;padding:14px 16px;color:#0A0E24;font-size:14px;line-height:1.6">${escapeHtml(
           value,
         )}</div>`
      : '';

  return `<!doctype html><html><body style="margin:0;background:#F4F6FF;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px">
    <div style="height:4px;border-radius:4px;background:linear-gradient(135deg,#15C3FF 0%,#4A50FC 50.53%,#5A41FD 100%)"></div>
    <div style="background:#ffffff;border:1px solid #E6E8F5;border-radius:16px;padding:28px;margin-top:16px">
      <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;color:#0A0E24">${escapeHtml(heading)}</h1>
      ${intro ? `<p style="margin:0 0 16px;color:#3B4266;font-size:14px;line-height:1.6">${escapeHtml(intro)}</p>` : ''}
      <table role="presentation" style="border-collapse:collapse;width:100%">${rows.map(row).join('')}</table>
      ${sections.map(section).join('')}
    </div>
    <p style="color:#7A83A6;font-size:12px;margin:16px 0 0">Wireish</p>
  </div></body></html>`;
}
