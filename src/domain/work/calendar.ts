const DAY_MS = 24 * 60 * 60 * 1000;

const localDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const startOfWeek = (date: Date) => {
  const result = localDate(date);
  const mondayOffset = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - mondayOffset);
  return result;
};

export const addDays = (date: Date, days: number) => {
  const result = localDate(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const recentWeekRanges = (count: number, today = new Date()) => {
  const currentMonday = startOfWeek(today);
  return Array.from({ length: count }, (_, index) => {
    const start = addDays(currentMonday, (index - count + 1) * 7);
    return { startDate: toIsoDate(start), endDate: toIsoDate(addDays(start, 6)) };
  });
};

export const remainingCalendarWeeks = (today = new Date()) => {
  const start = localDate(today);
  const nextYear = new Date(start.getFullYear() + 1, 0, 1);
  return Math.max(0, (nextYear.getTime() - start.getTime()) / DAY_MS / 7);
};

export const dateFallsInWeek = (isoDate: string, startDate: string, endDate: string) =>
  isoDate >= startDate && isoDate <= endDate;
