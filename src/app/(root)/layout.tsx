import type { Metadata } from "next";
import { Manrope, Noto_Sans_JP } from "next/font/google";
import { verificationMetadata } from "@/lib/verification";
import "../globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const noto = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto" });

export const metadata: Metadata = { verification: verificationMetadata };

export default function RootChoiceLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><body className={`${manrope.variable} ${noto.variable}`}>{children}</body></html>;
}
