import { z } from 'zod';
import { LOCALES } from '@/lib/i18n/config';

/*
 * Shared by the forms (client-side validation) and the API routes (server-side validation).
 * Error messages are dictionary keys (t.errors[key]), so every language gets its own text.
 * Option labels here are English and only used in the internal team emails.
 */
export const CHANNEL_OPTIONS = [
  { value: 'website', label: 'Website chat' },
  { value: 'instagram', label: 'Instagram DMs' },
  { value: 'whatsapp', label: 'WhatsApp Business' },
  { value: 'messenger', label: 'Facebook Messenger' },
  { value: 'custom', label: 'CRM and custom tools' },
] as const;

export const VOLUME_OPTIONS = [
  { value: 'lt1k', label: 'Under 1,000' },
  { value: '1k-5k', label: '1,000 to 5,000' },
  { value: '5k-20k', label: '5,000 to 20,000' },
  { value: 'gt20k', label: 'Over 20,000' },
] as const;

export const GOAL_OPTIONS = [
  { value: 'support', label: 'Answer support questions' },
  { value: 'sales', label: 'Qualify leads and sell' },
  { value: 'bookings', label: 'Take bookings' },
  { value: 'mixed', label: 'A mix of these' },
] as const;

export const TOPIC_OPTIONS = [
  { value: 'project', label: 'New project' },
  { value: 'client', label: 'Existing agent' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'careers', label: 'Careers' },
  { value: 'press', label: 'Press' },
] as const;

type Option = { readonly value: string; readonly label: string };
type ValueOf<T extends readonly Option[]> = T[number]['value'];

function values<T extends readonly Option[]>(options: T) {
  return options.map((o) => o.value) as unknown as [ValueOf<T>, ...ValueOf<T>[]];
}

export function labelFor(options: readonly Option[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export type Channel = ValueOf<typeof CHANNEL_OPTIONS>;
export type Volume = ValueOf<typeof VOLUME_OPTIONS>;
export type Goal = ValueOf<typeof GOAL_OPTIONS>;
export type Topic = ValueOf<typeof TOPIC_OPTIONS>;

export function isTopic(value: unknown): value is Topic {
  return TOPIC_OPTIONS.some((o) => o.value === value);
}

/** Keys of t.errors. */
export type ErrorKey =
  | 'nameShort'
  | 'tooLong'
  | 'emailRequired'
  | 'emailInvalid'
  | 'phoneInvalid'
  | 'messageShort'
  | 'companyRequired'
  | 'pickChannel'
  | 'invalid';

const E = (key: ErrorKey) => key;

const name = z.string().trim().min(2, E('nameShort')).max(80, E('tooLong'));
const email = z.string().trim().min(1, E('emailRequired')).email(E('emailInvalid')).max(160, E('tooLong'));
const phone = z
  .string()
  .trim()
  .max(40, E('tooLong'))
  .regex(/^[+()\d\s.-]*$/, E('phoneInvalid'));
/** Honeypot. Real people never see or fill it; the API silently drops submissions that do. */
const hp = z.string().optional();
const locale = z.enum(LOCALES).default('en');

export const contactSchema = z.object({
  topic: z.enum(values(TOPIC_OPTIONS), { message: E('invalid') }),
  name,
  email,
  company: z.string().trim().max(120, E('tooLong')),
  phone,
  message: z.string().trim().min(20, E('messageShort')).max(4000, E('tooLong')),
  hp,
});
export type ContactInput = z.infer<typeof contactSchema>;
/** What the API accepts: the form fields plus the page language. */
export const contactRequestSchema = contactSchema.extend({ locale });

export const bookingDetailsSchema = z.object({
  name,
  email,
  company: z.string().trim().min(2, E('companyRequired')).max(120, E('tooLong')),
  phone,
  notes: z.string().trim().max(2000, E('tooLong')),
  hp,
});
export type BookingDetails = z.infer<typeof bookingDetailsSchema>;

/** The canvas map as sent by the booking page; the server re-validates it with parseDoc. */
const blueprintSchema = z.object({
  nodes: z
    .array(z.object({ id: z.string().max(64), kind: z.string().max(32), x: z.number(), y: z.number() }))
    .max(300),
  edges: z.array(z.object({ id: z.string().max(64), from: z.string().max(64), to: z.string().max(64) })).max(900),
});

export const bookingSchema = bookingDetailsSchema.extend({
  channels: z.array(z.enum(values(CHANNEL_OPTIONS))).min(1, E('pickChannel')).max(CHANNEL_OPTIONS.length),
  volume: z.enum(values(VOLUME_OPTIONS), { message: E('invalid') }),
  goal: z.enum(values(GOAL_OPTIONS), { message: E('invalid') }),
  slotStart: z.string().datetime({ message: E('invalid') }),
  timeZone: z.string().min(1).max(64),
  locale,
  blueprint: blueprintSchema.optional(),
});
export type BookingInput = z.input<typeof bookingSchema>;

/** Error codes the API routes return; the forms turn them into translated text. */
export type ApiErrorCode = 'rate_limited' | 'bad_request' | 'invalid' | 'send_failed' | 'slot_taken';

export interface ApiError {
  error?: ApiErrorCode;
  /** Development only: the underlying reason, e.g. a Resend error message. */
  detail?: string;
  /** Field name → list of ErrorKey. */
  fieldErrors?: Record<string, string[] | undefined>;
}
