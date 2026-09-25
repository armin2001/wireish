import { z } from 'zod';

/* Option lists are shared by the forms, the API routes and the notification emails. */
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

const name = z.string().trim().min(2, 'Enter at least 2 characters').max(80, 'Keep it under 80 characters');
const email = z
  .string()
  .trim()
  .min(1, 'Enter your email address')
  .email('Enter a valid email, like you@company.com')
  .max(160, 'Keep it under 160 characters');
const phone = z
  .string()
  .trim()
  .max(40, 'Keep it under 40 characters')
  .regex(/^[+()\d\s.-]*$/, 'Use digits, spaces and + ( ) - only');
/** Honeypot. Real people never see or fill it; the API silently drops submissions that do. */
const hp = z.string().optional();

export const contactSchema = z.object({
  topic: z.enum(values(TOPIC_OPTIONS)),
  name,
  email,
  company: z.string().trim().max(120, 'Keep it under 120 characters'),
  phone,
  message: z
    .string()
    .trim()
    .min(20, 'Add a few more details (20 characters minimum)')
    .max(4000, 'Keep it under 4,000 characters'),
  hp,
});
export type ContactInput = z.infer<typeof contactSchema>;

export const bookingDetailsSchema = z.object({
  name,
  email,
  company: z.string().trim().min(2, 'Enter your company name').max(120, 'Keep it under 120 characters'),
  phone,
  notes: z.string().trim().max(2000, 'Keep it under 2,000 characters'),
  hp,
});
export type BookingDetails = z.infer<typeof bookingDetailsSchema>;

export const bookingSchema = bookingDetailsSchema.extend({
  channels: z.array(z.enum(values(CHANNEL_OPTIONS))).min(1, 'Pick at least one channel').max(CHANNEL_OPTIONS.length),
  volume: z.enum(values(VOLUME_OPTIONS)),
  goal: z.enum(values(GOAL_OPTIONS)),
  slotStart: z.string().datetime({ message: 'Pick a time slot' }),
  timeZone: z.string().min(1).max(64),
  blueprint: z.string().max(2000).optional(),
});
export type BookingInput = z.infer<typeof bookingSchema>;

/** Shape of every JSON error the API routes return. */
export interface ApiError {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}
