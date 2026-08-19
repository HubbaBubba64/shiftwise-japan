# ShiftWise Japan

ShiftWise Japan is a mobile-first planning tool that helps international students understand how changing part-time shifts affect their projected annual gross income.

## First milestone

This repository currently contains the anonymous vertical slice only:

- Trustworthy, bilingual landing page (English/Japanese)
- Multiple job and hourly-wage entry
- Four to twelve weeks of per-job work history
- Automatic combined weekly hours
- Explainable quiet, most-likely, and busy income scenarios
- Interactive future-hours and future-wage simulator
- Normal-school and official-long-vacation period modes
- Combined weekly checks in normal periods and combined per-day checks in official school long vacations
- Separate normal-period and long-vacation forecast regimes
- Responsive layouts for desktop and 375px mobile screens
- Pure calculation functions with unit tests and an essential Playwright flow

Authentication, database persistence, tax calculations, National Health Insurance calculations, individual immigration eligibility decisions, dashboards, and saved forecasts are intentionally not included yet.

## Forecast method

Expected weekly hours are calculated from the most recent history:

- Latest four available weeks: 60%
- Up to eight preceding weeks: 40%
- With fewer than five observations, the available recent mean is used

The quiet and busy cases use the 25th and 75th percentiles of entered weekly totals and are labelled as scenarios—not statistical confidence intervals. Per-job historical earnings use each job's wage. Future scenarios use the history-weighted average wage unless the user overrides it in the simulator. Yen values are rounded to whole yen.

The headline result is full calendar-year projected gross income:

`estimated income from entered weeks + other entered year-to-date gross income + projected remaining gross income`

Remaining weeks are calculated automatically from the current date to January 1 and can be overridden under Advanced assumptions. Weekly history uses Monday–Sunday date ranges.

## Work-hours reference

The informational status card uses versioned general references from the Immigration Services Agency of Japan: 28 hours per week during a normal school period and 8 hours per day during an official long vacation designated by the educational institution. Hours from every job are combined. A 40-hour vacation week is shown only as an informational total; it is not modeled as a universal weekly limit. This is not an individual eligibility or permission determination. Rule metadata and the verification date live in `src/config/immigrationRules.ts`.

Forecasting keeps normal-period and official-vacation history separate. Higher vacation weeks therefore do not increase the expected normal-period forecast.

## Stack

- Next.js 16 App Router
- React 19 and strict TypeScript
- Tailwind CSS 4 with custom responsive CSS
- Zod and React Hook Form available for later complex forms
- Vitest for domain unit tests
- Playwright for essential browser tests

## Local setup

Requirements: Node.js 20.9 or later and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

The first Playwright run may require `npx playwright install chromium`.

## Architecture

- `src/app`: routes, layout, and global visual system
- `src/components`: localized UI and calculator components
- `src/domain/forecast`: pure forecast and income calculations
- `src/i18n`: typed English and Japanese messages
- `tests/e2e`: anonymous browser journeys

## International SEO

English and Japanese content uses separate, statically generated URL prefixes (`/en/` and `/ja/`). Localized pages self-canonicalize and provide reciprocal `en`, `ja`, and `x-default` alternates. The language switcher links to the equivalent topic rather than returning to a locale homepage.

The initial indexable guides cover work hours, international-student part-time income, official long-vacation work, and variable-shift income forecasting. Tax and insurance pages are intentionally excluded until those products exist.

Set the public production origin when deploying so canonical, OpenGraph, sitemap, and robots URLs use the correct domain:

```bash
NEXT_PUBLIC_SITE_URL=https://shiftwise-japan.com
```

This value is optional on Vercel. URL resolution uses the first available value in this order:

1. `NEXT_PUBLIC_SITE_URL`
2. `https://${VERCEL_PROJECT_PRODUCTION_URL}`
3. `https://${VERCEL_URL}`
4. `http://localhost:3000` in local development only

Resolved production URLs must use HTTPS and contain only an origin. A production build fails only when none of the three production URL variables is available or when the resolved value is malformed.

## Deploying to Vercel

1. Import the GitHub repository into Vercel and keep the detected framework preset as **Next.js**.
2. Keep the standard install and build settings (`npm install` and `npm run build`). No custom output directory or `vercel.json` is required.
3. For a custom canonical domain, optionally add this in **Project Settings → Environment Variables**:

   ```text
   NEXT_PUBLIC_SITE_URL=https://shiftwise-japan.com
   ```

   Replace the example with the final canonical HTTPS origin if a different domain is used. When it is omitted, Vercel's `VERCEL_PROJECT_PRODUCTION_URL` is preferred, followed by `VERCEL_URL`. Because the resolved value is embedded in statically generated metadata, redeploy after changing it.
4. Deploy, then verify `/en`, `/ja`, `/sitemap.xml`, and `/robots.txt` on the public domain. Confirm that canonical and `hreflang` links use the same production origin.

For a local production-equivalent build in PowerShell:

```powershell
$env:NEXT_PUBLIC_SITE_URL="https://shiftwise-japan.com"
npm run build
npm run start
```

For bash-compatible shells:

```bash
NEXT_PUBLIC_SITE_URL=https://shiftwise-japan.com npm run build
npm run start
```

No manually configured environment variable is required for a normal Vercel deployment because Vercel supplies its URL variables automatically. `NEXT_PUBLIC_SITE_URL` is the only optional application variable and overrides those values. The anonymous MVP does not need database, authentication, email, storage, AI, tax, or insurance credentials.

## Privacy and limitations

Calculator state currently stays in React memory and is lost on refresh. It is not sent to a database. Results are estimates based entirely on entered assumptions and do not constitute legal, immigration, tax, or financial advice. The status card compares entries with configured general references; it does not determine individual eligibility or calculate tax or insurance.

## Next milestones

Later work can add persistence and authentication, a dashboard and history, and separately verified tax/NHI rule engines. Those features should not reuse unverified numeric rules.
