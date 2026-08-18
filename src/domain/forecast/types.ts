export type Job = {
  id: string;
  name: string;
  hourlyWage: number;
};

export type WeeklyEntry = {
  id: string;
  label: string;
  hoursByJob: Record<string, number>;
};

export type Scenario = {
  weeklyHours: number;
  remainingIncome: number;
  annualIncome: number;
  monthlyAverage: number;
};

export type ForecastResult = {
  earnedIncome: number;
  averageHourlyWage: number;
  meanHours: number;
  low: Scenario;
  expected: Scenario;
  high: Scenario;
};
