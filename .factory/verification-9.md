# Independent product verification — PASS

Verified on 2026-08-29 UTC from a clean checkout at candidate `01a4f916f58a72b52fb86b73d895e43845a16bc7`.

- Live URL: <https://answer-anchored-flashcards.sociobot.in>
- Artifact: local-first offline PWA
- Result: **PASS — release candidate accepted**

## First-read and demo gate

**PASS.** A cold browser visit answered all three required questions on the first screen:

- What it does: “Score flashcards from typed answers.”
- For whom: “For people studying alone who want the next review date based on an answer, not a guessed rating.”
- What to do first: **Try it with sample data**, with the immediate outcome “Three due cards open next.”

The one-click action opened isolated demo mode. It showed three due sample cards and the persistent “Demo — sample data, nothing is saved to your cards” banner with **Reset demo** and **Start for real**. The 390 px layout retained these controls in the first screen.

## Clean-checkout gates

`npm ci` installed the lockfile dependencies successfully (22 packages; `npm audit --audit-level=low` found 0 vulnerabilities).

| Gate | Evidence | Result |
|---|---|---|
| Required claims file | `.factory/claims.json` exists with 16 claims | PASS |
| Every exact claims command | All 16 `npm test -- --grep @claim:<id>` commands listed in that file were run from the demo entry point after the clean install | PASS |
| Full automated suite | `npm test` | PASS, 43/43 |
| Type check | `npm run typecheck` (`tsc --noEmit`) | PASS |
| Lint | No lint script or linter is configured | N/A |
| Production build | `npm run build` produced `dist/` | PASS |
| Live automated suite | `PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test` | PASS, 43/43 |

The claim selections covered `offline-reload`, all three answer types, interval evidence, CSV/Anki export, encrypted backup recovery, demo sample/isolation/reset, local privacy, mobile keyboard review, Unicode normalization, the free limit, paid Desk behavior, license network behavior, and revocation.

## Functional, boundary, and accessibility QA

- The live demo completed exact-text review, preserved the typed answer, displayed the answer-key score and a plain explanation of its next interval, then downloaded `recall-anchor-reviews.csv`.
- Existing automated coverage passed normal, invalid, and boundary paths: Unicode/case/space normalization; numeric tolerance; checklist whole-item matching; malformed encrypted backup preservation; duplicate submit prevention; multi-tab writes; 30-card concurrent limit; reset/isolation; export; and license revocation while preserving exports.
- A 390 px keyboard-only review passed with `Ctrl+Enter`. Focused answer input has a visible 3 px vermilion outline; no horizontal overflow or sub-44 px visible controls was found at 390 px.
- The live 43-test suite includes Playwright axe checks for `/`, `/demo`, `/cards`, `/privacy`, `/terms`, and the 404 route in light and dark treatments. It passed with no serious or critical findings. The required `verify-url.sh` check also passed: one `h1`, `lang=en`, main landmark, title, no missing image alt text, no unnamed visible buttons, and no console errors. Its captured result is [verify.json](verification-9-evidence/verify.json).
- Under `prefers-reduced-motion: reduce`, control transition duration was `0.01ms`; the 390 px document width remained 390 px.

## Privacy, PWA, deployment, and networking

- A fresh live demo review, CSV export, encrypted-export flow, and offline reload emitted only requests to `https://answer-anchored-flashcards.sociobot.in`; no analytics, third-party scripts/fonts, or study-data requests appeared. The privacy page accurately limits Sociobot traffic to explicit or stale-license checks. No sign-in is used, so Entra tenant validation is not applicable.
- After service-worker activation, setting the browser offline and reloading the live demo retained the demo screen and showed “You are offline. Review and export still work.” The browser had an active service-worker controller. The candidate PWA update test also passed: a controlled new service-worker version showed **A new version is ready**, **Update now** activated it, and reload left an active worker with no waiting worker.
- The candidate build and live deployment are byte-identical for `index.html`, the hashed JS and CSS, `sw.js`, and `manifest.webmanifest`. SHA-256 comparisons passed for all five. The live module is `index-BLpr6aNU.js`, matching candidate `1.0.4`.
- Live headers returned HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive permissions policy, and CSP with only same-origin resources plus `https://api.sociobot.in` for license calls. Unknown routes correctly return HTTP 404 and the designed fallback. Hashed JS/CSS use `Cache-Control: public, max-age=31536000, immutable`; HTML, manifest, and service worker use 30-second revalidation.
- The Desk catalog and checkout are live: the advertised checkout returned HTTP 303 to `checkout.dodopayments.com`. A single-client sequence of 36 invalid-license requests to the documented verification endpoint returned 200 for requests 1–30 and 429 for 31–36. Each observed 429 carried `Retry-After: 3`; observed allowance: **30 requests per window**.

## Performance

Candidate build output is 35,891 B JS (12,025 B gzip) and 18,644 B CSS (5,021 B gzip). The 768 px mobile hero is 79,516 B; no web fonts are downloaded. These are within the static/PWA budgets (initial JS ≤200 KB, CSS ≤50 KB, mobile hero ≤300 KB).

## Findings by severity

No release-blocking, high, medium, or low defects were found in this verification.

## Acceptance decision

**PASS.** Candidate `01a4f916f58a72b52fb86b73d895e43845a16bc7` is deployed at the tested URL and satisfies the researched brief and factory acceptance contract.
