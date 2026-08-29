# Adversarial first-read review 2 — Recall Anchor

Reviewed 2026-08-29 UTC against `8bf472010047b8415f14fa5b477ce126ac3a26b5` and <https://answer-anchored-flashcards.sociobot.in>.

## Verdict

**FAIL — 3 findings: 1 blocking, 1 major, 1 minor.**

The cold first-read and demo gates pass. Every declared claim command passes from a clean clone, as does the full 39-test suite. The acceptance standard is zero findings, and the router loses Back/Forward scroll position while two public assertions are absent from the claim register.

## Cold first screen

Fresh 390 × 844 and 1440 × 900 contexts were used before scrolling.

| Viewport | What it does | For whom | First action | Gate |
|---|---|---|---|---|
| 390 × 844 | Scores flashcards from typed answers and selects a next review date. | People studying alone. | **Try it with sample data**; three sample cards open. | PASS |
| 1440 × 900 | Same. | Same. | Same. | PASS |

The visible copy is “Score flashcards from typed answers,” “For people studying alone who want the next review date based on an answer, not a guessed rating,” and **Try it with sample data** followed by “Three due cards open next.” All three required facts are above the fold at both sizes.

## Findings

### F-2-1 — Back navigation loses the prior reading position

**Severity: BLOCKING — routing behavior is incomplete.**

- **Location:** `src/main.ts`, `render(true)` and the `popstate` handler.
- **Evidence:** In a fresh live 390 px context, I set home to `scrollY = 1200`, navigated to `/cards`, then used browser Back. The URL, focused h1, and live announcement returned correctly, but scroll returned to the top instead of the prior reading location. The route-change code calls `scrollTo({ top: 0, ... })` even after `popstate`.
- **Why it matters:** A phone visitor who opens Cards while reading the lower landing page loses their place on Back. The required routing behavior includes Back/Forward scroll restoration as well as focus.
- **Fix:** Save `{scrollY}` in `history.replaceState` before every `pushState`. On `popstate`, render, restore that state’s scroll position, and retain the h1 focus/live announcement without a forced top scroll. Add a regression that asserts landing → Cards → Back → Forward restores both positions.

### F-2-2 — The initial sample promised by the primary action is not a listed claim

**Severity: major — unlisted claim.**

- **Quote/location:** Landing: “Three due cards open next.” README: “It opens three due sample cards in separate browser storage.”
- **Evidence:** `.factory/claims.json` has no claim for initial three-card sample data or for the landing action destination. `@claim:demo-isolation` visits `/demo` and sees `/3 due/`, but its registered claim is only “Demo cards never enter the real collection.”
- **Why it matters:** This is the expected outcome of the only primary action. It can regress while every declared claim remains green.
- **Fix:** Add `demo-sample`: “Try it with sample data opens three due sample cards in isolated browser storage.” Its tagged test must start at `/`, click the primary action, assert `?demo=1`, `3 due`, the banner, and an empty real collection after **Start for real**. Or remove the exact count from both locations.

### F-2-3 — Footer provenance is an unlisted, untestable public assertion

**Severity: minor — unlisted claim.**

- **Quote/location:** Landing footer: “Hero illustration generated with factory-image on August 28, 2026.”
- **Evidence:** No claim entry covers this historical assertion. `.factory/design.md` records provenance, but a sandbox test cannot establish that historical generation event from the displayed sentence.
- **Why it matters:** The page presents a provenance fact with no regression contract.
- **Fix:** Remove this public sentence and retain provenance in `.factory/design.md`, or publish a versioned provenance record and test that the displayed asset/version maps to it.

## Copy audit

