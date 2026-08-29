# Adversarial first-read review 1 — Recall Anchor

Reviewed 2026-08-29 UTC against commit `e32b6eba1fb44500515cbd86cf23cc514d112e7a` and the live site at <https://answer-anchored-flashcards.sociobot.in>.

## Verdict

**FAIL — 20 findings: 0 blocking, 12 major, 8 minor.**

The first-read gate and demo gate pass. All 11 declared claim commands pass, and the core app works. The product still cannot pass this review because the acceptance standard is zero findings and no untested claims.

## Cold first screen

Fresh contexts were used before scrolling.

| Viewport | What does it do? | For whom? | What should I click first? | Gate |
|---|---|---|---|---|
| 390 × 844 | It scores a flashcard from the answer I type and uses that result to schedule the card. | People studying on their own. | **Try it with sample data**; the adjacent text says three due cards open next. | PASS |
| 1440 × 900 | Same answer. | Same answer. | Same action. | PASS |

The exact first-screen text was “Score the answer you actually recall,” “For self-learners who want the next interval based on a typed answer, not a rating guess,” **Try it with sample data**, and “Three due cards open next.” This is enough to answer all three mandatory questions, so there is no blocking first-read finding.

## Findings — major

### F-1-1 — The three required facts are not on the first screen

- **Quote/location:** Home facts: “Works offline after your first visit,” “Cards stay in this browser,” and “Free for 30 cards.”
- **Evidence:** At 390 × 844, none is visible before scrolling; the illustration starts at y=838 and CSS deliberately puts `.facts` after it. At 1440 × 900, only the first two are visible; the third is below the fold.
- **Impact:** The mandatory first-screen shape requires all three privacy/offline/price facts. Phone visitors must scroll past the illustration to learn any of them.
- **Fix:** Keep the facts directly below the primary action at all widths. Reduce the mobile headline/hero spacing or move the illustration after the facts. Verify all three facts fit at 390 × 844 and 1440 × 900.

### F-1-2 — The offline claim test does not perform an offline review or export

- **Quote/location:** Home: “Works offline after your first visit.” README: “Offline review after the first visit.” Offline status: “You are offline. Review and export still work.”
- **Evidence:** `@claim:offline-reload` sets the context offline, reloads `/demo`, and navigates to Cards. It never submits an answer or downloads an export while offline.
- **Impact:** The test can pass even if the two specific offline actions promised to users stop working.
- **Fix:** Extend `@claim:offline-reload` to score a seeded card offline, assert the stored review/result, and download and inspect a CSV while still offline.

### F-1-3 — Reset is a documented but unlisted claim

- **Quote/location:** README: “Use Reset demo to restore the sample.” The demo exposes **Reset demo**.
- **Evidence:** There is no `demo-reset` entry in `.factory/claims.json`, and no claim-tagged test clicks Reset. A manual live check did pass: 3 cards/2 reviews became 3/3 after scoring and returned to 3/2 after Reset.
- **Impact:** A documented demo guarantee can regress while every declared claim remains green.
- **Fix:** Add `demo-reset` to `claims.json`. Its test should change sample data, reset, assert the original three cards and two reviews, and confirm a pre-existing real card is unchanged.

### F-1-4 — The paid claim test checks a checkout URL, not a working checkout

- **Quote/location:** README: “The one-time Desk purchase uses Sociobot’s hosted checkout and license verification.” Landing: “$19 one-time purchase.”
- **Evidence:** `@claim:paid-desk` checks the catalog price and the link’s `href`, then mocks license verification. It never requests the checkout URL and does not assert a one-time billing mode. The live URL currently works (303 to a Dodo checkout that returns 200), but that outcome is outside the claim test.
- **Impact:** The exact dead-checkout regression recorded in the earlier verification could return without failing the declared claim.
- **Fix:** Have the claim test request the checkout endpoint without completing payment, assert its expected redirect to the hosted checkout, and assert the catalog’s one-time price/billing field. Keep license validation mocked.

