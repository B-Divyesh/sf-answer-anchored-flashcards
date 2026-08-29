# Recall Anchor polish round 2 handoff — PASS

## Outcome

All 23 cumulative findings in `.factory/review-1.md` and `.factory/review-2.md` are closed. The implementation commit is `46e7f35d9d8384fccc488e751e6559f6abad29a5`, pushed to `origin/main` and deployed to <https://answer-anchored-flashcards.sociobot.in>.

The release preserves the warm-paper, halftone worksheet identity and the original offline PWA deployment class.

## What changed

- Back and Forward now restore each route’s scroll position while moving focus to the new h1 and announcing the route.
- The one-click `/?demo=1` path now has a registered `demo-sample` claim that proves three due cards, the persistent banner, and real-data isolation.
- The untestable public image-provenance sentence was removed from app and 404 footers. Provenance remains in `.factory/design.md`.
- The claim register now contains 16 claims with exactly one tagged outcome test each.
- The catalog line is now: “Score typed flashcard answers and schedule the next review.”
- The lockfile version now matches the package version.

## Exact verification evidence

- Clean clone: `/tmp/recall-anchor-polish2-o0Jkp7/repo` at `46e7f35`.
- `npm ci`: passed; 0 vulnerabilities.
- Every exact command in `.factory/claims.json`: 16/16 passed independently.
- `npm test`: 41/41 passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; `dist/index.html` exists.
- Bundles: JavaScript 11.54 KB gzip; CSS 5.01 KB gzip.
- `npm audit --audit-level=low`: 0 vulnerabilities.
- Live browser suite: 41/41 passed against production.
- Live URL verifier: HTTP 200, no console errors, one h1, `lang=en`, main present, zero missing image alts, zero unlabeled buttons.
- Standalone Axe CLI 4.10.3: 0 violations across Home, Demo, Privacy, and Terms.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.35 s; CLS 0.
- Unknown live URL: designed page with HTTP 404.
- Live scroll audit: Home 1200 px → Cards 420 px → Back 1200 px → Forward 420 px, with focused h1 and live announcement.

Deployment ID: `fdc840f1-16ba-4d6a-8d8e-7883f4f538bf`.

Detailed finding evidence and screenshot paths are in `.factory/polish-2.md`. Machine reports are in `.factory/polish-2-live/`.

## Run locally

```sh
npm ci
npm test
npm run build
```

Use `/?demo=1` for the isolated sample. Build output is `dist/`.

## Known gaps

None found.
