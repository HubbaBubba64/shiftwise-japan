"use client";

import Link from "next/link";
import { ArrowRight, CalendarCheck2, CircleCheck, Compass, Sprout, WalletCards } from "lucide-react";
import { Disclaimer } from "@/components/disclaimer";
import { useLocale } from "@/components/locale-provider";
import { PublicRoadmap } from "@/components/public-roadmap";

export function LandingPage() {
  const { locale, t } = useLocale();
  const benefits = [
    [CalendarCheck2, "track", "trackBody"], [Compass, "forecast", "forecastBody"],
    [WalletCards, "simulate", "simulateBody"], [Sprout, "prepare", "prepareBody"],
  ] as const;
  return <main>
    <section className="hero shell"><div className="hero-copy"><p className="eyebrow"><span />{t("heroEyebrow")}</p><h1>{t("heroTitle")}</h1><p className="hero-body">{t("heroBody")}</p><div className="hero-actions"><Link className="button primary" href={`/${locale}/calculator`}>{t("primaryCta")}<ArrowRight size={18}/></Link><Link className="button secondary" href="#how-it-works">{t("secondaryCta")}</Link></div><p className="proof">{t("proof")}</p></div><div className="forecast-preview" aria-label={t("outlookLabel").replace("{year}", "2026")}><div className="preview-top"><span>{t("outlookLabel").replace("{year}", "2026")}</span><span className="live-dot"><CircleCheck size={13}/>{t("updated")}</span></div><p className="preview-label">{t("onTrackFor")}</p><p className="preview-total">¥1,468,000</p><div className="range-track"><span/></div><div className="range-labels"><span>¥1.21m<br/><small>{t("quieterWeeks")}</small></span><span>¥1.72m<br/><small>{t("busyWeeks")}</small></span></div><div className="mini-chart" aria-hidden="true">{[34,53,75,42,66,84,50,72,43,62,79,58].map((height,index)=><i key={index} style={{height:`${height}%`}}/>)}</div><p className="preview-note"><CircleCheck size={13}/>{t("previewNote")}</p></div></section>
    <section className="benefits shell" id="how-it-works">{benefits.map(([Icon,title,body],index)=><article key={title}><span className="benefit-number">0{index+1}</span><Icon/><h2>{t(title)}</h2><p>{t(body)}</p></article>)}</section>
    <PublicRoadmap />
    <section className="cta-band shell"><div><p className="eyebrow"><span />{t("startWithKnown")}</p><h2>{t("calculatorTitle")}</h2></div><Link className="button primary light" href={`/${locale}/calculator`}>{t("primaryCta")}<ArrowRight size={18}/></Link></section>
    <footer className="shell"><p>{t("footer")}</p><Disclaimer/><p>© 2026 ShiftWise Japan</p></footer>
  </main>;
}