### F-1-5 — The documented license-storage key is an unlisted claim

- **Quote/location:** README: “License tokens use the documented `sb_license:answer-anchored-flashcards` localStorage key.”
- **Evidence:** No claim entry or claim test asserts the key or removal behavior.
- **Impact:** Integrators may rely on a storage contract that can change unnoticed.
- **Fix:** Either move the key into a clearly marked internal implementation note, or add a `license-storage` claim test that restores/removes a license and asserts the namespaced keys.

### F-1-6 — The stated network boundary for licensing is unlisted

- **Quote/location:** README: “The app contacts Sociobot only to buy or verify Desk.” Privacy: “A license check contacts Sociobot only after you paste or receive a paid license.”
- **Evidence:** `@claim:local-privacy` has no stored license and does not exercise purchase return, explicit verification, or cached-license refresh.
- **Impact:** The privacy test does not prove the conditional network behavior that the copy promises.
- **Fix:** Add a claim that records requests for explicit verification, a returned license, and stale cached-license refresh; assert that only the documented Sociobot endpoint is contacted and that no check happens without those triggers.

### F-1-7 — “Merchant of record” is an unlisted legal claim

- **Quote/location:** README and Terms: “Sociobot and Dodo act as merchant of record.”
- **Evidence:** No `claims.json` entry or sandbox test establishes this legal role.
- **Impact:** A buyer may rely on a payment-responsibility statement the product does not verify.
- **Fix:** Remove the sentence from product copy unless the factory can provide a stable, testable contract source. If retained, link that source and add an assertion against it.

### F-1-8 — Payment and refund handling is an unlisted claim

- **Quote/location:** Terms: “They handle payment and refunds.”
- **Evidence:** No claim entry or test covers refund handling.
- **Impact:** This sets a support expectation without sandbox proof.
- **Fix:** Replace it with a link to the actual purchase/refund policy, or add a contract-backed test and a matching claim entry.

### F-1-9 — Revoked-license behavior is unlisted and untested

- **Quote/location:** Terms: “A refunded or revoked license stops paid features.”
- **Evidence:** `@claim:paid-desk` tests only a mocked valid response. It never returns `valid: false` after a previously valid license.
- **Impact:** The paid/free boundary after refund or revocation is asserted without regression coverage.
- **Fix:** Add a claim test that seeds a valid cached license, returns a revoked response, and confirms unlimited creation and trends lock while free features remain.

### F-1-10 — Unicode normalization is promised without claim coverage

- **Quote/location:** Demo exact-card help: “Spelling and spacing are checked after Unicode normalization.”
- **Evidence:** No claim entry mentions normalization, and the current test suite contains no Unicode/normalization case. This also contradicts the prior handoff’s statement that the suite covers Unicode boundaries.
- **Impact:** Users are told how exact matching behaves, but a change to normalization would not fail the claims gate.
- **Fix:** Add a claim and test composed/decomposed accents, case, and repeated whitespace, or replace the help with behavior already tested.

### F-1-11 — Spreadsheet and Anki compatibility is broader than the export tests

- **Quote/location:** Cards: “CSV files open in spreadsheets and Anki.” README: “Review CSV and Anki-field CSV exports.”
- **Evidence:** The tests inspect row counts and headers; they do not import the files into Anki or a spreadsheet parser.
- **Impact:** “Open in” implies compatibility beyond producing CSV-shaped text.
- **Fix:** Rewrite as “Download review CSV or an Anki-formatted card CSV,” or validate the files with an independent CSV parser and an Anki import fixture under a matching claim.

### F-1-12 — The product-boundary sentence contains three unlisted claims

- **Quote/location:** Home: “Recall Anchor does not host decks, generate cards, or diagnose learning ability.”
- **Evidence:** No claim entry covers deck hosting, card generation, or diagnosis.
- **Impact:** These are product-behavior statements, not section labels, and they fall outside the claims contract.
- **Fix:** Delete the sentence and keep the tested “It stores cards in this browser,” or add explicit tests for each retained boundary.

