"use client";

import { Calculator } from "@/components/calculator";
import { Disclaimer } from "@/components/disclaimer";
import { useLocale } from "@/components/locale-provider";

export default function CalculatorPage() {
  const { t } = useLocale();
  return <main className="calculator-page"><section className="calculator-intro shell"><p className="eyebrow"><span />{t("calculatorEyebrow")}</p><h1>{t("calculatorTitle")}</h1><p>{t("calculatorBody")}</p></section><div className="shell"><Calculator/><Disclaimer/></div></main>;
}
