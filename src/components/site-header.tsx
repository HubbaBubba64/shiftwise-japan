"use client";

import Link from "next/link";
import { Languages } from "lucide-react";
import { useLocale } from "./locale-provider";

export function SiteHeader() {
  const { t, toggleLocale } = useLocale();
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="ShiftWise Japan home">
        <span className="brand-mark">S</span>
        <span>ShiftWise <b>Japan</b></span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/#how-it-works">{t("navHow")}</Link>
        <Link href="/calculator">{t("navCalculator")}</Link>
        <button className="language-button" onClick={toggleLocale} type="button">
          <Languages size={16} aria-hidden="true" /> {t("language")}
        </button>
      </nav>
    </header>
  );
}
