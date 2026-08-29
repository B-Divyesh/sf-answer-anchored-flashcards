# Adversarial first-read review 5 — Recall Anchor

Reviewed 2026-08-29 UTC against repository commit `f49f8e2bb0b597f4192cbbdc5a4cd97bd29b89f0` and the live site at <https://answer-anchored-flashcards.sociobot.in>.

## Verdict

**FAIL — 3 findings: 2 major, 1 minor, 0 blocking.**

The cold first-read gate, one-click demo, all 16 declared claim tests, offline/privacy request checks, routing, accessibility checks, link crawl, and visual-identity review pass. The review cannot pass because three visitor-facing deletion and retention promises have no entries in `.factory/claims.json`. The standard is zero findings and no untested claim.

## Cold first screen

Fresh browser contexts were opened before scrolling at 390 × 844 and 1440 × 900.

| Viewport | What does it do? | For whom? | What should I click first? | Result |
|---|---|---|---|---|
| 390 × 844 | It scores flashcards from the answer I type and schedules the next review. | People studying alone. | **Try it with sample data**; the adjacent text says three due cards open next. | PASS |
| 1440 × 900 | Same. | Same. | Same. | PASS |

The exact first-screen copy is “Score flashcards from typed answers,” “For people studying alone who want the next review date based on an answer, not a guessed rating,” **Try it with sample data**, and “Three due cards open next.” “Works offline after your first visit,” “Cards stay in this browser,” and “Free for 30 cards” also fit before the fold at both sizes. No first-read blocking finding applies.

## Findings — major

### F-5-1 — The complete local-data deletion promise is unlisted and untested

- **Exact quote/location:** `/privacy`, Delete and export: “Clear this site’s storage to remove every local record.” The same sentence is emitted by `privacyPage()` in `src/main.ts`.
- **Evidence:** `.factory/claims.json` has no claim for clearing all stored records. `@claim:local-privacy` records outgoing requests but never clears storage or checks IndexedDB, localStorage, Cache Storage, or service-worker state afterward. A repository search finds the promise only in `src/main.ts`, not in a tagged test.
- **Why this matters:** A privacy-conscious visitor can rely on “every” when deciding whether the product is erasable. The current suite can stay green if a new local record type survives the documented deletion procedure.
- **Concrete fix:** Add a `local-data-deletion` claim and exactly one `@claim:local-data-deletion` test. Seed real cards, demo changes, review rows, and license state; clear site storage through a browser-context/CDP storage operation; then assert the real database, demo database, localStorage keys, and app caches are gone before revisiting. If that scope cannot be guaranteed, replace the sentence with precise browser-specific instructions and list what remains.

### F-5-2 — Retaining review history after card removal is an unlisted claim

- **Exact quote/location:** Cards removal confirmation: “Remove ‘…’? Its past review rows stay in exports.” The success status then says “Card removed. Past review rows were kept.” Both are emitted by `removeCard()` in `src/main.ts`.
- **Evidence:** No entry in `.factory/claims.json` covers review-row retention after removing a card. The encrypted-backup test clicks **Remove**, but it does not export immediately after removal and assert that the deleted card’s review rows remain. Its registered claim concerns encrypted backup behavior, not deletion retention.
- **Why this matters:** This is consequential data-retention behavior disclosed at the destructive action. A visitor may remove a card while expecting the confirmation’s promised review history to remain available.
- **Concrete fix:** Add `card-removal-retention` with one tagged test that creates and reviews a card, removes it, reloads, confirms the card stays absent, exports review CSV, and confirms that card’s prior review row remains. Keep the confirmation and status wording tied to that claim.

## Finding — minor

### F-5-3 — The Privacy page advertises card removal without a registered claim

- **Exact quote/location:** `/privacy`, Delete and export: “Remove cards from the Cards page.” The Cards page exposes **Remove** controls.
- **Evidence:** `.factory/claims.json` has no card-removal entry. Existing tests use removal only as setup for backup restoration; no tagged claim test removes a card, reloads, and verifies that it remains removed.
- **Why this matters:** This is a direct product capability on the privacy page. It can regress while every declared claim remains green.
- **Concrete fix:** Cover removal in the proposed `card-removal-retention` claim test, and expand that claim text to state both outcomes: the card is removed and its past review rows remain in exports. Alternatively remove this promise from Privacy.

