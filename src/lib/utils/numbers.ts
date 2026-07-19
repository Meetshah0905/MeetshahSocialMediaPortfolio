/**
 * Number formatting for stats and charts.
 *
 * Every formatter is null-safe on purpose: §2 forbids inventing analytics, so
 * a missing metric must render as an explicit dash rather than a zero that
 * reads like a real measurement.
 */

/** The single placeholder shown wherever a real value is unavailable. */
export const NO_VALUE = "—";

/** 11900 -> "11.9K". Returns NO_VALUE for null/undefined. */
export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return NO_VALUE;
  }
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** 11900 -> "11,900". Returns NO_VALUE for null/undefined. */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return NO_VALUE;
  }
  return new Intl.NumberFormat("en-US").format(value);
}

/** 4.2 -> "4.2%". Returns NO_VALUE for null/undefined. */
export function formatPercent(
  value: number | null | undefined,
  fractionDigits = 1,
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return NO_VALUE;
  }
  return `${value.toFixed(fractionDigits)}%`;
}

/** Signed display for deltas: 320 -> "+320", -18 -> "-18". */
export function formatDelta(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return NO_VALUE;
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value)}`;
}

/**
 * Sum that refuses to guess: if every input is null the result is null, not 0.
 * Used by the combined-analytics rules in §24.
 */
export function sumOrNull(
  values: Array<number | null | undefined>,
): number | null {
  const present = values.filter(
    (v): v is number => v !== null && v !== undefined && Number.isFinite(v),
  );
  if (present.length === 0) return null;
  return present.reduce((total, v) => total + v, 0);
}
