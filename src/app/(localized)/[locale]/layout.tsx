import type { Metadata } from "next";
import { Manrope, Noto_Sans_JP } from "next/font/google";
import { notFound } from "next/navigation";
import { LocaleProvider } from "@/components/locale-provider";
import { SiteHeader } from "@/components/site-header";
import { isLocale, locales } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";
import "../../globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const noto = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto" });

export const metadata: Metadata = { metadataBase: new URL(siteUrl) };
export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocalizedLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale} data-scroll-behavior="smooth"><body className={`${manrope.variable} ${noto.variable}`}><LocaleProvider locale={locale}><SiteHeader/>{children}</LocaleProvider></body></html>;
}
