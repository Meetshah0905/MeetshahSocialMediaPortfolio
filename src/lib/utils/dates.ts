import { NO_VALUE } from "./numbers";

/**
 * Date helpers for report freshness labels.
 *
 * All dates crossing storage are ISO 8601 strings so a report survives JSON
 * round-tripping through Redis unchanged.
 */

/** ISO string -> "17 Jul 2026". Null-safe. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return NO_VALUE;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return NO_VALUE;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** ISO string -> "3 days ago". Used for the report freshness badge. */
export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return NO_VALUE;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return NO_VALUE;

  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(seconds) >= secondsInUnit) {
      return formatter.format(Math.round(seconds / secondsInUnit), unit);
    }
  }
  return formatter.format(seconds, "second");
}

/**
 * Whether two reporting periods describe the same window.
 *
 * §24 gates every "safe to combine" sum behind this: reach from a 30-day
 * fitness report and a 90-day finance report must never be added together.
 */
export function periodsMatch(
  a: { startDate: string | null; endDate: string | null; days: number | null },
  b: { startDate: string | null; endDate: string | null; days: number | null },
): boolean {
  // Explicit ranges are authoritative when both sides have them.
  if (a.startDate && a.endDate && b.startDate && b.endDate) {
    return a.startDate === b.startDate && a.endDate === b.endDate;
  }
  // Otherwise fall back to duration, which must be known on both sides.
  if (a.days !== null && b.days !== null) {
    return a.days === b.days;
  }
  // Not enough information to prove they match — assume they don't.
  return false;
}
