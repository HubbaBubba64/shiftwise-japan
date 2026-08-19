import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/landing-page";
import { isLocale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isJa = locale === "ja";
  const title = isJa ? "BaitoPlan（バイトプラン）｜留学生の勤務時間・年収予測" : "BaitoPlan | Student Work Hours & Income Planner";
  const description = isJa ? "複数のアルバイト時間をまとめ、変動するシフトから年間総収入を予測できる留学生向け無料ツール。" : "Combine multiple jobs, track changing work hours, and estimate annual income as an international student in Japan.";
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/${locale}`), languages: { en: absoluteUrl("/en"), ja: absoluteUrl("/ja"), "x-default": absoluteUrl("/") } },
    openGraph: { title, description, url: absoluteUrl(`/${locale}`), locale: isJa ? "ja_JP" : "en_US", alternateLocale: isJa ? ["en_US"] : ["ja_JP"], type: "website", siteName: "BaitoPlan" },
  };
}

export default function LocalizedHome() { return <LandingPage/>; }
