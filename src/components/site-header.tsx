"use client";

import Link from "next/link";
import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";
import { getAlternatePath } from "@/i18n/routing";
import { useLocale } from "./locale-provider";

export function SiteHeader() {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const alternatePath = getAlternatePath(pathname, locale);
  return (
    <header className="site-header">
      <Link className="brand" href={`/${locale}`} aria-label="ShiftWise Japan home">
        <span className="brand-mark">S</span>
        <span>ShiftWise <b>Japan</b></span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href={`/${locale}#how-it-works`}>{t("navHow")}</Link>
        <Link href={`/${locale}/calculator`}>{t("navCalculator")}</Link>
        <Link className="language-button" href={alternatePath} hrefLang={locale === "en" ? "ja" : "en"}>
          <Languages size={16} aria-hidden="true" /> {t("language")}
        </Link>
      </nav>
    </header>
  );
}
