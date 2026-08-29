# Polish round 3 — cumulative zero-finding closure

Repair commit: `a6141443e679813a95a7907dfcc63878bd1261f6`. Pushed to `origin/main` and deployed to <https://answer-anchored-flashcards.sociobot.in> through the static work-order deployment. Azure deployment ID: `a40ca198-57f8-4b5a-a91b-daabc565981a`.

The repair removes the two unsupported legal assertions that regressed after round 2. Every prior finding was rechecked against the deployed artifact, rather than accepted merely because it was previously marked fixed.

## Finding map

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept all three first-screen facts directly below the sample action and ahead of the artwork. | `all three landing facts fit in the first screen on phone and desktop`; [mobile home](polish-3-home-390.png); live `/` passed at 390 × 844. |
| F-1-2 | Kept offline scoring plus review-CSV download in the offline claim flow. | `@claim:offline-reload`; live 42-test run; live `/?demo=1` passed. |
| F-1-3 | Kept reset coverage that restores the sample while preserving real storage. | `@claim:demo-reset`; [mobile demo](polish-3-demo-390.png); live `/?demo=1` passed. |
| F-1-4 | Kept the $19 catalog assertion, real 303 hosted-checkout request, one-time checkout text, and mocked license unlock. | `@claim:paid-desk`; [Terms](polish-3-terms-1440.png); live `/terms` passed. |
| F-1-5 | Kept the implementation storage-key name out of public copy. | Copy audit; `@claim:license-network`; live README and `/privacy` copy review passed. |
| F-1-6 | Kept explicit, returned, and stale-license request-boundary coverage. | `@claim:license-network`; live `/privacy` passed. |
| F-1-7 | Removed the unsupported merchant-of-record assertion from Terms. | `@claim:paid-desk`; [Terms](polish-3-terms-1440.png); live `/terms` contains no merchant-of-record wording. |
| F-1-8 | Removed the unsupported refund-handling assertion from Terms. | `@claim:paid-desk`; [Terms](polish-3-terms-1440.png); live `/terms` contains no refund-handling wording. |
| F-1-9 | Kept inactive-license relocking while preserving free CSV export. | `@claim:license-revocation`; live `/cards` passed. |
| F-1-10 | Kept case, composed/decomposed accent, and whitespace normalization coverage. | `@claim:exact-normalization`; live `/?demo=1` passed. |
| F-1-11 | Kept specific Anki-formatted CSV wording and six-field export assertions. | `@claim:anki-export`; live `/cards?demo=1` passed. |
| F-1-12 | Kept the untestable product-boundary sentence removed. | Copy audit; [mobile home](polish-3-home-390.png); live `/` passed. |
| F-1-13 | Kept public language as typed answer, answer key, and next review date. | Copy audit; live `/` and `/?demo=1` passed. |
| F-1-14 | Kept literal, task-complete process headings. | Copy audit; [mobile home](polish-3-home-390.png); live `/` passed. |
| F-1-15 | Kept literal privacy/storage headings. | Copy audit; live `/privacy` passed with zero Axe violations. |
| F-1-16 | Kept Plans and Recall Anchor Desk license terminology consistent. | `@claim:paid-desk`; live `/` passed. |
| F-1-17 | Kept the README user-first and moved technical details below the task explanation. | Copy audit; clean-clone `npm test`; live `/` matched the documented task. |
| F-1-18 | Kept the untestable public image-provenance assertion absent; private provenance remains in `design.md`. | Copy audit; [404](polish-3-404-1440.png); live `/` and 404 passed. |
| F-1-19 | Kept route-specific title, canonical, Open Graph, and Twitter metadata. | `every app route updates canonical, Open Graph, and Twitter metadata`; live `/`, `/study`, `/cards`, `/demo`, `/privacy`, and `/terms` passed. |
| F-1-20 | Kept the shared, current-version, legal-linked static 404. | `static host policy serves real 404s and immutable hashed assets`; [404](polish-3-404-1440.png); live unknown URL returned HTTP 404. |
| F-2-1 | Kept saved scroll positions for Back/Forward while route focus and the announcement move to the h1. | `Back and Forward restore route scroll while moving focus to the heading`; live 42-test run passed. |
| F-2-2 | Kept the registered one-click three-card sample promise and isolated exit. | `@claim:demo-sample`; [mobile demo](polish-3-demo-390.png); live `/?demo=1` passed. |
| F-2-3 | Kept the public historical provenance sentence absent. | Copy audit; [404](polish-3-404-1440.png); live `/` passed. |
| F-3-1 | Removed the reintroduced merchant-of-record clause, and narrowed the paid test to observable checkout and license behavior. | `@claim:paid-desk`; [Terms](polish-3-terms-1440.png); cold live `/terms` check passed. |
| F-3-2 | Removed the reintroduced refund-handling clause, with no substitute legal assertion. | `@claim:paid-desk`; [Terms](polish-3-terms-1440.png); cold live `/terms` check passed. |

## Verification

- Fresh clone: `/tmp/recall-anchor-polish3-ntIpGV/repo` at `a6141443e679813a95a7907dfcc63878bd1261f6`.
- After `npm ci`, every exact test command in `.factory/claims.json` passed independently: `offline-reload`, `answer-types`, `interval-reason`, `csv-export`, `anki-export`, `encrypted-backup`, `demo-isolation`, `demo-sample`, `demo-reset`, `local-privacy`, `keyboard-review`, `exact-normalization`, `free-limit`, `paid-desk`, `license-network`, and `license-revocation`.
- The clean-clone full suite passed 42/42, followed by `npm run typecheck`, `npm run build`, and `npm audit --audit-level=low`. The production build is 12.05 kB gzip JavaScript and 5.01 kB gzip CSS.
- The deployed full suite also passed 42/42 with `PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test`.
- The cold live browser check found correct status/title/metadata/one-h1/main on `/`, `/study`, `/cards`, `/demo`, `/privacy`, `/terms`, and the HTTP 404. It confirmed the live module hash `/assets/index-D13V2Mir.js`, demo banner/reset/real exit, and all first-screen facts at 390 px.
- Playwright Axe found zero WCAG 2 A/AA violations on those seven routes in both light and dark schemes (14 checks). [verify-url evidence](polish-3-live/verify.json) reports no console errors on Home, one h1, `lang=en`, a main landmark, and no missing image alt text or unlabeled buttons.
- Mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.5 s and CLS 0. See [lighthouse.json](polish-3-live/lighthouse.json).

No finding from review rounds 1–3 remains open.
