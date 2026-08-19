import type { ForecastResult, HistoryStatistics, Job, PeriodType, Scenario, WeeklyEntry } from "./types";

export const roundYen = (value: number) => Math.round(value);

export const totalDailyHours = (week: WeeklyEntry, date: string) =>
  Object.values(week.dailyHoursByJob?.[date] ?? {}).reduce((total, hours) => total + (hours || 0), 0);

export const hoursByJobForWeek = (week: WeeklyEntry) => {
  if (week.periodType !== "officialLongVacation" || !week.dailyHoursByJob) return week.hoursByJob;
  const totals: Record<string, number> = {};
  for (const day of Object.values(week.dailyHoursByJob)) {
    for (const [jobId, hours] of Object.entries(day)) totals[jobId] = (totals[jobId] ?? 0) + (hours || 0);
  }
  return totals;
};

export const totalWeeklyHours = (week: WeeklyEntry) =>
  Object.values(hoursByJobForWeek(week)).reduce((total, hours) => total + (hours || 0), 0);

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

export const standardDeviation = (values: number[]) => {
  if (!values.length) return 0;
  const average = mean(values);
  return Math.sqrt(mean(values.map((value) => (value - average) ** 2)));
};

export const calculateHistoryStatistics = (weeks: WeeklyEntry[]): HistoryStatistics => {
  const hours = weeks.map(totalWeeklyHours);
  const average = mean(hours);
  const deviation = standardDeviation(hours);
  const coefficientOfVariation = average ? deviation / average : 0;
  return {
    average,
    median: median(hours),
    minimum: hours.length ? Math.min(...hours) : 0,
    maximum: hours.length ? Math.max(...hours) : 0,
    recentFourAverage: mean(hours.slice(-4)),
    standardDeviation: deviation,
    variability: coefficientOfVariation < 0.15 ? "low" : coefficientOfVariation < 0.3 ? "moderate" : "high",
  };
};

export const earnedIncome = (jobs: Job[], weeks: WeeklyEntry[]) => {
  const wages = new Map(jobs.map((job) => [job.id, job.hourlyWage]));
  return roundYen(
    weeks.reduce(
      (total, week) =>
        total +
        Object.entries(hoursByJobForWeek(week)).reduce(
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
    for (const [jobId, hours] of Object.entries(hoursByJobForWeek(week))) {
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
  additionalYearToDateIncome = 0,
  futurePeriodType: PeriodType = "normal",
): ForecastResult => {
  const hours = weeks.map(totalWeeklyHours);
  const regimeHours = {
    normal: weeks.filter((week) => week.periodType === "normal").map(totalWeeklyHours),
    officialLongVacation: weeks.filter((week) => week.periodType === "officialLongVacation" && Object.keys(week.dailyHoursByJob ?? {}).length > 0).map(totalWeeklyHours),
  };
  // Never borrow observations from the other school-period regime. A quiet
  // normal semester and a busy official vacation describe different schedules.
  const activeHours = regimeHours[futurePeriodType];
  const expectedHours = weightedWeeklyHours(activeHours);
  const lowHours = Math.min(quantile(activeHours, 0.25), expectedHours);
  const highHours = Math.max(quantile(activeHours, 0.75), expectedHours);
  const enteredWeeksIncome = earnedIncome(jobs, weeks);
  const incomeSoFar = enteredWeeksIncome + roundYen(additionalYearToDateIncome);
  const averageWage = weightedHourlyWage(jobs, weeks);

  return {
    enteredWeeksIncome,
    additionalYearToDateIncome: roundYen(additionalYearToDateIncome),
    incomeSoFar,
    averageHourlyWage: averageWage,
    meanHours: mean(hours),
    low: buildScenario(lowHours, averageWage, remainingWeeks, incomeSoFar),
    expected: buildScenario(expectedHours, averageWage, remainingWeeks, incomeSoFar),
    high: buildScenario(highHours, averageWage, remainingWeeks, incomeSoFar),
    regimes: {
      normal: {
        weekCount: regimeHours.normal.length,
        averageWeeklyHours: regimeHours.normal.length ? mean(regimeHours.normal) : null,
        expectedWeeklyHours: regimeHours.normal.length ? weightedWeeklyHours(regimeHours.normal) : null,
      },
      officialLongVacation: {
        weekCount: regimeHours.officialLongVacation.length,
        averageWeeklyHours: regimeHours.officialLongVacation.length ? mean(regimeHours.officialLongVacation) : null,
        expectedWeeklyHours: regimeHours.officialLongVacation.length ? weightedWeeklyHours(regimeHours.officialLongVacation) : null,
      },
    },
  };
};

export const calculateCustomScenario = (
  weeklyHours: number,
  hourlyWage: number,
  remainingWeeks: number,
  incomeSoFar: number,
) => buildScenario(weeklyHours, hourlyWage, remainingWeeks, incomeSoFar);
