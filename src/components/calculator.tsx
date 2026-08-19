"use client";

import { Fragment, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, CalendarDays, ChevronDown, CircleCheck, Coffee, Gauge, Plus, Sparkles, Trash2 } from "lucide-react";
import { immigrationRules } from "@/config/immigrationRules";
import { calculateCustomScenario, calculateForecast, calculateHistoryStatistics, hoursByJobForWeek, totalDailyHours, totalWeeklyHours } from "@/domain/forecast/calculations";
import type { Job, PeriodType, WeeklyEntry } from "@/domain/forecast/types";
import { addDays, dateFallsInWeek, recentWeekRanges, remainingCalendarWeeks, toIsoDate } from "@/domain/work/calendar";
import { calculateWorkHoursStatus } from "@/domain/work/status";
import { useLocale } from "./locale-provider";

const initialJobs: Job[] = [{ id: "job-1", name: "Cafe", hourlyWage: 1300 }];
const demoHours = [10, 18, 26, 14, 23, 28, 17, 25];
const createInitialWeeks = (): WeeklyEntry[] => recentWeekRanges(demoHours.length).map((range, index) => ({
  id: `week-${index + 1}`,
  ...range,
  periodType: "normal",
  hoursByJob: { "job-1": demoHours[index] },
}));

const yen = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
const numberValue = (value: string) => Math.max(0, Number(value) || 0);

