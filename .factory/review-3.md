# Adversarial first-read review 3 — Recall Anchor

Reviewed 2026-08-29 UTC against commit `cdd7638feabccb9913bcf3d22a680a8f6d50ef29` and the live site at <https://answer-anchored-flashcards.sociobot.in>.

## Verdict

**FAIL — 2 findings, both blocking regressions.**

The cold first-read gate, demo gate, declared claim tests, routing, accessibility, and visual-identity checks pass. The Terms page has reintroduced two unsupported legal claims previously recorded as F-1-7 and F-1-8. The required standard is zero findings.

## Cold first screen

Fresh browser contexts were opened at both sizes before scrolling.

| Viewport | What does it do? | For whom? | What should I click first? | Result |
|---|---|---|---|---|
| 390 × 844 | Scores flashcards from typed answers and sets a next review date. | People studying alone. | **Try it with sample data**; the adjacent copy says three due cards open next. | PASS |
| 1440 × 900 | Same. | Same. | Same. | PASS |

The exact first-screen copy is “Score flashcards from typed answers,” “For people studying alone who want the next review date based on an answer, not a guessed rating,” **Try it with sample data**, and “Three due cards open next.” The offline, storage, and price facts also fit before the fold at both sizes.

## Findings

### F-3-1 / F-1-7 — Merchant-of-record claim regressed

**Severity: BLOCKING — an earlier finding is live again.**

- **Exact quote/location:** `/terms`, Purchases: “Sociobot/Dodo is the merchant of record and handles refunds for Desk purchases.” The merchant-of-record clause is also in `src/main.ts:163`.
- **Evidence:** `.factory/claims.json` has no merchant-of-record claim. `@claim:paid-desk` only confirms that the product repeats this sentence; it does not verify a contract, policy, or authoritative external source establishing the legal role. `polish-1.md` and `polish-2.md` say F-1-7 was fixed by removing this statement, but commit `08fa80d` added it again.
- **Why this misleads:** A buyer can rely on this sentence to decide which company is legally responsible for the sale. A self-referential UI assertion does not prove that responsibility.
- **Concrete fix:** Remove “Sociobot/Dodo is the merchant of record” again. If it must remain, add a distinct claim entry and a test against a stable, authoritative purchase contract or policy URL; checking that Recall Anchor displays its own sentence is insufficient.

### F-3-2 / F-1-8 — Refund-handling claim regressed

**Severity: BLOCKING — an earlier finding is live again.**

- **Exact quote/location:** `/terms`, Purchases: “Sociobot/Dodo is the merchant of record and handles refunds for Desk purchases.” The refund clause is also in `src/main.ts:163`.
- **Evidence:** `.factory/claims.json` has no refund-handling claim. No test checks an authoritative refund policy or confirms where a buyer can request a refund. The `@claim:paid-desk` assertion only checks that the unsupported sentence is visible. `polish-1.md` and `polish-2.md` say F-1-8 was fixed by removing this statement, but it is present again.
- **Why this misleads:** The sentence creates a concrete support expectation for a purchaser without a verified policy or usable refund route.
- **Concrete fix:** Remove “and handles refunds for Desk purchases,” or replace it with a link to the actual refund policy and register a contract-backed claim test for the retained wording.

## Copy audit

