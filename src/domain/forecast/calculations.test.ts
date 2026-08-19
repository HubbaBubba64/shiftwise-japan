import { describe, expect, it } from "vitest";
import {
  calculateCustomScenario,
  calculateForecast,
  calculateHistoryStatistics,
  earnedIncome,
  mean,
  median,
  quantile,
  roundYen,
  totalWeeklyHours,
  weightedHourlyWage,
  weightedWeeklyHours,
} from "./calculations";
import type { Job, WeeklyEntry } from "./types";

const jobs: Job[] = [
  { id: "a", name: "Cafe", hourlyWage: 1200 },
  { id: "b", name: "Restaurant", hourlyWage: 1500 },
];
const weeks: WeeklyEntry[] = [
  { id: "1", startDate: "2026-07-06", endDate: "2026-07-12", periodType: "normal", hoursByJob: { a: 10, b: 2 } },
  { id: "2", startDate: "2026-07-13", endDate: "2026-07-19", periodType: "normal", hoursByJob: { a: 8, b: 8 } },
  { id: "3", startDate: "2026-07-20", endDate: "2026-07-26", periodType: "normal", hoursByJob: { a: 12, b: 8 } },
  { id: "4", startDate: "2026-07-27", endDate: "2026-08-02", periodType: "normal", hoursByJob: { a: 14, b: 10 } },
  { id: "5", startDate: "2026-08-03", endDate: "2026-08-09", periodType: "normal", hoursByJob: { a: 10, b: 18 } },
];

describe("forecast statistics", () => {
  it("calculates mean and median", () => {
    expect(mean([10, 23, 17, 27, 14])).toBe(18.2);
    expect(median([10, 23, 17, 27, 14])).toBe(17);
    expect(median([10, 20, 30, 40])).toBe(25);
  });

  it("interpolates quantiles without claiming confidence intervals", () => {
    expect(quantile([10, 20, 30, 40, 50], 0.25)).toBe(20);
    expect(quantile([], 0.75)).toBe(0);
  });

  it("weights the recent four weeks at 60%", () => {
    expect(weightedWeeklyHours([10, 10, 10, 10, 20, 20, 20, 20])).toBe(16);
  });

  it("adapts to fewer than four observations", () => {
    expect(weightedWeeklyHours([10, 20, 30])).toBe(20);
    expect(weightedWeeklyHours([])).toBe(0);
  });

  it("includes zero-hour and missing weeks as entered observations", () => {
    expect(weightedWeeklyHours([0, 10, 20, 30])).toBe(15);
  });

  it("summarizes history and assigns an explainable variability level", () => {
    const result = calculateHistoryStatistics(weeks);
    expect(result).toMatchObject({ average: 20, median: 20, minimum: 12, maximum: 28, recentFourAverage: 22 });
    expect(result.variability).toBe("moderate");
  });
});

