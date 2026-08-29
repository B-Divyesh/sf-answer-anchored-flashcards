# Adversarial first-read review 7 — Recall Anchor

Reviewed 2026-08-29 UTC against commit `6e0f73370fbdd91f35a28d4585c00b83e59d2630` and the live site at <https://answer-anchored-flashcards.sociobot.in>.

## Verdict

**PASS — zero findings.**

The cold first-read, one-click demo, storage isolation, claim matrix, privacy request boundary, prior-finding regression audit, routes, links, metadata, and visual-identity checks pass. There is no untested registered claim or remaining minor finding.

## Cold first screen

Fresh browser contexts were opened at 390 × 844 and 1440 × 900 before scrolling.

| Viewport | What it does | For whom | First action | Result |
|---|---|---|---|---|
| 390 × 844 | Scores a flashcard from the answer typed and sets its next review date. | People studying alone. | **Try it with sample data**; “Three due cards open next.” says what happens. | Pass |
| 1440 × 900 | Same. | Same. | Same. | Pass |

The exact first-screen headline is “Score flashcards from typed answers.” The audience sentence is “For people studying alone who want the next review date based on an answer, not a guessed rating.” The three required facts are also visible without scrolling: offline (bottom 719 px), browser storage (742 px), and free 30-card limit (765 px) on the phone; all end by 882 px on desktop. The first-read gate passes.

## Copy audit

Counts treat hyphenated compounds, URLs, paths, versions, and keyboard shortcuts as one word. Labels and headings are included so the heading and action checks are explicit. No sentence exceeds 22 words; no banned marketing wording, jargon-dependent heading, inconsistent product term, information-free slogan, or non-result-naming action was found. Therefore there are no copy findings or rewrites to propose.

### Landing page

| Copy | Words | Check |
|---|---:|---|
| Skip to main content | 4 | Clear action |
| RA | 1 | Decorative mark |
| Recall Anchor | 2 | Wordmark |
| Study / Cards / Demo / Privacy | 1 each | Clear navigation |
| Typed-answer flashcard review | 3 | Clear category label |
| Score flashcards from typed answers | 5 | Plain job headline |
| For people studying alone who want the next review date based on an answer, not a guessed rating. | 18 | Audience and outcome |
| Try it with sample data | 5 | Result-naming action; `demo-sample` |
| Three due cards open next. | 5 | `demo-sample` |
| Works offline after your first visit | 6 | `offline-reload` |
| Cards stay in this browser | 5 | `local-privacy` |
| Free for 30 cards | 4 | `free-limit` |
| Typed answer → answer key → next review date | 7 | Clear process caption |
| Typed answer / Answer key / Next review | 2 / 2 / 2 | Clear preview labels |
| claim, evidence / 2 of 3 matched / Tomorrow | 2 / 4 / 1 | Sample preview values |
| How Recall Anchor scores a review | 6 | Clear section label |
| See what matched and when to review again | 8 | Clear section heading |
| Type your answer before seeing the key | 7 | Clear step heading |
| Write the answer you remember. | 5 | Clear instruction |
| Compare it with the answer key | 6 | Clear step heading |
| Use exact text, a number range, or a checklist. | 9 | `answer-types` |
| See why the card returns when it does | 8 | Clear step heading |
| Read what matched and the next review date. | 8 | `interval-reason` |
| Data storage and privacy | 4 | Clear section label |
| Cards and reviews stay in this browser | 7 | `local-privacy` |
| Cards and reviews are stored on this device. | 8 | `local-privacy` |
| Read the privacy details | 4 | Result-naming link |
| Local only | 2 | Decorative stamp |
| Plans | 1 | Clear section label |
| Use 30 cards free or buy unlimited cards | 8 | `free-limit`, `paid-desk` |
| $19 / one-time purchase | 1 / 2 | `paid-desk` |
| The Recall Anchor Desk license adds unlimited cards and review trends. | 11 | `paid-desk` |
| The free plan includes 30 cards, every card type, and every export. | 12 | `free-limit`, `answer-types`, exports |
| Buy Recall Anchor Desk license | 5 | Result-naming action; `paid-desk` |
| opens hosted checkout | 3 | Destination disclosure |
| Read purchase terms | 3 | Result-naming link |
| Have a license? / Paste your license / Verify license | 3 / 3 / 2 | Clear disclosure, label, and action |
| Score cards from typed answers, not guessed ratings. | 8 | Product summary |
| Terms / Built by Param Factory / opens in a new tab / Version 1.0.9 | 1 / 4 / 5 / 2 | Clear footer content |