## Findings — minor

### F-1-13 — Core copy relies on “evidence,” “rubric,” and “interval” jargon

- **Quotes/locations:** “Evidence-led spaced repetition”; “For self-learners who want the next interval…”; “Answer → rubric → next interval”; “Let the evidence set the interval”; README “Evidence-led intervals…” and “rubric match, and interval reason.”
- **Impact:** A cold visitor must translate study-system vocabulary before understanding the result.
- **Fix:** Use “Typed-answer flashcard review”; “For people studying on their own who want the next review date based on a typed answer, not a guessed rating”; “Typed answer → answer key → next review date”; and “See what matched and when to review again.”

### F-1-14 — The three-step headings are decorative or unclear out of context

- **Quotes/location:** Home: “How it works / 03 marks,” “Type before reveal,” “Check one rubric,” and “See the reason.”
- **Impact:** A screen-reader heading list does not name the task or result, and “03 marks” is invented print lore.
- **Fix:** Use “How Recall Anchor scores a review,” “Type your answer before seeing the key,” “Compare it with the answer key,” and “See why the card returns when it does.”

### F-1-15 — The privacy headings are slogans rather than section names

- **Quotes/location:** Home: “Local by design” and “Your study record stays yours.”
- **Impact:** Neither heading says where data is stored or what the section contains.
- **Fix:** Replace them with “Data storage and privacy” and “Cards and reviews stay in this browser.”

### F-1-16 — The pricing heading uses metaphor and inconsistent tier names

- **Quotes/location:** Home: “One-time desk pass” and “Keep studying free, or add more room.” Elsewhere the product calls this a “Desk license,” “Desk purchase,” and “Recall Anchor Desk.”
- **Impact:** “Room” does not name the increased card limit, and “pass,” “license,” “purchase,” and product name appear to be different things.
- **Fix:** Use the section label “Plans” and heading “Use 30 cards free or buy unlimited cards.” Call the paid item “Recall Anchor Desk license” everywhere.

### F-1-17 — The README opens with unexplained implementation and scoring terms

- **Quotes/location:** “offline-first study tool for self-learners”; “numeric tolerance, and checklist recall”; “Passphrase-encrypted backup and restore using AES-GCM”; “Cards and reviews use browser IndexedDB”; “Demo data uses a separate `recall-anchor-demo` database.”
- **Impact:** The README mixes an end-user introduction with storage and cryptography terminology before explaining the ordinary task.
- **Fix:** Use “Recall Anchor is a study tool for people who study on their own. After your first visit, it works without an internet connection”; “It scores exact answers, numbers within a range, and lists of required points”; and “Download an encrypted backup and restore it with your passphrase.” Move IndexedDB/AES-GCM/database names under a “Technical details” heading.

### F-1-18 — The footer points to unavailable “visual notes”

- **Quote/location:** Every app footer: “Generated illustration disclosed in the visual notes.”
- **Impact:** There is no link or public route to those notes, so the sentence gives the visitor no usable provenance.
- **Fix:** Link a public provenance note, or write the usable fact directly: “Hero illustration generated with factory-image on August 28, 2026.”

### F-1-19 — Non-home routes keep the home Open Graph copy

- **Quote/location:** `/demo`, `/study`, `/cards`, `/privacy`, and `/terms` all expose `og:title="Recall Anchor — Score typed flashcard answers"` and the home OG description while their document titles, descriptions, and canonicals change.
- **Impact:** Shared Privacy, Terms, Cards, and Demo links describe the landing page instead of the shared route.
- **Fix:** Update Open Graph and Twitter title/description/url in `setMeta()` for every route, then test each route’s metadata.

### F-1-20 — The real 404 uses a stale and incomplete site shell

