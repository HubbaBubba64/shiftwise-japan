import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "BaitoPlan | Choose your language",
  description: "Choose English or Japanese to use BaitoPlan.",
  alternates: { canonical: absoluteUrl("/"), languages: { en: absoluteUrl("/en/"), ja: absoluteUrl("/ja/"), "x-default": absoluteUrl("/") } },
  robots: { index: true, follow: true },
};

export default function LanguageChoice() {
  return <main className="language-choice"><div><span className="brand-mark">B</span><p>BaitoPlan</p><h1>Choose your language</h1><p>言語を選んでください</p><nav aria-label="Language selection"><Link href="/en" hrefLang="en">English</Link><Link href="/ja" hrefLang="ja">日本語</Link></nav></div></main>;
}