describe("work and income calculations", () => {
  it("combines hours across multiple jobs", () => {
    expect(totalWeeklyHours(weeks[0])).toBe(12);
  });

  it("calculates income already represented by the history", () => {
    expect(earnedIncome(jobs, [weeks[0]])).toBe(15000);
  });

  it("uses an hours-weighted wage across jobs", () => {
    expect(weightedHourlyWage(jobs, [weeks[0]])).toBe(1250);
  });

  it("rounds yen to whole values", () => {
    expect(roundYen(1234.5)).toBe(1235);
  });

  it("projects low, expected, and high annual scenarios", () => {
    const result = calculateForecast(jobs, weeks, 20);
    expect(result.low.annualIncome).toBeLessThanOrEqual(result.expected.annualIncome);
    expect(result.high.annualIncome).toBeGreaterThanOrEqual(result.expected.annualIncome);
    expect(result.expected.annualIncome).toBe(result.incomeSoFar + result.expected.remainingIncome);
    expect(result.expected.monthlyAverage).toBe(roundYen(result.expected.annualIncome / 12));
  });

  it("defines full-year gross as entered weeks plus other year-to-date income plus remaining income", () => {
    const result = calculateForecast(jobs, weeks, 20, 50000);
    expect(result.enteredWeeksIncome).toBe(133800);
    expect(result.incomeSoFar).toBe(result.enteredWeeksIncome + 50000);
    expect(result.expected.annualIncome).toBe(result.enteredWeeksIncome + 50000 + result.expected.remainingIncome);
  });

  it("calculates a custom scenario from explicit assumptions", () => {
    expect(calculateCustomScenario(20, 1300, 10, 100000)).toEqual({
      weeklyHours: 20,
      remainingIncome: 260000,
      annualIncome: 360000,
      monthlyAverage: 30000,
    });
  });

  it("keeps vacation weeks from distorting the normal-period forecast", () => {
    const normalWeeks: WeeklyEntry[] = Array.from({ length: 4 }, (_, index) => ({
      id: `n${index}`, startDate: `2026-06-${String(index * 7 + 1).padStart(2, "0")}`, endDate: `2026-06-${String(index * 7 + 7).padStart(2, "0")}`, periodType: "normal", hoursByJob: { a: 20 },
    }));
    const vacationWeek: WeeklyEntry = {
      id: "v", startDate: "2026-07-01", endDate: "2026-07-07", periodType: "officialLongVacation", hoursByJob: {},
      dailyHoursByJob: Object.fromEntries(["01", "02", "03", "04", "05"].map((day) => [`2026-07-${day}`, { a: 8 }])),
    };
    const normalForecast = calculateForecast(jobs, [...normalWeeks, vacationWeek], 10, 0, "normal");
    const vacationForecast = calculateForecast(jobs, [...normalWeeks, vacationWeek], 10, 0, "officialLongVacation");
    expect(normalForecast.expected.weeklyHours).toBe(20);
    expect(normalForecast.regimes.normal.averageWeeklyHours).toBe(20);
    expect(normalForecast.regimes.officialLongVacation.averageWeeklyHours).toBe(40);
    expect(vacationForecast.expected.weeklyHours).toBe(40);
  });

  it("does not substitute normal history when forecasting a vacation with no vacation entries", () => {
    const result = calculateForecast(jobs, weeks, 10, 0, "officialLongVacation");
    expect(result.regimes.officialLongVacation.weekCount).toBe(0);
    expect(result.expected.weeklyHours).toBe(0);
    expect(result.expected.remainingIncome).toBe(0);
  });

  it("weights only the recent weeks within the requested regime", () => {
    const mixed: WeeklyEntry[] = [
      ...Array.from({ length: 4 }, (_, index) => ({
        id: `old-normal-${index}`, startDate: "2026-04-06", endDate: "2026-04-12", periodType: "normal" as const, hoursByJob: { a: 10 },
      })),
      { id: "vacation", startDate: "2026-05-04", endDate: "2026-05-10", periodType: "officialLongVacation", hoursByJob: {}, dailyHoursByJob: { "2026-05-04": { a: 8 } } },
      ...Array.from({ length: 4 }, (_, index) => ({
        id: `recent-normal-${index}`, startDate: "2026-06-01", endDate: "2026-06-07", periodType: "normal" as const, hoursByJob: { a: 20 },
      })),
    ];
    const result = calculateForecast(jobs, mixed, 10, 0, "normal");
    expect(result.expected.weeklyHours).toBe(16);
  });

  it("keeps quiet, likely, and busy scenarios ordered for irregular shifts", () => {
    const irregular = [8, 12, 18, 24, 28].map((hours, index): WeeklyEntry => ({
      id: String(index), startDate: "2026-06-01", endDate: "2026-06-07", periodType: "normal", hoursByJob: { a: hours },
    }));
    const result = calculateForecast(jobs, irregular, 12);
    expect(result.low.weeklyHours).toBeLessThanOrEqual(result.expected.weeklyHours);
    expect(result.expected.weeklyHours).toBeLessThanOrEqual(result.high.weeklyHours);
  });
});
