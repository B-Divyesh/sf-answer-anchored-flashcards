# Adversarial first-read review 6 — Recall Anchor

Reviewed 2026-08-29 UTC against repository commit `aed015d228c1d6fc28740aeb7c683825be5a11cd` and the live site at <https://answer-anchored-flashcards.sociobot.in>.

## Verdict

**FAIL — 3 findings: 2 blocking regressions and 1 minor.**

The first-read gate, demo gate, all 18 declared claim commands, clean-clone suite, deployed suite, offline/privacy checks, link crawl, and accessibility checks pass. The result is still FAIL because two unsupported legal claims have regressed and the 404 h1 uses a metaphor. This review requires zero findings and no untested claim.

## Cold first screen

Fresh browser contexts were opened before scrolling.

| Viewport | What does it do? | For whom? | What should I click first? | Result |
|---|---|---|---|---|
| 390 × 844 | Scores flashcards from the answer I type and sets the next review date. | People studying alone. | **Try it with sample data**; the adjacent line says three due cards open next. | PASS |
| 1440 × 900 | Same. | Same. | Same. | PASS |

The exact first-screen text is “Score flashcards from typed answers,” “For people studying alone who want the next review date based on an answer, not a guessed rating,” **Try it with sample data**, and “Three due cards open next.” The offline, browser-storage, and free-30-card facts are also fully visible: their last lines end at 765 px on the 844 px phone viewport and 882 px on the 900 px desktop viewport. There is no first-read blocking finding.

## Findings — blocking

### F-6-1 / F-3-1 / F-1-7 — The merchant-of-record claim regressed again

- **Exact quote/location:** Live `/terms`, Purchases: “Sociobot/Dodo is the merchant of record.” Source: `termsPage()` in `src/main.ts`.
- **Evidence:** `.factory/claims.json` has no merchant-of-record entry. The `paid-desk` claim is only “A $19 one-time Recall Anchor Desk license adds unlimited cards and review trends.” Its test confirms the Terms page repeats the merchant sentence; it does not check an authoritative contract or policy that establishes the legal role. This exact defect was F-1-7, regressed as F-3-1, was removed in polish rounds 3–5, and is live again.
- **Why a visitor is misled:** A buyer can use this sentence to decide which company is legally responsible for the sale. A self-referential UI assertion does not prove that responsibility.
- **Concrete fix:** Remove the sentence. If the legal role must remain public, add a distinct `merchant-of-record` entry to `.factory/claims.json`, link a stable authoritative policy or contract, and make the claim test verify that source rather than Recall Anchor’s own copy.

### F-6-2 / F-3-2 / F-1-8 — Refund handling and automatic refund revocation regressed again

- **Exact quote/location:** Live `/terms`, Purchases: “It handles refunds, and a refund revokes the license automatically.” Source: `termsPage()` in `src/main.ts`.
- **Evidence:** `.factory/claims.json` has no refund-handling or refund-revocation entry. `license-revocation` proves only that a mocked inactive saved license returns the UI to the free plan. `paid-desk` asserts that this sentence is visible and checks one-time checkout text; neither test proves where a buyer requests a refund or that a real refund automatically changes the license. This exact unsupported refund claim was F-1-8, regressed as F-3-2, was removed in polish rounds 3–5, and is live again.
- **Why a visitor is misled:** The sentence sets a support expectation and promises an automatic account outcome that the declared sandbox contract does not establish.
- **Concrete fix:** Remove the sentence. If retained, add separate claim entries for refund handling and automatic refund revocation, link the actual refund policy, and test an authoritative refund-to-license flow without making a purchase.

## Finding — minor

### F-6-3 — The 404 h1 is a metaphor, not a standalone error heading

- **Exact quote/location:** Live unknown URL and `public/404.html`: “This page is not in the deck.” The client-side fallback in `src/main.ts` also labels the route “Misprinted route.”
- **Evidence:** The HTTP status, title, metadata, shell, and return link are correct. However, a screen-reader heading list exposes only “This page is not in the deck,” which depends on flashcard wordplay to communicate the error. The plain-words rule requires headings to name the section without surrounding context and rejects metaphor headings.
- **Why a visitor is lost:** “Deck” can mean cards, slides, or a physical platform. It delays the one fact a visitor needs: the page was not found.
- **Concrete fix:** Use `<h1>Page not found</h1>` in both the static and client-side 404. Keep “The address may be wrong or the page may have moved” and **Return home** beneath it. Update the 404 regression to assert the literal h1.

