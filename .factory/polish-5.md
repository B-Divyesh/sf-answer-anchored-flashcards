# Polish round 5 — cumulative zero-finding closure

Release candidate `f49f8e2bb0b597f4192cbbdc5a4cd97bd29b89f0`, reviewed in `bd5a3ee4571f3949a93eb56995de8ec60d45a997`, was repaired in implementation commit `91b43ea7f7da78038ab8a68d164b6709bc36b9aa`. It was pushed to `origin/main` and deployed to <https://answer-anchored-flashcards.sociobot.in> as Azure Static Web Apps deployment `df43d6cb-2a07-4bb5-b9cb-3883d1d7188c`.

Round 5 adds outcome coverage for complete site-data clearing and for card removal with retained review history. It also adds a registry test that rejects an unregistered claim, a missing claim test, or a duplicate claim tag. Every earlier finding was rechecked in source, tests, and the deployed artifact.

## Finding map

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept all three facts immediately below the sample action and ahead of the artwork. | `all three landing facts fit in the first screen on phone and desktop`; `.factory/polish-5-home-390.png`; cold live `/` placed the fact bottoms at 719, 742, and 765 px in a 390 × 844 viewport. |
| F-1-2 | Kept offline reload, review scoring, stored result, and Review CSV download in one claim flow. | `@claim:offline-reload`; `.factory/polish-5-demo-390.png`; production `/?demo=1` passed in the 46-test live run. |
| F-1-3 | Kept reset coverage that restores the sample without changing real cards. | `@claim:demo-reset`; `.factory/polish-5-demo-390.png`; cold live `/?demo=1` showed “Sample cards were reset.” |
| F-1-4 | Kept the $19 catalog price, real 303 hosted-checkout redirect, one-time checkout text, and valid-license unlock under test. | `@claim:paid-desk`; `.factory/polish-5-home-390.png`; live checkout returned 303 and Home passed. |
| F-1-5 | Kept the exact license-storage key out of visitor-facing copy. | `@claim:license-network`; `.factory/polish-5-privacy-1440.png`; live `/privacy` describes triggers rather than implementation keys. |
| F-1-6 | Kept request-boundary coverage for no license, explicit verification, checkout return, and stale saved license. | `@claim:license-network`; `.factory/polish-5-privacy-1440.png`; production `/privacy` and the live claim passed. |
| F-1-7 | Kept the unsupported merchant-of-record assertion absent. | `terms keep purchase copy to the declared checkout and license behavior`; `.factory/polish-5-terms-1440.png`; live `/terms` contains no merchant claim. |
| F-1-8 | Kept the unsupported refund-handling assertion absent. | `terms keep purchase copy to the declared checkout and license behavior`; `.factory/polish-5-terms-1440.png`; live `/terms` contains no refund claim. |
| F-1-9 | Kept inactive-license relocking while free exports remain available. | `@claim:license-revocation`; `.factory/polish-5-removal-1440.png`; production `/cards` passed the live claim. |
| F-1-10 | Kept case, composed/decomposed accent, and whitespace normalization coverage. | `@claim:exact-normalization`; `.factory/polish-5-demo-390.png`; production `/?demo=1` passed. |
| F-1-11 | Kept precise Anki-formatted CSV wording and six-field/three-card validation. | `@claim:anki-export`; `.factory/polish-5-removal-1440.png`; production `/cards?demo=1` passed. |
| F-1-12 | Kept the untestable landing product-boundary sentence removed. | `landing page has one clear heading and working routes`; `.factory/polish-5-home-390.png`; cold live `/` contains no hosting, generation, or diagnosis assertion. |
| F-1-13 | Kept public study terms as typed answer, answer key, and next review date. | `@claim:interval-reason`; `.factory/polish-5-home-390.png`; live `/` and `/?demo=1` use the same terms. |
| F-1-14 | Kept all three process headings literal and useful out of context. | `landing page has one clear heading and working routes`; `.factory/polish-5-home-390.png`; live `/` retained the task-complete outline. |
| F-1-15 | Kept data-storage and privacy headings literal. | `has no serious accessibility issues on /privacy`; `.factory/polish-5-privacy-1440.png`; live `/privacy` has one h1 and an ordered heading outline. |
| F-1-16 | Kept `Plans` and `Recall Anchor Desk license` terminology consistent. | `@claim:paid-desk`; `.factory/polish-5-home-390.png`; live `/`, `/cards`, and `/terms` match. |
| F-1-17 | Kept README user-first and technical details below the task explanation. | `landing page has one clear heading and working routes`; `.factory/polish-5-home-390.png`; live first-screen wording matches README. |
| F-1-18 | Kept historical image-provenance assertions out of public copy while retaining internal provenance in `design.md`. | `static host policy serves real 404s and immutable hashed assets`; `.factory/polish-5-404-1440.png`; live Home and 404 footers contain no provenance assertion. |
| F-1-19 | Kept route-specific title, description, canonical, Open Graph, and Twitter metadata. | `every app route updates canonical, Open Graph, and Twitter metadata`; `.factory/polish-5-privacy-1440.png`; all six live routes plus the 404 passed. |
| F-1-20 | Updated the standard-shell static 404 to version 1.0.6 while retaining skip, nav, legal links, and metadata. | `static host policy serves real 404s and immutable hashed assets`; `.factory/polish-5-404-1440.png`; live `/not-a-real-card-round-5` returned HTTP 404. |
| F-2-1 | Kept manual Back/Forward scroll state with h1 focus and polite announcement. | `Back and Forward restore route scroll while moving focus to the heading`, repeated 5/5 against production; `.factory/polish-5-back-restored-390.png`; live Home restored to 1200 px with its h1 focused. |
| F-2-2 | Kept the registered one-click three-card sample promise and isolated real-data exit. | `@claim:demo-sample`; `.factory/polish-5-demo-390.png`; cold live Home → `/?demo=1` showed `3 due`, then **Start for real** opened an empty `/cards`. |
| F-2-3 | Kept the untestable historical provenance sentence absent. | `static host policy serves real 404s and immutable hashed assets`; `.factory/polish-5-home-390.png`; live Home and 404 contain no public generation claim. |
| F-3-1 | Kept the regressed merchant-of-record clause removed. | `terms keep purchase copy to the declared checkout and license behavior`; `.factory/polish-5-terms-1440.png`; cold live `/terms` contains no `merchant of record`. |
| F-3-2 | Kept the regressed refund-handling clause removed. | `terms keep purchase copy to the declared checkout and license behavior`; `.factory/polish-5-terms-1440.png`; cold live `/terms` contains no `refund`. |
| F-4-1 | Kept the untestable learning-measurement and recall-guarantee sentence removed. | `terms keep purchase copy to the declared checkout and license behavior`; `.factory/polish-5-terms-1440.png`; live `/terms` contains neither phrase. |
| F-5-1 | Narrowed the clearing instruction to named browser stores, registered `local-data-deletion`, and added a CDP site-data test. It seeds real/demo cards and reviews, license state, Cache Storage, and a service worker; clears the origin; proves all are absent before revisiting; then proves real data is empty and the demo reseeds. | `@claim:local-data-deletion`; `.factory/polish-5-privacy-1440.png`; the claim passed independently from the clean clone and in the production suite at live `/privacy`. |
| F-5-2 | Registered `card-removal-retention` and added an end-to-end test that creates and reviews a card, removes it, reloads, proves it stays absent, and validates its prior row in Review CSV. | `@claim:card-removal-retention`; `.factory/polish-5-removal-1440.png`; production `/cards?demo=1` passed the full flow. |
| F-5-3 | The same claim now covers the Privacy removal statement and the actual Remove control, including persistence after reload. | `@claim:card-removal-retention`; `.factory/polish-5-removal-1440.png`; live `/privacy` names removal and live `/cards?demo=1` completed it. |

