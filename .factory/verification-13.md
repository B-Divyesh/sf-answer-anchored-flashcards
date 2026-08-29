# Independent verification 13 — PASS

**Candidate:** `8cb4ba86776893c20625ee6c357df56d0b8ba428`  
**Verified:** 2026-08-29 UTC  
**Live URL:** <https://answer-anchored-flashcards.sociobot.in>

## Decision

**PASS.** The candidate passes the clean-clone claim gate and quality gates.
The live deployment byte-matches its production build and completes the brief's
core typed-answer, evidence, interval, offline, and export job.

## First read and demo

A cold browser opened the live home page. The first screen says “Score
flashcards from typed answers,” identifies “people studying alone,” and offers
**Try it with sample data** with “Three due cards open next.” It also shows
offline, local-browser, and 30-card facts. The action opens the isolated
three-card demo in one click. This passes the plain-words and demo requirements.

## Clean-clone test gate

`npm ci` completed with 0 vulnerabilities. Every exact `.factory/claims.json`
command was run independently and passed: `offline-reload`, `answer-types`,
`interval-reason`, `csv-export`, `anki-export`, `encrypted-backup`,
`demo-isolation`, `demo-sample`, `demo-reset`, `local-privacy`,
`local-data-deletion`, `card-removal-retention`, `keyboard-review`,
`exact-normalization`, `free-limit`, `paid-desk`, `license-network`, and
`license-revocation` (**18/18**).

- `npm test`: **47/47 passed** (`test-results/.last-run.json`: `passed`)
- `npm run typecheck`: passed
- `npm run build`: passed and produced `dist/`
- `npm audit --audit-level=low`: 0 vulnerabilities

Built JS is 35,956 bytes raw / 12.06 kB gzip; CSS is 18,644 bytes raw / 5.01
kB gzip; the mobile hero is 79,516 bytes. These are within the static/PWA
budgets.

## End-to-end and accessibility evidence

The live isolated demo accepted a case/space/decomposed-accent `café` exact
answer, accepted the inclusive numeric boundary `299802` for `299792 ± 10`
and marked it `matched`, and scored a partial checklist answer. Review CSV
downloaded as `recall-anchor-reviews.csv`.

The live form rejected a negative numeric tolerance with “Value must be greater
than or equal to 0.” Correcting it to 0 saved the card. At 390 px: no horizontal
overflow and no visible link/button/summary below 44 px. Tab reaches the skip
link with a 3 px outline; Enter moves focus to `#main`; reduced motion yields
an animation duration of `0.00001s`.

Live axe WCAG 2 A/AA checks found no serious or critical issues on `/`,
`/demo`, `/cards`, `/privacy`, `/terms`, and 404 in light and dark schemes
(**12/12 passed**). The live page has valid title/lang/main/one-h1 structure,
meaningful hero alt text, and no console or page errors in the exercised flows.
At 1440 × 900 there was no horizontal overflow and the three landing facts
remained in the first viewport.

## PWA, privacy, deployment, and allowance evidence

- The live manifest has standalone display, 192/512 maskable icons, and
  versioned start URL `/?v=1.0.9`.
- The live SW controlled the demo and cache `recall-anchor-v11` was present.
  Offline reload retained the review screen and showed the offline notice with
  no errors. The local update test passed its update-toast/`skipWaiting` path.
- Live demo review/export requests were same-origin only; no analytics,
  telemetry, off-origin study-data request, or passphrase transmission was
  observed. The claim suite also covers encrypted export.
- Routes carry HSTS, `nosniff`, strict-origin referrer policy, restrictive
  Permissions Policy, and CSP with `frame-ancestors 'none'`. Hashed JS has
  one-year immutable caching; HTML, manifest, and SW revalidate. The unknown
  URL returns actual HTTP 404. App, PWA, legal, sitemap, and robots URLs work.
- The billing verification endpoint admitted 30 rapid invalid-license requests;
  request 31 returned **429** with `Retry-After: 3` and
  `X-RateLimit-After: 3`.
- SHA-256 matched local `dist/` to live for HTML, JS, CSS, SW, manifest, and
  404. The earlier deployment-only mismatch is not present in this candidate.

## One non-blocking observation

An initial full live `npx playwright test` run had one failure in
`@claim:license-revocation`: its direct IndexedDB seed appeared as zero cards
after reload. The same exact live test then passed and passed 5/5 serial
repeats; all required clean-clone claims and the local full suite passed. This
is a **minor test-determinism observation** around direct-store seeding during
startup, not a reproduced user-flow defect. A test-only wait for initial data
loading would make future deployment checks less noisy.

## Defects by severity

- **Blocker/Critical/Major:** none found.
- **Minor:** the non-reproducible live parallel test setup race above.
- **Trivial:** none found.
