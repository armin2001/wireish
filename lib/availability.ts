/**
 * Demo availability, computed without a date library.
 *
 * Slots are defined in the host's wall-clock time (HOST_TIME_ZONE), converted to
 * absolute instants, then regrouped by calendar day in the visitor's time zone.
 * The same `isBookableSlot` check runs on the server, so a tampered request can't
 * book 3 a.m. on a Sunday.
 *
 * To connect a real calendar (Google Calendar, Cal.com, etc.), filter the result of
 * `generateSlots` against busy times in the API route and in the booking page.
 */
export const HOST_TIME_ZONE = 'Europe/Sarajevo'; // Set to your team's time zone.
export const SLOT_MINUTES = 30;
export const MEETING_MINUTES = 30;
export const BUSINESS_HOURS = { start: 9, end: 17 } as const; // host time, end exclusive
export const WORKDAYS: readonly number[] = [1, 2, 3, 4, 5]; // Mon to Fri
export const MIN_NOTICE_HOURS = 12;
export const BOOKING_HORIZON_DAYS = 30;
/** Grace period so a slot picked at the edge of the notice window survives a slow form fill. */
const SUBMIT_GRACE_MS = 60 * 60 * 1000;

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export interface ZonedParts {
  year: number;
  month: number; // 1 to 12
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number; // 0 = Sunday
}

const WEEKDAY: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    formatters.set(timeZone, f);
  }
  return f;
}

export function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = formatterFor(timeZone).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '0';
  const hour = Number(get('hour'));
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: hour === 24 ? 0 : hour,
    minute: Number(get('minute')),
    second: Number(get('second')),
    weekday: WEEKDAY[get('weekday')] ?? 0,
  };
}

function offsetMinutes(date: Date, timeZone: string): number {
  const p = getZonedParts(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const truncated = Math.floor(date.getTime() / 1000) * 1000;
  return Math.round((asUtc - truncated) / 60000);
}

/** Converts a wall-clock time in `timeZone` to the absolute instant. DST-safe (two-pass). */
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const first = offsetMinutes(new Date(guess), timeZone);
  let ts = guess - first * 60000;
  const second = offsetMinutes(new Date(ts), timeZone);
  if (second !== first) ts = guess - second * 60000;
  return new Date(ts);
}

export function generateSlots(now: Date = new Date()): Date[] {
  const earliest = now.getTime() + MIN_NOTICE_HOURS * HOUR;
  const today = getZonedParts(now, HOST_TIME_ZONE);
  const slots: Date[] = [];

  for (let offset = 0; offset <= BOOKING_HORIZON_DAYS; offset++) {
    const calendarDay = new Date(Date.UTC(today.year, today.month - 1, today.day + offset));
    if (!WORKDAYS.includes(calendarDay.getUTCDay())) continue;

    for (
      let minutes = BUSINESS_HOURS.start * 60;
      minutes + MEETING_MINUTES <= BUSINESS_HOURS.end * 60;
      minutes += SLOT_MINUTES
    ) {
      const slot = zonedTimeToUtc(
        calendarDay.getUTCFullYear(),
        calendarDay.getUTCMonth() + 1,
        calendarDay.getUTCDate(),
        Math.floor(minutes / 60),
        minutes % 60,
        HOST_TIME_ZONE,
      );
      if (slot.getTime() >= earliest) slots.push(slot);
    }
  }
  return slots;
}

export function isBookableSlot(slot: Date, now: Date = new Date()): boolean {
  const t = slot.getTime();
  if (Number.isNaN(t) || slot.getUTCMilliseconds() !== 0) return false;
  if (t < now.getTime() + MIN_NOTICE_HOURS * HOUR - SUBMIT_GRACE_MS) return false;
  if (t > now.getTime() + (BOOKING_HORIZON_DAYS + 1) * DAY) return false;

  const p = getZonedParts(slot, HOST_TIME_ZONE);
  if (!WORKDAYS.includes(p.weekday) || p.second !== 0) return false;
  const minutes = p.hour * 60 + p.minute;
  if (minutes % SLOT_MINUTES !== 0) return false;
  return minutes >= BUSINESS_HOURS.start * 60 && minutes + MEETING_MINUTES <= BUSINESS_HOURS.end * 60;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Calendar day of `date` in `timeZone`, as YYYY-MM-DD. */
export function dateKey(date: Date, timeZone: string): string {
  const p = getZonedParts(date, timeZone);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export function groupSlotsByDay(slots: Date[], timeZone: string): Map<string, Date[]> {
  const days = new Map<string, Date[]>();
  for (const slot of slots) {
    const key = dateKey(slot, timeZone);
    const list = days.get(key);
    if (list) list.push(slot);
    else days.set(key, [slot]);
  }
  return days;
}

export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function getVisitorTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function listTimeZones(include: string[]): string[] {
  let zones: string[] = [];
  try {
    zones = Intl.supportedValuesOf('timeZone');
  } catch {
    zones = [];
  }
  const all = new Set([...include, ...zones, 'UTC', HOST_TIME_ZONE]);
  return [...all].sort((a, b) => a.localeCompare(b));
}