Counts treat hyphenated terms, URLs, paths, versions, and keyboard shortcuts as one word. Symbols and arrows are not words. The tables include headings, labels, controls, captions, and informative fragments so the heading and result-naming-action checks are visible. Repeated shell text is listed once with its locations. No item exceeds 22 words, uses a banned marketing adjective, changes terms for the same concept, or uses a non-result-naming button. The two findings above are on Terms, not in the requested landing/README corpus.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Pass |
| RA | 1 | Decorative mark |
| Recall Anchor | 2 | Pass; header/footer |
| Study | 1 | Pass |
| Cards | 1 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Typed-answer flashcard review | 3 | Pass |
| Score flashcards from typed answers | 5 | Pass |
| For people studying alone who want the next review date based on an answer, not a guessed rating. | 18 | Pass |
| Try it with sample data | 5 | Pass |
| Three due cards open next. | 5 | `demo-sample` |
| Works offline after your first visit | 6 | `offline-reload` |
| Cards stay in this browser | 5 | `local-privacy` |
| Free for 30 cards | 4 | `free-limit` |
| 01 | 1 | Decorative number |
| Typed answer → answer key → next review date | 7 | Pass |
| Typed answer | 2 | Pass |
| claim, evidence | 2 | Realistic preview content |
| Answer key | 2 | Pass |
| 2 of 3 matched | 4 | Pass |
| Next review | 2 | Pass |
| Tomorrow | 1 | Pass |
| How Recall Anchor scores a review | 6 | Pass |
| See what matched and when to review again | 8 | Pass |
| 01 / 02 / 03 | 1 each | Decorative step numbers |
| Type your answer before seeing the key | 7 | Pass |
| Write the answer you remember. | 5 | Pass |
| Compare it with the answer key | 6 | Pass |
| Use exact text, a number range, or a checklist. | 9 | `answer-types` |
| See why the card returns when it does | 8 | Pass |
| Read what matched and the next review date. | 8 | `interval-reason` |
| Data storage and privacy | 4 | Pass |
| Cards and reviews stay in this browser | 7 | `local-privacy` |
| Cards and reviews are stored on this device. | 8 | `local-privacy` |
| Read the privacy details | 4 | Pass |
| Local only | 2 | Decorative stamp |
| Plans | 1 | Pass |
| Use 30 cards free or buy unlimited cards | 8 | `free-limit`, `paid-desk` |
| $19 | 1 | `paid-desk` |
| one-time purchase | 2 | `paid-desk` |
| The Recall Anchor Desk license adds unlimited cards and review trends. | 11 | `paid-desk` |
| The free plan includes 30 cards, every card type, and every export. | 12 | Limit, type, and export claims |
| Buy Recall Anchor Desk license | 5 | `paid-desk` |
| opens hosted checkout | 3 | `paid-desk` |
| Read purchase terms | 3 | Pass |
| Have a license? | 3 | Pass |
| Paste your license | 3 | Pass |
| Verify license | 2 | `license-network` |
| Score cards from typed answers, not guessed ratings. | 8 | Pass; footer |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| opens in a new tab | 5 | Pass |
| Version 1.0.3 | 2 | Pass |

### README

| Copy | Words | Result |
|---|---:|---|
| Recall Anchor | 2 | Pass |
| Score flashcards from typed answers, not guessed ratings. | 8 | Pass |
| Recall Anchor is a study tool for people who study on their own. | 13 | Pass |
| Type an answer, compare it with the answer key, and see the next review date. | 15 | Pass |
| After your first visit, it works without an internet connection. | 10 | `offline-reload` |
| Live site: `https://answer-anchored-flashcards.sociobot.in` | 3 | Pass |
| Try the isolated demo | 4 | Pass |
| Open `?demo=1` or <https://answer-anchored-flashcards.sociobot.in/?demo=1>. | 4 | `demo-sample` |
| It opens three due sample cards in separate browser storage. | 10 | `demo-sample` |
| Use Reset demo to restore the sample. | 7 | `demo-reset` |
| Use Start for real to open your own empty collection. | 10 | `demo-isolation` |
| What it includes | 3 | Pass |
| Exact answers, numbers within a range, and lists of required points. | 11 | `answer-types` |
| A typed answer, answer-key result, and next review date after every review. | 12 | `interval-reason` |
| Offline review after the first visit. | 6 | `offline-reload` |
| Review CSV and Anki-formatted card CSV downloads. | 7 | `csv-export`, `anki-export` |
| Download an encrypted backup and restore it with your passphrase. | 10 | `encrypted-backup` |
| Backup imports validate cards and reviews before replacing your collection. | 10 | `encrypted-backup` |
| Keyboard review, including `Ctrl+Enter` to score. | 6 | `keyboard-review` |
| A free 30-card plan. | 4 | `free-limit` |
| A $19 one-time Recall Anchor Desk license with unlimited cards and review trends. | 13 | `paid-desk` |
| Cards and reviews stay in browser storage. | 7 | `local-privacy` |
| Demo data stays separate from real cards. | 7 | `demo-isolation` |
| Sociobot is contacted only for a Desk checkout or license verification. | 11 | `paid-desk`, `license-network` |
| Technical details | 2 | Pass |
| Cards and reviews use IndexedDB. | 6 | Technical detail |
| Demo data uses the separate `recall-anchor-demo` database. | 7 | Technical detail |
| Encrypted backups use AES-GCM. | 4 | `encrypted-backup` |
| License tokens are namespaced in localStorage. | 6 | Technical detail |
| Develop | 1 | Pass |
| Requires Node.js 20 or newer. | 5 | Run requirement |
| `npm install` | 2 | Command |
| `npm run dev` | 3 | Command |
| Open the local URL printed by Vite. | 7 | Instruction |
| The production build is static. | 5 | Build property |
| Test and build | 3 | Pass |
| `npm test` | 2 | Command |
| `npm run build` | 3 | Command |
| `npm test` builds the product and runs Playwright claim, accessibility, persistence, route, and 390 px mobile checks. | 17 | Verified |
| The exact deployment command is `npm run build`. | 8 | Verified |
| Output lands in `dist/`, with `dist/index.html` at its root. | 9 | Verified |
| Each product claim and its sandbox test is listed in `.factory/claims.json`. | 11 | F-3-1 and F-3-2 show two omitted claims |
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

