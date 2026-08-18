import type { Metadata } from "next";
import { Manrope, Noto_Sans_JP } from "next/font/google";
import { LocaleProvider } from "@/components/locale-provider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const noto = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto" });

export const metadata: Metadata = {
  title: { default: "ShiftWise Japan | Student shift & income planner", template: "%s | ShiftWise Japan" },
  description: "Track changing part-time hours and forecast annual income for international students in Japan.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${noto.variable}`}>
        <LocaleProvider><SiteHeader />{children}</LocaleProvider>
      </body>
    </html>
  );
}
