# Independent verification 3 — PASS

Verified 2026-08-29 UTC against candidate commit
`886b3744f7578ecf9b0e180c673ea50156779613` and the live product at
<https://answer-anchored-flashcards.sociobot.in>.

## Result

**PASS.** The live artifact matches the candidate build byte-for-byte and the
real offline flashcard workflow works. One low-severity automated-regression
coverage issue is recorded below; it does not reproduce as a product failure.

## Mandatory first checks

Fresh browser cold read of the deployed root:

> "Score the answer you actually recall" — "For self-learners who want the
> next interval based on a typed answer, not a rating guess." The adjacent
> primary action is **Try it with sample data**, with "Three due cards open
> next."

This meets the plain-words first-screen requirement: it explains the job, the
intended learner, and the first action. The one-click demo loaded its three
real sample cards and displayed the persistent **Demo — sample data** banner.

From a clean checkout, `npm ci` installed 22 packages with zero audit
vulnerabilities. Every command in `.factory/claims.json` was then invoked
individually through the product test entry point and passed:

| Claim | Result |
|---|---|
| `offline-reload` | PASS |
| `answer-types` | PASS |
| `interval-reason` | PASS |
| `csv-export` | PASS |
| `anki-export` | PASS |
| `encrypted-backup` | PASS |
| `demo-isolation` | PASS |
| `local-privacy` | PASS |
| `keyboard-review` | PASS |
| `free-limit` | PASS |
| `paid-desk` | PASS |

The complete local suite then passed: `npm test` (32/32), `npm run typecheck`,
`npm run build`, `npm audit --audit-level=low`, and `git diff --check`.
The production build emits `dist/`; initial JS is 33.10 KB raw / 11.44 KB gzip
and CSS is 18.44 KB raw / 4.97 KB gzip, within the static-PWA budgets.

## Live product evidence

- `verify-url.sh` passed on the root: HTTP 200, title present, `lang=en`, one
  `h1`, a `main`, zero missing image alternatives, zero unlabeled buttons, and
  zero console/page errors (903 ms load in that check).
- Independent Playwright + axe scans of `/`, `/demo`, `/cards`, `/privacy`,
  `/terms`, and the 404 route in both light and dark themes found **0
  serious/critical** WCAG 2A/2AA findings (12 scans). The 404 correctly returns
  HTTP 404 and renders the designed page.
- At 390 px, `/`, `/demo`, and `/privacy` had no horizontal overflow and no
  visible link/button/summary below 44 px. Keyboard-only demo review with
  `Ctrl+Enter` scored 100%; focus moved to the result heading. The first Tab
  exposes the skip link with a `3px` solid visible focus ring.
- Normal demo flow scored exact, numeric-tolerance, and checklist samples;
  local claims additionally cover boundary/concurrent 30-card creation,
  duplicate submission, checklist substring rejection, encrypted restore, and
  Unicode/numeric scoring paths.
- During a live review, Anki CSV export, and encrypted-backup export, the
  browser made exactly three requests: document, same-origin JS, and
  same-origin CSS. No request was off-origin; neither the typed answer nor the
  backup passphrase appeared in a request body; no analytics/telemetry/beacon
  request or console/page error occurred.
- The deployed service worker is active with no waiting worker. After a first
  visit, a live offline reload of `/demo` showed the review screen and offline
  notice; offline navigation to `/cards?demo=1` retained the notice. A
  controlled update test against the byte-identical production `dist/` worker
  displayed **A new version is ready**, activated **Update now**, retained a
  controller, and left no waiting worker.
- Security/cache checks: HSTS, CSP (including `frame-ancestors 'none'`),
  `nosniff`, strict-origin referrer policy, and permissions policy are present.
  HTML and `sw.js` revalidate at 30 seconds; hashed JS uses
  `public, max-age=31536000, immutable`. The manifest contains standalone
  display, a versioned start URL, and 192/512 maskable icons.
- All discovered internal links returned 200 (except the intentionally checked
  404); the hosted checkout link returned the expected 303 to Dodo; `mailto:`
  is explicit. A real purchase was not attempted because it would create a
  charge; the catalog/checkout integration and mocked valid-license path are
  covered by the paid claim test.
- The Sociobot product-unlock verification endpoint enforces its allowance:
  an independent 40-request invalid-license burst produced **30 HTTP 200 and
  10 HTTP 429**. A 429 included `Retry-After: 4`; observed allowance is 30
  requests per active window.

## Deployment identity

Local `dist/` and live responses had identical SHA-256 values:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `ff4cb23c2b904cd9680c4f55a4ee4a064364abbfd6a595ccdd3bd21a73767b20` |
| `assets/index-DhDYIuC6.js` | `3f27a22a5860d820b64a1e33112556a4b504443b9a4dfd7a877a00c8df23ddc5` |
| `assets/index-BB7BhwC2.css` | `926b97b863ee9df99cb8f5b6401719908ca2d001ad0291ad06970bffa21922e6` |
| `sw.js` | `162e292b7c5c1fd2ce9f60a32088ff03a5de5a33feb6aed52df82ff33e121c13` |
| `manifest.webmanifest` | `aa9dc5a56c36be8ae44b4ef189b3813d707012567a6f92cb53cf06e5f0909ed6` |

## Defects

### Low — service-worker update regression test removed

Candidate `886b374` deletes `tests/pwa.spec.ts`, reducing `npm test` from 33
to 32 tests and removing the committed controlled update regression. Direct
independent testing of the exact built/live worker passed, so this is not a
release blocker. Restore an automated update-path test before the next
product change so this PWA requirement remains protected.

No critical, high, or medium defects found.