Counts treat hyphenated compounds, URLs, shortcuts, versions, and identifiers as one word. Headings, labels, actions, and footer strings are included. No item exceeds 22 words. No banned marketing adjective, unclear result button, jargon, or mood-heading was found. `F-2-2` and `F-2-3` are the only copy flags.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Pass |
| Recall Anchor | 2 | Pass |
| Study | 1 | Pass |
| Cards | 1 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Typed-answer flashcard review | 3 | Pass |
| Score flashcards from typed answers | 5 | Pass |
| For people studying alone who want the next review date based on an answer, not a guessed rating. | 18 | Pass |
| Try it with sample data | 5 | Pass |
| Three due cards open next. | 5 | F-2-2 |
| Works offline after your first visit | 6 | `offline-reload` |
| Cards stay in this browser | 5 | `local-privacy` |
| Free for 30 cards | 4 | `free-limit` |
| Typed answer → answer key → next review date | 7 | Pass |
| Typed answer | 2 | Pass |
| claim, evidence | 2 | Pass |
| Answer key | 2 | Pass |
| 2 of 3 matched | 4 | Pass |
| Next review | 2 | Pass |
| Tomorrow | 1 | Pass |
| How Recall Anchor scores a review | 6 | Pass |
| See what matched and when to review again | 9 | Pass |
| Type your answer before seeing the key | 7 | Pass |
| Write the answer you remember. | 5 | Pass |
| Compare it with the answer key | 6 | Pass |
| Use exact text, a number range, or a checklist. | 9 | `answer-types` |
| See why the card returns when it does | 9 | Pass |
| Read what matched and the next review date. | 8 | `interval-reason` |
| Data storage and privacy | 4 | Pass |
| Cards and reviews stay in this browser | 7 | `local-privacy` |
| Cards and reviews are stored on this device. | 9 | `local-privacy` |
| Read the privacy details | 4 | Pass |
| Local only | 2 | Pass |
| Plans | 1 | Pass |
| Use 30 cards free or buy unlimited cards | 9 | `free-limit`, `paid-desk` |
| $19 | 1 | `paid-desk` |
| one-time purchase | 2 | `paid-desk` |
| The Recall Anchor Desk license adds unlimited cards and review trends. | 11 | `paid-desk` |
| The free plan includes 30 cards, every card type, and every export. | 12 | Covered by limit/type/export claims |
| Buy Recall Anchor Desk license | 5 | `paid-desk` |
| opens hosted checkout | 3 | `paid-desk` |
| Read purchase terms | 3 | Pass |
| Have a license? | 3 | Pass |
| Paste your license | 3 | Pass |
| Verify license | 2 | `license-network` |
| Score cards from typed answers, not guessed ratings. | 8 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| opens in a new tab | 5 | Pass |
| Version 1.0.3 | 2 | Pass |
| Hero illustration generated with factory-image on August 28, 2026. | 8 | F-2-3 |

### README

| Copy | Words | Result |
|---|---:|---|
| Recall Anchor | 2 | Pass |
| Score flashcards from the answer you type, not a rating you guess. | 12 | Pass |
| Recall Anchor is a study tool for people who study on their own. | 13 | Pass |
| Type an answer, compare it with the answer key, and see the next review date. | 15 | Pass |
| After your first visit, it works without an internet connection. | 10 | `offline-reload` |
| Live site URL | 3 | Pass |
| Try the isolated demo | 4 | Pass |
| Open `?demo=1` or the live demo URL. | 6 | F-2-2 |
| It opens three due sample cards in separate browser storage. | 10 | F-2-2 |
| Use Reset demo to restore the sample. | 6 | `demo-reset` |
| Use Start for real to open your own empty collection. | 10 | `demo-isolation` |
| What it includes | 3 | Pass |
| Exact answers, numbers within a range, and lists of required points. | 11 | `answer-types` |
| A typed answer, answer-key result, and next review date after every review. | 12 | `interval-reason` |
| Offline review after the first visit. | 6 | `offline-reload` |
| Review CSV and Anki-formatted card CSV downloads. | 6 | `csv-export`, `anki-export` |
| Download an encrypted backup and restore it with your passphrase. | 10 | `encrypted-backup` |
| Keyboard review, including `Ctrl+Enter` to score. | 6 | `keyboard-review` |
| A free 30-card plan. | 5 | `free-limit` |
| A $19 one-time Recall Anchor Desk license with unlimited cards and review trends. | 12 | `paid-desk` |
| Cards and reviews stay in browser storage. | 7 | `local-privacy` |
| Demo data stays separate from real cards. | 7 | `demo-isolation` |
| Sociobot is contacted only for a Desk checkout or license verification. | 10 | `license-network` |
| Technical details | 2 | Pass |
| Cards and reviews use IndexedDB. | 6 | Technical detail |
| Demo data uses the separate `recall-anchor-demo` database. | 7 | Technical detail |
| Encrypted backups use AES-GCM. | 4 | `encrypted-backup` |
| License tokens are namespaced in localStorage. | 6 | Technical detail |
| Develop | 1 | Pass |
| Requires Node.js 20 or newer. | 5 | Run requirement |
| Open the local URL printed by Vite. | 7 | Instruction |
| The production build is static. | 5 | Build property |
| Test and build | 3 | Pass |
| `npm test` | 2 | Command |
| `npm run build` | 3 | Command |
| `npm test` builds the product and runs Playwright claim, accessibility, persistence, route, and 390 px mobile checks. | 17 | Verified |
| The exact deployment command is `npm run build`. | 8 | Verified |
| Output lands in `dist/`, with `dist/index.html` at its root. | 9 | Verified |
| Each product claim and its sandbox test is listed in `.factory/claims.json`. | 11 | Verified |
| Demo behavior is documented in `.factory/demo.md`. | 6 | Verified |
| Deploy | 1 | Pass |
| Deploy the contents of `dist/` as a static site. | 9 | Instruction |
| `staticwebapp.config.json` supplies SPA fallback, security headers, and the 404 response for Azure Static Web Apps. | 15 | Verified |
| The factory owns DNS and deployment. | 6 | Scope statement |
| Privacy and payment | 3 | Pass |
| There are no analytics, third-party fonts, or third-party runtime scripts. | 10 | `local-privacy` |
| Study data does not leave the browser. | 7 | `local-privacy` |
| The one-time Desk purchase uses Sociobot’s hosted checkout and license verification. | 11 | `paid-desk`, `license-network` |
| See `/privacy` and `/terms` in the app. | 7 | Verified |
| License | 1 | Pass |
| MIT. | 1 | Verified |
| See `LICENSE`. | 2 | Verified |

