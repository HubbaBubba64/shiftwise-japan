import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorPage } from "@/components/calculator-page";
import { isLocale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isJa = locale === "ja";
  const title = isJa ? "留学生の勤務時間・年収計算ツール｜ShiftWise Japan" : "Student Work Hours & Income Calculator Japan | ShiftWise Japan";
  const description = isJa ? "複数のアルバイト時間を合計し、通常期間と長期休暇を分けて年間収入を予測します。" : "Combine jobs, separate normal and official-vacation work history, and estimate your annual gross income.";
  return { title, description, alternates: { canonical: absoluteUrl(`/${locale}/calculator`), languages: { en: absoluteUrl("/en/calculator"), ja: absoluteUrl("/ja/calculator"), "x-default": absoluteUrl("/en/calculator") } }, openGraph: { title, description, url: absoluteUrl(`/${locale}/calculator`), locale: isJa ? "ja_JP" : "en_US", type: "website", siteName: "ShiftWise Japan" } };
}

export default function LocalizedCalculator() { return <CalculatorPage/>; }
