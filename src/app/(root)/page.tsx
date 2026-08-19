import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "ShiftWise Japan | Choose your language",
  description: "Choose English or Japanese to use ShiftWise Japan.",
  alternates: { canonical: absoluteUrl("/"), languages: { en: absoluteUrl("/en"), ja: absoluteUrl("/ja"), "x-default": absoluteUrl("/") } },
  robots: { index: false, follow: true },
};

export default function LanguageChoice() {
  return <main className="language-choice"><div><span className="brand-mark">S</span><p>ShiftWise Japan</p><h1>Choose your language</h1><p>言語を選んでください</p><nav aria-label="Language selection"><Link href="/en" hrefLang="en">English</Link><Link href="/ja" hrefLang="ja">日本語</Link></nav></div></main>;
}