export function Calculator() {
  const { locale, t } = useLocale();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [weeks, setWeeks] = useState<WeeklyEntry[]>(createInitialWeeks);
  const automaticRemainingWeeks = useMemo(() => remainingCalendarWeeks(), []);
  const [manualRemainingWeeks, setManualRemainingWeeks] = useState<number | null>(null);
  const [additionalYearToDateIncome, setAdditionalYearToDateIncome] = useState(0);
  const [currentPeriodType, setCurrentPeriodType] = useState<PeriodType>("normal");
  const remainingWeeks = manualRemainingWeeks ?? automaticRemainingWeeks;
  const weeklyLimit = immigrationRules.normalWeeklyHours;

  const valid = jobs.length > 0 && weeks.length >= 4;
  const forecast = useMemo(
    () => valid ? calculateForecast(jobs, weeks, remainingWeeks, additionalYearToDateIncome, currentPeriodType) : null,
    [jobs, weeks, remainingWeeks, additionalYearToDateIncome, currentPeriodType, valid],
  );
  const statistics = useMemo(() => calculateHistoryStatistics(weeks), [weeks]);
  const workStatus = useMemo(() => calculateWorkHoursStatus(weeks, weeklyLimit, immigrationRules.officialLongVacationDailyHours, new Date(), currentPeriodType), [weeks, weeklyLimit, currentPeriodType]);
  const earlierAverage = useMemo(() => {
    const earlier = weeks.slice(-8, -4).map(totalWeeklyHours);
    return earlier.length ? earlier.reduce((sum, hours) => sum + hours, 0) / earlier.length : null;
  }, [weeks]);
  const [futureHours, setFutureHours] = useState(20);
  const [futureWage, setFutureWage] = useState(1300);
  const scenario = forecast ? calculateCustomScenario(futureHours, futureWage, remainingWeeks, forecast.incomeSoFar) : null;

  const formatWeek = (week: WeeklyEntry) => {
    const formatter = new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", { month: "short", day: "numeric" });
    return `${formatter.format(new Date(`${week.startDate}T00:00:00`))} – ${formatter.format(new Date(`${week.endDate}T00:00:00`))}`;
  };
  const addJob = () => {
    const id = `job-${crypto.randomUUID()}`;
    setJobs((current) => [...current, { id, name: `Job ${current.length + 1}`, hourlyWage: 1200 }]);
  };
  const removeJob = (id: string) => {
    setJobs((current) => current.filter((job) => job.id !== id));
    setWeeks((current) => current.map((week) => {
      const { [id]: removed, ...hoursByJob } = week.hoursByJob;
      void removed;
      const dailyHoursByJob = week.dailyHoursByJob && Object.fromEntries(Object.entries(week.dailyHoursByJob).map(([date, day]) => {
        const { [id]: removedDaily, ...remaining } = day;
        void removedDaily;
        return [date, remaining];
      }));
      return { ...week, hoursByJob, dailyHoursByJob };
    }));
  };
  const updateJob = (id: string, update: Partial<Job>) => setJobs((current) => current.map((job) => job.id === id ? { ...job, ...update } : job));
  const addWeek = () => setWeeks((current) => {
    if (current.length >= 12) return current;
    const lastEnd = new Date(`${current.at(-1)?.endDate ?? toIsoDate(new Date())}T00:00:00`);
    const start = addDays(lastEnd, 1);
    return [...current, { id: `week-${crypto.randomUUID()}`, startDate: toIsoDate(start), endDate: toIsoDate(addDays(start, 6)), periodType: currentPeriodType, hoursByJob: Object.fromEntries(jobs.map((job) => [job.id, 0])) }];
  });
  const updateHours = (weekId: string, jobId: string, hours: number) => setWeeks((current) => current.map((week) => week.id === weekId ? { ...week, hoursByJob: { ...week.hoursByJob, [jobId]: hours } } : week));
  const updateDailyHours = (weekId: string, date: string, jobId: string, hours: number) => setWeeks((current) => current.map((week) => week.id === weekId ? { ...week, dailyHoursByJob: { ...week.dailyHoursByJob, [date]: { ...week.dailyHoursByJob?.[date], [jobId]: hours } } } : week));
  const updateWeekPeriod = (weekId: string, periodType: PeriodType) => {
    const today = toIsoDate(new Date());
    const selectedWeek = weeks.find((week) => week.id === weekId);
    if (selectedWeek && dateFallsInWeek(today, selectedWeek.startDate, selectedWeek.endDate)) setCurrentPeriodType(periodType);
    setWeeks((current) => current.map((week) => week.id === weekId ? { ...week, periodType } : week));
  };
  const updateCurrentPeriod = (periodType: PeriodType) => {
    setCurrentPeriodType(periodType);
    const today = toIsoDate(new Date());
    setWeeks((current) => current.map((week) => dateFallsInWeek(today, week.startDate, week.endDate) ? { ...week, periodType } : week));
  };
  const formatDay = (date: string) => new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", { weekday: "long", month: "short", day: "numeric" }).format(new Date(`${date}T00:00:00`));
  const statItems = [[t("averageHours"), statistics.average], [t("medianHours"), statistics.median], [t("lowestWeek"), statistics.minimum], [t("highestWeek"), statistics.maximum], [t("recentAverage"), statistics.recentFourAverage]] as const;

  return <div className="calculator-grid">
    <div className="calculator-form">
      <section className="form-card" aria-labelledby="jobs-heading">
        <div className="section-heading"><span><Coffee size={20}/></span><div><h2 id="jobs-heading">{t("jobs")}</h2><p>{t("trackBody")}</p></div></div>
        <div className="job-list">{jobs.map((job, index) => <div className="job-row" key={job.id}><span className="job-index">{index + 1}</span><label><span>{t("jobName")}</span><input aria-label={`${t("jobName")} ${index + 1}`} value={job.name} onChange={(event) => updateJob(job.id, { name: event.target.value })}/></label><label><span>{t("wage")} (¥)</span><input aria-label={`${t("wage")} ${index + 1}`} min="0" step="10" type="number" value={job.hourlyWage} onChange={(event) => updateJob(job.id, { hourlyWage: numberValue(event.target.value) })}/></label>{jobs.length > 1 && <button className="icon-button" aria-label={`${t("remove")} ${job.name}`} onClick={() => removeJob(job.id)} type="button"><Trash2 size={18}/></button>}</div>)}</div>
        <button className="text-button" onClick={addJob} type="button"><Plus size={17}/>{t("addJob")}</button>
      </section>

      <section className="form-card" aria-labelledby="history-heading">
        <div className="section-heading"><span><CalendarDays size={20}/></span><div><h2 id="history-heading">{t("history")}</h2><p>{t("historyHelp")}</p></div></div>
        <div className="period-picker" role="group" aria-label={t("currentPeriod")}><span>{t("currentPeriod")}</span><div><button className={currentPeriodType === "normal" ? "active" : ""} onClick={() => updateCurrentPeriod("normal")} type="button">{t("normalPeriod")}</button><button className={currentPeriodType === "officialLongVacation" ? "active" : ""} onClick={() => updateCurrentPeriod("officialLongVacation")} type="button">{t("longVacationPeriod")}</button></div><small>{currentPeriodType === "normal" ? t("normalPeriodHelp").replace("{limit}", String(weeklyLimit)) : t("vacationPeriodHelp").replace("{limit}", String(immigrationRules.officialLongVacationDailyHours))}</small></div>
        <div className="history-summary">{statItems.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value.toFixed(1)}h</strong></div>)}<div><span>{t("variability")}</span><strong className={`variability ${statistics.variability}`}>{t(statistics.variability === "low" ? "variabilityLow" : statistics.variability === "moderate" ? "variabilityModerate" : "variabilityHigh")}</strong></div></div>
        <div className="week-table-wrap"><table className="week-table period-table"><thead><tr><th>{t("weekRange")}</th><th>{t("period")}</th>{jobs.map((job) => <th key={job.id}>{job.name}</th>)}<th>{t("combined")}</th></tr></thead><tbody>{weeks.map((week, index) => <Fragment key={week.id}><tr><th>{formatWeek(week)}<small>{index === weeks.length - 1 ? t("mostRecent") : ""}</small></th><td><select aria-label={`${formatWeek(week)} ${t("period")}`} value={week.periodType} onChange={(event) => updateWeekPeriod(week.id, event.target.value as PeriodType)}><option value="normal">{t("normalShort")}</option><option value="officialLongVacation">{t("vacationShort")}</option></select></td>{jobs.map((job) => <td key={job.id}>{week.periodType === "normal" ? <><input aria-label={`${formatWeek(week)} ${job.name}`} min="0" max="80" step="0.5" type="number" value={week.hoursByJob[job.id] ?? 0} onChange={(event) => updateHours(week.id, job.id, numberValue(event.target.value))}/><small>h</small></> : <span className="derived-hours">{(hoursByJobForWeek(week)[job.id] ?? 0).toFixed(1)}h</span>}</td>)}<td className="week-total">{totalWeeklyHours(week).toFixed(1)}h</td></tr>{week.periodType === "officialLongVacation" && <tr className="daily-editor-row"><td colSpan={jobs.length + 3}><div className="daily-editor"><div className="daily-editor-heading"><strong>{t("dailyHoursEntry")}</strong><span>{t("dailyHoursHelp").replace("{limit}", String(immigrationRules.officialLongVacationDailyHours))}</span></div>{Array.from({ length: 7 }, (_, dayIndex) => { const date = toIsoDate(addDays(new Date(`${week.startDate}T00:00:00`), dayIndex)); const dailyTotal = totalDailyHours(week, date); return <div className={`daily-entry ${dailyTotal > immigrationRules.officialLongVacationDailyHours ? "issue" : ""}`} key={date}><strong>{formatDay(date)}</strong>{jobs.map((job) => <label key={job.id}><span>{job.name}</span><input aria-label={`${formatDay(date)} ${job.name}`} min="0" max="24" step="0.5" type="number" value={week.dailyHoursByJob?.[date]?.[job.id] ?? 0} onChange={(event) => updateDailyHours(week.id, date, job.id, numberValue(event.target.value))}/></label>)}<span className="daily-total">{dailyTotal.toFixed(1)} / {immigrationRules.officialLongVacationDailyHours}h<small>{t(dailyTotal <= immigrationRules.officialLongVacationDailyHours ? "withinLimit" : "possibleIssue")}</small></span></div>; })}</div></td></tr>}</Fragment>)}</tbody></table></div>
        <div className="row-actions"><button className="text-button" disabled={weeks.length >= 12} onClick={addWeek} type="button"><Plus size={17}/>{t("addWeek")}</button><button className="text-button muted" disabled={weeks.length <= 4} onClick={() => setWeeks((current) => current.slice(0, -1))} type="button">{t("removeWeek")}</button></div>
        <details className="advanced"><summary><ChevronDown size={16}/>{t("advancedAssumptions")}</summary><div className="advanced-grid"><label className="weeks-control"><span>{t("remainingWeeks")}</span><input aria-label={t("remainingWeeks")} min="0" max="52" step="0.1" type="number" placeholder={automaticRemainingWeeks.toFixed(1)} value={manualRemainingWeeks ?? ""} onChange={(event) => setManualRemainingWeeks(event.target.value === "" ? null : numberValue(event.target.value))}/><small>{t("automaticWeeks")}: {automaticRemainingWeeks.toFixed(1)}</small></label><label className="weeks-control"><span>{t("additionalIncome")}</span><input aria-label={t("additionalIncome")} min="0" step="1000" type="number" value={additionalYearToDateIncome} onChange={(event) => setAdditionalYearToDateIncome(numberValue(event.target.value))}/><small>{t("additionalIncomeHelp")}</small></label></div></details>
      </section>

      <section className="form-card status-card" aria-labelledby="status-heading"><div className="section-heading"><span><Gauge size={20}/></span><div><h2 id="status-heading">{t("workHoursStatus")}</h2><p>{t("statusContext")}</p></div></div><div className={`limit-summary ${workStatus.currentWeekStatus === "possibleIssue" ? "issue" : "within"}`}><div>{workStatus.currentWeekStatus === "possibleIssue" ? <AlertTriangle size={18}/> : <CircleCheck size={18}/>}<strong>{t(workStatus.currentWeekStatus === "possibleIssue" ? "possibleIssue" : "withinLimit")}</strong></div>{workStatus.periodType === "normal" ? <b>{(workStatus.currentWeekHours ?? 0).toFixed(1)} / {weeklyLimit}h <small>{t("thisWeek")}</small></b> : <b>{t("officialVacationMode")}</b>}</div>{workStatus.periodType === "officialLongVacation" ? <div className="daily-status-list">{workStatus.dailyStatuses.map((day) => <div className={day.status} key={day.date}><span>{formatDay(day.date)}</span><strong>{day.hours.toFixed(1)} / {immigrationRules.officialLongVacationDailyHours}h</strong><small>{t(day.status === "within" ? "withinLimit" : "possibleIssue")}</small></div>)}<p>{t("weeklyInfoOnly").replace("{hours}", (workStatus.currentWeekHours ?? 0).toFixed(1))}</p></div> : <div className="friendly-status"><CircleCheck size={17}/><div><strong>{workStatus.currentWeekRemainingHours !== null && workStatus.currentWeekRemainingHours > 0 ? t("roomThisWeek") : t("lookingGood")}</strong><span>{earlierAverage !== null && statistics.recentFourAverage > earlierAverage ? t("busierLately") : t("planningHelps")}</span></div></div>}<div className="status-grid"><div><span>{t("highestEntered")}</span><strong>{workStatus.highestWeeklyHours.toFixed(1)}h</strong></div><div><span>{t("averageHours")}</span><strong>{workStatus.averageWeeklyHours.toFixed(1)}h</strong></div><div><span>{t("normalWeeksOver").replace("{limit}", String(weeklyLimit))}</span><strong>{workStatus.normalWeeksOverLimit}</strong></div><div><span>{workStatus.periodType === "normal" ? t("currentRemaining") : t("daysOver").replace("{limit}", String(immigrationRules.officialLongVacationDailyHours))}</span><strong>{workStatus.periodType === "normal" ? (workStatus.currentWeekRemainingHours === null ? t("notApplicable") : `${workStatus.currentWeekRemainingHours.toFixed(1)}h`) : workStatus.daysOverLimit}</strong></div></div><p className="rule-note">{t("ruleNoteBoth").replace("{weekly}", String(weeklyLimit)).replace("{daily}", String(immigrationRules.officialLongVacationDailyHours))} <a href={immigrationRules.source.url} target="_blank" rel="noreferrer">{t("officialSource")}</a> · {t("verified")} {immigrationRules.lastVerifiedDate}</p></section>
    </div>

    <aside className="results-column" aria-live="polite">{!forecast ? <div className="empty-results"><p>{t("validation")}</p></div> : <>
      <section className="results-card"><div className="result-kicker"><Sparkles size={15}/>{t("lookingGood")}</div><p className="eyebrow"><span />{t("results")}</p><h2>{t("outlookLabel").replace("{year}", String(new Date().getFullYear()))}</h2><p>{t("resultsBody")}</p><div className="regime-forecast"><strong>{t("hoursByPeriod")}</strong>{(["normal", "officialLongVacation"] as const).map((regime) => <div className={currentPeriodType === regime ? "active" : ""} key={regime}><span>{t(regime === "normal" ? "normalShort" : "vacationShort")}</span><b>{forecast.regimes[regime].averageWeeklyHours === null ? t("notEnoughHistory") : `${forecast.regimes[regime].averageWeeklyHours!.toFixed(1)}h ${t("averageShort")}`}</b><small>{forecast.regimes[regime].expectedWeeklyHours === null ? t("addRegimeWeek") : `${forecast.regimes[regime].expectedWeeklyHours!.toFixed(1)}h ${t("expectedShort")}`}</small></div>)}</div><div className="scenario-list">{(["low", "expected", "high"] as const).map((key) => <article className={`scenario ${key}`} key={key}><div><span>{t(key)}</span><strong>{forecast[key].weeklyHours.toFixed(1)} {t("weekly")}</strong></div><b>{yen.format(forecast[key].annualIncome)}</b></article>)}</div><div className="forecast-equation"><span>{yen.format(forecast.incomeSoFar)}</span><i>+</i><span>{yen.format(forecast.expected.remainingIncome)}</span><i>=</i><strong>{yen.format(forecast.expected.annualIncome)}</strong><small>{t("yearToDateGross")} + {t("projectedRemaining")} = {t("fullYearGross")}</small></div><dl className="result-details"><div><dt>{t("earned")}</dt><dd>{yen.format(forecast.enteredWeeksIncome)}</dd></div>{forecast.additionalYearToDateIncome > 0 && <div><dt>{t("additionalIncomeShort")}</dt><dd>{yen.format(forecast.additionalYearToDateIncome)}</dd></div>}<div><dt>{t("monthly")}</dt><dd>{yen.format(forecast.expected.monthlyAverage)}</dd></div></dl><div className="assumptions"><strong>{t("assumptions")}</strong><ul><li>{t("forecastRegimeAssumption").replace("{period}", t(currentPeriodType === "normal" ? "normalShort" : "vacationShort"))}</li><li>{t("assumptionWeeks").replace("{weeks}", remainingWeeks.toFixed(1))}</li><li>{t("assumptionWage").replace("{wage}", yen.format(forecast.averageHourlyWage))}</li><li>{t("assumptionMethod")}</li></ul></div></section>
      <section className="simulator-card"><div className="simulator-heading"><div><p className="eyebrow"><span />{t("simulatorLabel")}</p><h2>{t("simulator")}</h2></div><ArrowRight/></div><p>{t("simulatorBody")}</p><div className="planning-note"><Sparkles size={14}/>{t("planningHelps")}</div><div className="presets"><button type="button" onClick={() => setFutureHours(Math.max(0, Math.round(forecast.low.weeklyHours)))}>{t("quiet")}</button><button type="button" onClick={() => setFutureHours(Math.round(forecast.expected.weeklyHours))}>{t("typical")}</button><button type="button" onClick={() => setFutureHours(Math.round(forecast.high.weeklyHours))}>{t("busy")}</button></div><label className="range-label"><span>{t("futureHours")}</span><strong>{futureHours}h</strong><div className="range-wrap"><input aria-label={t("futureHours")} type="range" min="0" max="50" step="1" value={futureHours} onChange={(event) => setFutureHours(numberValue(event.target.value))}/>{currentPeriodType === "normal" && <i style={{ left: `${weeklyLimit / 50 * 100}%` }}><b>{weeklyLimit}h</b></i>}</div><span className="range-ends"><small>0h</small><small>50h</small></span></label>{currentPeriodType === "normal" && futureHours > weeklyLimit && <div className="limit-warning"><AlertTriangle size={16}/><span>{t("simulatorWarning").replace("{limit}", String(weeklyLimit))}</span></div>}{currentPeriodType === "officialLongVacation" && <div className="vacation-simulator-note"><CalendarDays size={16}/>{t("vacationSimulatorNote").replace("{limit}", String(immigrationRules.officialLongVacationDailyHours))}</div>}<label className="sim-wage"><span>{t("futureWage")} (¥)</span><input aria-label={t("futureWage")} type="number" min="0" step="10" value={futureWage} onChange={(event) => setFutureWage(numberValue(event.target.value))}/></label><div className="scenario-total"><span>{t("scenarioIncome")}</span><strong>{yen.format(scenario!.annualIncome)}</strong><small className={scenario!.annualIncome >= forecast.expected.annualIncome ? "positive" : "negative"}>{scenario!.annualIncome >= forecast.expected.annualIncome ? "+" : ""}{yen.format(scenario!.annualIncome - forecast.expected.annualIncome)} · {t("difference")}</small></div></section>
    </>}</aside>
  </div>;
}