## Verification

- Fresh clone: `/tmp/recall-anchor-polish5-XoW6uo/repo` at `91b43ea7f7da78038ab8a68d164b6709bc36b9aa`.
- `npm ci` reported zero vulnerabilities. All 18 exact commands in `.factory/claims.json` passed independently from that clone.
- Clean-clone `npm test` passed 46/46. `npm run typecheck`, `npm run build`, and `npm audit --audit-level=low` passed; `dist/index.html` exists.
- The deployed full suite passed 46/46 with `PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test`.
- A separate live Axe run found zero WCAG 2 A/AA violations on Home, Demo, Cards, Privacy, Terms, and 404 in light and dark themes: 12/12 route-theme checks.
- `/opt/fleet/lib/verify-url.sh` reported HTTPS 200, no console errors, `lang=en`, one h1, a main landmark, no missing alt text, and no unlabeled buttons. Evidence: `.factory/polish-5-live/verify.json`.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.433 s; CLS 0. Evidence: `.factory/polish-5-live/lighthouse-mobile.json`.
- Production JavaScript is 35,907 B raw / 12.04 kB gzip; CSS is 18,644 B raw / 5.01 kB gzip; the mobile hero is 79,516 B. The live HTML, JS, and CSS SHA-256 hashes match `dist/`.
- A cold live crawl returned 200 for every internal link and Sociobot, 303 for hosted checkout, and a valid `mailto:` target. The unknown route returned the designed HTTP 404.

No finding from review rounds 1–5 remains open.