## Demo and sandbox behavior

- One click on the live primary action opened `/?demo=1` at “Answer before you see the key,” with the realistic prompt “What Spanish word means coffee?”, the answer field, confidence choices, and `Foundations · 3 due` already visible.
- The persistent banner says “Demo — sample data, nothing is saved to your cards.” It includes **Reset demo** and **Start for real**.
- A fresh live run created `REAL STORAGE SENTINEL` in `recall-anchor`, scored the demo, reset it, and returned to real mode. Demo reviews changed 2 → 3 → 2; the real database stayed at one sentinel card and zero reviews.
- The full live run made seven same-origin requests, no off-origin requests, and sent neither the typed answer nor sentinel text in a request body.
- A separate live service-worker run reloaded the sample offline, showed “You are offline. Review and export still work,” and scored the sample to 100%. Its request log contained only same-origin cached resources, with no failed requests or console errors.

The demo gate passes.

## Declared claim results

Fresh clone: `/tmp/recall-anchor-review3-9P9Ntk/repo` at `cdd7638`. After `npm ci`, every exact command from `.factory/claims.json` ran independently.

| Claim | Result |
|---|---|
| `offline-reload` | PASS, 1 test |
| `answer-types` | PASS, 1 test |
| `interval-reason` | PASS, 1 test |
| `csv-export` | PASS, 1 test |
| `anki-export` | PASS, 1 test |
| `encrypted-backup` | PASS, 1 test |
| `demo-isolation` | PASS, 1 test |
| `demo-sample` | PASS, 1 test |
| `demo-reset` | PASS, 1 test |
| `local-privacy` | PASS, 1 test |
| `keyboard-review` | PASS, 1 mobile test |
| `exact-normalization` | PASS, 1 test |
| `free-limit` | PASS, 1 test |
| `paid-desk` | PASS, 1 test |
| `license-network` | PASS, 1 test |
| `license-revocation` | PASS, 1 test |

The complete clean-clone `npm test` run also passed 42/42 and produced `dist/`; JavaScript is 12.09 kB gzip and CSS is 5.01 kB gzip. Live JS, CSS, and image asset SHA-256 hashes match the clean build. There is no failing listed claim test. F-3-1 and F-3-2 are unlisted claims.

## Structure, links, accessibility, and identity

