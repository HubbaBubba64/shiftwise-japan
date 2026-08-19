export const immigrationRules = {
  ruleYear: 2026,
  normalWeeklyHours: 28,
  officialLongVacationDailyHours: 8,
  assumptions: [
    "The user has the relevant comprehensive permission for activities outside their residence status.",
    "Official long vacation means a long vacation designated by the user's educational institution.",
    "Hours across all jobs are combined.",
  ],
  source: {
    title: "Permission to engage in activities other than those permitted under student status",
    organization: "Immigration Services Agency of Japan",
    url: "https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri07_00003.html",
  },
  lastVerifiedDate: "2026-08-19",
} as const;
