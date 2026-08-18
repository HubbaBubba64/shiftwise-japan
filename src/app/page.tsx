"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, BriefcaseBusiness, CalendarRange, PiggyBank } from "lucide-react";
import { Disclaimer } from "@/components/disclaimer";
import { useLocale } from "@/components/locale-provider";

export default function Home() {
  const { t } = useLocale();
  const benefits = [
    [BriefcaseBusiness, "track", "trackBody"],
    [BarChart3, "forecast", "forecastBody"],
    [CalendarRange, "simulate", "simulateBody"],
    [PiggyBank, "prepare", "prepareBody"],
  ] as const;
  return (
    <main>
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow"><span />{t("heroEyebrow")}</p>
          <h1>{t("heroTitle")}</h1>
          <p className="hero-body">{t("heroBody")}</p>
          <div className="hero-actions">
            <Link className="button primary" href="/calculator">{t("primaryCta")}<ArrowRight size={18} /></Link>
            <Link className="button secondary" href="#how-it-works">{t("secondaryCta")}</Link>
          </div>
          <p className="proof">{t("proof")}</p>
        </div>
        <div className="forecast-preview" aria-label="Example income forecast">
          <div className="preview-top"><span>2026 forecast</span><span className="live-dot">Updated</span></div>
          <p className="preview-label">Expected annual income</p>
          <p className="preview-total">¥1,468,000</p>
          <div className="range-track"><span /></div>
          <div className="range-labels"><span>¥1.21m<br/><small>Low</small></span><span>¥1.72m<br/><small>High</small></span></div>
          <div className="mini-chart" aria-hidden="true">
            {[34, 53, 75, 42, 66, 84, 50, 72, 43, 62, 79, 58].map((height, index) => <i key={index} style={{height: `${height}%`}} />)}
          </div>
          <p className="preview-note">Built from 12 weeks of changing shifts</p>
        </div>
      </section>
      <section className="benefits shell" id="how-it-works">
        {benefits.map(([Icon, title, body], index) => (
          <article key={title}><span className="benefit-number">0{index + 1}</span><Icon /><h2>{t(title)}</h2><p>{t(body)}</p></article>
        ))}
      </section>
      <section className="cta-band shell">
        <div><p className="eyebrow"><span />Start with what you know</p><h2>{t("calculatorTitle")}</h2></div>
        <Link className="button primary light" href="/calculator">{t("primaryCta")}<ArrowRight size={18}/></Link>
      </section>
      <footer className="shell"><p>{t("footer")}</p><Disclaimer /><p>© 2026 ShiftWise Japan</p></footer>
    </main>
  );
}
