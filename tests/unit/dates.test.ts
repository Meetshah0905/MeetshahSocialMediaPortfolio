import { describe, expect, it } from "vitest";
import { formatDate, periodsMatch } from "@/lib/utils/dates";
import { NO_VALUE } from "@/lib/utils/numbers";

describe("formatDate", () => {
  it("formats an ISO date", () => {
    expect(formatDate("2026-07-17T00:00:00.000Z")).toBe("17 Jul 2026");
  });

  it("dashes on null or an unparseable string", () => {
    expect(formatDate(null)).toBe(NO_VALUE);
    expect(formatDate("not a date")).toBe(NO_VALUE);
  });
});

/**
 * periodsMatch gates every "safe to combine" sum in §24. A false positive here
 * means 30-day fitness reach gets added to 90-day finance reach and published
 * as a single number — so the bias is deliberately toward returning false.
 */
describe("periodsMatch", () => {
  const range = (startDate: string, endDate: string, days: number | null) => ({
    startDate,
    endDate,
    days,
  });

  it("matches identical explicit date ranges", () => {
    expect(
      periodsMatch(
        range("2026-06-17", "2026-07-17", 30),
        range("2026-06-17", "2026-07-17", 30),
      ),
    ).toBe(true);
  });

  it("rejects different date ranges of the same length", () => {
    // Both 30 days, but different windows — reach is not comparable.
    expect(
      periodsMatch(
        range("2026-06-17", "2026-07-17", 30),
        range("2026-05-17", "2026-06-16", 30),
      ),
    ).toBe(false);
  });

  it("falls back to duration when explicit ranges are unavailable", () => {
    expect(
      periodsMatch(
        { startDate: null, endDate: null, days: 30 },
        { startDate: null, endDate: null, days: 30 },
      ),
    ).toBe(true);
  });

  it("rejects mismatched durations", () => {
    expect(
      periodsMatch(
        { startDate: null, endDate: null, days: 30 },
        { startDate: null, endDate: null, days: 90 },
      ),
    ).toBe(false);
  });

  it("refuses to guess when there is nothing to compare", () => {
    expect(
      periodsMatch(
        { startDate: null, endDate: null, days: null },
        { startDate: null, endDate: null, days: null },
      ),
    ).toBe(false);
  });

  it("refuses when only one side has a known duration", () => {
    expect(
      periodsMatch(
        { startDate: null, endDate: null, days: 30 },
        { startDate: null, endDate: null, days: null },
      ),
    ).toBe(false);
  });
});
