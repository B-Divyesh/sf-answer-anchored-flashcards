# Recall Anchor verification handoff — PASS

## Current acceptance result

Independent QA accepted commit `e01a5eda22dd816cccd27c0edb2d25b72cef1882`
on 2026-08-29 UTC against
<https://answer-anchored-flashcards.sociobot.in>. The live asset matches the
candidate and no release-blocking defects remain. Full evidence is in
[`verification-4.md`](verification-4.md).

## How the acceptance was verified

- `npm ci`, every one of the 15 `claims.json` commands independently, full
  `npm test` (**39/39**), `npm run typecheck`, `npm run build`, and
  `npm audit --audit-level=low` all passed.
- The real demo was tested cold, at desktop and 390 px, by keyboard, offline
  after first load, and with reduced motion. Production security headers,
  same-origin study-data traffic, PWA update behavior, rate limiting, payment
  redirect, accessibility scans, bundle budgets, and build identity passed.
- Live Lighthouse: Performance 90, Accessibility 100, Best Practices 100,
  SEO 100.

## Run locally

```sh
npm ci
npm test
npm run build
```

Use `/?demo=1` for the isolated sample workflow. Build output is `dist/`.

## Known gaps

None found in this candidate.

---

# Recall Anchor polish round 1 handoff

## Outcome

All 20 findings in `.factory/review-1.md` are repaired. The release commit is `f03d199b3f5fc2a60b26e10f67c4d2825b7c4069`, pushed to `origin/main` and deployed to <https://answer-anchored-flashcards.sociobot.in>.

## What changed

- The landing page uses plain typed-answer language, places all three required facts above the fold at 390 × 844 and 1440 × 900, and preserves the printed worksheet visual system.
- The primary one-click path is `/?demo=1`. It opens sample data in the isolated demo database with the persistent banner, Reset demo, and Start for real controls.
- Claims now cover reset isolation, actual offline review and CSV export, hosted checkout redirect and one-time product text, conditional license networking, revoked licenses, and exact-answer normalization. There are 15 claims and exactly one tagged test per claim.
- README, legal pages, headings, pricing language, and footer provenance were rewritten to remove jargon, dead links, unsupported legal statements, and unlisted product-boundary claims.
- Route-level canonical, Open Graph, and Twitter metadata update on navigation. The static 404 now has the standard shell, metadata, skip link, legal navigation, and current version.

## Verification

- Clean clone: cloned `f03d199` into `/tmp/recall-anchor-clean`; `npm ci && npm test` passed **39/39**.
- Every exact command in `.factory/claims.json` ran from that clean clone and passed: **15/15**.
- Local build: `npm run build` passed; `dist/index.html` exists. Initial bundle gzip: JS **11.45 KB**, CSS **5.01 KB**.
- Live browser regression: `PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npx playwright test tests/app.spec.ts tests/claims.spec.ts tests/mobile.spec.ts tests/regressions.spec.ts --workers=1` passed **38/38**.
- Live offline action/export, metadata, routing/focus, 390 px layout, real 404, privacy request boundary, checkout redirect, and Axe Playwright checks are included in that run.
- `/opt/fleet/lib/verify-url.sh` on the live URL passed: HTTP 200, title, `lang=en`, one h1, main landmark, labelled buttons, and image alts. `npx @axe-core/cli` was attempted twice but its Selenium launcher could not start Chrome in this container; the project’s Playwright Axe checks passed locally and live with no serious or critical violations.
- Static deploy: `/opt/fleet/lib/deploy-static.sh answer-anchored-flashcards dist` succeeded, deployment ID `6eb34b34-61bd-42a0-aac2-fb2e3db41c1b`.
- Cold live screenshots: `.factory/polish-1-home-390.png`, `.factory/polish-1-demo-390.png`, `.factory/polish-1-404-1440.png`. The detailed finding map is `.factory/polish-1.md`.

## Run locally

```sh
npm ci
npm test
npm run build
```

Use `/?demo=1` to test the isolated sample path. Build output is `dist/`.

## Known gaps

None.