## Copy audit

Counts treat hyphenated compounds, URLs, paths, shortcuts, versions, and identifiers as one word. Labels, headings, actions, and informative fragments are included so heading and button checks are explicit. All landing and README items are 22 words or fewer. No banned marketing adjective, inconsistent product term, information-free heading, or non-result-naming action appears in this corpus. The findings above occur on Privacy and during card removal.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Pass |
| RA | 1 | Decorative mark |
| Recall Anchor | 2 | Pass |
| Study / Cards / Demo / Privacy | 1 each | Clear navigation |
| Typed-answer flashcard review | 3 | Pass |
| Score flashcards from typed answers | 5 | Pass |
| For people studying alone who want the next review date based on an answer, not a guessed rating. | 18 | Pass |
| Try it with sample data | 5 | Result-naming action; `demo-sample` |
| Three due cards open next. | 5 | `demo-sample` |
| Works offline after your first visit | 6 | `offline-reload` |
| Cards stay in this browser | 5 | `local-privacy` |
| Free for 30 cards | 4 | `free-limit` |
| 01 | 1 | Decorative number |
| Typed answer → answer key → next review date | 7 | Pass |
| Typed answer / Answer key / Next review | 2 each | Clear preview labels |
| claim, evidence | 2 | Realistic sample answer |
| 2 of 3 matched | 4 | Realistic preview result |
| Tomorrow | 1 | Realistic preview result |
| How Recall Anchor scores a review | 6 | Clear section label |
| See what matched and when to review again | 8 | Clear heading |
| 01 / 02 / 03 | 1 each | Decorative step numbers |
| Type your answer before seeing the key | 7 | Clear heading |
| Write the answer you remember. | 5 | Pass |
| Compare it with the answer key | 6 | Clear heading |
| Use exact text, a number range, or a checklist. | 9 | `answer-types` |
| See why the card returns when it does | 8 | Clear heading |
| Read what matched and the next review date. | 8 | `interval-reason` |
| Data storage and privacy | 4 | Clear section label |
| Cards and reviews stay in this browser | 7 | `local-privacy` |
| Cards and reviews are stored on this device. | 8 | `local-privacy` |
| Read the privacy details | 4 | Result-naming link |
| Local only | 2 | Decorative stamp |
| Plans | 1 | Clear section label |
| Use 30 cards free or buy unlimited cards | 8 | `free-limit`, `paid-desk` |
| $19 | 1 | `paid-desk` |
| one-time purchase | 2 | `paid-desk` |
| The Recall Anchor Desk license adds unlimited cards and review trends. | 11 | `paid-desk` |
| The free plan includes 30 cards, every card type, and every export. | 12 | Limit, answer-type, and export claims |
| Buy Recall Anchor Desk license | 5 | Result-naming action; `paid-desk` |
| opens hosted checkout | 3 | `paid-desk` |
| Read purchase terms | 3 | Result-naming link |
| Have a license? | 3 | Clear disclosure label |
| Paste your license | 3 | Clear field label |
| Verify license | 2 | Result-naming action; `license-network` |
| Score cards from typed answers, not guessed ratings. | 8 | Product summary |
| Terms | 1 | Clear navigation |
| Built by Param Factory | 4 | Attribution link |
| opens in a new tab | 5 | Destination disclosure |
| Version 1.0.5 | 2 | Build identifier |

### README

