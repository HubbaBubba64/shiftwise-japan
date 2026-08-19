"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { messages, type Locale, type MessageKey } from "@/i18n/messages";

type LocaleContextValue = {
  locale: Locale;
  t: (key: MessageKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  const value = useMemo(
    () => ({
      locale,
      t: (key: MessageKey) => messages[locale][key],
    }),
    [locale],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
