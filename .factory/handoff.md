# Recall Anchor polish round 3 handoff

## Result

**PASS.** Commit `a6141443e679813a95a7907dfcc63878bd1261f6` removes the two regressed, unsupported Terms assertions about merchant-of-record status and refunds. The repair was pushed to `origin/main` and deployed to <https://answer-anchored-flashcards.sociobot.in> (Azure static deployment `a40ca198-57f8-4b5a-a91b-daabc565981a`).

The public Terms page now says only that Desk opens Sociobot’s hosted checkout and that an active license is required for paid features. The paid claim still verifies the real $19 catalog record, 303 checkout redirect, hosted one-time checkout text, and valid-license unlock. It no longer treats a self-authored legal assertion as proof.

## Verification

- Fresh clone `/tmp/recall-anchor-polish3-ntIpGV/repo`, at repair commit: `npm ci`; each of the 16 exact `.factory/claims.json` commands independently; `npm test` (42/42); `npm run typecheck`; `npm run build`; and `npm audit --audit-level=low` all passed.
- Production browser suite: `PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test` passed 42/42. This covers the PWA offline flow, scoring/export, demo reset/isolation, license flows, metadata, 404, mobile, Back/Forward restoration, accessibility, and privacy checks.
- Cold production checks: the live module is `/assets/index-D13V2Mir.js`; all first-screen facts fit at 390 × 844; the one-click `?demo=1` sample, persistent banner, reset, and Start for real exit work; `/`, `/study`, `/cards`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns the designed 404.
- Accessibility: Playwright Axe found zero WCAG 2 A/AA violations on all seven checked routes in both light and dark schemes. [verify-url evidence](polish-3-live/verify.json) records the live Home check with no console errors, `lang=en`, one h1, a main landmark, and no missing alt text or unnamed buttons.
- Performance: mobile Lighthouse scores are Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.5 s and CLS 0. The report is [lighthouse.json](polish-3-live/lighthouse.json). Build output is 12.05 kB gzip JS and 5.01 kB gzip CSS.
- Screenshots: [mobile home](polish-3-home-390.png), [mobile demo](polish-3-demo-390.png), [Terms](polish-3-terms-1440.png), and [404](polish-3-404-1440.png). The detailed finding-to-evidence map is [.factory/polish-3.md](polish-3.md).

## Run locally

```sh
npm ci
npm test
npm run typecheck
npm run build
```

`dist/` is the static deployment root. The demo entry point is `/?demo=1`.

## Known gaps and next steps

No product, review, accessibility, privacy, offline, routing, or documentation gaps remain. The factory owns future deployment and DNS changes.
