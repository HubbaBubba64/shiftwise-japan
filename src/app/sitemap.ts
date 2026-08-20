import type { MetadataRoute } from "next";
import { seoPages } from "@/content/seo-pages";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/en/", "/ja/", "/en/calculator/", "/ja/calculator/"];
  return [...staticPaths, ...seoPages.map((page) => `/${page.locale}/${page.slug}`)].map((path) => ({ url: absoluteUrl(encodeURI(path)), lastModified: new Date("2026-08-20"), changeFrequency: path.includes("calculator") ? "weekly" as const : "monthly" as const, priority: path === "/" || path === "/en/" || path === "/ja/" ? 1 : path.includes("calculator") ? 0.9 : 0.8 }));
}
