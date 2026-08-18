import type { ForecastResult, Job, Scenario, WeeklyEntry } from "./types";

export const roundYen = (value: number) => Math.round(value);

export const totalWeeklyHours = (week: WeeklyEntry) =>
  Object.values(week.hoursByJob).reduce((total, hours) => total + (hours || 0), 0);

export const mean = (values: number[]) =>
  values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;

export const median = (values: number[]) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

export const quantile = (values: number[], percentile: number) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * percentile;
  const lower = Math.floor(index);
  const fraction = index - lower;
  return sorted[lower + 1] === undefined
    ? sorted[lower]
    : sorted[lower] + fraction * (sorted[lower + 1] - sorted[lower]);
};

export const weightedWeeklyHours = (hours: number[]) => {
  if (!hours.length) return 0;
  const recent = hours.slice(-4);
  const previous = hours.slice(Math.max(0, hours.length - 12), Math.max(0, hours.length - 4));
  if (!previous.length) return mean(recent);
  return mean(recent) * 0.6 + mean(previous) * 0.4;
};

export const earnedIncome = (jobs: Job[], weeks: WeeklyEntry[]) => {
  const wages = new Map(jobs.map((job) => [job.id, job.hourlyWage]));
  return roundYen(
    weeks.reduce(
      (total, week) =>
        total +
        Object.entries(week.hoursByJob).reduce(
          (weekTotal, [jobId, hours]) => weekTotal + (wages.get(jobId) ?? 0) * (hours || 0),
          0,
        ),
      0,
    ),
  );
};

export const weightedHourlyWage = (jobs: Job[], weeks: WeeklyEntry[]) => {
  const totalHoursByJob = new Map<string, number>();
  for (const week of weeks) {
    for (const [jobId, hours] of Object.entries(week.hoursByJob)) {
      totalHoursByJob.set(jobId, (totalHoursByJob.get(jobId) ?? 0) + (hours || 0));
    }
  }
  const totalHours = [...totalHoursByJob.values()].reduce((total, hours) => total + hours, 0);
  if (!totalHours) return mean(jobs.map((job) => job.hourlyWage));
  return jobs.reduce(
    (total, job) => total + job.hourlyWage * (totalHoursByJob.get(job.id) ?? 0),
    0,
  ) / totalHours;
};

const buildScenario = (
  weeklyHours: number,
  hourlyWage: number,
  remainingWeeks: number,
  incomeSoFar: number,
): Scenario => {
  const remainingIncome = roundYen(weeklyHours * hourlyWage * remainingWeeks);
  const annualIncome = incomeSoFar + remainingIncome;
  return {
    weeklyHours,
    remainingIncome,
    annualIncome,
    monthlyAverage: roundYen(annualIncome / 12),
  };
};

export const calculateForecast = (
  jobs: Job[],
  weeks: WeeklyEntry[],
  remainingWeeks: number,
): ForecastResult => {
  const hours = weeks.map(totalWeeklyHours);
  const expectedHours = weightedWeeklyHours(hours);
  const lowHours = Math.min(quantile(hours, 0.25), expectedHours);
  const highHours = Math.max(quantile(hours, 0.75), expectedHours);
  const incomeSoFar = earnedIncome(jobs, weeks);
  const averageWage = weightedHourlyWage(jobs, weeks);

  return {
    earnedIncome: incomeSoFar,
    averageHourlyWage: averageWage,
    meanHours: mean(hours),
    low: buildScenario(lowHours, averageWage, remainingWeeks, incomeSoFar),
    expected: buildScenario(expectedHours, averageWage, remainingWeeks, incomeSoFar),
    high: buildScenario(highHours, averageWage, remainingWeeks, incomeSoFar),
  };
};

export const calculateCustomScenario = (
  weeklyHours: number,
  hourlyWage: number,
  remainingWeeks: number,
  incomeSoFar: number,
) => buildScenario(weeklyHours, hourlyWage, remainingWeeks, incomeSoFar);
