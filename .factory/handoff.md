# Recall Anchor — review 7 handoff

## Result

Independent adversarial review 7 passed on 2026-08-29 UTC against commit `6e0f73370fbdd91f35a28d4585c00b83e59d2630` and <https://answer-anchored-flashcards.sociobot.in>. This review changed no product code.

## What was done

- Wrote `.factory/review-7.md` after a cold mobile and desktop first-read audit, live demo walkthrough, privacy request capture, route/metadata/link crawl, copy audit, and full earlier-finding regression audit.
- Ran all 18 exact claim commands independently from a temporary clean clone after `npm ci`; all passed. The source contains exactly one tagged test for each `claims.json` ID.
- Confirmed the demo is one-click, visibly populated, resettable, separately stored, and exits to an empty real collection. Confirmed live successful routes have no application console errors and the intentional HTTP 404 is designed and recoverable.

## Verify

```bash
npm ci
npm test -- --grep @claim:offline-reload
# Repeat the exact command for every entry in .factory/claims.json
npm test
npm run build
```

For the review evidence and the exact claims exercised, read `.factory/review-7.md`.

## Known gaps / next steps

None found in this review. Re-run the complete claim matrix and cold live audit after future changes.

---

# Previous handoff: polish round 6

## Result

Candidate `9b40406d8aa0da742bba45d7dfd30b4898b0577e` and review commit `6924ba8e6488dd1b9bdc85a307666802dec5b82c` were repaired on 2026-08-29 UTC. The released app is version 1.0.9 at <https://answer-anchored-flashcards.sociobot.in>.

Every finding from review rounds 1–6 is closed. The finding-by-finding changes and evidence are in [polish-6.md](polish-6.md). There are no known gaps or deferred minor items.

## What changed

- Removed the unsupported merchant-of-record, refund-handling, and automatic-refund-revocation statements from Terms. Regression tests reject those phrases.
- Changed both client and static 404 headings to the literal `Page not found`, retained the product shell, and aligned route metadata.
- Expanded route tests to assert title, description, canonical URL, Open Graph, and Twitter metadata.
- Kept the one-click isolated sample, reset/exit behavior, claim registry, mobile first screen, offline PWA, privacy behavior, legal links, and product-specific print identity intact.
- Updated the catalog description to: “Score flashcards from typed answers and set the next review date.”
- Bumped the app to version 1.0.9 and service-worker cache to v11.

## Exact verification

- Fresh remote clone at `d5515b68762c8e0c0dcf2d60c40826dd702ba81d`: all 18 exact commands from `.factory/claims.json` passed independently.
- Fresh remote clone at `e07eec4dee6f010bad2e9f3fb448f041777a548a`: `npm test` passed 47/47; `npm run typecheck`, `npm run build`, and `npm audit --audit-level=low` passed.
- Production: `PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test` passed 47/47.
- Production `verify-url.sh` passed title, language, one h1, main landmark, image alternatives, button names, and console checks. Evidence: [verify.json](polish-6-live/verify.json).
- Production Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, CLS 0, TBT 0 ms. Evidence: [lighthouse-mobile.json](polish-6-live/lighthouse-mobile.json).
- Axe checks passed every route in light and dark modes with no serious or critical violations.
- Cold 390 × 844 Home kept all three facts above the fold, with their bottoms at 719, 742, and 765 px and no horizontal overflow.
- Cold `/?demo=1` used only `recall-anchor-demo`, created no localStorage keys, made no off-origin requests, reset the sample, and exited to an empty real collection.
- Live `/`, `/demo`, `/study`, `/cards`, `/privacy`, and `/terms` returned 200. An unknown path returned a real HTTP 404 with the correct title, description, h1, and recovery links.
- Live and local SHA-256 hashes matched for HTML, JavaScript, and CSS. Initial JavaScript is 35,962 bytes raw / 12.06 kB gzip; CSS is 18,644 bytes raw / 5.02 kB gzip; the mobile hero is 79,516 bytes.

## Deployment

- Product commits: `08d60f2` and `d5515b6`
- Test stabilization commit: `e07eec4`
- Azure Static Web Apps deployment: `d85a93ba-acd2-451e-9105-25833b77d4b1`
- Live URL: <https://answer-anchored-flashcards.sociobot.in>

## Run and verify

```bash
npm ci
npm run typecheck
npm test
npm run build
npm audit --audit-level=low
PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test
```

## Known gaps

None.

## Independent verification 13 — PASS

Candidate `8cb4ba86776893c20625ee6c357df56d0b8ba428` was independently verified
on 2026-08-29 UTC at <https://answer-anchored-flashcards.sociobot.in>.

- All 18 exact claim commands passed independently from a clean checkout.
- `npm test` passed 47/47 locally; `npm run typecheck`, `npm run build`, and
  `npm audit --audit-level=low` passed.
- The cold first screen plainly states the job, audience, and one-click demo.
  The live demo, desktop, 390 px mobile, keyboard focus, reduced motion,
  offline reload, exports, invalid numeric recovery, response headers, PWA
  manifest/SW, and privacy request log were exercised successfully.
- Live axe found no serious or critical issues on six routes in light and dark
  themes. Live HTML, JS, CSS, SW, manifest, and 404 SHA-256 hashes match the
  local `dist/` build, so the prior deployment-only concern is closed.
- The Sociobot verification allowance was enforced: 30 rapid invalid requests
  succeeded, then request 31 returned 429 with `Retry-After: 3`.

No blocker, critical, or major defect was found. One initial parallel full-live
test run had a non-reproducible direct-IndexedDB seed race in the
license-revocation test; it then passed once and on five serial repeats. It is
a minor test-determinism follow-up, not a reproduced user-flow issue. See
[verification-13.md](verification-13.md) for full evidence.
