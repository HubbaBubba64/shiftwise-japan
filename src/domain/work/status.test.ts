import { describe, expect, it } from "vitest";
import type { WeeklyEntry } from "../forecast/types";
import { calculateWorkHoursStatus } from "./status";

const normalWeek = (hours: number): WeeklyEntry => ({ id: "n", startDate: "2026-08-17", endDate: "2026-08-23", periodType: "normal", hoursByJob: { a: hours } });
const vacationWeek = (dailyHoursByJob: WeeklyEntry["dailyHoursByJob"]): WeeklyEntry => ({ id: "v", startDate: "2026-08-17", endDate: "2026-08-23", periodType: "officialLongVacation", hoursByJob: {}, dailyHoursByJob });
const today = new Date(2026, 7, 19);

describe("normal-school work-hours status", () => {
  it("treats exactly 28h as within the entered general limit", () => {
    const result = calculateWorkHoursStatus([normalWeek(28)], 28, 8, today);
    expect(result.currentWeekStatus).toBe("within");
    expect(result.normalWeeksOverLimit).toBe(0);
    expect(result.currentWeekRemainingHours).toBe(0);
  });

  it("flags a normal week over 28h as a possible issue", () => {
    const result = calculateWorkHoursStatus([normalWeek(28.5)], 28, 8, today);
    expect(result.currentWeekStatus).toBe("possibleIssue");
    expect(result.normalWeeksOverLimit).toBe(1);
  });

  it("combines multiple jobs before checking a normal week", () => {
    const week = { ...normalWeek(20), hoursByJob: { a: 20, b: 9 } };
    const result = calculateWorkHoursStatus([week], 28, 8, today);
    expect(result.currentWeekHours).toBe(29);
    expect(result.currentWeekStatus).toBe("possibleIssue");
  });

  it("counts over-limit normal weeks without applying the weekly rule to vacation weeks", () => {
    const oldNormal = { ...normalWeek(29), id: "old", startDate: "2026-08-03", endDate: "2026-08-09" };
    const vacation = vacationWeek({ "2026-08-19": { a: 8 } });
    const result = calculateWorkHoursStatus([oldNormal, vacation], 28, 8, today);
    expect(result.normalWeeksOverLimit).toBe(1);
    expect(result.currentWeekStatus).toBe("within");
  });
});

describe("official-long-vacation work-hours status", () => {
  it("treats an 8h day as within and a day over 8h as a possible issue", () => {
    const result = calculateWorkHoursStatus([vacationWeek({ "2026-08-19": { a: 8 }, "2026-08-20": { a: 8.5 } })], 28, 8, today);
    expect(result.dailyStatuses.find((day) => day.date === "2026-08-19")?.status).toBe("within");
    expect(result.dailyStatuses.find((day) => day.date === "2026-08-20")?.status).toBe("possibleIssue");
  });

  it("allows a 40h informational week composed of five 8h days", () => {
    const daily = Object.fromEntries(["17", "18", "19", "20", "21"].map((day) => [`2026-08-${day}`, { a: 8 }]));
    const result = calculateWorkHoursStatus([vacationWeek(daily)], 28, 8, today);
    expect(result.currentWeekHours).toBe(40);
    expect(result.currentWeekStatus).toBe("within");
    expect(result.daysOverLimit).toBe(0);
    expect(result.currentWeekRemainingHours).toBeNull();
  });

  it("combines multiple jobs on the same day before checking 8h", () => {
    const result = calculateWorkHoursStatus([vacationWeek({ "2026-08-19": { a: 5, b: 4 } })], 28, 8, today);
    expect(result.dailyStatuses.find((day) => day.date === "2026-08-19")).toMatchObject({ hours: 9, status: "possibleIssue" });
  });

  it("reports remaining daily hours without allowing a negative remainder", () => {
    const result = calculateWorkHoursStatus([vacationWeek({ "2026-08-19": { a: 9 } })], 28, 8, today);
    expect(result.dailyStatuses.find((day) => day.date === "2026-08-19")?.remainingHours).toBe(0);
    expect(result.dailyStatuses.find((day) => day.date === "2026-08-18")?.remainingHours).toBe(8);
  });

  it("returns to the weekly rule when the current week changes back to normal", () => {
    const vacation: WeeklyEntry = { ...vacationWeek({ "2026-08-12": { a: 8 } }), startDate: "2026-08-10", endDate: "2026-08-16" };
    const result = calculateWorkHoursStatus([vacation, normalWeek(23)], 28, 8, today);
    expect(result.periodType).toBe("normal");
    expect(result.currentWeekStatus).toBe("within");
    expect(result.currentWeekRemainingHours).toBe(5);
  });
});
