# Polish round 2 — cumulative finding closure

Release repaired: implementation commit `46e7f35d9d8384fccc488e751e6559f6abad29a5`. Deployed 2026-08-29 UTC to <https://answer-anchored-flashcards.sociobot.in> as deployment `fdc840f1-16ba-4d6a-8d8e-7883f4f538bf`.

Cold live screenshots:

- Home first screen: `.factory/polish-2-home-390.png`
- Isolated demo: `.factory/polish-2-demo-390.png`
- Restored Back position: `.factory/polish-2-back-restored-390.png`
- Cards: `.factory/polish-2-cards-1440.png`
- Privacy: `.factory/polish-2-privacy-1440.png`
- Terms: `.factory/polish-2-terms-1440.png`
- Real 404: `.factory/polish-2-404-1440.png`

## Finding map

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept all three facts directly under the primary action and above the artwork. | `all three landing facts fit in the first screen on phone and desktop`; `.factory/polish-2-home-390.png`; live `/` passed. |
| F-1-2 | Kept the offline claim test scoring a card and downloading CSV while offline. | `@claim:offline-reload`; `.factory/polish-2-demo-390.png`; live `/?demo=1` passed. |
| F-1-3 | Kept demo reset coverage for sample restoration and real-data isolation. | `@claim:demo-reset`; `.factory/polish-2-demo-390.png`; live `/?demo=1` passed. |
| F-1-4 | Kept the checkout test for the $19 catalog price, 303 hosted redirect, one-time copy, and valid-license unlock. | `@claim:paid-desk`; `.factory/polish-2-home-390.png`; live checkout and `/` passed. |
| F-1-5 | Kept the storage key out of the public contract. | `@claim:license-network`; `.factory/polish-2-cards-1440.png`; live `/cards` passed. |
| F-1-6 | Kept request-boundary coverage for no license, explicit verification, checkout return, and stale refresh. | `@claim:license-network`; `.factory/polish-2-privacy-1440.png`; live `/privacy` passed. |
| F-1-7 | Kept the unsupported merchant-of-record statement removed. | `has no serious accessibility issues on /terms` plus copy review; `.factory/polish-2-terms-1440.png`; live `/terms` passed. |
| F-1-8 | Kept the unsupported refund-handling statement removed. | `has no serious accessibility issues on /terms` plus copy review; `.factory/polish-2-terms-1440.png`; live `/terms` passed. |
| F-1-9 | Kept revoked-license relocking while exports remain available. | `@claim:license-revocation`; `.factory/polish-2-terms-1440.png`; live `/terms` passed. |
| F-1-10 | Kept case, accent-form, and extra-space normalization claim coverage. | `@claim:exact-normalization`; `.factory/polish-2-demo-390.png`; live `/?demo=1` passed. |
| F-1-11 | Kept concrete Anki-formatted CSV wording and six-field export assertions. | `@claim:anki-export`; `.factory/polish-2-cards-1440.png`; live `/cards?demo=1` passed. |
| F-1-12 | Kept the untestable product-boundary sentence removed. | `landing page has one clear heading and working routes` plus copy review; `.factory/polish-2-home-390.png`; live `/` passed. |
| F-1-13 | Kept typed answer, answer key, and next review date as the public terms. | `landing page has one clear heading and working routes`; `.factory/polish-2-home-390.png`; live `/` passed. |
| F-1-14 | Kept the three task-complete process headings. | `landing page has one clear heading and working routes`; `.factory/polish-2-home-390.png`; live `/` passed. |
| F-1-15 | Kept literal data-storage and privacy headings. | `has no serious accessibility issues on /privacy`; `.factory/polish-2-privacy-1440.png`; live `/privacy` passed. |
| F-1-16 | Kept the Plans heading and Recall Anchor Desk license terminology. | `@claim:paid-desk`; `.factory/polish-2-home-390.png`; live `/` passed. |
| F-1-17 | Kept the README user-first, with implementation details below the product explanation. | Full clean-clone `npm test` and copy audit; `.factory/polish-2-home-390.png`; live `/` matched the documented task. |
| F-1-18 | Removed the public historical image assertion instead of pointing to unavailable notes; provenance remains in `.factory/design.md`. | `static host policy serves real 404s and immutable hashed assets`; `.factory/polish-2-404-1440.png`; live `/` and the HTTP 404 contain no provenance assertion. |
| F-1-19 | Kept route-specific canonical, Open Graph, and Twitter metadata. | `every app route updates canonical, Open Graph, and Twitter metadata`; `.factory/polish-2-privacy-1440.png`; all live routes passed. |
| F-1-20 | Kept the static 404 on the standard shell and removed the new untestable footer assertion there too. | `static host policy serves real 404s and immutable hashed assets`; `.factory/polish-2-404-1440.png`; live unknown URL returned HTTP 404. |
| F-2-1 | Added manual history scroll state, saved before navigation and on scroll; Popstate restores it after rendering without losing h1 focus or the live announcement. | `Back and Forward restore route scroll while moving focus to the heading`; `.factory/polish-2-back-restored-390.png`; live `/ → /cards → Back → Forward` restored 1200 px and 420 px. |
| F-2-2 | Added `demo-sample` to the claims register and a one-click test from Home through the isolated demo to an empty real collection. | `@claim:demo-sample`; `.factory/polish-2-demo-390.png`; live `/?demo=1` showed the banner, answer field, and `3 due`. |
| F-2-3 | Removed the historical factory-image sentence from both the app footer and static 404; internal provenance remains recorded. | `static host policy serves real 404s and immutable hashed assets`; `.factory/polish-2-home-390.png` and `.factory/polish-2-404-1440.png`; live pages contain no public assertion. |

## Final verification

- Clean clone `/tmp/recall-anchor-polish2-o0Jkp7/repo` at `46e7f35`: `npm ci`, all 16 exact claim commands, `npm test` (41/41), `npm run typecheck`, `npm run build`, and `npm audit --audit-level=low` passed.
- Live Playwright run: 41/41 passed against the production origin, including offline, privacy, mobile, metadata, 404, and Back/Forward restoration checks.
- `/opt/fleet/lib/verify-url.sh` reported HTTP 200, no console errors, one h1, `lang=en`, a main landmark, and no missing alt text.
- Standalone Axe CLI 4.10.3 found 0 violations on Home, Demo, Privacy, and Terms. Report: `.factory/polish-2-live/axe.json`.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.35 s; CLS 0. Report: `.factory/polish-2-live/lighthouse.json`.
- Production bundle: 11.54 KB gzip JavaScript and 5.01 KB gzip CSS. `dist/index.html` exists.

No finding from either review remains open.
