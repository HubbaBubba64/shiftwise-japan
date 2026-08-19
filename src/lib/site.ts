const DEVELOPMENT_SITE_URL = "http://localhost:3000";

type SiteUrlEnvironment = {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  VERCEL_URL?: string;
};

export const normalizeSiteUrl = (value: string, production = false) => {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("The resolved site URL must be a valid absolute URL.");
  }
  if (url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
    throw new Error("The resolved site URL must contain only the origin, without a path, query, credentials, or fragment.");
  }
  if (production && ["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname)) {
    throw new Error("The resolved site URL cannot use a localhost origin in production.");
  }
  if (url.protocol !== "https:" && !(url.protocol === "http:" && !production)) {
    throw new Error("The resolved site URL must use HTTPS in production.");
  }
  return url.origin;
};

export const resolveSiteUrl = (environment: SiteUrlEnvironment, production = false) => {
  const candidate = environment.NEXT_PUBLIC_SITE_URL
    ?? (environment.VERCEL_PROJECT_PRODUCTION_URL ? `https://${environment.VERCEL_PROJECT_PRODUCTION_URL}` : undefined)
    ?? (environment.VERCEL_URL ? `https://${environment.VERCEL_URL}` : undefined)
    ?? (!production ? DEVELOPMENT_SITE_URL : undefined);

  if (!candidate) {
    throw new Error(
      "A production site URL is required. Set NEXT_PUBLIC_SITE_URL, VERCEL_PROJECT_PRODUCTION_URL, or VERCEL_URL.",
    );
  }
  return normalizeSiteUrl(candidate, production);
};

export const siteUrl = resolveSiteUrl(
  {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    VERCEL_URL: process.env.VERCEL_URL,
  },
  process.env.NODE_ENV === "production",
);

export const absoluteUrl = (path: string) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
