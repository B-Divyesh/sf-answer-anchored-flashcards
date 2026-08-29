# Adversarial first-read review 4 — Recall Anchor

Reviewed 2026-08-29 UTC against repository commit `a3302bcfda9cb9eac1397e98599dd348564169fa` and the live site at <https://answer-anchored-flashcards.sociobot.in>.

## Verdict

**FAIL — 1 minor finding.**

The cold first-read, one-click demo, declared claim tests, offline/privacy behavior, routing, accessibility, link crawl, and visual-identity checks pass. The standard for this review is zero findings. The Terms page makes two visitor-reliant product-boundary assertions without a corresponding entry and observable test in `.factory/claims.json`.

## Cold first screen

Fresh browser contexts were used before scrolling at 390 × 844 and 1440 × 900.

| Viewport | What it does | For whom | First action | Result |
|---|---|---|---|---|
| 390 × 844 | Scores flashcards from the typed answer and sets a next review date. | People studying alone. | **Try it with sample data**; three due cards open next. | PASS |
| 1440 × 900 | Same. | Same. | Same. | PASS |

The exact visible copy was “Score flashcards from typed answers,” “For people studying alone who want the next review date based on an answer, not a guessed rating,” **Try it with sample data**, and “Three due cards open next.” At both sizes the offline, browser-storage, and free-30-card facts were also fully visible before the fold. No first-read blocking finding applies.

## Finding

### F-4-1 — Terms makes unlisted product-boundary claims

**Severity: minor — unlisted claim.**

- **Exact quote/location:** `/terms`, opening paragraph: “Recall Anchor helps you study. It does not measure learning ability or guarantee recall.” The same text is emitted by `termsPage()` in `src/main.ts`.
- **Evidence:** None of the 16 entries in `.factory/claims.json` covers whether the product measures learning ability or guarantees recall. The existing test suite does not exercise either statement. These are factual product-boundary statements a visitor can rely on, rather than merely a heading or a legal citation.
- **Why this matters:** The review contract requires every claim-like sentence to have a listed test. Earlier finding F-1-12 removed a similar untestable three-part product-boundary statement from the landing page for this reason. Reintroducing a different unregistered boundary statement in Terms leaves the same regression gap.
- **Concrete fix:** Delete the sentence, leaving the plain heading “Use Recall Anchor for personal study”; or add separate claims with observable, sandboxable tests for every retained assertion. Do not register a self-referential test that only checks that the sentence is displayed.

## Copy audit

Counts treat hyphenated compounds, URLs, paths, keyboard shortcuts, versions, and identifiers as one word. Labels, headings, actions, and informative fragments are included because the plain-words check also covers them. `—` means no wording issue. All items are 22 words or fewer. No landing or README copy uses a banned marketing adjective, changes the meaning of a repeated term, uses an information-free mood heading, or uses a non-result-naming button.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | — |
| RA | 1 | Decorative mark |
| Recall Anchor | 2 | — |
| Study / Cards / Demo / Privacy | 1 each | Clear navigation |
| Typed-answer flashcard review | 3 | — |
| Score flashcards from typed answers | 5 | — |
| For people studying alone who want the next review date based on an answer, not a guessed rating. | 18 | — |
| Try it with sample data | 5 | `demo-sample` |
| Three due cards open next. | 5 | `demo-sample` |
| Works offline after your first visit | 6 | `offline-reload` |
| Cards stay in this browser | 5 | `local-privacy` |
| Free for 30 cards | 4 | `free-limit` |
| 01 | 1 | Decorative number |
| Typed answer → answer key → next review date | 7 | — |
| Typed answer / Answer key / Next review | 2 each | Clear preview labels |
| claim, evidence | 2 | Realistic preview content |
| 2 of 3 matched | 4 | Realistic preview result |
| Tomorrow | 1 | Realistic preview result |
| How Recall Anchor scores a review | 6 | — |
| See what matched and when to review again | 8 | — |
| 01 / 02 / 03 | 1 each | Decorative step numbers |
| Type your answer before seeing the key | 7 | — |
| Write the answer you remember. | 5 | — |
| Compare it with the answer key | 6 | — |
| Use exact text, a number range, or a checklist. | 9 | `answer-types` |
| See why the card returns when it does | 8 | — |
| Read what matched and the next review date. | 8 | `interval-reason` |
| Data storage and privacy | 4 | — |
| Cards and reviews stay in this browser | 7 | `local-privacy` |
| Cards and reviews are stored on this device. | 8 | `local-privacy` |
| Read the privacy details | 4 | Clear destination |
| Local only | 2 | Decorative stamp |
| Plans | 1 | — |
| Use 30 cards free or buy unlimited cards | 8 | `free-limit`, `paid-desk` |
| $19 | 1 | `paid-desk` |
| one-time purchase | 2 | `paid-desk` |
| The Recall Anchor Desk license adds unlimited cards and review trends. | 11 | `paid-desk` |
| The free plan includes 30 cards, every card type, and every export. | 12 | `free-limit`, answer/export claims |
| Buy Recall Anchor Desk license | 5 | `paid-desk` |
| opens hosted checkout | 3 | `paid-desk` |
| Read purchase terms | 3 | Clear destination |
| Have a license? | 3 | — |
| Paste your license | 3 | — |
| Verify license | 2 | `license-network` |
| Score cards from typed answers, not guessed ratings. | 8 | Clear product summary |
| Terms | 1 | Clear navigation |
| Built by Param Factory | 4 | Attribution |
| opens in a new tab | 5 | Destination disclosure |
| Version 1.0.4 | 2 | Build identifier |