## Copy audit

Counts treat hyphenated compounds, URLs, paths, versions, and keyboard shortcuts as one word. The tables include headings, labels, actions, and informative fragments so the heading and result-naming-action checks are explicit. No landing or README item exceeds 22 words, uses a banned marketing adjective, changes terms for the same concept, uses an information-free mood heading, or uses a non-result-naming action. The three findings occur outside this requested landing/README corpus.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Pass |
| RA | 1 | Decorative mark |
| Recall Anchor | 2 | Pass |
| Study | 1 | Clear navigation |
| Cards | 1 | Clear navigation |
| Demo | 1 | Clear navigation |
| Privacy | 1 | Clear navigation |
| Typed-answer flashcard review | 3 | Clear category label |
| Score flashcards from typed answers | 5 | Pass |
| For people studying alone who want the next review date based on an answer, not a guessed rating. | 18 | Pass |
| Try it with sample data | 5 | Result-naming action; `demo-sample` |
| Three due cards open next. | 5 | `demo-sample` |
| Works offline after your first visit | 6 | `offline-reload` |
| Cards stay in this browser | 5 | `local-privacy` |
| Free for 30 cards | 4 | `free-limit` |
| 01 | 1 | Decorative number |
| Typed answer → answer key → next review date | 7 | Clear process caption |
| Typed answer | 2 | Clear preview label |
| claim, evidence | 2 | Sample answer content |
| Answer key | 2 | Clear preview label |
| 2 of 3 matched | 4 | Sample result |
| Next review | 2 | Clear preview label |
| Tomorrow | 1 | Sample result |
| How Recall Anchor scores a review | 6 | Clear section label |
| See what matched and when to review again | 8 | Clear section heading |
| 01 / 02 / 03 | 1 each | Decorative step numbers |
| Type your answer before seeing the key | 7 | Clear step heading |
| Write the answer you remember. | 5 | Pass |
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
| Version 1.0.7 | 2 | Build identifier |

### README

| Copy | Words | Result |
|---|---:|---|
| Recall Anchor | 2 | Pass |
| Score flashcards from the answer you type, not a rating you guess. | 12 | Pass |
| Recall Anchor is a study tool for people who study on their own. | 13 | Pass |
| Type an answer, compare it with the answer key, and see the next review date. | 15 | `interval-reason` |
| After your first visit, it works without an internet connection. | 10 | `offline-reload` |
| Live site: `https://answer-anchored-flashcards.sociobot.in` | 3 | Destination label |
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
| Sociobot is contacted only for a Desk checkout or license verification. | 11 | `paid-desk`, `license-network` |
| Technical details | 2 | Clear heading |
| Cards and reviews use IndexedDB. | 6 | Implementation detail |
| Demo data uses the separate `recall-anchor-demo` database. | 7 | Implementation detail |
| Encrypted backups use AES-GCM. | 4 | `encrypted-backup` |
| License tokens are namespaced in localStorage. | 6 | Implementation detail |
| Develop | 1 | Clear heading |
| Requires Node.js 20 or newer. | 5 | Run requirement |
| `npm install` | 2 | Command |
| `npm run dev` | 3 | Command |
| Open the local URL printed by Vite. | 7 | Instruction |
| The production build is static. | 5 | Build property |
| Test and build | 3 | Clear heading |
| `npm test` | 2 | Command |
| `npm run build` | 3 | Command |
| `npm test` builds the product and runs Playwright claim, accessibility, persistence, route, and 390 px mobile checks. | 17 | Verified in the clean clone |
| The exact deployment command is `npm run build`. | 8 | Verified in the clean clone |
| Output lands in `dist/`, with `dist/index.html` at its root. | 9 | Verified in the clean clone |
| Each product claim and its sandbox test is listed in `.factory/claims.json`. | 11 | F-6-1 and F-6-2 show the registry is incomplete |
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

