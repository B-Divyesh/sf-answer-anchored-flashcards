# Polish round 6 — cumulative zero-finding closure

Released version: 1.0.9  
Live URL: <https://answer-anchored-flashcards.sociobot.in>  
Deployment: `d85a93ba-acd2-451e-9105-25833b77d4b1`

Every review and polish report from rounds 1–6 was reread. This table maps every finding ID to the retained or new repair and its final evidence.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept the three facts directly under the sample action and before the artwork. | `all three landing facts fit in the first screen on phone and desktop`; [cold mobile Home](polish-6-live/home-cold-390.png); live `/` fact bottoms were 719, 742, and 765 px at 390 × 844. |
| F-1-2 | Kept reload, scoring, stored result, and Review CSV download in the offline flow. | `@claim:offline-reload`; production 47-test run; live `/?demo=1`. |
| F-1-3 | Kept sample reset isolated from real cards. | `@claim:demo-reset`; [cold mobile Demo](polish-6-live/demo-cold-390.png); live reset announced “Sample cards were reset.” |
| F-1-4 | Kept the $19 price, real hosted-checkout redirect, one-time copy, and license unlock under test. | `@claim:paid-desk`; live `/`; real catalog and checkout request passed. |
| F-1-5 | Kept the exact license-storage key out of visitor-facing copy. | `@claim:license-network`; live `/privacy`; copy audit. |
| F-1-6 | Kept request boundaries for no license, explicit verification, checkout return, and stale saved license. | `@claim:license-network`; production suite; live `/privacy`. |
| F-1-7 | Removed the unsupported merchant-of-record statement again and added a negative Terms regression. | `terms keep purchase copy to the declared checkout and license behavior`; [cold Terms](polish-6-live/terms-cold-1440.png); live `/terms` has no merchant claim. |
| F-1-8 | Removed refund-handling and automatic-refund-revocation statements and added negative regressions. | Same Terms regression; [cold Terms](polish-6-live/terms-cold-1440.png); live `/terms` has no refund claim. |
| F-1-9 | Kept inactive-license relocking while free exports remain available. | `@claim:license-revocation`; production `/cards` flow. |
| F-1-10 | Kept case, composed/decomposed accent, and whitespace normalization coverage. | `@claim:exact-normalization`; live `/?demo=1`. |
| F-1-11 | Kept precise Anki-formatted CSV wording and validated all six fields and sample rows. | `@claim:anki-export`; live `/cards?demo=1`. |
| F-1-12 | Kept the untestable hosting, generation, and diagnosis boundary sentence absent. | `landing page has one clear heading and working routes`; [cold mobile Home](polish-6-live/home-cold-390.png); live `/`. |
| F-1-13 | Kept public terms as typed answer, answer key, and next review date. | `@claim:interval-reason`; copy audit; live `/` and `/demo`. |
| F-1-14 | Kept all process headings literal and useful out of context. | Landing structure test; [desktop Home](polish-6-live/screenshot-desktop.png); live `/`. |
| F-1-15 | Kept storage and privacy headings literal. | `has no serious accessibility issues on /privacy`; live `/privacy`; Axe passed light and dark. |
| F-1-16 | Kept `Plans` and `Recall Anchor Desk license` terminology consistent. | `@claim:paid-desk`; live `/`, `/cards`, and `/terms`. |
| F-1-17 | Kept README user-first and implementation details under Technical details. | Copy audit; clean-clone full suite; live first screen matches the README task. |
| F-1-18 | Kept dead visual-notes and public historical-provenance assertions absent; internal provenance remains in `design.md`. | Static host regression; [desktop Home](polish-6-live/screenshot-desktop.png); live Home and 404 footers. |
| F-1-19 | Expanded per-route checks for title, description, canonical, Open Graph, and Twitter metadata. | `every app route updates title, description, canonical, Open Graph, and Twitter metadata`; production routes and live cold checks. |
| F-1-20 | Kept the current shared shell, skip link, metadata, nav, legal links, and real status on the static 404. | `static host policy serves real 404s and immutable hashed assets`; [cold 404](polish-6-live/404-cold-1440.png); live unknown URL returned HTTP 404. |
| F-2-1 | Kept Back/Forward scroll restoration with h1 focus and polite route announcement. | `Back and Forward restore route scroll while moving focus to the heading`; production suite; live route focus check. |
| F-2-2 | Kept the registered one-click three-card sample and isolated exit to an empty real collection. | `@claim:demo-sample`; [cold mobile Demo](polish-6-live/demo-cold-390.png); live `/?demo=1`. |
| F-2-3 | Kept the untestable public image-provenance sentence absent. | Static host regression; [desktop Home](polish-6-live/screenshot-desktop.png); live Home and 404. |
| F-3-1 | Removed the repeated merchant-of-record regression from Terms, with no substitute assertion. | Terms regression; [cold Terms](polish-6-live/terms-cold-1440.png); cold live `/terms`. |
| F-3-2 | Removed the repeated refund-handling regression, including the new automatic-revocation wording. | Terms regression; [cold Terms](polish-6-live/terms-cold-1440.png); cold live `/terms`. |
| F-4-1 | Kept learning-measurement and recall-guarantee statements absent. | Terms regression rejects both phrases; live `/terms`. |
| F-5-1 | Kept complete site-data clearing registered and tested across real/demo databases, reviews, licenses, caches, and service-worker state. | `@claim:local-data-deletion`; all 18 clean-clone claim commands; live `/privacy`. |
| F-5-2 | Kept card removal persistent while retaining the prior review row in Review CSV. | `@claim:card-removal-retention`; production `/cards?demo=1`. |
| F-5-3 | Kept the Privacy removal sentence tied to the registered working removal flow. | `@claim:card-removal-retention`; live `/privacy` and `/cards?demo=1`. |
| F-6-1 | Removed “Sociobot/Dodo is the merchant of record” and guarded against recurrence. | Terms regression; [cold Terms](polish-6-live/terms-cold-1440.png); live `/terms` contains no `merchant of record`. |
| F-6-2 | Removed refund handling and automatic refund revocation and guarded against recurrence. | Terms regression; [cold Terms](polish-6-live/terms-cold-1440.png); live `/terms` contains no `refund`. |
| F-6-3 | Replaced both static and client 404 metaphors with `Page not found`; aligned descriptions and retained recovery links. | `unknown URLs show the designed 404 route`; static host regression; [cold 404](polish-6-live/404-cold-1440.png); live unknown URL returned 404. |

## Final verification

- All 18 exact `.factory/claims.json` commands passed independently from a fresh remote clone.
- Fresh remote-clone `npm test`: 47/47 passed.
- `npm run typecheck`, `npm run build`, and `npm audit --audit-level=low`: passed.
- Full production suite: 47/47 passed.
- `verify-url.sh`: passed with no console errors. See [verify.json](polish-6-live/verify.json).
- Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO. See [lighthouse-mobile.json](polish-6-live/lighthouse-mobile.json).
- Cold Home, Demo, Terms, 404, route focus, storage isolation, request boundary, reset, and exit checks passed after deployment.
- Live HTML, JavaScript, and CSS hashes match the final local build.

No finding of any severity remains open.