### README

| Copy | Words | Result |
|---|---:|---|
| Recall Anchor | 2 | — |
| Score flashcards from typed answers, not guessed ratings. | 8 | — |
| Recall Anchor is a study tool for people who study on their own. | 13 | — |
| Type an answer, compare it with the answer key, and see the next review date. | 15 | — |
| After your first visit, it works without an internet connection. | 10 | `offline-reload` |
| Live site: URL | 3 | Destination |
| Try the isolated demo | 4 | — |
| Open `?demo=1` or the live demo URL. | 4 | `demo-sample` |
| It opens three due sample cards in separate browser storage. | 10 | `demo-sample` |
| Use Reset demo to restore the sample. | 7 | `demo-reset` |
| Use Start for real to open your own empty collection. | 10 | `demo-isolation` |
| What it includes | 3 | — |
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
| Technical details | 2 | — |
| Cards and reviews use IndexedDB. | 6 | Implementation detail |
| Demo data uses the separate `recall-anchor-demo` database. | 7 | Implementation detail |
| Encrypted backups use AES-GCM. | 4 | `encrypted-backup` |
| License tokens are namespaced in localStorage. | 6 | Implementation detail |
| Develop | 1 | — |
| Requires Node.js 20 or newer. | 5 | Run requirement |
| `npm install` / `npm run dev` | 2 / 3 | Commands |
| Open the local URL printed by Vite. | 7 | Instruction |
| The production build is static. | 5 | Build property |
| Test and build | 3 | — |
| `npm test` / `npm run build` | 2 / 3 | Commands |
| `npm test` builds the product and runs Playwright claim, accessibility, persistence, route, and 390 px mobile checks. | 17 | Verified |
| The exact deployment command is `npm run build`. | 8 | Verified |
| Output lands in `dist/`, with `dist/index.html` at its root. | 9 | Verified |
| Each product claim and its sandbox test is listed in `.factory/claims.json`. | 11 | F-4-1 is omitted |
| Demo behavior is documented in `.factory/demo.md`. | 6 | Verified |
| Deploy | 1 | — |
| Deploy the contents of `dist/` as a static site. | 9 | Instruction |
| `staticwebapp.config.json` supplies SPA fallback, security headers, and the 404 response for Azure Static Web Apps. | 15 | Verified |
| The factory owns DNS and deployment. | 6 | Scope statement |
| Privacy and payment | 3 | — |
| There are no analytics, third-party fonts, or third-party runtime scripts. | 10 | `local-privacy` |
| Study data does not leave the browser. | 7 | `local-privacy` |
| The one-time Desk purchase uses Sociobot’s hosted checkout and license verification. | 11 | `paid-desk`, `license-network` |
| See `/privacy` and `/terms` in the app. | 7 | Verified |
| License | 1 | — |
| MIT. / See `LICENSE`. | 1 / 2 | Verified |

## Demo, claims, sandbox, and structure evidence