| Copy | Words | Result |
|---|---:|---|
| Recall Anchor | 2 | Pass |
| Score flashcards from the answer you type, not a rating you guess. | 12 | Pass |
| Recall Anchor is a study tool for people who study on their own. | 13 | Pass |
| Type an answer, compare it with the answer key, and see the next review date. | 15 | `interval-reason` |
| After your first visit, it works without an internet connection. | 10 | `offline-reload` |
| Live site: URL | 3 | Destination label |
| Try the isolated demo | 4 | Clear heading |
| Open `?demo=1` or the live demo URL. | 4 | `demo-sample` |
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
| Sociobot is contacted only for a Desk checkout or license verification. | 11 | `paid-desk`, `license-network` |
| Technical details | 2 | Clear heading |
| Cards and reviews use IndexedDB. | 6 | Implementation detail |
| Demo data uses the separate `recall-anchor-demo` database. | 7 | Implementation detail |
| Encrypted backups use AES-GCM. | 4 | `encrypted-backup` |
| License tokens are namespaced in localStorage. | 6 | Implementation detail |
| Develop | 1 | Clear heading |
| Requires Node.js 20 or newer. | 5 | Run requirement |
| `npm install` / `npm run dev` | 2 / 3 | Commands |
| Open the local URL printed by Vite. | 7 | Instruction |
| The production build is static. | 5 | Build property |
| Test and build | 3 | Clear heading |
| `npm test` / `npm run build` | 2 / 3 | Commands |
| `npm test` builds the product and runs Playwright claim, accessibility, persistence, route, and 390 px mobile checks. | 17 | Verified in clean clone |
| The exact deployment command is `npm run build`. | 8 | Verified in clean clone |
| Output lands in `dist/`, with `dist/index.html` at its root. | 9 | Verified in clean clone |
| Each product claim and its sandbox test is listed in `.factory/claims.json`. | 11 | F-5-1 through F-5-3 show this is incomplete |
| Demo behavior is documented in `.factory/demo.md`. | 6 | Verified |
| Deploy | 1 | Clear heading |
| Deploy the contents of `dist/` as a static site. | 9 | Instruction |
| `staticwebapp.config.json` supplies SPA fallback, security headers, and the 404 response for Azure Static Web Apps. | 15 | Verified |
| The factory owns DNS and deployment. | 6 | Scope statement |
| Privacy and payment | 3 | Clear heading |
| There are no analytics, third-party fonts, or third-party runtime scripts. | 10 | `local-privacy` |
| Study data does not leave the browser. | 7 | `local-privacy` |
| The one-time Desk purchase uses Sociobot’s hosted checkout and license verification. | 11 | `paid-desk`, `license-network` |
| See `/privacy` and `/terms` in the app. | 7 | Verified links |
| License | 1 | Clear heading |
| MIT. | 1 | Verified by `LICENSE` |
| See `LICENSE`. | 2 | Verified link |

## Demo and sandbox behavior

- From a fresh live Home context, one click on **Try it with sample data** opened `/?demo=1` directly to “What Spanish word means coffee?” with an answer field, three confidence choices, **Score my answer**, and `FOUNDATIONS · 3 DUE`.
- The persistent banner said “Demo — sample data, nothing is saved to your cards.” It exposed **Reset demo** and **Start for real**.
- Entering `café` and selecting Certain produced “100% of the answer key matched.” **Reset demo** returned to three due cards and announced “Sample cards were reset.” **Start for real** opened `/cards` with `0 CARDS · 0 DUE`.
- The direct live demo flow made no off-origin request and logged no console error. The clean-clone `demo-reset` claim also seeded a real card and confirmed that reset did not change it.
- Demo state uses `recall-anchor-demo`; real state uses `recall-anchor`. The live build is byte-identical to the clean build at the HTML entry point and references the same hashed JS and CSS assets.

## Declared claim results

A clean clone was made at `/tmp/recall-anchor-review5-ZlWoiY/repo` from remote `main`; its HEAD was `f49f8e2bb0b597f4192cbbdc5a4cd97bd29b89f0`. `npm ci` completed with zero vulnerabilities. Every exact command from `.factory/claims.json` ran independently.

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

Each registered ID appears in exactly one tagged test. The full deployed suite also passed 43/43 and included a production build. `dist/index.html` exists; production JavaScript is 12.01 kB gzip and CSS is 5.01 kB gzip. No listed claim test failed. F-5-1 through F-5-3 are unlisted claims.

## Structure, links, accessibility, and identity

