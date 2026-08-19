export type Job = {
  id: string;
  name: string;
  hourlyWage: number;
};

export type PeriodType = "normal" | "officialLongVacation";

export type DailyHoursByJob = Record<string, Record<string, number>>;

export type WeeklyEntry = {
  id: string;
  startDate: string;
  endDate: string;
  periodType: PeriodType;
  hoursByJob: Record<string, number>;
  dailyHoursByJob?: DailyHoursByJob;
};

export type Scenario = {
  weeklyHours: number;
  remainingIncome: number;
  annualIncome: number;
  monthlyAverage: number;
};

export type ForecastResult = {
  enteredWeeksIncome: number;
  additionalYearToDateIncome: number;
  incomeSoFar: number;
  averageHourlyWage: number;
  meanHours: number;
  low: Scenario;
  expected: Scenario;
  high: Scenario;
  regimes: Record<PeriodType, RegimeForecast>;
};

export type RegimeForecast = {
  weekCount: number;
  averageWeeklyHours: number | null;
  expectedWeeklyHours: number | null;
};

export type VariabilityLevel = "low" | "moderate" | "high";

export type HistoryStatistics = {
  average: number;
  median: number;
  minimum: number;
  maximum: number;
  recentFourAverage: number;
  standardDeviation: number;
  variability: VariabilityLevel;
};
