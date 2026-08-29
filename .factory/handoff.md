# Recall Anchor review-4 handoff

## Result

**FAIL — one minor documentation/claims gap.** Review 4 checked the live site at <https://answer-anchored-flashcards.sociobot.in> and a fresh clone at `a3302bcfda9cb9eac1397e98599dd348564169fa` on 2026-08-29 UTC. No product code was changed in this work order.

## What was verified

- Cold 390 px and desktop first-read gates passed; the one-click sample demo opens a realistic card, uses isolated `recall-anchor-demo` storage, resets correctly, and leaves real storage empty after **Start for real**.
- All 16 exact commands listed in `.factory/claims.json` passed independently after `npm ci`. The fresh-clone `npm test` passed 43/43; `npm run typecheck` and `npm run build` passed and generated `dist/`.
- Live request logging was same-origin for landing/demo use. The site has working metadata, routes, links, an HTTP 404, focus/Back behavior, and the documented product-specific visual system.

## Remaining issue

`/terms` states that Recall Anchor does not measure learning ability or guarantee recall, but these product-boundary claims have no `.factory/claims.json` entry or observable test. See [review-4.md](review-4.md) finding `F-4-1` for the exact quote and required fix.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run build
```

The isolated demo entry point is `/?demo=1`; `dist/` is the static deployment root. Deployment, DNS, and billing remain factory-owned.
