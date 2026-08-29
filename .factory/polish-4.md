# Polish round 4 — cumulative zero-finding closure

Implementation commit: `0e671d83dfe559fa9b3c3fd13e1f718f64ffe2bc`. It was pushed to `origin/main` and deployed to <https://answer-anchored-flashcards.sociobot.in> through the static work-order configuration. Azure deployment ID: `ec9bdd80-d2ab-437b-95bd-b6918b00cd80`.

Round 4 removes the unsupported product-boundary sentence from Terms and adds a regression guard against its return. Every earlier finding was checked in the deployed artifact and source, not accepted only from an earlier status report.

## Finding map

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept all three facts below the sample action and ahead of the artwork. | `all three landing facts fit in the first screen on phone and desktop`; [mobile Home](polish-4-home-390.png); cold live `/` placed their lower edges at 719, 742, and 765 px in a 390 × 844 viewport. |
| F-1-2 | Kept offline reload, scoring, stored result, and review-CSV download in one claim flow. | `@claim:offline-reload`; [mobile Demo](polish-4-demo-390.png); live `/?demo=1` passed in the 43-test production run. |
| F-1-3 | Kept sample restoration and real-card preservation in the reset claim. | `@claim:demo-reset`; [mobile Demo](polish-4-demo-390.png); live `/?demo=1` reset to three cards and two prior reviews without changing real storage. |
| F-1-4 | Kept the $19 catalog check, real 303 hosted-checkout redirect, one-time checkout text, and mocked valid-license unlock. | `@claim:paid-desk`; [full Home](polish-4-live/screenshot-desktop.png); the live checkout returned 303 to `checkout.dodopayments.com`. |
| F-1-5 | Kept the exact localStorage key out of visitor-facing documentation. | `@claim:license-network`; [Cards](polish-4-cards-1440.png); live `/cards` and `/privacy` expose behavior, not the implementation key. |
| F-1-6 | Kept request-boundary coverage for no license, explicit verification, returned license, and stale saved license. | `@claim:license-network`; [Privacy](polish-4-privacy-1440.png); live `/privacy` names the three observable triggers. |
| F-1-7 | Kept the unsupported merchant-of-record assertion absent. | `terms keep purchase copy to the declared checkout and license behavior`; [Terms](polish-4-terms-1440.png); cold live `/terms` contained no `merchant of record`. |
| F-1-8 | Kept the unsupported refund-handling assertion absent. | `terms keep purchase copy to the declared checkout and license behavior`; [Terms](polish-4-terms-1440.png); cold live `/terms` contained no `refund`. |
| F-1-9 | Kept revoked-license relocking while leaving free exports available. | `@claim:license-revocation`; [Cards](polish-4-cards-1440.png); live `/cards` passed the inactive-license flow. |
| F-1-10 | Kept case, composed/decomposed accent, and extra-space normalization coverage. | `@claim:exact-normalization`; [mobile Demo](polish-4-demo-390.png); live `/?demo=1` scored the decomposed uppercase sample at 100%. |
| F-1-11 | Kept concrete Anki-formatted CSV wording and six-field/three-card assertions. | `@claim:anki-export`; [Cards](polish-4-cards-1440.png); live `/cards?demo=1` downloaded and validated the card CSV. |
| F-1-12 | Kept the former landing product-boundary sentence absent. | `landing page has one clear heading and working routes`; [mobile Home](polish-4-home-390.png); cold live `/` contained no diagnosis, generation, or hosting assertion. |
| F-1-13 | Kept public study terms as typed answer, answer key, and next review date. | Landing/copy audit plus `@claim:interval-reason`; [full Home](polish-4-live/screenshot-desktop.png); live `/` and `/demo` use the same terms. |
| F-1-14 | Kept all three process headings literal and useful out of context. | `landing page has one clear heading and working routes`; [full Home](polish-4-live/screenshot-desktop.png); cold live `/` retained the task-complete headings. |
| F-1-15 | Kept storage and privacy headings literal. | `has no serious accessibility issues on /privacy`; [Privacy](polish-4-privacy-1440.png); live `/privacy` returned 200 with the expected heading outline. |
| F-1-16 | Kept `Plans` and `Recall Anchor Desk license` terminology consistent. | `@claim:paid-desk`; [full Home](polish-4-live/screenshot-desktop.png); live `/`, `/cards`, and `/terms` matched. |
| F-1-17 | Kept the README user-first and implementation details under Technical details. | Clean-clone copy audit and `npm test`; [mobile Home](polish-4-home-390.png); the live first screen matches the README task description. |
| F-1-18 | Kept untestable public image-provenance wording absent while retaining internal provenance in `design.md`. | `static host policy serves real 404s and immutable hashed assets`; [full Home](polish-4-live/screenshot-desktop.png); live Home and 404 footers contain no provenance assertion. |
| F-1-19 | Kept route-specific title, description, canonical, Open Graph, and Twitter metadata. | `every app route updates canonical, Open Graph, and Twitter metadata`; [Terms](polish-4-terms-1440.png); cold live `/`, `/study`, `/cards`, `/demo`, `/privacy`, `/terms`, and 404 metadata passed. |
| F-1-20 | Updated and retained the shared-shell static 404 with current version, skip link, metadata, nav, and legal links. | `static host policy serves real 404s and immutable hashed assets`; [404](polish-4-404-1440.png); live `/not-a-real-card` returned HTTP 404 and Version 1.0.5. |
| F-2-1 | Kept manual Back/Forward scroll state while moving focus and the polite announcement to the route heading. | `Back and Forward restore route scroll while moving focus to the heading`; [restored mobile position](polish-4-back-restored-390.png); live Home restored to 907 px with its h1 focused. |
| F-2-2 | Kept the one-click three-card sample promise registered and isolated. | `@claim:demo-sample`; [mobile Demo](polish-4-demo-390.png); cold live Home → `/?demo=1` showed `3 due`, the banner, and an empty real collection after exit. |
| F-2-3 | Kept the untestable historical image sentence out of the public footer. | `static host policy serves real 404s and immutable hashed assets`; [full Home](polish-4-live/screenshot-desktop.png); live Home and 404 footers contain only the product line, legal links, factory link, and version. |
| F-3-1 | Kept the regressed merchant-of-record wording removed. | `@claim:paid-desk` and the Terms regression; [Terms](polish-4-terms-1440.png); live `/terms` contained no merchant claim. |
| F-3-2 | Kept the regressed refund-handling wording removed. | `@claim:paid-desk` and the Terms regression; [Terms](polish-4-terms-1440.png); live `/terms` contained no refund claim. |
| F-4-1 | Deleted “Recall Anchor helps you study. It does not measure learning ability or guarantee recall.” instead of adding self-referential claim tests. Extended the Terms regression to reject both phrases. | `terms keep purchase copy to the declared checkout and license behavior`; [Terms](polish-4-terms-1440.png); cold live `/terms` contained neither `measure learning ability` nor `guarantee recall`. |

