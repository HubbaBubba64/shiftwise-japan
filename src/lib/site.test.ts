import { describe, expect, it } from "vitest";
import { normalizeSiteUrl, resolveSiteUrl } from "./site";

describe("production site origin", () => {
  it("prefers an explicit NEXT_PUBLIC_SITE_URL", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://custom.example/", VERCEL_PROJECT_PRODUCTION_URL: "production.vercel.app", VERCEL_URL: "preview.vercel.app" }, true)).toBe("https://custom.example");
  });

  it("uses VERCEL_PROJECT_PRODUCTION_URL when the explicit URL is absent", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "shiftwise-production.vercel.app", VERCEL_URL: "preview.vercel.app" }, true)).toBe("https://shiftwise-production.vercel.app");
  });

  it("uses VERCEL_URL when no explicit or project production URL exists", () => {
    expect(resolveSiteUrl({ VERCEL_URL: "shiftwise-preview.vercel.app" }, true)).toBe("https://shiftwise-preview.vercel.app");
  });

  it("uses localhost only in local development", () => {
    expect(resolveSiteUrl({}, false)).toBe("http://localhost:3000");
    expect(() => resolveSiteUrl({}, true)).toThrow(/production site URL is required/);
  });

  it("normalizes a production HTTPS origin", () => {
    expect(normalizeSiteUrl("https://shiftwise.example/", true)).toBe("https://shiftwise.example");
  });

  it.each([
    "http://shiftwise.example",
    "https://shiftwise.example/path",
    "https://shiftwise.example?preview=true",
    "https://user:secret@shiftwise.example",
    "not-a-url",
  ])("rejects an unsafe production value: %s", (value) => {
    expect(() => normalizeSiteUrl(value, true)).toThrow();
  });

  it.each(["http://localhost:3000", "https://127.0.0.1:3000", "https://[::1]"])(
    "rejects a local production origin: %s",
    (value) => expect(() => normalizeSiteUrl(value, true)).toThrow(/localhost origin/),
  );
});
