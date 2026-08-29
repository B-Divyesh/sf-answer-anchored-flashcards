# Independent verification 6 — FAIL

## Scope and identity

- Candidate tested: `d1a4b11214be7991d459dac02bdd71b364b76dff`.
- Live URL: <https://answer-anchored-flashcards.sociobot.in>.
- Date: 2026-08-29 UTC.
- The live HTML, JavaScript, CSS, and social asset matched the candidate build byte-for-byte by SHA-256. This is a fresh deployed-candidate result, not a deployment mismatch.

## Release decision

**FAIL.** A correctly encrypted but structurally malformed backup can replace a real collection with data the app cannot render. Reload then produces an empty page and uncaught error with no in-app recovery. The paid terms also omit mandatory merchant-of-record and refund disclosure.

## Cold first read

PASS. Fresh live load says that Recall Anchor scores typed flashcard answers, is for people studying alone who want a next review date from an answer rather than a guessed rating, and tells the visitor to click **Try it with sample data**. The adjacent copy says three due cards open next. The action is visible without scrolling and opened `/?demo=1` in one click.

## Claims contract

`.factory/claims.json` exists and contains 16 claims. From the clean detached candidate checkout, after `npm ci`, I ran every declared command exactly once through the demo entry point. All passed (one targeted Playwright test each):

| Claim IDs | Result |
| --- | --- |
| `offline-reload`, `answer-types`, `interval-reason`, `csv-export` | PASS |
| `anki-export`, `encrypted-backup`, `demo-isolation`, `demo-sample` | PASS |
| `demo-reset`, `local-privacy`, `keyboard-review`, `exact-normalization` | PASS |
| `free-limit`, `paid-desk`, `license-network`, `license-revocation` | PASS |

The claim suite does not exercise decrypted-data schema validation. The green `encrypted-backup` test proves a valid backup restore but did not cover a validly encrypted malformed payload; it therefore did not catch QA6-01.

## Clean-checkout gates

- `npm ci`: PASS; 0 audited vulnerabilities.
- `npm test`: PASS, 41/41 Playwright tests.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; `dist/` produced.
- Production bundle: JavaScript 34.22 KB / 11.54 KB gzip; CSS 18.64 KB / 5.01 KB gzip, within budgets.
- No separate lint command exists in `package.json`.

A fresh Lighthouse CLI attempt could not attach to the disposable container's Chromium. Independently exercised semantic, axe, responsive, console, header, caching, and bundle-budget checks passed; this tool limitation is not the release blocker.

## Defects by severity

### High — QA6-01: malformed encrypted import corrupts persisted collection

Fresh production reproduction:

1. Open `/cards` in a new browser context and save the real exact card “Collection that must survive.”
2. Generate a version-1 Recall Anchor AES-GCM/PBKDF2 envelope using the accepted passphrase `valid-pass`; its decrypted JSON is `{"cards":[{}],"reviews":[]}`.
3. Import it through **Choose an encrypted backup** and accept the replacement confirmation.
4. Reload `/cards`.

Observed: `decryptBackup` verifies only that `cards` and `reviews` are arrays. The malformed record is saved before rendering. Reload has an empty body and zero h1 elements; Playwright receives the uncaught page error `Invalid time value`. The original collection is no longer accessible in the app; site-data clearing or developer tooling is required to recover. This fails the required invalid-input/recovery path and makes encrypted restore unsafe.

Required repair: validate every decrypted card and review field and its value constraints before confirmation or any IndexedDB write. Preserve the current collection on all validation/import errors, give an actionable status message, and add a tagged regression claim/test for malformed but validly encrypted backup data.

### Medium — QA6-02: terms omit required merchant/refund disclosure

Fresh live `/terms` says only, “The Desk purchase opens Sociobot’s hosted checkout. A license must be active for paid features to remain available.” It does not identify Sociobot/Dodo as merchant of record or state that refunds are handled there. The paid-unlock contract requires both disclosures.

Required repair: add plain-language merchant-of-record and refund handling text to `/terms`, and cover it with the relevant copy/route test.

## Product exercise and normal-path evidence

- Exact, numeric tolerance, and checklist demo cards score and record typed answer, rubric result, and next-interval explanation.
- Exact matching accepted uppercase decomposed `CAFÉ` with surrounding/repeated spaces. The claim suite covers numeric/checklist boundaries, free-limit transaction behavior, encrypted valid restore, demo isolation/reset, CSV/Anki export, license flows, and revocation.
- A real empty collection saved an exact card and the suite confirmed persistence across reload.
- Invalid card creation with no expected exact answer stayed on the form and announced “Add the expected answer before saving.” This is distinct from the failing malformed-backup recovery path.
- No sign-in is used; the Microsoft Entra tenant condition is not applicable.

## Live UX, accessibility, privacy, and PWA

- `verify-url.sh` passed: HTTP 200, title, `lang=en`, one h1, main, zero missing alt/unlabeled button findings, and zero normal-route console/page errors. Cold load observed at 1082 ms.
- Fresh Axe Playwright checks found zero serious or critical WCAG 2 A/AA violations on live demo at desktop, 390 px mobile, and dark scheme. At 390 px scroll width equalled client width; keyboard-only review showed a visible 3 px focus outline and Ctrl+Enter scored 100%.
- Reduced-motion preference was active with no active animations. Normal desktop, mobile, dark, and reduced-motion paths emitted no console/page errors.
- Playwright request logging across demo review, CSV export, and encrypted backup export saw only three same-origin GET requests and no passphrase in request data. No analytics, third-party script, or font traffic appeared.
- Browser headers include HSTS, `nosniff`, strict-origin referrer policy, denied camera/microphone/geolocation permissions, and a restrictive CSP. HTML/SW/manifest use 30-second revalidation; hashed JS is one-year immutable.
- Fresh live demo acquired a service-worker controller; its passing offline claim reloaded offline, scored a card, and exported CSV with an offline notice. Controlled replacement of the unchanged candidate service worker showed the update notice, activated **Update now**, reloaded under a controller, and left no worker waiting.
- `/`, `/study`, `/cards`, `/demo`, `/privacy`, `/terms`, PWA files, `robots.txt`, and `sitemap.xml` returned 200. An unknown route returned the designed 404 with HTTP 404.

## Payment and request allowance

- The live checkout returned HTTP 303 to `checkout.dodopayments.com`; the passing paid claim confirmed USD 19 catalog data and valid-license unlock.
- The only product server-side request is Sociobot license verification. A fresh one-client set of 35 invalid-token requests returned 30 HTTP 200 and 5 HTTP 429. Every 429 had `Retry-After: 4`; observed allowance is 30 requests per burst window.

## Decision

**FAIL. Do not release** candidate `d1a4b11214be7991d459dac02bdd71b364b76dff` until malformed encrypted imports cannot overwrite usable data and `/terms` carries the required merchant/refund disclosures.
