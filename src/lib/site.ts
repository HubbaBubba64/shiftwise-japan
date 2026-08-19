const DEVELOPMENT_SITE_URL = "https://shiftwise-japan.com";

export const normalizeSiteUrl = (value: string, production = false) => {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL.");
  }
  if (url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
    throw new Error("NEXT_PUBLIC_SITE_URL must contain only the site origin, without a path, query, credentials, or fragment.");
  }
  if (production && ["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname)) {
    throw new Error("NEXT_PUBLIC_SITE_URL cannot use a localhost origin in production.");
  }
  if (url.protocol !== "https:" && !(url.protocol === "http:" && !production)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production.");
  }
  return url.origin;
};

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !configuredSiteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required for production builds.");
}

export const siteUrl = normalizeSiteUrl(configuredSiteUrl ?? DEVELOPMENT_SITE_URL, isProduction);

export const absoluteUrl = (path: string) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
