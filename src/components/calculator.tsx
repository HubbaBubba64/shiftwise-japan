"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, Plus, Trash2, TrendingUp } from "lucide-react";
import { calculateCustomScenario, calculateForecast, totalWeeklyHours } from "@/domain/forecast/calculations";
import type { Job, WeeklyEntry } from "@/domain/forecast/types";
import { useLocale } from "./locale-provider";

const initialJobs: Job[] = [{ id: "job-1", name: "Cafe", hourlyWage: 1300 }];
const demoHours = [10, 18, 26, 14, 23, 28, 17, 25];
const initialWeeks: WeeklyEntry[] = demoHours.map((hours, index) => ({
  id: `week-${index + 1}`,
  label: `Week ${index + 1}`,
  hoursByJob: { "job-1": hours },
}));

const yen = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
const numberValue = (value: string) => Math.max(0, Number(value) || 0);

export function Calculator() {
  const { t } = useLocale();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [weeks, setWeeks] = useState<WeeklyEntry[]>(initialWeeks);
  const [remainingWeeks, setRemainingWeeks] = useState(20);

  const valid = jobs.length > 0 && weeks.length >= 4;
  const forecast = useMemo(
    () => valid ? calculateForecast(jobs, weeks, remainingWeeks) : null,
    [jobs, weeks, remainingWeeks, valid],
  );
  const [futureHours, setFutureHours] = useState(20);
  const [futureWage, setFutureWage] = useState(1300);
  const scenario = forecast
    ? calculateCustomScenario(futureHours, futureWage, remainingWeeks, forecast.earnedIncome)
    : null;

  const addJob = () => {
    const id = `job-${crypto.randomUUID()}`;
    setJobs((current) => [...current, { id, name: `Job ${current.length + 1}`, hourlyWage: 1200 }]);
  };
  const removeJob = (id: string) => {
    setJobs((current) => current.filter((job) => job.id !== id));
    setWeeks((current) => current.map((week) => {
      const { [id]: removed, ...hoursByJob } = week.hoursByJob;
      void removed;
      return { ...week, hoursByJob };
    }));
  };
  const updateJob = (id: string, patch: Partial<Job>) =>
    setJobs((current) => current.map((job) => job.id === id ? { ...job, ...patch } : job));
  const addWeek = () => setWeeks((current) => current.length >= 12 ? current : [...current, {
    id: `week-${crypto.randomUUID()}`,
    label: `Week ${current.length + 1}`,
    hoursByJob: Object.fromEntries(jobs.map((job) => [job.id, 0])),
  }]);
  const updateHours = (weekId: string, jobId: string, hours: number) =>
    setWeeks((current) => current.map((week) => week.id === weekId
      ? { ...week, hoursByJob: { ...week.hoursByJob, [jobId]: hours } }
      : week));

  return (
    <div className="calculator-grid">
      <div className="calculator-form">
        <section className="form-card" aria-labelledby="jobs-heading">
          <div className="section-heading"><span><BriefcaseBusiness size={20}/></span><div><h2 id="jobs-heading">{t("jobs")}</h2><p>{t("trackBody")}</p></div></div>
          <div className="job-list">
            {jobs.map((job, index) => (
              <div className="job-row" key={job.id}>
                <span className="job-index">{index + 1}</span>
                <label><span>{t("jobName")}</span><input aria-label={`${t("jobName")} ${index + 1}`} value={job.name} onChange={(event) => updateJob(job.id, { name: event.target.value })}/></label>
                <label><span>{t("wage")} (¥)</span><input aria-label={`${t("wage")} ${index + 1}`} min="0" step="10" type="number" value={job.hourlyWage} onChange={(event) => updateJob(job.id, { hourlyWage: numberValue(event.target.value) })}/></label>
                {jobs.length > 1 && <button className="icon-button" aria-label={`${t("remove")} ${job.name}`} onClick={() => removeJob(job.id)} type="button"><Trash2 size={18}/></button>}
              </div>
            ))}
          </div>
          <button className="text-button" onClick={addJob} type="button"><Plus size={17}/>{t("addJob")}</button>
        </section>

        <section className="form-card" aria-labelledby="history-heading">
          <div className="section-heading"><span><TrendingUp size={20}/></span><div><h2 id="history-heading">{t("history")}</h2><p>{t("historyHelp")}</p></div></div>
          <div className="week-table-wrap"><table className="week-table"><thead><tr><th>{t("week")}</th>{jobs.map((job) => <th key={job.id}>{job.name}</th>)}<th>{t("combined")}</th></tr></thead>
            <tbody>{weeks.map((week, index) => <tr key={week.id}><th>{t("week")} {index + 1}</th>{jobs.map((job) => <td key={job.id}><input aria-label={`${t("week")} ${index + 1} ${job.name}`} min="0" max="80" step="0.5" type="number" value={week.hoursByJob[job.id] ?? 0} onChange={(event) => updateHours(week.id, job.id, numberValue(event.target.value))}/><small>h</small></td>)}<td className="week-total">{totalWeeklyHours(week).toFixed(1)}h</td></tr>)}</tbody>
          </table></div>
          <div className="row-actions"><button className="text-button" disabled={weeks.length >= 12} onClick={addWeek} type="button"><Plus size={17}/>{t("addWeek")}</button><button className="text-button muted" disabled={weeks.length <= 4} onClick={() => setWeeks((current) => current.slice(0, -1))} type="button">{t("removeWeek")}</button></div>
          <label className="weeks-control"><span>{t("remainingWeeks")}</span><input aria-label={t("remainingWeeks")} min="0" max="52" type="number" value={remainingWeeks} onChange={(event) => setRemainingWeeks(numberValue(event.target.value))}/></label>
        </section>
      </div>

      <aside className="results-column" aria-live="polite">
        {!forecast ? <div className="empty-results"><p>{t("validation")}</p></div> : <>
          <section className="results-card">
            <p className="eyebrow"><span />{t("results")}</p><h2>{new Date().getFullYear()} forecast</h2><p>{t("resultsBody")}</p>
            <div className="scenario-list">
              {(["low", "expected", "high"] as const).map((key) => <article className={`scenario ${key}`} key={key}><div><span>{t(key)}</span><strong>{forecast[key].weeklyHours.toFixed(1)} {t("weekly")}</strong></div><b>{yen.format(forecast[key].annualIncome)}</b></article>)}
            </div>
            <dl className="result-details"><div><dt>{t("earned")}</dt><dd>{yen.format(forecast.earnedIncome)}</dd></div><div><dt>{t("monthly")}</dt><dd>{yen.format(forecast.expected.monthlyAverage)}</dd></div></dl>
          </section>
          <section className="simulator-card">
            <div className="simulator-heading"><div><p className="eyebrow"><span />Simulator</p><h2>{t("simulator")}</h2></div><ArrowRight/></div><p>{t("simulatorBody")}</p>
            <div className="presets"><button type="button" onClick={() => setFutureHours(Math.max(0, Math.round(forecast.low.weeklyHours)))}>{t("quiet")}</button><button type="button" onClick={() => setFutureHours(Math.round(forecast.expected.weeklyHours))}>{t("typical")}</button><button type="button" onClick={() => setFutureHours(Math.round(forecast.high.weeklyHours))}>{t("busy")}</button></div>
            <label className="range-label"><span>{t("futureHours")}</span><strong>{futureHours}h</strong><input aria-label={t("futureHours")} type="range" min="0" max="40" step="1" value={futureHours} onChange={(event) => setFutureHours(numberValue(event.target.value))}/><span className="range-ends"><small>0h</small><small>40h</small></span></label>
            <label className="sim-wage"><span>{t("futureWage")} (¥)</span><input aria-label={t("futureWage")} type="number" min="0" step="10" value={futureWage} onChange={(event) => setFutureWage(numberValue(event.target.value))}/></label>
            <div className="scenario-total"><span>{t("scenarioIncome")}</span><strong>{yen.format(scenario!.annualIncome)}</strong><small className={scenario!.annualIncome >= forecast.expected.annualIncome ? "positive" : "negative"}>{scenario!.annualIncome >= forecast.expected.annualIncome ? "+" : ""}{yen.format(scenario!.annualIncome - forecast.expected.annualIncome)} · {t("difference")}</small></div>
          </section>
        </>}
      </aside>
    </div>
  );
}
