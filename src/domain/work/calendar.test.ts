import { describe, expect, it } from "vitest";
import { recentWeekRanges, remainingCalendarWeeks, startOfWeek, toIsoDate } from "./calendar";

describe("calendar assumptions", () => {
  it("calculates remaining calendar weeks from today to January 1", () => {
    expect(remainingCalendarWeeks(new Date(2026, 11, 25))).toBe(1);
    expect(remainingCalendarWeeks(new Date(2026, 0, 1))).toBe(365 / 7);
  });

  it("handles leap-year date boundaries", () => {
    expect(remainingCalendarWeeks(new Date(2028, 1, 29))).toBe(307 / 7);
  });

  it("uses Monday-to-Sunday ranges in chronological order", () => {
    expect(toIsoDate(startOfWeek(new Date(2026, 7, 18)))).toBe("2026-08-17");
    expect(recentWeekRanges(2, new Date(2026, 7, 18))).toEqual([
      { startDate: "2026-08-10", endDate: "2026-08-16" },
      { startDate: "2026-08-17", endDate: "2026-08-23" },
    ]);
  });
});