- One click from a fresh live Home context opened `/?demo=1` directly on “What Spanish word means coffee?” with the answer field, confidence choices, **Score my answer**, and `FOUNDATIONS · 3 DUE` already visible.
- The persistent banner says “Demo — sample data, nothing is saved to your cards.” It includes **Reset demo** and **Start for real**.
- Scoring `café` showed “100% of the answer key matched.” **Reset demo** restored the original three due cards and announced “Sample cards were reset.” **Start for real** opened `/cards` with `0 CARDS · 0 DUE` and no demo banner.
- The full demo flow sent only same-origin document, JS, CSS, image, and service-worker requests. The typed answer did not appear in a request body. The deployed `local-privacy` and `offline-reload` claims also passed the complete encrypted-export and offline review/export flows.
- Source and tests confirm separate IndexedDB databases: `recall-anchor-demo` and `recall-anchor`. `demo-reset` preserved a seeded real card; `demo-isolation` returned to an empty real collection. Demo behavior passes.

## Declared claim results

Clean clone: `/tmp/recall-review6-ekAMj0/repo` at `aed015d228c1d6fc28740aeb7c683825be5a11cd`. After `npm ci`, every exact command in `.factory/claims.json` was run independently.

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
| `local-data-deletion` | PASS, 1 test |
| `card-removal-retention` | PASS, 1 test |
| `keyboard-review` | PASS, 1 mobile test |
| `exact-normalization` | PASS, 1 test |
| `free-limit` | PASS, 1 test |
| `paid-desk` | PASS, 1 test |
| `license-network` | PASS, 1 test |
| `license-revocation` | PASS, 1 test |

The clean-clone full suite passed 47/47 and produced `dist/`. The same 47/47 suite passed against the deployed origin. Each registered ID has exactly one tagged test. The passing `paid-desk` test does not resolve F-6-1 or F-6-2 because its registered claim text omits those legal promises and its relevant assertions only confirm that the app displays them.

## Structure, links, accessibility, and identity

- `/`, `/demo`, `/study`, `/cards`, `/privacy`, and `/terms` return 200. An unknown route returns the designed page with HTTP 404.
- Every checked route has `lang=en`, one h1, one main landmark, a route-specific title, description, canonical, Open Graph/Twitter metadata, favicon, and the shared header/footer. Home uses “Recall Anchor — Score typed flashcard answers”; secondary routes use “Route — Recall Anchor.”
- The sitemap lists all six public routes. The manifest, robots file, SVG favicon, 180 px apple-touch icon, and 1200 × 630 social image return 200.
- All internal route targets return 200. `https://sociobot.in` returns 200, the purchase endpoint returns the expected 303 to hosted checkout, and the privacy address is a valid `mailto:` link.
- The deployed Back/Forward test restores both saved scroll positions, focuses the new h1, and updates the polite route announcement. Deep-link reloads pass.
- The live response supplies CSP, HSTS, `nosniff`, strict-origin referrer policy, and permissions policy. `frame-ancestors` is sent in the response CSP. The live Home, JS, and CSS are byte-identical to the clean build.
- `verify-url.sh` reports no console errors, one h1, `lang=en`, one main, no missing alt text, and no unnamed buttons. Playwright Axe reports zero serious/critical WCAG 2 A/AA violations across Home, Demo, Cards, Privacy, Terms, and 404 in light and dark modes. The 390 px touch/overflow and keyboard tests pass; reduced-motion CSS reduces transitions and animation to 0.01 ms.
- Production JavaScript is 36,072 bytes raw and 12,084 bytes gzip; CSS is 5,021 bytes gzip. The first-load script remains below the 150 KB budget.
- The warm paper, asymmetric worksheet layout, halftone answer slips, clipped corners, serif/sans pairing, and vermilion/mustard marks match `.factory/design.md`. The identity is product-specific rather than a generic SaaS template. F-6-3 concerns the 404 wording, not its visual design or routing.

## Earlier-finding regression audit