- `/`, `/study`, `/cards`, `/demo`, `/privacy`, and `/terms` return 200. An unknown route returns the designed, on-brand HTTP 404.
- Every route has one h1, one main landmark, `lang=en`, a route-specific title, description, canonical, Open Graph/Twitter metadata, favicon, and shared header/footer. The 1200 × 630 social image and 180 × 180 apple-touch icon both return 200.
- All navigational internal links on the 200 routes return 200; the 404 skip link correctly stays on that 404 document. The checkout returns its expected 303 hosted-checkout redirect, Sociobot returns 200, and the privacy email is a valid `mailto:` link.
- Live Back/Forward restored the observed Home and Cards positions (1051 px and 415 px), focused the new h1, and updated the polite route announcement.
- `/opt/fleet/lib/verify-url.sh` passed the live Home page with no console errors, one h1, `lang=en`, one main landmark, and no missing alt text or unlabeled buttons.
- Live Axe checks found zero WCAG 2 A/AA violations on Home, Demo, Cards, Privacy, Terms, and 404 in both light and dark modes.
- The warm paper, halftone dots, worksheet rules, clipped corners, vermilion marks, editorial type, and answer-slip illustration match `.factory/design.md`. The result is visibly product-specific and not a generic SaaS template.

## Earlier-finding regression audit

Every finding in `review-1.md` and `review-2.md`, both polish reports, and the current handoff was checked against the live site and code rather than accepted from its recorded status.

| Earlier ID | Current confirmation | Status |
|---|---|---|
| F-1-1 | All three facts fit before the fold at 390 × 844 and 1440 × 900. | Fixed |
| F-1-2 | The offline claim test and live run score a card offline; the test also inspects an offline CSV. | Fixed |
| F-1-3 | Reset returns demo state to three cards/two reviews without changing the real sentinel. | Fixed |
| F-1-4 | The claim test verifies $19, a 303 Dodo redirect, one-time checkout copy, and paid unlock. | Fixed |
| F-1-5 | README does not publish the exact localStorage key as a public contract. | Fixed |
| F-1-6 | `license-network` covers no-license, explicit, returned, and stale-license request boundaries. | Fixed |
| F-1-7 | The unsupported merchant-of-record assertion is live again in Terms. | **Regressed: F-3-1** |
| F-1-8 | The unsupported refund-handling assertion is live again in Terms. | **Regressed: F-3-2** |
| F-1-9 | `license-revocation` confirms inactive licenses relock paid features while exports remain. | Fixed |
| F-1-10 | `exact-normalization` covers case, composed/decomposed accents, and extra spaces. | Fixed |
| F-1-11 | Public wording says Anki-formatted CSV; the test checks all six fields and three card rows. | Fixed |
| F-1-12 | The former three-part landing product-boundary sentence remains absent. | Fixed |
| F-1-13 | Landing and README use typed answer, answer key, and next review date. | Fixed |
| F-1-14 | All three process headings name their step out of context. | Fixed |
| F-1-15 | Privacy headings name data storage and browser location directly. | Fixed |
| F-1-16 | Plans and Recall Anchor Desk license terminology remain consistent. | Fixed |
| F-1-17 | README starts with the user task; implementation terms remain under Technical details. | Fixed |
| F-1-18 | The dead visual-notes footer reference remains absent. | Fixed |
| F-1-19 | Canonical, Open Graph, and Twitter fields update on every app route. | Fixed |
| F-1-20 | The live 404 has the shared shell, current version, metadata, legal links, and HTTP 404 status. | Fixed |
| F-2-1 | Back/Forward restores scroll, focus, and the route announcement live and in the regression test. | Fixed |
| F-2-2 | `demo-sample` registers and tests the exact one-click three-card promise. | Fixed |
| F-2-3 | The public historical image-provenance assertion remains absent; provenance stays in `.factory/design.md`. | Fixed |

The prior handoff’s “no product defects remain” statement applied to candidate `b9781d1`; later commit `08fa80d` reintroduced F-1-7 and F-1-8.

## Missed leverage

No missed-leverage finding. The brief calls for local answer scoring, interval explanations, and export. The product supplies review CSV, Anki-formatted CSV, encrypted backup/restore, and offline use. Sync would conflict with the current local-only promise unless made explicit and optional. Card generation is not implied, and adding AI would weaken the answer-first study constraint rather than complete it.

## What would make this perfect

Remove the merchant-of-record and refund-handling clauses again, or support each with its own registered, contract-backed claim and a usable policy link. Then rerun the full claim and history audit. Nothing else found in this round requires a product change.