## Demo, claims, and structure evidence

- Home’s primary action opened `/?demo=1` directly to the realistic exact card “What Spanish word means coffee?” The first view showed the answer field, confidence choices, scoring button, “FOUNDATIONS · 3 DUE,” and the persistent “Demo — sample data, nothing is saved to your cards” banner with **Reset demo** and **Start for real**.
- Reset restored sample data; Start for real showed an empty real collection in a fresh context. Demo and real state use separate IndexedDB namespaces. Offline review/export and same-origin privacy checks are in the passing claim tests.
- Clean clone `/tmp/recall-anchor-review-zqfcTV`: `npm ci`, each exact one-test claim command (15/15), `npm test` (39/39), and `npm run build` all passed. Gzip build output: JS 11.45 kB, CSS 5.01 kB.
- Live Home, Demo, Study, Cards, Privacy, and Terms return 200; unknown routes return a designed HTTP 404. Metadata, canonical/OG/Twitter fields, title pattern, one h1, main, favicon, sitemap, robots, header/footer, and internal-link crawl passed. Route focus and announcements work; F-2-1 is the scroll exception.
- The warm paper, worksheet rules, print marks, notched cards, vermilion/mustard ink, and original answer-slip art match `.factory/design.md` and are distinct from a generic SaaS template. The brief does not imply an AI feature; CSV export and encrypted backup/restore cover the useful transfer path.

## Earlier-finding regression audit

Every finding in `review-1.md` and `polish-1.md` was checked live and in code. All are fixed; no former ID regressed.

| IDs | Confirmation |
|---|---|
| F-1-1 | All required facts fit before the fold at both specified sizes. |
| F-1-2 | Offline test scores and exports while offline. |
| F-1-3 | Reset restores sample data without changing real data. |
| F-1-4 | Paid test proves price, 303 checkout, hosted one-time copy, and unlock. |
| F-1-5 | Public license-key contract removed. |
| F-1-6 | License request-boundary test covers no-license, explicit, return, stale cache. |
| F-1-7, F-1-8 | Unsupported merchant/refund wording removed. |
| F-1-9 | Revocation test relocks paid features while preserving exports. |
| F-1-10 | Unicode normalization is claim-tested. |
| F-1-11 | Export wording is concrete Anki-formatted CSV. |
| F-1-12 | Untestable product-boundary sentence removed. |
| F-1-13 through F-1-17 | Plain terms, useful headings, literal plan wording, and readable README are live. |
| F-1-18 | Dead visual-notes link is gone; its replacement introduces F-2-3. |
| F-1-19 | Route-level canonical/OG/Twitter updates work. |
| F-1-20 | Live 404 has shared shell, metadata, legal links, skip link, and current version. |

## What would make this perfect

Implement tested Back/Forward scroll restoration, register the exact initial demo promise, and remove or verifiably publish the historical hero provenance sentence. Then rerun the full review with zero findings.