- **Quote/location:** Live unknown route footer: “Built by Param Factory · Version 1.0.1”; current app version is 1.0.2.
- **Evidence:** The 404 correctly returns HTTP 404 and is designed, but it has no canonical, Open Graph tags, favicon, skip link, standard primary nav, product one-liner, or current version. Its header/footer differ from every app route.
- **Impact:** A visitor arriving on a bad link sees stale release information and loses the site’s standard navigation and metadata.
- **Fix:** Generate `404.html` from the shared shell or keep a tested static equivalent with the standard header/footer, skip link, canonical/OG/favicon metadata, and version sourced from `package.json`.

## Copy audit

Counts treat hyphenated terms, URLs, versions, paths, identifiers, and keyboard shortcuts as one word. The tables include labels, headings, and actions as well as complete sentences so button and out-of-context-heading checks are visible. No item exceeds 22 words. Landing actions use result-naming verbs; no button finding was raised.

### Landing page

| Copy | Words | Flag |
|---|---:|---|
| Skip to main content | 4 | — |
| Recall Anchor | 2 | — |
| Study | 1 | — |
| Cards | 1 | — |
| Demo | 1 | — |
| Privacy | 1 | — |
| Evidence-led spaced repetition | 3 | F-1-13 |
| Score the answer you actually recall | 6 | — |
| For self-learners who want the next interval based on a typed answer, not a rating guess. | 16 | F-1-13 |
| Try it with sample data | 5 | — |
| Three due cards open next. | 5 | — |
| Works offline after your first visit | 6 | F-1-2 |
| Cards stay in this browser | 5 | — |
| Free for 30 cards | 4 | — |
| Answer → rubric → next interval | 4 | F-1-13 |
| Typed answer | 2 | — |
| claim, evidence | 2 | — |
| Rubric | 1 | F-1-13 |
| 2 of 3 matched | 4 | — |
| Next review | 2 | — |
| Tomorrow | 1 | — |
| How it works / 03 marks | 5 | F-1-14 |
| Let the evidence set the interval | 6 | F-1-13 |
| Type before reveal | 3 | F-1-14 |
| Put your full answer on the record. | 7 | — |
| Check one rubric | 3 | F-1-14 |
| Use exact text, a number range, or a checklist. | 9 | — |
| See the reason | 3 | F-1-14 |
| Read what matched and when the card returns. | 8 | — |
| Local by design | 3 | F-1-15 |
| Your study record stays yours | 5 | F-1-15 |
| Recall Anchor does not host decks, generate cards, or diagnose learning ability. | 12 | F-1-12 |
| It stores cards in this browser. | 6 | — |
| Read the privacy details | 4 | — |
| Local only | 2 | — |
| One-time desk pass | 3 | F-1-16 |
| Keep studying free, or add more room | 7 | F-1-16 |
| $19 | 1 | — |
| one-time purchase | 2 | — |
| Recall Anchor Desk adds unlimited cards and review trends. | 9 | — |
| The free plan includes 30 cards, every card type, and every export. | 12 | — |
| Buy Recall Anchor Desk | 4 | — |
| opens hosted checkout | 3 | F-1-4 |
| Read purchase terms | 3 | — |
| Have a license? | 3 | — |
| Paste your license | 3 | — |
| Verify license | 2 | — |
| Score cards from answers, not guesses. | 6 | — |
| Built by Param Factory | 4 | — |
| opens in a new tab | 5 | — |
| Version 1.0.2 · Generated illustration disclosed in the visual notes. | 9 | F-1-18 |

### README

