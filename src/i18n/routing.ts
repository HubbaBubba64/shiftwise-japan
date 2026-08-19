import type { Locale } from "./messages";

export const locales = ["en", "ja"] as const;
export const defaultLocale: Locale = "en";

export const seoPathPairs = [
  { en: "international-student-work-hours-japan", ja: "留学生-28時間" },
  { en: "international-student-part-time-income-japan", ja: "留学生-バイト-年収" },
  { en: "international-student-long-vacation-work-japan", ja: "留学生-夏休み-バイト" },
  { en: "variable-shift-income-calculator-japan", ja: "バイト-年収-予測" },
] as const;

export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

export const getAlternatePath = (pathname: string, locale: Locale) => {
  const alternateLocale: Locale = locale === "en" ? "ja" : "en";
  const segments = pathname.split("/").filter(Boolean);
  const slug = segments[1];
  if (!slug) return `/${alternateLocale}`;
  if (slug === "calculator") return `/${alternateLocale}/calculator`;
  const decodedSlug = decodeURIComponent(slug);
  const pair = seoPathPairs.find((item) => item[locale] === decodedSlug);
  return pair ? `/${alternateLocale}/${pair[alternateLocale]}` : `/${alternateLocale}`;
};