- `/`, `/study`, `/cards`, `/demo`, `/privacy`, and `/terms` return 200. A nonexistent route returns the designed HTTP 404.
- Every checked route has `lang=en`, one h1, one main landmark, a route-specific title, description, canonical, Open Graph/Twitter metadata, favicon, and the shared header/footer. The social image, apple-touch icon, manifest, robots file, and sitemap return 200.
- The title pattern is correct: Home is “Recall Anchor — Score typed flashcard answers”; application and policy routes use “Route — Recall Anchor”; the 404 uses “Page not found — Recall Anchor.”
- All internal route targets return 200. `https://sociobot.in` returns 200, the checkout returns the expected 303 to hosted checkout, and the privacy email is a valid `mailto:` target.
- The deployed 43-test run verifies Back/Forward scroll restoration, h1 focus, the polite route announcement, 390 px controls, keyboard review, and light/dark Axe checks. `/opt/fleet/lib/verify-url.sh` found no Home console errors, one h1, `lang=en`, a main landmark, no missing alt text, and no unlabeled buttons.
- The response sends `frame-ancestors 'none'` as a header. The Home request is HTTPS 200 and includes CSP, HSTS, Referrer-Policy, Permissions-Policy, and `X-Content-Type-Options`.
- The warm paper, asymmetric broadsheet, halftone answer slips, clipped corners, vermilion/mustard marks, and serif/sans pairing follow `.factory/design.md`. This is recognizably product-specific rather than a generic SaaS template.

## Earlier-finding regression audit

Every earlier review and polish report plus the prior handoff was read. Each finding was checked in the live artifact and source, not accepted from its recorded status.

| Earlier ID | Current confirmation | Status |
|---|---|---|
| F-1-1 | All three product facts fit before the fold at both required sizes. | Fixed |
| F-1-2 | The offline claim reloads, scores, stores the result, and exports CSV while offline. | Fixed |
| F-1-3 | Reset restores three cards/two reviews without changing a seeded real card. | Fixed |
| F-1-4 | The paid claim checks $19, a 303 hosted redirect, one-time checkout copy, and unlock. | Fixed |
| F-1-5 | The exact license localStorage key remains outside visitor-facing documentation. | Fixed |
| F-1-6 | License request tests cover no license, explicit verification, checkout return, and stale refresh. | Fixed |
| F-1-7 | No merchant-of-record assertion appears in Home, README, Privacy, Terms, or source copy. | Fixed |
| F-1-8 | No refund-handling assertion appears in Home, README, Privacy, Terms, or source copy. | Fixed |
| F-1-9 | An inactive license relocks paid features while free export remains available. | Fixed |
| F-1-10 | Case, composed/decomposed accents, and extra spaces are claim-tested. | Fixed |
| F-1-11 | Public copy says Anki-formatted CSV; the test checks six fields and three rows. | Fixed |
| F-1-12 | The former landing product-boundary sentence remains absent. | Fixed |
| F-1-13 | Public study terms remain typed answer, answer key, and next review date. | Fixed |
| F-1-14 | The three process headings name their task without context. | Fixed |
| F-1-15 | Storage/privacy headings are literal and specific. | Fixed |
| F-1-16 | Plans and Recall Anchor Desk license terminology remain consistent. | Fixed |
| F-1-17 | README begins with the ordinary study task; technical terms are separated below. | Fixed |
| F-1-18 | No unavailable visual-notes link or public provenance assertion remains. | Fixed |
| F-1-19 | Title, description, canonical, Open Graph, and Twitter metadata update by route. | Fixed |
| F-1-20 | The HTTP 404 has the shared shell, metadata, legal links, skip link, and version 1.0.5. | Fixed |
| F-2-1 | Back/Forward restores both saved scroll positions while focusing and announcing the h1. | Fixed |
| F-2-2 | `demo-sample` registers and tests the one-click three-card sample promise. | Fixed |
| F-2-3 | The untestable public hero-provenance assertion remains absent. | Fixed |
| F-3-1 | The regressed merchant-of-record statement remains removed. | Fixed |
| F-3-2 | The regressed refund-handling statement remains removed. | Fixed |
| F-4-1 | Terms no longer says the product measures learning ability or guarantees recall. | Fixed |

The three current findings are newly identified claim-registration gaps; no earlier ID has regressed.

## Missed leverage

No separate missed-leverage finding applies. The brief calls for local answer scoring, interval explanations, offline use, and export; the product supplies each, plus Anki-formatted export and encrypted backup/restore. Sync would contradict the current local-only promise unless introduced as an explicit opt-in. Card generation is not implied by the answer-first study job, so an AI feature would be decorative rather than necessary.

## What would make this perfect

Register and test the complete deletion contract: card removal, preservation of past review rows after removal, and clearing every local record. Keep the public wording only as broad as the tests prove. Then rerun all claim commands and this full checklist; nothing else found in this round requires a product change.
