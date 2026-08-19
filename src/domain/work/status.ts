import { mean, totalDailyHours, totalWeeklyHours } from "../forecast/calculations";
import type { PeriodType, WeeklyEntry } from "../forecast/types";
import { addDays, dateFallsInWeek, toIsoDate } from "./calendar";

export type LimitStatus = "within" | "possibleIssue";
export type DailyStatus = { date: string; hours: number; remainingHours: number; status: LimitStatus };

export type WorkHoursStatus = {
  periodType: PeriodType;
  highestWeeklyHours: number;
  averageWeeklyHours: number;
  normalWeeksOverLimit: number;
  currentWeekHours: number | null;
  currentWeekRemainingHours: number | null;
  currentWeekStatus: LimitStatus | null;
  dailyStatuses: DailyStatus[];
  daysOverLimit: number;
};

export const calculateWorkHoursStatus = (
  weeks: WeeklyEntry[],
  weeklyLimit: number,
  dailyLimit = 8,
  today = new Date(),
  currentPeriodType: PeriodType = "normal",
): WorkHoursStatus => {
  const totals = weeks.map(totalWeeklyHours);
  const todayIso = toIsoDate(today);
  const currentWeek = weeks.find((week) => dateFallsInWeek(todayIso, week.startDate, week.endDate));
  const currentWeekHours = currentWeek ? totalWeeklyHours(currentWeek) : null;
  const periodType = currentWeek?.periodType ?? currentPeriodType;
  const dailyStatuses = currentWeek && periodType === "officialLongVacation"
    ? Array.from({ length: 7 }, (_, index) => {
        const date = toIsoDate(addDays(new Date(`${currentWeek.startDate}T00:00:00`), index));
        const hours = totalDailyHours(currentWeek, date);
        return { date, hours, remainingHours: Math.max(0, dailyLimit - hours), status: hours <= dailyLimit ? "within" as const : "possibleIssue" as const };
      })
    : [];
  return {
    periodType,
    highestWeeklyHours: totals.length ? Math.max(...totals) : 0,
    averageWeeklyHours: mean(totals),
    normalWeeksOverLimit: weeks.filter((week) => week.periodType === "normal" && totalWeeklyHours(week) > weeklyLimit).length,
    currentWeekHours,
    currentWeekRemainingHours: periodType === "normal" && currentWeekHours !== null ? Math.max(0, weeklyLimit - currentWeekHours) : null,
    currentWeekStatus: currentWeekHours === null ? null : periodType === "normal"
      ? (currentWeekHours <= weeklyLimit ? "within" : "possibleIssue")
      : (dailyStatuses.some((day) => day.status === "possibleIssue") ? "possibleIssue" : "within"),
    dailyStatuses,
    daysOverLimit: dailyStatuses.filter((day) => day.status === "possibleIssue").length,
  };
};
