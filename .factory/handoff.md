# Recall Anchor polish-4 handoff

## Result

**PASS — zero findings remain.** Release 1.0.5 is deployed at <https://answer-anchored-flashcards.sociobot.in>. The implementation repair is commit `0e671d83dfe559fa9b3c3fd13e1f718f64ffe2bc`; Azure deployment ID `ec9bdd80-d2ab-437b-95bd-b6918b00cd80` completed successfully.

## What changed

- Removed the two unsupported product-boundary assertions reported as F-4-1 from Terms.
- Strengthened the Terms regression so merchant, refund, learning-measurement, and recall-guarantee wording cannot silently return.
- Made the service-worker update regression cache-version independent, then bumped the product, manifest, 404, and PWA cache to 1.0.5 / `recall-anchor-v7`.
- Updated the verb-first catalog line to “Score flashcards from typed answers and set the next review date.” (65 characters).
- Re-audited every earlier finding. The first-screen copy, isolated demo, claims, routing, metadata, focus, 404, legal links, mobile layout, privacy, exports, backup, and paid-license boundaries remain fixed.

The warm-paper, halftone worksheet visual system and original illustration were preserved unchanged.

## Verification evidence

- Clean clone `/tmp/recall-anchor-polish4-s0hTX8/repo` at `0e671d8`: `npm ci`; all 16 exact `.factory/claims.json` commands independently; `npm test` (43/43); `npm run typecheck`; `npm run build`; and `npm audit --audit-level=low` all passed.
- Production: `PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test` passed 43/43. This includes browser, light/dark accessibility, privacy, offline, mobile, PWA update, route/history/focus, metadata, and 404 coverage.
- The required URL verifier passed with no console errors and correct title, language, one h1, main, alt text, and button labels: [verify.json](polish-4-live/verify.json).
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.4 s; CLS 0: [lighthouse.json](polish-4-live/lighthouse.json).
- Cold production checks confirmed all app routes at HTTP 200, the designed unknown route at HTTP 404, all links healthy, all three facts above the 844 px fold, and no unsupported Terms wording.
- A direct cold `/?demo=1` context showed the persistent banner, reset/exit controls, three due cards, only the `recall-anchor-demo` IndexedDB database, and no off-origin request.
- Local and live SHA-256 values match for `index.html`, hashed JS/CSS, `sw.js`, and `manifest.webmanifest`. The shipped bundle is 35,796 B JS raw / 12.01 kB gzip and 18,644 B CSS raw / 5.01 kB gzip.
- Finding-by-finding evidence and live screenshots are in [polish-4.md](polish-4.md).

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run build
```

The static deployment root is `dist/`. The isolated demo is `/?demo=1`.

## Known gaps and next steps

None. No review finding, deferred minor item, test failure, or known product defect remains.