Every earlier review and polish report plus the handoff was read. Each earlier finding was checked against the current live artifact, source, and tests rather than accepted from its recorded status.

| Earlier ID | Current confirmation | Status |
|---|---|---|
| F-1-1 | All three required facts fit before the fold at 390 × 844 and 1440 × 900. | Fixed |
| F-1-2 | `offline-reload` reloads, scores, stores the result, and downloads Review CSV while offline. | Fixed |
| F-1-3 | `demo-reset` restores three cards/two prior reviews without changing a seeded real card. | Fixed |
| F-1-4 | `paid-desk` verifies $19, a real 303 hosted-checkout redirect, one-time checkout copy, and paid unlock. | Fixed |
| F-1-5 | The exact license storage key is absent from visitor-facing documentation. | Fixed |
| F-1-6 | `license-network` covers no-license, explicit verification, checkout return, and stale saved-license refresh. | Fixed |
| F-1-7 | “Sociobot/Dodo is the merchant of record” is live again without a matching claim entry or authoritative test. | **Regressed: F-6-1** |
| F-1-8 | Refund handling and automatic refund revocation are live again without matching claim entries or authoritative tests. | **Regressed: F-6-2** |
| F-1-9 | `license-revocation` returns a mocked inactive saved license to the free plan while exports remain. | Fixed |
| F-1-10 | `exact-normalization` covers case, composed/decomposed accents, and extra spaces. | Fixed |
| F-1-11 | Public wording says Anki-formatted CSV; the test checks all six fields and three card rows. | Fixed |
| F-1-12 | The former hosting/generation/diagnosis product-boundary sentence remains absent. | Fixed |
| F-1-13 | Public study terms remain typed answer, answer key, and next review date. | Fixed |
| F-1-14 | All three process headings name their task without surrounding context. | Fixed |
| F-1-15 | Storage/privacy headings are literal and specific. | Fixed |
| F-1-16 | `Plans` and `Recall Anchor Desk license` remain consistent. | Fixed |
| F-1-17 | README begins with the ordinary study task; implementation details remain under Technical details. | Fixed |
| F-1-18 | No unavailable visual-notes link or public historical provenance assertion remains. | Fixed |
| F-1-19 | Title, description, canonical, Open Graph, and Twitter metadata update by route. | Fixed |
| F-1-20 | The HTTP 404 retains the shared shell, metadata, legal links, skip link, and current version. | Fixed structurally; new wording issue F-6-3 |
| F-2-1 | The deployed regression restores Home and Cards scroll positions with h1 focus and announcement. | Fixed |
| F-2-2 | `demo-sample` registers and tests the one-click three-card promise and isolated exit. | Fixed |
| F-2-3 | The untestable public hero-provenance sentence remains absent. | Fixed |
| F-3-1 | The merchant-of-record clause removed in polish round 3 is live again. | **Regressed: F-6-1** |
| F-3-2 | The refund-handling clause removed in polish round 3 is live again with an added automatic-revocation promise. | **Regressed: F-6-2** |
| F-4-1 | Terms no longer says the product measures learning ability or guarantees recall. | Fixed |
| F-5-1 | `local-data-deletion` clears both databases, reviews, licenses, caches, and service-worker state through site-data controls. | Fixed |
| F-5-2 | `card-removal-retention` proves removal persists and the prior review remains in Review CSV. | Fixed |
| F-5-3 | The same registered claim covers the Privacy removal statement and working Cards removal control. | Fixed |

## Missed leverage

No missed-leverage finding applies. The brief calls for answer-based scoring, interval explanations, offline use, and export. The product supplies those, plus Anki-formatted export and encrypted backup/restore. Sync would conflict with the present local-only contract unless it became an explicit opt-in. Card generation is not implied by the answer-first job, so an AI feature would be decorative rather than necessary.

## What would make this perfect

Remove the merchant-of-record and refund sentences, or register and prove each against an authoritative external contract. Replace the 404 metaphor with the literal h1 “Page not found” in both 404 implementations. Then rerun every claim command, the full deployed suite, and the complete claim-copy scan. No other product change was identified in this round.