### README

| Copy | Words | Check |
|---|---:|---|
| Recall Anchor | 2 | Title |
| Score flashcards from the answer you type, not a rating you guess. | 12 | Plain summary |
| Recall Anchor is a study tool for people who study on their own. | 13 | Audience |
| Type an answer, compare it with the answer key, and see the next review date. | 15 | `interval-reason` |
| After your first visit, it works without an internet connection. | 10 | `offline-reload` |
| Live site: `https://answer-anchored-flashcards.sociobot.in` | 3 | Destination |
| Try the isolated demo | 4 | Clear heading |
| Open `?demo=1` or `https://answer-anchored-flashcards.sociobot.in/?demo=1`. | 4 | `demo-sample` |
| It opens three due sample cards in separate browser storage. | 10 | `demo-sample`, `demo-isolation` |
| Use Reset demo to restore the sample. | 7 | `demo-reset` |
| Use Start for real to open your own empty collection. | 10 | `demo-isolation` |
| What it includes | 3 | Clear heading |
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
| Sociobot is contacted only for a Desk checkout or license verification. | 11 | `license-network` |
| Technical details | 2 | Clear heading |
| Cards and reviews use IndexedDB. | 6 | Accurate implementation detail |
| Demo data uses the separate `recall-anchor-demo` database. | 7 | Accurate implementation detail |
| Encrypted backups use AES-GCM. | 4 | `encrypted-backup` |
| License tokens are namespaced in localStorage. | 6 | Accurate implementation detail |
| Develop / Test and build / Deploy / Privacy and payment / License | 1 / 3 / 1 / 3 / 1 | Clear headings |
| Requires Node.js 20 or newer. | 5 | Run requirement |
| `npm install` / `npm run dev` / `npm test` / `npm run build` | 2 / 3 / 2 / 3 | Commands |
| Open the local URL printed by Vite. | 7 | Instruction |
| The production build is static. | 5 | Accurate build property |
| `npm test` builds the product and runs Playwright claim, accessibility, persistence, route, and 390 px mobile checks. | 17 | Verified |
| The exact deployment command is `npm run build`. | 8 | Verified |
| Output lands in `dist/`, with `dist/index.html` at its root. | 9 | Verified |
| Each product claim and its sandbox test is listed in `.factory/claims.json`. | 11 | Verified |
| Demo behavior is documented in `.factory/demo.md`. | 6 | Verified |
| Deploy the contents of `dist/` as a static site. | 9 | Instruction |
| `staticwebapp.config.json` supplies SPA fallback, security headers, and the 404 response for Azure Static Web Apps. | 15 | Verified |
| The factory owns DNS and deployment. | 6 | Scope statement |
| There are no analytics, third-party fonts, or third-party runtime scripts. | 10 | `local-privacy` |
| Study data does not leave the browser. | 7 | `local-privacy` |
| The one-time Desk purchase uses Sociobot’s hosted checkout and license verification. | 11 | `paid-desk`, `license-network` |
| See `/privacy` and `/terms` in the app. | 7 | Verified links |
| MIT. / See `LICENSE`. | 1 / 2 | Verified license |

## Demo, sandbox, and privacy

- A fresh-phone click on **Try it with sample data** opened `/?demo=1` in one action. Its first screen already showed a realistic due card, “What Spanish word means coffee?”, an answer field, confidence choices, and **Score my answer**.
- The persistent banner reads “Demo — sample data, nothing is saved to your cards.” It exposes **Reset demo** and **Start for real**. Reset announced “Sample cards were reset.” Start for real reached an empty `/cards` collection with no demo banner.
- The live demo flow requested only same-origin HTML, JavaScript, CSS, image, and service-worker resources. No typed answer appeared in a request. Source and claim tests confirm the separate `recall-anchor-demo` and `recall-anchor` IndexedDB namespaces; demo is never read as real data or copied into it.
- The `offline-reload` claim test reloads, scores, saves evidence, and downloads Review CSV while offline after first visit. The local-privacy claim records the full demo and encrypted-backup flow and permits only the documented same-origin traffic.

## Claim matrix

Temporary clean clone: `/tmp/recall-review7-55Ejsv/repo`, created from the reviewed checkout. After `npm ci`, every exact command in `.factory/claims.json` passed independently. A source scan also found exactly one `@claim:<id>` test tag for each registered claim.