| Copy | Words | Flag |
|---|---:|---|
| Recall Anchor | 2 | — |
| Score flashcards from the answer you type, not a rating you guess. | 12 | — |
| Recall Anchor is an offline-first study tool for self-learners. | 9 | F-1-17 |
| It supports exact text, numeric tolerance, and checklist recall. | 9 | F-1-17 |
| Each review records the typed answer, confidence, rubric match, and interval reason. | 12 | F-1-13 |
| Live site: https://answer-anchored-flashcards.sociobot.in | 3 | — |
| Try the isolated demo | 4 | — |
| Open `/demo` or <https://answer-anchored-flashcards.sociobot.in/demo>. | 4 | — |
| It loads three due cards in a separate IndexedDB database. | 10 | F-1-17 |
| Use Reset demo to restore the sample. | 7 | F-1-3 |
| Use Start for real to open your own empty collection. | 10 | — |
| What it includes | 3 | — |
| Exact, numeric tolerance, and checklist cards. | 6 | F-1-17 |
| Evidence-led intervals with a plain reason after each answer. | 9 | F-1-13 |
| Offline review after the first visit. | 6 | F-1-2 |
| Review CSV and Anki-field CSV exports. | 6 | F-1-11 |
| Passphrase-encrypted backup and restore using AES-GCM. | 6 | F-1-17 |
| Keyboard review, including `Ctrl+Enter` to score. | 6 | — |
| A free 30-card plan. | 4 | — |
| Recall Anchor Desk for $19 once, with unlimited cards and review trends. | 12 | — |
| Cards and reviews use browser IndexedDB. | 6 | F-1-17 |
| Demo data uses a separate `recall-anchor-demo` database. | 7 | F-1-17 |
| License tokens use the documented `sb_license:answer-anchored-flashcards` localStorage key. | 8 | F-1-5 |
| The app contacts Sociobot only to buy or verify Desk. | 10 | F-1-6 |
| Develop | 1 | — |
| Requires Node.js 20 or newer. | 5 | — |
| Open the local URL printed by Vite. | 7 | — |
| The production build is static. | 5 | — |
| Test and build | 3 | — |
| `npm test` | 2 | — |
| `npm run build` | 3 | — |
| `npm test` builds the product and runs Playwright claim, accessibility, persistence, route, and 390 px mobile checks. | 17 | — |
| The exact deployment command is `npm run build`. | 8 | — |
| Output lands in `dist/`, with `dist/index.html` at its root. | 9 | — |
| Each product claim and its sandbox test is listed in `.factory/claims.json`. | 11 | — |
| Demo behavior is documented in `.factory/demo.md`. | 6 | — |
| Deploy | 1 | — |
| Deploy the contents of `dist/` as a static site. | 9 | — |
| `staticwebapp.config.json` supplies SPA fallback, security headers, and the 404 response for Azure Static Web Apps. | 15 | — |
| The factory owns DNS and deployment. | 6 | — |
| Privacy and payment | 3 | — |
| There are no analytics, third-party fonts, or third-party runtime scripts. | 10 | — |
| Study data does not leave the browser. | 7 | — |
| The one-time Desk purchase uses Sociobot’s hosted checkout and license verification. | 11 | F-1-4 |
| Sociobot and Dodo act as merchant of record. | 8 | F-1-7 |
| See `/privacy` and `/terms` in the app. | 7 | — |
| License | 1 | — |
| MIT. | 1 | — |
| See `LICENSE`. | 2 | — |

## Demo and sandbox evidence

- One click from the live home page opened `/demo` on a realistic exact-answer card: “Which organelle produces most cellular ATP?”
- The first demo screen already showed the question, answer field, scoring rule, confidence choices, and **Score my answer**.
- The persistent banner said “Demo — sample data, nothing is saved to your cards” and showed **Reset demo** and **Start for real**.
- A manual isolation run created `REAL STORAGE SENTINEL` in the real database, scored the demo, reset it, and returned to real mode. Demo counts changed 3 cards/2 reviews → 3/3 → 3/2; the real database remained one sentinel card/zero reviews.
- That whole run produced only same-origin document/JS/CSS requests. Typed answers were absent from request bodies.
- A fresh live service-worker context reloaded `/demo` offline, retained the sample, kept the offline notice after navigating to `/cards?demo=1`, and logged no console errors.

The demo gate passes. F-1-3 is a claim-regression gap, not a reproduced demo failure.

## Claims results

Every command in `.factory/claims.json` was run independently after `npm ci`:

