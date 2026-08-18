import { describe, expect, it } from "vitest";
import {
  calculateCustomScenario,
  calculateForecast,
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
  { id: "1", label: "Week 1", hoursByJob: { a: 10, b: 2 } },
  { id: "2", label: "Week 2", hoursByJob: { a: 8, b: 8 } },
  { id: "3", label: "Week 3", hoursByJob: { a: 12, b: 8 } },
  { id: "4", label: "Week 4", hoursByJob: { a: 14, b: 10 } },
  { id: "5", label: "Week 5", hoursByJob: { a: 10, b: 18 } },
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
    expect(result.expected.annualIncome).toBe(result.earnedIncome + result.expected.remainingIncome);
    expect(result.expected.monthlyAverage).toBe(roundYen(result.expected.annualIncome / 12));
  });

  it("calculates a custom scenario from explicit assumptions", () => {
    expect(calculateCustomScenario(20, 1300, 10, 100000)).toEqual({
      weeklyHours: 20,
      remainingIncome: 260000,
      annualIncome: 360000,
      monthlyAverage: 30000,
    });
  });
});
