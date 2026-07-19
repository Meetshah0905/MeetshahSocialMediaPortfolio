import { describe, expect, it } from "vitest";
import {
  NO_VALUE,
  formatCompact,
  formatDelta,
  formatNumber,
  formatPercent,
  sumOrNull,
} from "@/lib/utils/numbers";

/**
 * These guard §2: a missing metric must never render as a number. The formatters
 * are the last line of defence between a null in storage and a figure a brand
 * manager might act on.
 */

describe("formatCompact", () => {
  it("abbreviates large numbers", () => {
    expect(formatCompact(11900)).toBe("11.9K");
    expect(formatCompact(15100)).toBe("15.1K");
  });

  it("renders a dash rather than a number when the value is missing", () => {
    expect(formatCompact(null)).toBe(NO_VALUE);
    expect(formatCompact(undefined)).toBe(NO_VALUE);
  });

  it("rejects non-finite values instead of printing Infinity or NaN", () => {
    expect(formatCompact(Number.NaN)).toBe(NO_VALUE);
    expect(formatCompact(Number.POSITIVE_INFINITY)).toBe(NO_VALUE);
  });

  it("does not treat a real zero as missing", () => {
    expect(formatCompact(0)).toBe("0");
  });
});

describe("formatNumber", () => {
  it("groups thousands", () => {
    expect(formatNumber(27000)).toBe("27,000");
  });

  it("dashes on null", () => {
    expect(formatNumber(null)).toBe(NO_VALUE);
  });
});

describe("formatPercent", () => {
  it("formats to one decimal by default", () => {
    expect(formatPercent(4.25)).toBe("4.3%");
  });

  it("dashes on null", () => {
    expect(formatPercent(null)).toBe(NO_VALUE);
  });

  it("keeps a real zero visible", () => {
    expect(formatPercent(0)).toBe("0.0%");
  });
});

describe("formatDelta", () => {
  it("signs gains and losses", () => {
    expect(formatDelta(320)).toBe("+320");
    expect(formatDelta(-18)).toBe("-18");
  });

  it("leaves zero unsigned", () => {
    expect(formatDelta(0)).toBe("0");
  });

  it("dashes on null", () => {
    expect(formatDelta(null)).toBe(NO_VALUE);
  });
});

describe("sumOrNull", () => {
  it("sums the values that are present", () => {
    expect(sumOrNull([11900, 15100])).toBe(27000);
  });

  it("ignores nulls when at least one value is real", () => {
    expect(sumOrNull([11900, null])).toBe(11900);
  });

  it("returns null — not 0 — when nothing is known", () => {
    // The important case: 0 would render as a real measurement of zero.
    expect(sumOrNull([null, undefined])).toBeNull();
    expect(sumOrNull([])).toBeNull();
  });

  it("sums a genuine zero", () => {
    expect(sumOrNull([0, null])).toBe(0);
  });
});