| Claim IDs | Result |
|---|---|
| `offline-reload`, `answer-types`, `interval-reason`, `csv-export`, `anki-export`, `encrypted-backup` | Pass |
| `demo-isolation`, `demo-sample`, `demo-reset` | Pass |
| `local-privacy`, `local-data-deletion`, `card-removal-retention` | Pass |
| `keyboard-review`, `exact-normalization`, `free-limit` | Pass |
| `paid-desk`, `license-network`, `license-revocation` | Pass |

All claim-like landing and README statements map to one or more applicable registered tests above. No unlisted product claim was found.

## Earlier finding regression audit

Every `review-*.md`, `polish-*.md`, and the prior handoff was read. Each prior finding was checked against the current live result, source, and relevant test instead of relying on its recorded status.

| Earlier IDs | Current confirmation | Status |
|---|---|---|
| F-1-1 | All three required facts remain above the fold at both audit viewports. | Fixed |
| F-1-2 | Offline test scores and exports after offline reload. | Fixed |
| F-1-3, F-2-2 | Sample entry and Reset are registered, isolated, and tested. | Fixed |
| F-1-4 | Paid test confirms the $19 contract, hosted-checkout redirect, and paid unlock. | Fixed |
| F-1-5 | Visitor-facing documentation no longer specifies a storage-key contract. | Fixed |
| F-1-6 | License request timing has a dedicated network test. | Fixed |
| F-1-7, F-3-1, F-6-1 | Merchant-of-record language is absent from current Terms. | Fixed |
| F-1-8, F-3-2, F-6-2 | Refund-handling and automatic-revocation language is absent from current Terms. | Fixed |
| F-1-9 | Saved inactive licenses return paid features to the free plan. | Fixed |
| F-1-10 | Case, accent form, and extra-space normalization is tested. | Fixed |
| F-1-11 | Copy says Anki-formatted CSV; export test checks fields and rows. | Fixed |
| F-1-12 | Former host/generate/diagnose boundary claim remains absent. | Fixed |
| F-1-13 through F-1-17 | Plain terms, literal headings, consistent tier naming, and readable README remain in place. | Fixed |
| F-1-18 | No unavailable provenance-note assertion remains. | Fixed |
| F-1-19 | Client navigation updates description, canonical, OG, and Twitter metadata. | Fixed |
| F-1-20 | Static 404 has the standard shell, current version, and metadata. | Fixed |
| F-2-1 | Source regression covers history scroll restoration, h1 focus, and route announcement. | Fixed |
| F-2-3 | No untestable public hero-provenance assertion remains. | Fixed |
| F-4-1 | Terms does not claim to measure learning ability or guarantee recall. | Fixed |
| F-5-1 | Site-data clearing has a dedicated claim test for databases, cache, license, and service worker. | Fixed |
| F-5-2, F-5-3 | Card removal persists while its past review row remains exportable. | Fixed |
| F-6-3 | Both static and client 404 h1 values are the literal “Page not found.” | Fixed |

## Structure, links, and identity

- Live `/`, `/demo`, `/study`, `/cards`, `/privacy`, and `/terms` returned 200. An unknown address returned a designed HTTP 404. All have `lang=en`, exactly one h1, one main landmark, a route-specific title, description, canonical URL, OG/Twitter title, favicon, and the consistent header/footer. The 404’s network-status console line is the expected browser report for its intentional HTTP 404; there was no application console error on any successful route.
- Every crawled internal route and asset link returned 200. The checkout endpoint returned its expected 303 to hosted Dodo checkout; the privacy contact is a `mailto:` link; `https://sociobot.in/` returned 200.
- Client route navigation moved focus to the new h1 and updated the polite route announcer. The source regression test covers Back/Forward restoration of saved scroll positions at 390 px.
- The warm paper, dithered worksheet surface, serif/sans pairing, clipped corners, vermilion offset action mark, and original halftone answer-slip art follow `.factory/design.md`. The asymmetric print layout is specific to answer evidence and not a generic SaaS template.

## Missed leverage

No missed-leverage finding applies. The brief implies answer-based scoring, interval explanations, offline use, and export; the product includes all of them, plus Anki-formatted export and encrypted backup/restore. Sync would contradict the explicit local-first storage model unless made an opt-in product change. AI card generation is not implied by the answer-first job and would be decorative here.

## What would make this perfect

Keep the present claim-to-test mapping and rerun this same cold-context review after any copy, payment, storage, or routing change. No additional product feature or copy change is indicated by this round.
