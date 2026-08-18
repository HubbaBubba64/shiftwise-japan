"use client";

import { Info } from "lucide-react";
import { useLocale } from "./locale-provider";

export function Disclaimer() {
  const { t } = useLocale();
  return <div className="disclaimer"><Info size={18} aria-hidden="true" /><p>{t("disclaimer")}</p></div>;
}