| Claim | Result |
|---|---|
| `offline-reload` | PASS, 1 test |
| `answer-types` | PASS, 1 test |
| `interval-reason` | PASS, 1 test |
| `csv-export` | PASS, 1 test |
| `anki-export` | PASS, 1 test |
| `encrypted-backup` | PASS, 1 test |
| `demo-isolation` | PASS, 1 test |
| `local-privacy` | PASS, 1 test |
| `keyboard-review` | PASS, 1 mobile test |
| `free-limit` | PASS, 1 test |
| `paid-desk` | PASS, 1 test |

There is no failing declared test, so there is no blocking claim-test finding. F-1-2 through F-1-12 record unlisted or incompletely asserted claims that prevent PASS.

## History check

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. The existing handoff and all four verification reports were read. Earlier defects were rechecked rather than accepted from their status labels.

| Earlier issue | Live/code confirmation | Status |
|---|---|---|
| Dead paid checkout | Product endpoint returns 303; redirected Dodo session returns 200. | Fixed; regression coverage remains F-1-4 |
| Dark-mode contrast | Live light/dark axe runs across Home, Demo, Cards, Privacy, Terms, and 404 found 0 serious/critical issues. | Fixed |
| Checklist substring match | Live regression rejects `earth` for `art`; test passed. | Fixed |
| Duplicate answer review | Live regression recorded exactly one review; test passed. | Fixed |
| Concurrent-tab card loss | Live two-tab regression retained both cards; test passed. | Fixed |
| Undersized mobile targets/overflow | 390 px tests passed on Home, Demo, and Privacy. | Fixed |
| Short cache on hashed assets | Live JS returns `max-age=31536000, immutable`. | Fixed |
| HTTP-200 not-found response | Unknown route returns HTTP 404. | Fixed |
| Duplicate/free-limit card race | `@claim:free-limit` passed rapid submission and a two-tab 29→30 race. | Fixed |
| Stale manifest start version | Manifest version assertion passed. | Fixed |
| Offline notice lost on navigation | Live offline notice remained on `/cards?demo=1`. | Fixed |
| Removed service-worker update regression | `tests/pwa.spec.ts` is present and passed in the 33-test suite. | Fixed |
| Backup test omitted restored reviews | Claim test clears reviews, restores, exports, and asserts three CSV lines. | Fixed |
| Checkout claim test omitted the checkout outcome | Test still asserts only the catalog URL and link `href`. | Half-fixed; F-1-4 |

## Structure, accessibility, and visual identity

- Route titles, one `<h1>`, descriptions, canonicals, deep links, back/forward navigation, route-change focus, and live announcements passed for the app routes.
- All crawled internal links returned 200 except the intentionally tested 404. The checkout returned its expected redirect, and Sociobot returned 200.
- `/opt/fleet/lib/verify-url.sh` passed: title, `lang=en`, one h1, main landmark, alt text, labels, and zero console/page errors.
- Live Playwright/axe/regression checks passed 22/22 in light/dark and at 390 px. Local `npm test` passed 33/33.
- The 33.10 KB raw / 11.44 KB gzip JS bundle is below the budget. `dist/` was produced.
- The warm-paper, halftone, misregistered-print visual system is distinct and matches `.factory/design.md`; it is not a generic SaaS layout. Asset provenance is recorded.
- F-1-19 and F-1-20 are the remaining structure defects.

## Missed leverage

No missed-leverage finding. The brief asks for local scoring, interval explanations, and export; the product includes review CSV, Anki-field CSV, encrypted backup/restore, and offline use. AI generation is not implied by the job and would weaken the answer-first learning constraint. Sync is not promised and would conflict with the current local-only privacy position unless introduced as an explicit optional feature.

## What would make this perfect

Resolve F-1-1 through F-1-20, add claim entries and outcome tests for every retained claim, repeat the cold 390 px first-screen check, rerun all declared claim commands and `npm test`, and repeat the live metadata/link/axe/offline crawl. At that point the review should find nothing else to change.