## Verification

- Fresh clone: `/tmp/recall-anchor-polish4-s0hTX8/repo` at `0e671d83dfe559fa9b3c3fd13e1f718f64ffe2bc`.
- After `npm ci`, all 16 exact commands in `.factory/claims.json` passed independently. The registry has exactly one `@claim:<id>` test for every entry.
- Clean-clone `npm test` passed 43/43. `npm run typecheck`, `npm run build`, and `npm audit --audit-level=low` passed; `dist/index.html` exists.
- The deployed full suite passed 43/43 against the production origin, including light/dark Axe checks, offline use, privacy request capture, mobile controls, route focus/history, metadata, and the HTTP 404.
- `/opt/fleet/lib/verify-url.sh` found HTTPS 200, no console errors, `lang=en`, one h1, a main landmark, no missing alt text, and no unlabeled buttons. Evidence: [verify.json](polish-4-live/verify.json).
- Mobile Lighthouse scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100; LCP was 1.4 s and CLS was 0. Evidence: [lighthouse.json](polish-4-live/lighthouse.json).
- Production assets are byte-identical to `dist/` for `index.html`, hashed JS/CSS, `sw.js`, and `manifest.webmanifest`. JavaScript is 35,796 B raw / 12.01 kB gzip; CSS is 18,644 B raw / 5.01 kB gzip; the mobile hero is 79,516 B.
- A cold live crawl found every internal link at 200, the factory link at 200, the checkout at 303 to its hosted checkout, and a valid privacy `mailto:` link. Direct `/?demo=1` used only `recall-anchor-demo` and made no off-origin request.

No finding from review rounds 1–4 remains open.
