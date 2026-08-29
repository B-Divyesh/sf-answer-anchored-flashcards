# Independent product verification 8 — PASS

## Scope and decision

- **Result: PASS — candidate `b9781d1d18894155abcd1591adb1de5ffa8d3511` is ready for release.**
- Checked URL: <https://answer-anchored-flashcards.sociobot.in> on 2026-08-29 UTC.
- Checked artifact class: offline PWA.
- Confirmed the live root HTML, JavaScript, CSS, service worker, and manifest match a local production build of the candidate by SHA-256.

## First-read and demo check

Confirmed a cold 1440 × 900 live load answers the three required questions in plain words:

- What it does: “Score flashcards from typed answers.”
- Who it is for: “For people studying alone who want the next review date based on an answer, not a guessed rating.”
- What to click: the visible one-click **Try it with sample data** link, with “Three due cards open next.”

Confirmed that link opens the isolated sample review and shows the persistent **Demo — sample data, nothing is saved to your cards** banner with **Reset demo** and **Start for real**.

## Claims check

Confirmed `.factory/claims.json` exists with 16 declared claims. The initial clean-checkout invocation correctly identified that dependencies were absent (`tsc: not found`); after `npm ci`, every declared claim selection was run and passed. A final candidate `npm test` run also rechecked every claim in the complete 42-test suite.

| Claim ID | Result |
| --- | --- |
| `offline-reload` | PASS |
| `answer-types` | PASS |
| `interval-reason` | PASS |
| `csv-export` | PASS |
| `anki-export` | PASS |
| `encrypted-backup` | PASS |
| `demo-isolation` | PASS |
| `demo-sample` | PASS |
| `demo-reset` | PASS |
| `local-privacy` | PASS |
| `keyboard-review` | PASS |
| `exact-normalization` | PASS |
| `free-limit` | PASS |
| `paid-desk` | PASS |
| `license-network` | PASS |
| `license-revocation` | PASS |

## Local quality checks

- Confirmed `npm ci` installed 22 packages and `npm audit --audit-level=low` reported 0 vulnerabilities.
- Confirmed `npm run typecheck` passed.
- Confirmed `npm test` passed: 42 Playwright checks in 1.7 minutes, including all claims, accessibility, persistence, routes, 390 px mobile, offline reload, and service-worker update.
- Confirmed `npm run build` passed and produced `dist/`.
- Checked package scripts: no separate lint script is configured; TypeScript is the configured static check.
- Confirmed the production payload is 35.97 KB JavaScript (12.09 KB gzip) and 18.64 KB CSS (5.01 KB gzip), below the static-PWA budgets.
- Confirmed a fresh mobile Lighthouse run: performance 95, accessibility 100, FCP 1.0 s, LCP 1.4 s, CLS 0, and TBT 260 ms.

## Live product checks

- Confirmed exact-text, numeric-tolerance, and checklist sample reviews score 100%, 100%, and 67% respectively for representative answers; each result shows typed evidence and the interval explanation.
- Checked invalid card input: a numeric card without an expected number announces “Add the expected answer before saving.” Confirmed adding `42` then saves the card.
- Checked invalid backup input: a five-character passphrase receives native minimum-length feedback. Confirmed a valid passphrase then downloads an encrypted backup.
- Confirmed demo storage isolation, reset behavior, CSV/Anki export, encrypted-backup restore validation, free 30-card behavior, and license state behavior through the passing suite.
- Confirmed `/privacy` and `/terms` are available and terms identify Sociobot/Dodo as merchant of record and refund handler.
- Confirmed the hosted checkout endpoint returns HTTP 303 to `checkout.dodopayments.com`.

## Browser, accessibility, privacy, and PWA checks

- Confirmed 390 px mobile width has no horizontal overflow and no visible link, button, or summary control smaller than 44 × 44 CSS px.
- Confirmed keyboard-only review: `Ctrl+Enter` scores the answer at 390 px. Checked the first Tab stop is the skip link with a solid 3 px focus outline.
- Confirmed Axe WCAG A/AA scans report 0 serious and 0 critical items on `/`, `/demo`, `/cards`, `/privacy`, `/terms`, and the not-found route.
- Confirmed live normal interaction emits 0 console errors and 0 page errors.
- Confirmed the demo review, export, and backup flow made three same-origin GET requests only; no off-origin request or answer/passphrase request body appeared.
- Checked live headers: HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, denied camera/microphone/geolocation permissions, and a CSP limited to the product origin plus the Sociobot license origin.
- Confirmed HTML, manifest, and service worker use 30-second revalidation; confirmed hashed JavaScript and CSS use `public, max-age=31536000, immutable`.
- Confirmed the live demo is service-worker controlled; after setting the browser offline, reload retained the sample review, showed the offline notice, and scored an answer. Confirmed the candidate suite checks the update notice and **Update now** activation path.
- Confirmed the product does not use sign-in, so the Entra tenant condition does not apply.

## Request allowance check

Checked `GET /api/v1/products/answer-anchored-flashcards/verify` with one client and an invalid license value. After 29 HTTP 200 responses in the measured sequence (following one initial single-request check in the same window), the next response was HTTP 429 with `Retry-After: 0`. Confirmed the observed allowance is 30 requests per window.

## Findings by severity

No release-blocking, high, medium, or low defects found in this verification.
