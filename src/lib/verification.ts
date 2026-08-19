import type { Metadata } from "next";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const verificationMetadata: Metadata["verification"] = googleSiteVerification
  ? { google: googleSiteVerification }
  : undefined;