- One click from the live landing page opened `/?demo=1`. The first screen already showed the realistic “What Spanish word means coffee?” card, its answer field, confidence choices, **Score my answer**, and `FOUNDATIONS · 3 DUE`.
- The persistent banner read “Demo — sample data, nothing is saved to your cards.” **Reset demo** returned the sample; **Start for real** opened `/cards` with `{cards: [], reviews: []}` in the real `recall-anchor` database. The only database while demo was open was `recall-anchor-demo`.
- The live landing and demo request logs contained only same-origin document, JS, CSS, image, and service-worker resources; there were no console errors. The declared local-privacy test additionally covers answer entry, Anki export, and encrypted export without off-origin or passphrase-bearing requests.
- From fresh clone `/tmp/recall-review4-gQrAxx/repo`, `npm ci` passed. Every exact command listed in `.factory/claims.json` passed independently (16/16). The final run recorded `test-results/.last-run.json` as `{"status":"passed","failedTests":[]}`.
- The fresh-clone full `npm test` passed 43/43; `npm run typecheck` and `npm run build` passed and created `dist/`. Build output was 12.05 kB gzip JS and 5.01 kB gzip CSS.
- The live routes `/`, `/demo`, `/study`, `/cards`, `/privacy`, and `/terms` all returned 200. A nonexistent route returned the designed static 404 with HTTP 404. Every checked route had one h1, one main landmark, a route-specific title, description, canonical, Open Graph title, favicon, and the shared header/footer.
- Crawled internal navigation targets returned 200 (aside from the deliberately checked unknown 404); `mailto:` was valid and the checkout target is the expected external hosted-checkout flow. Back/Forward scroll restoration, heading focus, and polite announcements are covered by the regression suite.
- The on-brand warm-paper worksheet, halftone answer-slip art, clipped corners, serif/sans pairing, and vermilion/mustard marks match `.factory/design.md` and are clearly distinct from a generic SaaS template. The brief implies exports and local storage, both supplied; it does not imply an AI feature or sync.

## Earlier-finding regression audit

All earlier review, polish, and handoff files were read. Each earlier finding was checked in the current live artifact and source, not accepted merely from its previous status.

| Earlier ID | Current confirmation | Status |
|---|---|---|
| F-1-1 | All three facts fit in both required first screens. | Fixed |
| F-1-2 | Offline test reloads, scores, and exports while offline. | Fixed |
| F-1-3 | Reset restores demo data without changing real data. | Fixed |
| F-1-4 | Claim verifies $19, 303 hosted checkout, one-time copy, and unlock. | Fixed |
| F-1-5 | The storage-key implementation name is not a public contract. | Fixed |
| F-1-6 | License request boundaries cover no-license, explicit, returned, and stale flows. | Fixed |
| F-1-7 | No merchant-of-record assertion is present. | Fixed |
| F-1-8 | No refund-handling assertion is present. | Fixed |
| F-1-9 | An inactive license relocks paid features while exports remain. | Fixed |
| F-1-10 | Case, accent form, and spaces are claim-tested. | Fixed |
| F-1-11 | The public export wording is concrete Anki-formatted CSV. | Fixed |
| F-1-12 | The prior unlisted landing boundary sentence remains absent. | Fixed; related new gap is F-4-1 |
| F-1-13 | Public terms are typed answer, answer key, and next review date. | Fixed |
| F-1-14 | Process headings name their task out of context. | Fixed |
| F-1-15 | Privacy headings name storage/privacy directly. | Fixed |
| F-1-16 | Plans and Recall Anchor Desk license are consistent. | Fixed |
| F-1-17 | README starts with the ordinary study task. | Fixed |
| F-1-18 | No dead visual-notes/provenance footer reference remains. | Fixed |
| F-1-19 | SPA metadata updates route by route. | Fixed |
| F-1-20 | Static 404 has the shared shell, legal links, current version, and metadata. | Fixed |
| F-2-1 | Back/Forward restores scroll, focus, and route announcement. | Fixed |
| F-2-2 | The three-card sample action is registered and tested. | Fixed |
| F-2-3 | The untestable public hero-provenance assertion remains absent. | Fixed |
| F-3-1 | The merchant-of-record claim did not regress. | Fixed |
| F-3-2 | The refund-handling claim did not regress. | Fixed |

## What would make this perfect

Remove the untestable Terms product-boundary sentence, or provide separate observable claim coverage for each retained assertion. Then rerun the 16 declared claim commands and the full adversarial checklist. No other product change was identified in this round.
