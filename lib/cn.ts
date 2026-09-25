/** Joins truthy class names. Tiny on purpose: no runtime dependency for a string join. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
