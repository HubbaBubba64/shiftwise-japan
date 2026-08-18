# ShiftWise Japan

ShiftWise Japan is a mobile-first planning tool that helps international students understand how changing part-time shifts affect their projected annual gross income.

## First milestone

This repository currently contains the anonymous vertical slice only:

- Trustworthy, bilingual landing page (English/Japanese)
- Multiple job and hourly-wage entry
- Four to twelve weeks of per-job work history
- Automatic combined weekly hours
- Explainable conservative, expected, and high-shift income scenarios
- Interactive future-hours and future-wage simulator
- Responsive layouts for desktop and 375px mobile screens
- Pure calculation functions with unit tests and an essential Playwright flow

Authentication, database persistence, tax calculations, National Health Insurance calculations, immigration-limit checks, dashboards, and saved forecasts are intentionally not included yet.

## Forecast method

Expected weekly hours are calculated from the most recent history:

- Latest four available weeks: 60%
- Up to eight preceding weeks: 40%
- With fewer than five observations, the available recent mean is used

The conservative and high-shift cases use the 25th and 75th percentiles of entered weekly totals and are labelled as scenarios—not statistical confidence intervals. Per-job historical earnings use each job's wage. Future scenarios use the history-weighted average wage unless the user overrides it in the simulator. Yen values are rounded to whole yen.

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

## Privacy and limitations

Calculator state currently stays in React memory and is lost on refresh. It is not sent to a database. Results are estimates based entirely on entered assumptions and do not constitute legal, immigration, tax, or financial advice. This milestone does not evaluate work-permission limits or calculate tax or insurance.

## Next milestones

Later work can add persistence and authentication, work-limit guidance based on verified official sources, a dashboard and history, and separately verified tax/NHI rule engines. Those features should not reuse unverified numeric rules.
