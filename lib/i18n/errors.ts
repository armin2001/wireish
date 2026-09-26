import type { ApiError } from '@/lib/schema';
import type { Dictionary } from './dictionaries/en';

/** Field error key from zod (client or server) → translated message. */
export function fieldError(t: Dictionary, key: string | undefined): string | undefined {
  if (!key) return undefined;
  return (t.errors as Record<string, string>)[key] ?? t.errors.invalid;
}

/** API error body → translated banner text. In development the provider's reason is appended. */
export function apiErrorText(t: Dictionary, body: ApiError, fallback: string): string {
  const base = body.error === 'rate_limited' ? t.errors.rateLimited : fallback;
  return body.detail ? `${base} (${body.detail})` : base;
}
