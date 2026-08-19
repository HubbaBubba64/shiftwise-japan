import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Calculator } from "@/components/calculator";
import { Disclaimer } from "@/components/disclaimer";
import { getSeoPage, seoPages } from "@/content/seo-pages";
import { isLocale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return seoPages.map(({ locale, slug }) => ({ locale, slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const page = getSeoPage(locale, decodeURIComponent(slug));
  if (!page) notFound();
  const canonicalPath = `/${locale}/${page.slug}`;
  const alternateLocale = locale === "en" ? "ja" : "en";
  const alternatePath = `/${alternateLocale}/${page.alternateSlug}`;
  const englishPath = locale === "en" ? canonicalPath : alternatePath;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: absoluteUrl(canonicalPath), languages: { en: absoluteUrl(locale === "en" ? canonicalPath : alternatePath), ja: absoluteUrl(locale === "ja" ? canonicalPath : alternatePath), "x-default": absoluteUrl(englishPath) } },
    openGraph: { title: page.title, description: page.description, url: absoluteUrl(canonicalPath), siteName: "ShiftWise Japan", locale: locale === "ja" ? "ja_JP" : "en_US", alternateLocale: locale === "ja" ? ["en_US"] : ["ja_JP"], type: "article" },
  };
}

export default async function SeoLandingPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const page = getSeoPage(locale, decodeURIComponent(slug));
  if (!page) notFound();
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  return <main className="seo-page">
    <article>
      <header className="seo-hero shell"><p className="eyebrow"><span/>{page.eyebrow}</p><h1>{page.h1}</h1><p>{page.intro}</p></header>
      {page.showCalculator && <section className="seo-calculator shell" aria-label={locale === "ja" ? "勤務時間と収入の計算" : "Work hours and income calculator"}><Calculator/></section>}
      <div className="seo-content shell">
        {page.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.points && <ul>{section.points.map((point) => <li key={point}><CheckCircle2 size={17}/><span>{point}</span></li>)}</ul>}</section>)}
        <section className="seo-faq"><p className="eyebrow"><span/>FAQ</p><h2>{locale === "ja" ? "よくある質問" : "Common questions"}</h2>{page.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
        {page.nextSlug && <nav className="next-topic" aria-label={locale === "ja" ? "関連ページ" : "Related page"}><span>{locale === "ja" ? "次に読む" : "Continue planning"}</span><Link href={`/${locale}/${page.nextSlug}`}>{page.nextLabel}<ArrowRight size={18}/></Link></nav>}
        <Disclaimer/>
      </div>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}/>
  </main>;
}
